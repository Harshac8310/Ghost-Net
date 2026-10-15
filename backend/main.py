
from pathlib import Path
from fastapi import FastAPI, File, HTTPException, UploadFile
from datetime import datetime, timezone
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection, initialize_database
from database import get_connection, initialize_database
app = FastAPI(title="GHOSTNET API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
initialize_database()

UPLOAD_DIR = Path(__file__).resolve().parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True, parents=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


@app.get("/")
def home():
    return {
        "message": "Welcome to GHOSTNET API",
        "status": "running"
    }


@app.post("/api/reports/upload")
async def upload_road_image(file: UploadFile = File(...)):
    extension = Path(file.filename or "").suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG and WEBP images are allowed."
        )

    contents = await file.read()

    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="Image must be 10 MB or smaller."
        )

    import cv2
    import numpy as np

    image_array = np.frombuffer(contents, dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if image is None:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid readable image."
        )

    import uuid

    filename = f"{uuid.uuid4().hex}{extension}"
    file_path = UPLOAD_DIR / filename

        
    file_path.write_bytes(contents)

    uploaded_at = datetime.now(timezone.utc).isoformat()

    try:
        with get_connection() as connection:
            cursor = connection.execute(
                """
                INSERT INTO reports (
                    image_filename,
                    uploaded_at,
                    status
                )
                VALUES (?, ?, ?)
                """,
                (filename, uploaded_at, "pending_review")
            )
            report_id = cursor.lastrowid

    except Exception:
        file_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=500,
            detail="Could not save the report to the database."
        )

    return {
        "message": "Road image uploaded and report saved successfully",
        "report_id": report_id,
        "filename": filename,
        "image_width": int(image.shape[1]),
        "image_height": int(image.shape[0]),
        "uploaded_at": uploaded_at,
        "status": "pending_review"
    }



@app.get("/api/reports")
def get_reports():
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT id, image_filename, latitude, longitude,
                   uploaded_at, status
            FROM reports
            ORDER BY id DESC
            """
        ).fetchall()

    return {
        "total": len(rows),
        "reports": [dict(row) for row in rows]
    }


@app.patch("/api/reports/{report_id}/status")
def update_report_status(report_id: int, status: str):
    allowed_statuses = {
        "pending_review",
        "verified",
        "resolved"
    }

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid status."
        )

    with get_connection() as connection:
        cursor = connection.execute(
            "UPDATE reports SET status = ? WHERE id = ?",
            (status, report_id)
        )

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Report not found."
            )

        row = connection.execute(
            "SELECT id, image_filename, uploaded_at, status "
            "FROM reports WHERE id = ?",
            (report_id,)
        ).fetchone()

    return {
        "message": "Report status updated successfully",
        "report": dict(row)
    }

