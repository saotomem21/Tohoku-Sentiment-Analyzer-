import React, { useState } from 'react';
import CSVUploader from './components/CSVUploader';
import LogViewer from './components/LogViewer';
import ResultViewer from './components/ResultViewer';
import { SentimentResult } from './utils/sentimentAnalyzer';

function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [sentimentResults, setSentimentResults] = useState<SentimentResult[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">CSV Analyzer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <CSVUploader 
            addLog={addLog} 
            setSentimentResults={setSentimentResults}
          />
        </div>
        
        <div className="space-y-8">
          <LogViewer logs={logs} />
          
          <ResultViewer results={sentimentResults} />
        </div>
      </div>
    </div>
  );
}

export default App;
