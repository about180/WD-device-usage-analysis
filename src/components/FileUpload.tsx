import React, { useRef, useState } from 'react';
import { Upload, FileWarning, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { parseCSV, isValidFilename } from '../utils/dataProcessor';
import { ReceiverLog } from '../types';

interface FileUploadProps {
  onUploadSuccess: (data: ReceiverLog[], filename: string) => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!isValidFilename(file.name)) {
      setError('Invalid filename. Please use Receiver_Log*.csv');
      return;
    }

    try {
      const data = await parseCSV(file);
      if (data.length === 0) {
        setError('The CSV file appears to be empty or has incompatible headers.');
        return;
      }
      onUploadSuccess(data, file.name);
    } catch (err) {
      setError('Failed to parse CSV file.');
      console.error(err);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">Device Usage Analysis</h1>
          <p className="text-gray-500 font-sans">Upload your receiver log CSV files to begin analysis</p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative cursor-pointer transition-all duration-300
            border-2 border-dashed rounded-3xl p-12
            flex flex-col items-center justify-center space-y-4
            ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50/50'}
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept=".csv"
            className="hidden"
          />
          
          <div className={`p-6 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-gray-100'} transition-colors`}>
            <Upload className={`w-12 h-12 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>

          <div className="text-center">
            <p className="text-xl font-medium text-gray-900">Click or drag CSV here</p>
            <p className="text-sm text-gray-400 mt-1">Accepts Receiver_Log*.csv</p>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600"
            >
              <FileWarning className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Auto Mapping', desc: 'Supports camelCase and Space headers' },
            { title: 'Interactive', desc: 'Real-time filtering and visualizations' },
            { title: 'Secure', desc: 'Client-side processing only' }
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-green-500 mb-2" />
              <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
