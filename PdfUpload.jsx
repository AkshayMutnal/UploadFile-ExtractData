import React, { useState } from "react";
import axios from "axios";

const PDFUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setError(null);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setJsonData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to upload and process the file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="container">
        <h1 className="text-xl font-bold mb-4">Upload PDF File</h1>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="error">{error}</p>}
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className={`spinner ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Uploading..." : "Upload and Extract"}
        </button>
        {jsonData && (
          <pre className="mt-4 p-2 bg-gray-100 rounded">
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default PDFUploader;
