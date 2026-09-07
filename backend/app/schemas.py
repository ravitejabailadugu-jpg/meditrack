from datetime import date
from pydantic import BaseModel, EmailStr, Field

class RegisterIn(BaseModel):
    full_name: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=4)
    confirm_password: str

class LoginIn(BaseModel):
    email: str
    password: str

class PatientIn(BaseModel):
    name: str
    age: int
    gender: str
    phone_number: str = ""
    address: str = ""

class DiseaseIn(BaseModel):
    patient_id: int
    disease_name: str
    diagnosis_date: date
    severity: str = "Mild"
    status: str = "Diagnosed"
    assigned_doctor: str = ""
    notes: str = ""

class DiseaseUpdateIn(BaseModel):
    status: str
    severity: str

class ProfileUpdate(BaseModel):
    name: str
    phone: str = ""

class SettingsIn(BaseModel):
    theme: str = "light"
    language: str = "english"

class ForgotIn(BaseModel):
    email: EmailStr

class VerifyOtpIn(BaseModel):
    email: EmailStr
    otp: str

class ResetPasswordIn(BaseModel):
    email: EmailStr
    new_password: str
    confirm_password: str
