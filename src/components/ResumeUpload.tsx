import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { CandidateInfo } from '../types';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

// -----------------------------------------------------------------------------------
// IMPORTANT: How to fix the "Failed to read PDF file" error
// The most reliable solution is to serve the PDF worker file locally.
// Follow these two steps:
//
// 1. Copy the worker file:
//    - Find 'pdf.worker.min.js' in your node_modules directory:
//      `node_modules/pdfjs-dist/build/pdf.worker.min.js`
//    - Copy this file into your project's `public` folder.
//
// 2. Update the workerSrc path in your code to point to the local file:
//    - Change the line below to:
//      `pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';`
//
// The code below is already updated for this.
// -----------------------------------------------------------------------------------
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface ResumeUploadProps {
  onInfoExtracted: (info: CandidateInfo) => void;
}

export function ResumeUpload({ onInfoExtracted }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [extractedInfo, setExtractedInfo] = useState<Partial<CandidateInfo>>({});
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractEmailFromText = (text: string): string => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const match = text.match(emailRegex);
    return match ? match[0] : '';
  };

  const extractPhoneFromText = (text: string): string => {
    const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const match = text.match(phoneRegex);
    return match ? match[0] : '';
  };

  const extractNameFromText = (text: string): string => {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      if (firstLine.length > 3 && firstLine.length < 50 && /^[A-Za-z\s]+$/.test(firstLine)) {
        return firstLine;
      }
    }
    return '';
  };

  const extractFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      const maxPagesToRead = Math.min(pdf.numPages, 3);
      for (let i = 1; i <= maxPagesToRead; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }
      return fullText;
    } catch (e) {
      console.error('PDF extraction failed:', e);
      throw new Error('Failed to read PDF file. Please check the file format or try a different file.');
    }
  };

  const extractFromDOCX = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileType = selectedFile.type;
    const fileSizeMB = selectedFile.size / 1024 / 1024;
    const maxFileSizeMB = 10;

    if (fileSizeMB > maxFileSizeMB) {
        setError(`File size exceeds the limit of ${maxFileSizeMB} MB.`);
        return;
    }

    if (fileType !== 'application/pdf' && fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setError('Unsupported file format. Please upload PDF or DOCX.');
        return;
    }

    setError('');
    setFile(selectedFile);
    setIsProcessing(true);

    try {
      let text = '';
      if (fileType === 'application/pdf') {
        text = await extractFromPDF(selectedFile);
      } else {
        text = await extractFromDOCX(selectedFile);
      }

      const info: Partial<CandidateInfo> = {
        name: extractNameFromText(text),
        email: extractEmailFromText(text),
        phone: extractPhoneFromText(text),
      };

      setExtractedInfo(info);
      setShowConfirmation(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const info: CandidateInfo = {
      name: (formData.get('name') as string) || extractedInfo.name || '',
      email: (formData.get('email') as string) || extractedInfo.email || '',
      phone: (formData.get('phone') as string) || extractedInfo.phone || '',
    };

    if (!info.name || !info.email || !info.phone) {
      setError('Please fill in all required fields.');
      return;
    }

    // Store candidate info in Firestore
    try {
      await setDoc(doc(db, 'users', info.email), info, { merge: true });
    } catch (err) {
      console.error('Error saving candidate info to Firestore:', err);
    }
    // Pass the final confirmed info to the parent component
    onInfoExtracted(info);
  };
  
  const handleSkipUpload = () => {
    setShowManualInput(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Your Resume</h2>
        {/* ...existing code... */}

        {/* ----------------- State 1: File Upload Form ----------------- */}
        {!showManualInput && !showConfirmation ? (
          <div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                title="Upload your resume (PDF or DOCX)"
              />

              {!file ? (
                <div>
                  <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">PDF or DOCX (max 10MB)</p>
                </div>
              ) : (
                <div>
                  <FileText className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                  <p className="text-lg text-gray-700">{file.name}</p>
                  {isProcessing && (
                    <p className="text-sm text-gray-500 mt-2">Processing...</p>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-700">{error}</p>
                  <p className="text-xs text-red-600 mt-2">If you see this error, please try uploading your resume in <b>DOCX format</b> or enter your details manually below.</p>
                </div>
              </div>
            )}

            <button
              onClick={handleSkipUpload}
              className="w-full mt-6 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Skip and enter details manually
            </button>
          </div>
        ) : (
          /* ----------------- State 2 & 3: Confirmation/Manual Input Form ----------------- */
          <form onSubmit={handleManualSubmit} className="space-y-6">
            <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">
                We've extracted information from your resume. Please review and edit if needed.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                defaultValue={extractedInfo.name || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                defaultValue={extractedInfo.email || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={extractedInfo.phone || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Enter your phone number"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Confirm & Continue to Interview
            </button>
          </form>
        )}
      </div>
    </div>
  );
}