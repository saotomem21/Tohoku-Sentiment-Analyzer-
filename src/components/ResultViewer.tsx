import React from 'react';
import { SentimentResult } from '../utils/sentimentAnalyzer';
import { exportToCSV } from '../utils/csvExporter';

interface ResultViewerProps {
  results: SentimentResult[];
}

const ResultViewer: React.FC<ResultViewerProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="result-container">
        <p className="text-gray-500">No results to display</p>
      </div>
    );
  }

  return (
    <div className="result-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Analysis Results</h2>
        <button
          onClick={() => exportToCSV(results, 'sentiment-analysis')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Export to CSV
        </button>
      </div>
      <div className="overflow-y-auto max-h-[600px] border border-gray-200 rounded-lg">
        {results.map((result, index) => (
          <div key={index} className="p-4 border-b border-gray-200 hover:bg-gray-50">
            <div className="text-sm text-gray-900 break-words">
              <div className="font-medium mb-1">{result.text}</div>
              <div className="text-xs text-gray-600">
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                  {(result.score * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultViewer;
