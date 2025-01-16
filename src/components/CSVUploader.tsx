import React, { useCallback, useState } from 'react';
import { processCSV, validateCSV } from '../utils/csvProcessor';
import { analyzeCSVSentiment } from '../utils/sentimentAnalyzer';

interface CSVUploaderProps {
  addLog: (message: string) => void;
  setSentimentResults: (results: any) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ addLog, setSentimentResults }) => {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        addLog('No file selected');
        return;
      }

      console.log('[CSV Uploader] Selected file:', file.name);
      setFile(file);
      setIsProcessing(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        console.log('[CSV Uploader] File content loaded');
        addLog(`File loaded: ${file.name}`);
        
        try {
          console.log('[CSV Uploader] Starting CSV processing');
          const { headers, rows } = processCSV(text);
          console.log('[CSV Uploader] CSV processed successfully');
          addLog(`Found ${headers.length} columns and ${rows.length} rows`);
          setCsvData(rows);
          
          console.log('[CSV Uploader] Starting CSV validation');
          const errors = validateCSV({ headers, rows });
          if (errors.length > 0) {
            console.warn('[CSV Uploader] CSV validation issues found:', errors);
            errors.forEach(error => addLog(`Warning: ${error}`));
          } else {
            console.log('[CSV Uploader] CSV validation passed');
            addLog('CSV validation passed');
          }
        } catch (error) {
          console.error('[CSV Uploader] Error processing CSV:', error);
          addLog(`Error processing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = () => {
        console.error('[CSV Uploader] File reading error');
        addLog('Error reading file');
        setIsProcessing(false);
      };

      reader.readAsText(file);
    },
    [addLog]
  );

  const handleSentimentAnalysis = useCallback(async () => {
    if (!csvData) return;

    setIsProcessing(true);
    console.log('[CSV Uploader] Starting sentiment analysis');
    addLog('Starting sentiment analysis...');
    
    try {
      const results = await analyzeCSVSentiment(csvData);
      console.log('[CSV Uploader] Sentiment analysis completed:', results);
      setSentimentResults(results);
      addLog('Sentiment analysis completed');
    } catch (error) {
      console.error('[CSV Uploader] Error analyzing sentiment:', error);
      addLog(`Error analyzing sentiment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  }, [csvData, addLog, setSentimentResults]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">CSV Upload</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        disabled={isProcessing}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100 mb-4
          disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        onClick={handleSentimentAnalysis}
        disabled={!csvData || isProcessing}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : 'Analyze Sentiment'}
      </button>
    </div>
  );
};

export default CSVUploader;
