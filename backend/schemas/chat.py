from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    user_id: int
    message: str
    conversation_id: Optional[int] = None

class ChatResponse(BaseModel):
    conversation_id: int
    user_message: str
    ai_response: str
