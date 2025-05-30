from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
from datetime import datetime
import uuid
import requests
import base64
from .auth import get_current_user, TokenData
import logging
from dotenv import load_dotenv

# Configure route-specific logging
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

router = APIRouter()

class MPESAPayment(BaseModel):
    phone_number: str
    amount: float
    description: Optional[str] = None

class PaymentRequest(BaseModel):
    amount: float
    phone_number: str
    description: str = None

def generate_access_token():
    """Generate M-PESA access token"""
    consumer_key = os.getenv("MPESA_CONSUMER_KEY")
    consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")
    
    if not consumer_key or not consumer_secret:
        raise HTTPException(500, "M-PESA credentials not configured")
        
    # Create auth string and encode it
    auth_string = f"{consumer_key}:{consumer_secret}"
    auth_bytes = auth_string.encode("ascii")
    auth_base64 = base64.b64encode(auth_bytes).decode("ascii")
    
    try:
        response = requests.get(
            "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
            headers={
                "Authorization": f"Basic {auth_base64}"
            }
        )
        response.raise_for_status()
        return response.json()["access_token"]
    except Exception as e:
        raise HTTPException(500, f"Failed to get M-PESA token: {str(e)}")

def format_phone_number(phone_number: str) -> str:
    """Format phone number to required format"""
    # Remove any spaces or special characters
    phone = "".join(filter(str.isdigit, phone_number))
    
    # Add country code if not present
    if phone.startswith("0"):
        phone = "254" + phone[1:]
    elif not phone.startswith("254"):
        phone = "254" + phone
        
    return phone

@router.post("/pay")
async def initiate_payment(
    payment: MPESAPayment,
    current_user: TokenData = Depends(get_current_user)
):
    try:
        logger.info(f"Initiating M-PESA payment for user {current_user.sub}, phone: {payment.phone_number}, amount: {payment.amount}")
        
        # Format phone number
        phone = format_phone_number(payment.phone_number)
        
        # Get access token
        access_token = generate_access_token()
        
        # Prepare STK push request
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        shortcode = os.getenv("MPESA_SHORTCODE")
        passkey = os.getenv("MPESA_PASSKEY")
        
        # Generate password
        password_str = f"{shortcode}{passkey}{timestamp}"
        password = base64.b64encode(password_str.encode()).decode("ascii")
        
        # Transaction details
        transaction_id = f"MPESA_{uuid.uuid4().hex[:8].upper()}"
        callback_url = f"{os.getenv('API_BASE_URL', 'https://your-domain.com')}/payments/callback"
        
        # Make STK push request
        response = requests.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            json={
                "BusinessShortCode": shortcode,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": int(payment.amount),
                "PartyA": phone,
                "PartyB": shortcode,
                "PhoneNumber": phone,
                "CallBackURL": callback_url,
                "AccountReference": "Kashela",
                "TransactionDesc": payment.description or "Payment for Kashela services"
            },
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
        )
        
        if response.status_code != 200:
            raise HTTPException(400, "Failed to initiate payment")
            
        stk_response = response.json()
        
        logger.info(f"Payment request processed successfully for user {current_user.sub}")
        return {
            "message": "Payment initiated successfully",
            "transaction_id": transaction_id,
            "checkout_request_id": stk_response.get("CheckoutRequestID"),
            "status": "pending",
            "phone_number": phone,
            "amount": payment.amount
        }
        
    except Exception as e:
        logger.error(f"Payment processing error for user {current_user.sub}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Payment processing failed"
        )

@router.get("/payment/{transaction_id}")
async def get_payment_status(
    transaction_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    try:
        logger.info(f"Checking payment status for user {current_user.sub}, transaction: {transaction_id}")
        
        # Here you would check the status in your database
        # For demo, we'll return completed if it's a valid transaction ID
        if transaction_id.startswith("MPESA_"):
            return {
                "transaction_id": transaction_id,
                "status": "completed",
                "timestamp": datetime.now().isoformat()
            }
        raise HTTPException(404, "Transaction not found")
    except Exception as e:
        logger.error(f"Status check error for user {current_user.sub}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to check payment status"
        )

@router.post("/callback")
async def mpesa_callback(data: dict):
    """Handle M-PESA callback"""
    try:
        # Log callback data
        logger.info("M-PESA Callback received:", data)
        
        # Extract relevant information
        result_code = data.get("Body", {}).get("stkCallback", {}).get("ResultCode")
        checkout_request_id = data.get("Body", {}).get("stkCallback", {}).get("CheckoutRequestID")
        
        if result_code == 0:
            # Payment successful
            # Here you would update your database
            logger.info(f"Payment successful for checkout request {checkout_request_id}")
        else:
            # Payment failed
            logger.info(f"Payment failed for checkout request {checkout_request_id}")
            
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Error processing callback: {str(e)}")
        return {"status": "error", "message": str(e)}

@router.post("/mpesa")
async def initiate_mpesa_payment(payment: PaymentRequest):
    try:
        logger.info(f"Initiating M-PESA payment for phone: {payment.phone_number}, amount: {payment.amount}")
        
        # Here you would implement the actual M-PESA integration
        # For now, we'll just log the attempt
        
        logger.info("Payment request processed successfully")
        return {
            "message": "Payment initiated",
            "transaction_id": "DEMO-12345",
            "status": "pending"
        }
    except Exception as e:
        logger.error(f"Payment processing error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Payment processing failed"
        )

@router.get("/")
def get_payments():
    return {"message": "Payments route is working!"}