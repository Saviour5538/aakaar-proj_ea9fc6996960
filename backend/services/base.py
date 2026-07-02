from typing import Type, TypeVar, Generic, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException

# Type variables for generic CRUD service
ModelType = TypeVar("ModelType")

class CRUDService(Generic[ModelType]):
    """Generic CRUD service for SQLAlchemy models."""

    def __init__(self, model: Type[ModelType]):
        self.model = model

    def create(self, db: Session, obj_in: dict) -> ModelType:
        """Create a new record."""
        try:
            db_obj = self.model(**obj_in)
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    def read(self, db: Session, id: str) -> Optional[ModelType]:
        """Read a record by ID."""
        try:
            return db.query(self.model).filter(self.model.id == id).first()
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    def update(self, db: Session, id: str, obj_in: dict) -> Optional[ModelType]:
        """Update a record by ID."""
        try:
            db_obj = db.query(self.model).filter(self.model.id == id).first()
            if not db_obj:
                raise HTTPException(status_code=404, detail="Record not found.")
            for key, value in obj_in.items():
                setattr(db_obj, key, value)
            db.commit()
            db.refresh(db_obj)
            return db_obj
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    def delete(self, db: Session, id: str) -> None:
        """Delete a record by ID."""
        try:
            db_obj = db.query(self.model).filter(self.model.id == id).first()
            if not db_obj:
                raise HTTPException(status_code=404, detail="Record not found.")
            db.delete(db_obj)
            db.commit()
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")