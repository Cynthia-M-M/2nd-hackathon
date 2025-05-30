from setuptools import setup, find_packages

setup(
    name="kashela-api",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.109.2",
        "uvicorn==0.27.1",
        "python-dotenv==1.0.0",
        "supabase==2.3.4",
        "SpeechRecognition==3.10.0",
        "Pillow==10.0.0",
        "pytesseract==0.3.10",
        "PyJWT==2.8.0",
        "python-multipart==0.0.6",
        "pydantic==2.6.1",
        "starlette==0.36.3",
        "python-jose[cryptography]==3.3.0",
        "pydantic-settings==2.9.1"
    ],
    python_requires=">=3.9",
) 