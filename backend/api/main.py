import sys
import os

# ✅ Add parent dir to Python path to resolve 'backend' imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from backend.db import SessionLocal
from backend.models.conversations import Conversation, Message
from backend.models.models import User
from datetime import datetime

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "AI Conversation API is live 🚀"}

@app.post("/users/{user_id}/conversations/")
def create_conversation(user_id: int, db: Session = Depends(get_db)):
    conv = Conversation(user_id=user_id)
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv

@app.post("/conversations/{conv_id}/messages/")
def add_message(conv_id: int, role: str, content: str, db: Session = Depends(get_db)):
    msg = Message(conversation_id=conv_id, role=role, content=content, timestamp=datetime.utcnow())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg

@app.get("/conversations/{conv_id}/messages/")
def get_conversation(conv_id: int, db: Session = Depends(get_db)):
    messages = db.query(Message).filter_by(conversation_id=conv_id).order_by(Message.timestamp).all()
    return messages
