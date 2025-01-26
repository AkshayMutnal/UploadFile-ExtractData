from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
from io import BytesIO
import uvicorn

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF file.")

    try:
        # Read the PDF file contents
        contents = await file.read()
        
        # Create a BytesIO object from the file contents
        pdf_file = BytesIO(contents)
        
        # Pass the BytesIO object to PdfReader
        reader = PdfReader(pdf_file)

        # Extract text from all pages
        extracted_text = "".join([page.extract_text() for page in reader.pages])

        # Return the extracted text as JSON
        return JSONResponse(content={"extracted_text": extracted_text})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
