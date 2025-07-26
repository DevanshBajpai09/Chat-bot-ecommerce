from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db import SessionLocal
from backend.models.conversations import Conversation, Message
from backend.models.models import User
from backend.schemas.chat import ChatRequest, ChatResponse
from datetime import datetime

app = FastAPI()

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # If no conversation_id, create a new one
    if not request.conversation_id:
        conversation = Conversation(user_id=request.user_id)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    else:
        conversation = db.query(Conversation).filter_by(id=request.conversation_id).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

    # Store user's message
    user_msg = Message(
        conversation_id=conversation.id,
        role="user",
        content=request.message,
        timestamp=datetime.utcnow()
    )
    db.add(user_msg)

    # Generate a dummy AI response (for now)
    ai_reply_text = f"🤖 This is a dummy response to: {request.message}"

    # Store AI response
    ai_msg = Message(
        conversation_id=conversation.id,
        role="ai",
        content=ai_reply_text,
        timestamp=datetime.utcnow()
    )
    db.add(ai_msg)

    db.commit()

    return ChatResponse(
        conversation_id=conversation.id,
        user_message=request.message,
        ai_response=ai_reply_text
    )
