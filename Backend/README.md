# Financial Management Backend API

A FastAPI-based backend system for managing personal finances with features like voice input, OCR, M-PESA integration, and more.

## Features

- User authentication with Supabase
- Voice-based transaction entry (Speech-to-Text)
- Image-based transaction entry (OCR)
- Real-time transaction logging
- Monthly financial reports
- M-PESA STK Push integration
- Bank transfer simulation
- Secure data storage in Supabase (PostgreSQL)

## Prerequisites

- Python 3.8+
- Tesseract OCR installed on your system
- Supabase account
- M-PESA developer account (for production)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Install Tesseract OCR:
   - Windows: Download and install from https://github.com/UB-Mannheim/tesseract/wiki
   - Linux: `sudo apt-get install tesseract-ocr`
   - Mac: `brew install tesseract`

4. Create a `.env` file in the project root with the following variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret_key
   MPESA_CONSUMER_KEY=your_mpesa_consumer_key
   MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
   MPESA_PASSKEY=your_mpesa_passkey
   MPESA_SHORTCODE=your_mpesa_shortcode
   ```

5. Set up Supabase tables:
   - Create a `profiles` table with columns:
     - id (uuid, primary key)
     - full_name (text)
     - email (text)
     - created_at (timestamp)
   
   - Create a `transactions` table with columns:
     - id (uuid, primary key)
     - user_id (uuid, foreign key to auth.users)
     - amount (numeric)
     - type (text)
     - category (text)
     - description (text)
     - timestamp (timestamp)

## Running the Application

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - User login

### Transactions
- POST `/transactions/voice` - Create transaction via voice input
- POST `/transactions/ocr` - Create transaction via image upload
- POST `/payments/mpesa` - Initiate M-PESA payment
- POST `/payments/bank-transfer` - Simulate bank transfer

### Reports
- GET `/reports/monthly/{year}/{month}` - Get monthly financial report

## Security Notes

1. Update CORS settings in production
2. Secure all environment variables
3. Use proper SSL/TLS in production
4. Implement rate limiting
5. Add input validation and sanitization

## License

MIT 