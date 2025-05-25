from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from supabase import create_client, Client
import os
import speech_recognition as sr
from PIL import Image
import pytesseract
import json
from datetime import datetime
from typing import Optional
import requests
from pydantic import BaseModel
import jwt
import random
import re
import logging
import atexit
import signal
import sys
from fastapi.responses import FileResponse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()
# Ensure static directory exists
os.makedirs("static", exist_ok=True)

@app.get("/favicon.ico")
async def favicon():
    return FileResponse("static/favicon.ico")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
# Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_KEY", "")
)

# Cleanup function
def cleanup():
    logger.info("Cleaning up resources...")
    # Close any open database connections
    try:
        if supabase:
            supabase.auth.sign_out()
            logger.info("Closed Supabase connection")
    except Exception as e:
        logger.error(f"Error during Supabase cleanup: {e}")
    
    # Remove any temporary files
    temp_dir = "."
    pattern = r"temp_\d+\.(wav|png)"
    for file in os.listdir(temp_dir):
        if re.match(pattern, file):
            try:
                os.remove(os.path.join(temp_dir, file))
                logger.info(f"Removed temporary file: {file}")
            except Exception as e:
                logger.error(f"Error removing temporary file {file}: {e}")

# Register cleanup handlers
atexit.register(cleanup)

def signal_handler(sig, frame):
    logger.info(f"Received signal {sig}")
    cleanup()
    sys.exit(0)

# Register signal handlers
signal.signal(signal.SIGINT, signal_handler)   # Ctrl+C
signal.signal(signal.SIGTERM, signal_handler)  # Termination request

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up Financial Management API...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Financial Management API...")
    cleanup()

# Test root route
@app.get("/")
def read_root():
    return {"message": "Kashela API is running"}

# Include routers
from routes import auth, transactions, payments
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
app.include_router(payments.router, prefix="/payments", tags=["payments"])

# Pydantic models
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class Transaction(BaseModel):
    amount: float
    type: str  # "income" or "expense"
    category: str
    description: str
    timestamp: Optional[datetime] = None

class MPESARequest(BaseModel):
    phone_number: str
    amount: float
    description: str

# Authentication middleware
async def get_current_user(authorization: str = Depends(OAuth2PasswordBearer(tokenUrl="token"))):
    try:
        payload = jwt.decode(authorization, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid authentication")

# User registration and login routes
@app.post("/auth/register")
async def register(user: UserCreate):
    try:
        # Create user in Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })
        
        # Store additional user data in profiles table
        user_data = {
            "id": auth_response.user.id,
            "full_name": user.full_name,
            "email": user.email,
            "created_at": datetime.utcnow().isoformat()
        }
        supabase.table("profiles").insert(user_data).execute()
        
        return {"message": "Registration successful", "user_id": auth_response.user.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/auth/login")
async def login(user: UserLogin):
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        return {
            "access_token": auth_response.session.access_token,
            "token_type": "bearer"
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")

# Voice transaction route
@app.post("/transactions/voice")
async def create_voice_transaction(audio_file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    try:
        # Initialize speech recognizer
        recognizer = sr.Recognizer()
        
        # Save temporary audio file
        temp_audio_path = f"temp_{datetime.now().timestamp()}.wav"
        with open(temp_audio_path, "wb") as buffer:
            buffer.write(audio_file.file.read())
        
        # Convert speech to text
        with sr.AudioFile(temp_audio_path) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio)
        
        # Process text to extract transaction details
        transaction = parse_voice_transaction(text)
        
        # Store transaction in database
        result = store_transaction(transaction, current_user["id"])
        
        return {"message": "Transaction recorded", "transaction": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)

# OCR transaction route
@app.post("/transactions/ocr")
async def create_ocr_transaction(image: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    try:
        # Save temporary image file
        temp_image_path = f"temp_{datetime.now().timestamp()}.png"
        with open(temp_image_path, "wb") as buffer:
            buffer.write(image.file.read())
        
        # Process image with OCR
        img = Image.open(temp_image_path)
        text = pytesseract.image_to_string(img)
        
        # Extract transaction details from OCR text
        transaction = parse_ocr_transaction(text)
        
        # Store transaction in database
        result = store_transaction(transaction, current_user["id"])
        
        return {"message": "Transaction recorded", "transaction": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)

# M-PESA STK Push route
@app.post("/payments/mpesa")
async def initiate_mpesa_payment(request: MPESARequest, current_user: dict = Depends(get_current_user)):
    try:
        # Simulate M-PESA STK push (sandbox implementation)
        response = simulate_mpesa_stk_push(request.phone_number, request.amount)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Bank transfer simulation route
@app.post("/payments/bank-transfer")
async def simulate_bank_transfer(transaction: Transaction, current_user: dict = Depends(get_current_user)):
    try:
        # Simulate bank transfer
        success = random.choice([True, False])
        if success:
            return {"status": "success", "message": "Transfer completed successfully"}
        else:
            raise HTTPException(status_code=400, detail="Transfer failed")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Monthly report route
@app.get("/reports/monthly/{year}/{month}")
async def get_monthly_report(year: int, month: int, current_user: dict = Depends(get_current_user)):
    try:
        # Get transactions for the specified month
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)
        
        transactions = supabase.table("transactions")\
            .select("*")\
            .eq("user_id", current_user["id"])\
            .gte("timestamp", start_date.isoformat())\
            .lt("timestamp", end_date.isoformat())\
            .execute()
        
        # Generate report with category breakdowns
        report = generate_monthly_report(transactions.data)
        return report
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Utility functions
def parse_voice_transaction(text: str) -> Transaction:
    """
    Parse voice input to extract transaction details.
    Expected format: "(income/expense) of (amount) for (category) (description)"
    Example: "expense of 1000 for food grocery shopping"
    """
    try:
        words = text.lower().split()
        
        # Determine transaction type
        if "income" in words:
            trans_type = "income"
        elif "expense" in words:
            trans_type = "expense"
        else:
            raise ValueError("Transaction type (income/expense) not found in voice input")
        
        # Extract amount
        amount_idx = words.index("of") + 1 if "of" in words else -1
        if amount_idx == -1 or amount_idx >= len(words):
            raise ValueError("Amount not found in voice input")
        try:
            amount = float(words[amount_idx].replace(",", ""))
        except ValueError:
            raise ValueError("Invalid amount format in voice input")
        
        # Extract category
        category_idx = words.index("for") + 1 if "for" in words else -1
        if category_idx == -1 or category_idx >= len(words):
            raise ValueError("Category not found in voice input")
        category = words[category_idx]
        
        # Extract description (everything after category)
        description = " ".join(words[category_idx + 1:]) if category_idx + 1 < len(words) else category
        
        return Transaction(
            amount=amount,
            type=trans_type,
            category=category,
            description=description,
            timestamp=datetime.utcnow()
        )
    except Exception as e:
        raise ValueError(f"Failed to parse voice input: {str(e)}")

def parse_ocr_transaction(text: str) -> Transaction:
    """
    Parse OCR text to extract transaction details.
    Looks for common receipt/invoice patterns to extract amount, category, and description.
    """
    try:
        lines = text.lower().split('\n')
        amount = None
        description = []
        category = None
        
        # Common amount patterns
        amount_patterns = [
            r'total[\s:]*ksh?\.?\s*([\d,]+\.?\d*)',
            r'amount[\s:]*ksh?\.?\s*([\d,]+\.?\d*)',
            r'ksh?\.?\s*([\d,]+\.?\d*)',
            r'(?:^|\s)([\d,]+\.?\d*)(?:\s|$)'  # Fallback: any number
        ]
        
        # Common category keywords
        category_mapping = {
            'food': ['restaurant', 'cafe', 'food', 'grocery', 'supermarket'],
            'transport': ['transport', 'taxi', 'uber', 'fare', 'bus', 'matatu'],
            'utilities': ['water', 'electricity', 'power', 'bill', 'utility'],
            'shopping': ['mall', 'shop', 'store', 'market'],
            'entertainment': ['cinema', 'movie', 'theatre', 'entertainment'],
        }
        
        # Extract amount
        for line in lines:
            for pattern in amount_patterns:
                match = re.search(pattern, line)
                if match:
                    amount_str = match.group(1).replace(',', '')
                    try:
                        amount = float(amount_str)
                        break
                    except ValueError:
                        continue
            if amount:
                break
        
        if not amount:
            raise ValueError("Could not find valid amount in receipt")
        
        # Extract category and description
        for line in lines:
            # Skip empty lines and common header/footer text
            if not line.strip() or any(x in line for x in ['tel:', 'date:', 'time:', 'receipt', 'invoice']):
                continue
            
            # Try to determine category
            if not category:
                for cat, keywords in category_mapping.items():
                    if any(keyword in line for keyword in keywords):
                        category = cat
                        break
            
            # Collect potential description text
            if len(line.strip()) > 3:  # Skip very short lines
                description.append(line.strip())
        
        # Use first meaningful line as description if we collected any
        final_description = description[0] if description else "Receipt transaction"
        
        # Use "shopping" as default category if none found
        final_category = category if category else "shopping"
        
        return Transaction(
            amount=amount,
            type="expense",  # Receipts are typically for expenses
            category=final_category,
            description=final_description,
            timestamp=datetime.utcnow()
        )
    except Exception as e:
        raise ValueError(f"Failed to parse receipt: {str(e)}")

def store_transaction(transaction: Transaction, user_id: str):
    # Store transaction in Supabase
    transaction_data = {
        "user_id": user_id,
        "amount": transaction.amount,
        "type": transaction.type,
        "category": transaction.category,
        "description": transaction.description,
        "timestamp": transaction.timestamp or datetime.utcnow().isoformat()
    }
    result = supabase.table("transactions").insert(transaction_data).execute()
    return result.data[0]

def simulate_mpesa_stk_push(phone_number: str, amount: float):
    # Simulate M-PESA STK push request
    return {
        "MerchantRequestID": "12345-67890",
        "CheckoutRequestID": "ws_CO_123456789",
        "ResponseCode": "0",
        "ResponseDescription": "Success. Request accepted for processing",
        "CustomerMessage": "Success. Request accepted for processing"
    }

def generate_monthly_report(transactions: list):
    # Generate monthly report with category breakdowns
    income_categories = {}
    expense_categories = {}
    total_income = 0
    total_expenses = 0
    
    for transaction in transactions:
        if transaction["type"] == "income":
            income_categories[transaction["category"]] = income_categories.get(transaction["category"], 0) + transaction["amount"]
            total_income += transaction["amount"]
        else:
            expense_categories[transaction["category"]] = expense_categories.get(transaction["category"], 0) + transaction["amount"]
            total_expenses += transaction["amount"]
    
    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net_amount": total_income - total_expenses,
        "income_breakdown": income_categories,
        "expense_breakdown": expense_categories
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)



