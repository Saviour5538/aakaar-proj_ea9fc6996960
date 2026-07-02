from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from uuid import UUID

from database.models import Document
from database.config import get_db
from backend.services.auth import get_current_user

router = APIRouter(prefix="/documents")

class DocumentResponse(BaseModel):
    id: UUID
    filename: str
    status: str
    session_id: str
    created_at: str

    class Config:
        orm_mode = True

@router.get("/", response_model=List[DocumentResponse], operation_id="listDocuments")
async def list_documents(db: Session = Depends(get_db)):
    try:
        documents = db.query(Document).all()
        return documents
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching documents: {str(e)}"
        )