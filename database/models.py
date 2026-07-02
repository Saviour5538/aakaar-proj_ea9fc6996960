import os
import uuid
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, Text, ForeignKey, DateTime, JSON, Index, Enum
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from pgvector.sqlalchemy import Vector

# Environment variable for database URL
DATABASE_URL_ENV = "DATABASE_URL"
DATABASE_URL = os.environ.get(DATABASE_URL_ENV)

# SQLAlchemy setup
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Document status ENUM
DOCUMENT_STATUS_ENUM = Enum('pending', 'processing', 'completed', 'failed', name='document_status', create_type=False)

class Document(Base):
    __tablename__ = 'documents'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String, nullable=False)
    status = Column(DOCUMENT_STATUS_ENUM, nullable=False)
    session_id = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

class DocumentChunk(Base):
    __tablename__ = 'document_chunks'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey('documents.id'), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    embedding = Column(Vector(384), nullable=False)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    document = relationship("Document", back_populates="chunks")

Document.chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

# Indexes
Index('ix_document_chunks_document_id', DocumentChunk.document_id)
Index('ix_document_chunks_embedding', DocumentChunk.embedding)