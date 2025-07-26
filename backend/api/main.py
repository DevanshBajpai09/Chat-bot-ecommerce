from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from backend.db import SessionLocal
from backend.models.conversations import Conversation, Message
from backend.models.models import User
from backend.schemas.chat import ChatRequest, ChatResponse
from backend.llm.llm import ask_gemini  # ✅ Gemini integration

app = FastAPI()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    # ✅ Check if user exists
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # ✅ Create new conversation if not provided
    if not request.conversation_id:
        conversation = Conversation(user_id=request.user_id)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    else:
        conversation = db.query(Conversation).filter_by(id=request.conversation_id).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

    # ✅ Store user's message
    user_msg = Message(
        conversation_id=conversation.id,
        role="user",
        content=request.message,
        timestamp=datetime.utcnow()
    )
    db.add(user_msg)

    # ✅ Build chat history for context
    messages = db.query(Message).filter_by(conversation_id=conversation.id).order_by(Message.timestamp).all()
    chat_history = ""
    for msg in messages:
        role = "User" if msg.role == "user" else "AI"
        chat_history += f"{role}: {msg.content}\n"

    # ✅ Prompt Gemini
    prompt = f"""
You are a smart AI assistant helping customers on an e-commerce clothing platform.

Context so far:
{chat_history}

Now respond to the user’s latest message: "{request.message}"

Your tasks:
- Ask clarifying questions if needed
- If you have enough info, generate a helpful and relevant response
- Keep the tone polite and clear
"""
    ai_reply_text = ask_gemini(prompt)

    # ✅ Store AI response
    ai_msg = Message(
        conversation_id=conversation.id,
        role="ai",
        content=ai_reply_text,
        timestamp=datetime.utcnow()
    )
    db.add(ai_msg)

    # ✅ Final DB commit
    db.commit()

    return ChatResponse(
        conversation_id=conversation.id,
        user_message=request.message,
        ai_response=ai_reply_text
    )
