from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class ConversationSchema(BaseModel):
    id: int
    title: Optional[str]
    created_at: Optional[datetime]  # ✅ Make it optional

class MessageSchema(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime
