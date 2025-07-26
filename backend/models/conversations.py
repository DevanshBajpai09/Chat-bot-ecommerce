# backend/models/conversations.py
from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from backend.models.base import Base  # ✅ shared base again

class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, default="Untitled Conversation")
    created_at = Column(DateTime)

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    role = Column(String)  # "user" or "ai"
    content = Column(String)
    timestamp = Column(DateTime)
