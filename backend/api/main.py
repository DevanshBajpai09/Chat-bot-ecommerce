from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime

from db import SessionLocal
from models.models import User
from models.conversations import Conversation, Message
from schemas.chat import ChatRequest, ChatResponse
from schemas.conversations import ConversationSchema, MessageSchema
from llm.llm import ask_gemini

# Create FastAPI instance
app = FastAPI(
    title="E-commerce Chatbot API",
    description="Chat interface for customers on a clothing e-commerce platform",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to ["http://localhost:3000"] or production domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================== ROUTES ==================

# POST /api/chat
@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create new conversation if not provided
    if not request.conversation_id:
        conversation = Conversation(user_id=user.id)
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

    # Prepare chat history for Gemini
    messages = db.query(Message).filter_by(conversation_id=conversation.id).order_by(Message.timestamp).all()
    chat_history = "\n".join(
        f"{'User' if msg.role == 'user' else 'AI'}: {msg.content}" for msg in messages
    )

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
    try:
        ai_response = ask_gemini(prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to get response from LLM")

    # Store AI's message
    ai_msg = Message(
        conversation_id=conversation.id,
        role="ai",
        content=ai_response,
        timestamp=datetime.utcnow()
    )
    db.add(ai_msg)
    db.commit()

    return ChatResponse(
        conversation_id=conversation.id,
        user_message=request.message,
        ai_response=ai_response
    )

# GET /api/conversations?user_id=1
@app.get("/api/conversations", response_model=list[ConversationSchema])
def get_user_conversations(user_id: int, db: Session = Depends(get_db)):
    return db.query(Conversation).filter(Conversation.user_id == user_id).order_by(Conversation.created_at.desc()).all()

# GET /api/conversations/{conversation_id}
@app.get("/api/conversations/{conversation_id}", response_model=list[MessageSchema])
def get_conversation_messages(conversation_id: int, db: Session = Depends(get_db)):
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.timestamp).all()
    if not messages:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return messages
