# backend/scripts/create_tables.py

from db import engine
from models.base import Base
import backend.models.models  # ensures table definitions are registered
import backend.models.conversations  # registers conversation tables

Base.metadata.create_all(bind=engine)

print("✅ All tables created successfully.")
