import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PDFUploader from './PdfUpload'



createRoot(document.getElementById('root')).render(
  <StrictMode>
   <PDFUploader/>
  </StrictMode>,
)
