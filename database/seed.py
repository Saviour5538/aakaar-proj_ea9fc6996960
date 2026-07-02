import uuid
from datetime import datetime
from database.models import Document, DocumentChunk, SessionLocal

def seed_database():
    session = SessionLocal()
    try:
        # Insert sample documents
        document1 = Document(
            id=str(uuid.uuid4()),
            filename="sample1.txt",
            status="completed",
            session_id=str(uuid.uuid4()),
            created_at=datetime.utcnow()
        )
        document2 = Document(
            id=str(uuid.uuid4()),
            filename="sample2.txt",
            status="processing",
            session_id=str(uuid.uuid4()),
            created_at=datetime.utcnow()
        )
        document3 = Document(
            id=str(uuid.uuid4()),
            filename="sample3.txt",
            status="failed",
            session_id=str(uuid.uuid4()),
            created_at=datetime.utcnow()
        )

        session.add_all([document1, document2, document3])
        session.commit()

        # Insert sample document chunks
        chunk1 = DocumentChunk(
            id=str(uuid.uuid4()),
            document_id=document1.id,
            chunk_index=0,
            content="Sample content for chunk 1",
            embedding=[0.1] * 384,
            metadata={"source": "sample1.txt"},
            created_at=datetime.utcnow()
        )
        chunk2 = DocumentChunk(
            id=str(uuid.uuid4()),
            document_id=document2.id,
            chunk_index=0,
            content="Sample content for chunk 2",
            embedding=[0.2] * 384,
            metadata={"source": "sample2.txt"},
            created_at=datetime.utcnow()
        )
        chunk3 = DocumentChunk(
            id=str(uuid.uuid4()),
            document_id=document3.id,
            chunk_index=0,
            content="Sample content for chunk 3",
            embedding=[0.3] * 384,
            metadata={"source": "sample3.txt"},
            created_at=datetime.utcnow()
        )

        session.add_all([chunk1, chunk2, chunk3])
        session.commit()
    finally:
        session.close()