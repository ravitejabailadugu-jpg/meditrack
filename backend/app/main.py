import os
import hashlib
import csv
import io
from datetime import datetime, date
from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from .database import Base, engine, get_db
from .models import ActivityLog, DiseaseType, Notification, Patient, PatientDisease, User
def hash_password(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()

from .schemas import (DiseaseIn, DiseaseUpdateIn, ForgotIn, LoginIn, PatientIn,
                      ProfileUpdate, RegisterIn, ResetPasswordIn, SettingsIn, VerifyOtpIn)

app = FastAPI(title="MediTrack API", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://medi-track-sepia.vercel.app",
]

# Also allow any additional origins configured in Render
frontend_origin = os.getenv("FRONTEND_ORIGIN")

if frontend_origin:
    origins.extend(
        origin.strip()
        for origin in frontend_origin.split(",")
        if origin.strip()
    )

# Remove duplicates
origins = list(set(origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
def root(): return {"message": "MediTrack FastAPI is running"}
@app.get("/api/health")
def health(): return {"status": "ok"}

def log(db: Session, action: str):
    db.add(ActivityLog(action=action)); db.commit()

def patient_json(p: Patient):
    return {"id": p.id, "name": p.name, "age": p.age, "gender": p.gender, "phone_number": p.phone_number, "address": p.address}

def disease_json(d: PatientDisease):
    return {"id": str(d.id), "record_id": d.id, "patientId": str(d.patient_id), "patient_id": d.patient_id,
            "name": d.disease_name, "disease": d.disease_name, "disease_name": d.disease_name,
            "patient_name": d.patient.name if d.patient else "Anonymous",
            "diagnosisDate": d.diagnosis_date.isoformat(), "diagnosis_date": d.diagnosis_date.isoformat(),
            "severity": d.severity, "default_severity": d.severity, "status": d.status,
            "assignedDoctor": d.assigned_doctor, "assigned_doctor": d.assigned_doctor, "notes": d.notes, "history": []}

@app.post("/api/register/")
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    if payload.password != payload.confirm_password: raise HTTPException(400, "Passwords do not match")
    if db.query(User).filter(func.lower(User.email) == payload.email.lower()).first(): raise HTTPException(400, "Email already registered")
    user = User(name=payload.full_name, email=payload.email.lower(), password=hash_password(payload.password))
    db.add(user); db.commit(); log(db, f"Registered user {user.email}")
    return {"message": "Registration successful", "user": {"name": user.name, "email": user.email}}

@app.post("/api/login/")
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(func.lower(User.email) == payload.email.lower()).first()
    if not user or user.password != hash_password(payload.password): raise HTTPException(401, "Invalid email or password")
    return {"message": "Login successful", "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}}

@app.post("/api/logout/")
def logout(): return {"message": "Logged out successfully"}

@app.get("/api/patients/")
def list_patients(db: Session = Depends(get_db)): return [patient_json(p) for p in db.query(Patient).order_by(Patient.id.desc()).all()]
@app.post("/api/patients/add/")
def add_patient(payload: PatientIn, db: Session = Depends(get_db)):
    p = Patient(**payload.model_dump()); db.add(p); db.commit(); db.refresh(p); log(db, f"Added patient {p.name}"); return patient_json(p)
@app.get("/api/patients/{patient_id}/")
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    p = db.query(Patient).options(joinedload(Patient.diseases)).filter(Patient.id == patient_id).first()
    if not p: raise HTTPException(404, "Patient not found")
    data = patient_json(p); data["diseases"] = [disease_json(d) for d in p.diseases]; return data
@app.put("/api/patients/{patient_id}/update/")
def update_patient(patient_id: int, payload: PatientIn, db: Session = Depends(get_db)):
    p = db.get(Patient, patient_id)
    if not p: raise HTTPException(404, "Patient not found")
    for k,v in payload.model_dump().items(): setattr(p,k,v)
    db.commit(); log(db, f"Updated patient {p.name}"); return patient_json(p)
@app.delete("/api/patients/{patient_id}/delete/")
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    p=db.get(Patient,patient_id)
    if not p: raise HTTPException(404,"Patient not found")
    db.delete(p); db.commit(); log(db, f"Deleted patient {patient_id}"); return {"message":"Patient deleted"}
@app.get("/api/patients/{patient_id}/history/")
def patient_history(patient_id: int, db: Session = Depends(get_db)):
    if not db.get(Patient,patient_id): raise HTTPException(404,"Patient not found")
    return [disease_json(d) for d in db.query(PatientDisease).filter(PatientDisease.patient_id==patient_id).order_by(PatientDisease.diagnosis_date.desc()).all()]

@app.get("/api/diseases/")
def list_diseases(db: Session = Depends(get_db)):
    records = db.query(PatientDisease).options(joinedload(PatientDisease.patient)).order_by(PatientDisease.id.desc()).all()
    return [disease_json(d) for d in records]

@app.get("/api/disease-types/")
def list_disease_types(db: Session = Depends(get_db)):
    types = db.query(DiseaseType).order_by(DiseaseType.name).all()
    return [{"id": t.id, "name": t.name, "disease_name": t.name} for t in types]
@app.post("/api/patients/assign-disease/")
def assign_disease(payload: DiseaseIn, db: Session = Depends(get_db)):
    if not db.get(Patient,payload.patient_id): raise HTTPException(404,"Patient not found")
    d=PatientDisease(**payload.model_dump()); db.add(d); db.commit(); db.refresh(d)
    if not db.query(DiseaseType).filter(func.lower(DiseaseType.name)==payload.disease_name.lower()).first(): db.add(DiseaseType(name=payload.disease_name)); db.commit()
    db.add(Notification(message=f"Disease {d.disease_name} assigned to patient {d.patient_id}")); db.commit(); log(db, f"Assigned disease {d.disease_name} to patient {d.patient_id}")
    return disease_json(d)
@app.get("/api/diseases/{disease_id}/detail/")
def disease_detail(disease_id:int, db:Session=Depends(get_db)):
    d=db.get(PatientDisease,disease_id)
    if not d: raise HTTPException(404,"Disease record not found")
    return disease_json(d)
@app.put("/api/patients/disease/{record_id}/update/")
def update_disease(record_id:int,payload:DiseaseUpdateIn,db:Session=Depends(get_db)):
    d=db.get(PatientDisease,record_id)
    if not d: raise HTTPException(404,"Disease record not found")
    d.status=payload.status; d.severity=payload.severity; db.commit(); db.refresh(d)
    db.add(Notification(message=f"Disease status updated for patient {d.patient_id}")); db.commit(); log(db, f"Updated disease {record_id}"); return disease_json(d)
@app.delete("/api/patients/disease/{record_id}/delete/")
def delete_disease(record_id:int,db:Session=Depends(get_db)):
    d=db.get(PatientDisease,record_id)
    if not d: raise HTTPException(404,"Disease record not found")
    db.delete(d); db.commit(); return {"message":"Disease record deleted"}

@app.get("/api/dashboard/")
def dashboard(db:Session=Depends(get_db)):
    total=db.query(PatientDisease).count(); active=db.query(PatientDisease).filter(PatientDisease.status.in_(["Active","Under Treatment","Diagnosed"])).count(); critical=db.query(PatientDisease).filter(func.lower(PatientDisease.severity)=="critical").count(); recovering=db.query(PatientDisease).filter(func.lower(PatientDisease.status).like("%recover%")).count()
    return {"total_cases":total,"active_cases":active,"critical_cases":critical,"recovering_cases":recovering}

@app.get("/api/notifications/")
def notifications(db:Session=Depends(get_db)):
    return [{"id":n.id,"message":n.message,"created_at":n.created_at.isoformat(),"is_read":n.is_read} for n in db.query(Notification).order_by(Notification.created_at.desc()).all()]
@app.patch("/api/notifications/{notification_id}/read/")
def mark_read(notification_id:int,db:Session=Depends(get_db)):
    n=db.get(Notification,notification_id)
    if not n: raise HTTPException(404,"Notification not found")
    n.is_read=True; db.commit(); return {"message":"Notification marked as read"}
@app.delete("/api/notifications/{notification_id}/delete/")
def delete_notification(notification_id:int,db:Session=Depends(get_db)):
    n=db.get(Notification,notification_id)
    if not n: raise HTTPException(404,"Notification not found")
    db.delete(n); db.commit(); return {"message":"Notification deleted"}

@app.get("/api/reports/summary/")
def report_summary(db:Session=Depends(get_db)):
    return {"total_patients":db.query(Patient).count(),"total_cases":db.query(PatientDisease).count(),"critical_cases":db.query(PatientDisease).filter(func.lower(PatientDisease.severity)=="critical").count(),"active_cases":db.query(PatientDisease).filter(PatientDisease.status.in_(["Active","Under Treatment","Diagnosed"])).count()}
@app.get("/api/reports/patients/")
def patient_report(db:Session=Depends(get_db)): return [get_patient(p.id,db) for p in db.query(Patient).all()]
@app.get("/api/reports/download/")
def download_report(format: str = "PDF", report_type: str = "Complete", db: Session = Depends(get_db)):
    rows = []
    if report_type != "Diseases Only":
        rows.extend([["Patient ID", "Name", "Age", "Gender", "Phone", "Address"]])
        rows.extend([[p.id, p.name, p.age, p.gender, p.phone_number, p.address] for p in db.query(Patient).all()])
    if report_type in ("Complete", "Diseases Only"):
        if rows: rows.append([])
        rows.append(["Disease ID", "Patient ID", "Disease", "Diagnosis Date", "Severity", "Status", "Doctor", "Notes"])
        rows.extend([[d.id, d.patient_id, d.disease_name, d.diagnosis_date.isoformat(), d.severity, d.status, d.assigned_doctor, d.notes] for d in db.query(PatientDisease).all()])
    if format.lower() in ("excel", "csv"):
        stream=io.StringIO(); csv.writer(stream).writerows(rows); stream.seek(0)
        return StreamingResponse(iter([stream.getvalue()]), media_type="text/csv", headers={"Content-Disposition":"attachment; filename=meditrack_report.csv"})
    text="MediTrack Report\n\n"+"\n".join(", ".join(map(str,r)) for r in rows)
    return StreamingResponse(iter([text]), media_type="application/pdf", headers={"Content-Disposition":"attachment; filename=meditrack_report.pdf"})

@app.get("/api/reports/analytics/")
def analytics(db:Session=Depends(get_db)):
    rows=db.query(PatientDisease.disease_name,func.count(PatientDisease.id)).group_by(PatientDisease.disease_name).all()
    return [{"disease":n,"count":c,"name":n,"value":c} for n,c in rows]

@app.get("/api/activity-log/")
def activity_log(db:Session=Depends(get_db)): return [{"id":x.id,"action":x.action,"created_at":x.created_at.isoformat()} for x in db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).all()]

@app.get("/api/profile/")
def profile(db:Session=Depends(get_db)):
    u=db.query(User).order_by(User.id).first()
    return {"name":u.name if u else "Doctor User","phone":u.phone if u else "","email":u.email if u else ""}
@app.post("/api/profile/update/")
def profile_update(payload:ProfileUpdate,db:Session=Depends(get_db)):
    u=db.query(User).order_by(User.id).first()
    if not u: raise HTTPException(404,"Profile not found")
    u.name=payload.name; u.phone=payload.phone; db.commit(); return {"message":"Profile updated"}

@app.get("/api/settings/")
def settings(): return {"theme":"light","language":"english"}
@app.post("/api/settings/save/")
def save_settings(payload:SettingsIn): return {"message":"Settings saved","settings":payload.model_dump()}

@app.post("/api/forgot-password/")
def forgot_password(payload:ForgotIn): return {"message":"OTP sent successfully","otp":"123456"}
@app.post("/api/verify-forgot-otp/")
def verify_otp(payload:VerifyOtpIn):
    if payload.otp != "123456": raise HTTPException(400,"Invalid OTP")
    return {"message":"OTP verified"}
@app.post("/api/reset-password/")
def reset_password(payload:ResetPasswordIn,db:Session=Depends(get_db)):
    if payload.new_password != payload.confirm_password: raise HTTPException(400,"Passwords do not match")
    u=db.query(User).filter(func.lower(User.email)==payload.email.lower()).first()
    if not u: raise HTTPException(404,"User not found")
    u.password=hash_password(payload.new_password); db.commit(); return {"message":"Password reset successfully"}
