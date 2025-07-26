from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

from db import SessionLocal
from backend.models.conversations import Conversation, Message
from backend.models.models import User
from backend.schemas.chat import ChatRequest, ChatResponse
from backend.schemas.conversations import MessageSchema, ConversationSchema
from backend.llm.llm import ask_gemini

app = FastAPI()

# ✅ Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # adjust if deployed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ POST /api/chat
@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create or retrieve conversation
    if not request.conversation_id:
        conversation = Conversation(user_id=user.id)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    else:
        conversation = db.query(Conversation).filter_by(id=request.conversation_id).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

    # Store user message
    user_msg = Message(
        conversation_id=conversation.id,
        role="user",
        content=request.message,
        timestamp=datetime.utcnow()
    )
    db.add(user_msg)

    # Build chat history
    messages = db.query(Message).filter_by(conversation_id=conversation.id).order_by(Message.timestamp).all()
    chat_history = "\n".join(
        f"{'User' if msg.role == 'user' else 'AI'}: {msg.content}" for msg in messages
    )

    # Get AI reply
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
    ai_response = ask_gemini(prompt)

    # Store AI reply
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

# ✅ GET /api/conversations?user_id=1
@app.get("/api/conversations", response_model=list[ConversationSchema])
def get_user_conversations(user_id: int, db: Session = Depends(get_db)):
    return db.query(Conversation).filter(Conversation.user_id == user_id).order_by(Conversation.created_at.desc()).all()

# ✅ GET /api/conversations/{conversation_id}
@app.get("/api/conversations/{conversation_id}", response_model=list[MessageSchema])
def get_conversation_messages(conversation_id: int, db: Session = Depends(get_db)):
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.timestamp).all()
    if not messages:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return messages
