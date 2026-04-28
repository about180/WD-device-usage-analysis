/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { ReceiverLog } from './types';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [data, setData] = useState<ReceiverLog[]>([]);
  const [filename, setFilename] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);

  const handleUploadSuccess = useCallback((logs: ReceiverLog[], name: string) => {
    setData(logs);
    setFilename(name);
    setIsUploaded(true);
  }, []);

  const handleReset = useCallback(() => {
    setData([]);
    setFilename('');
    setIsUploaded(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-700">
      <AnimatePresence mode="wait">
        {!isUploaded ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-4"
          >
            <Dashboard 
              data={data} 
              filename={filename} 
              onReset={handleReset} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer / Branding */}
      <footer className="py-12 px-4 border-t border-gray-100 bg-white mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-xs font-semibold tracking-widest uppercase">
          <p>© 2026 Receiver Analytics Engine</p>
          <div className="flex gap-8">
            <span className="hover:text-gray-900 transition-colors cursor-default">Privacy</span>
            <span className="hover:text-gray-900 transition-colors cursor-default">Documentation</span>
            <span className="hover:text-gray-900 transition-colors cursor-default">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

