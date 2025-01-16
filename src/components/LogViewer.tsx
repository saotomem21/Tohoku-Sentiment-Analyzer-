import React from 'react';

interface LogViewerProps {
  logs: string[];
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  return (
    <div className="log-container">
      <h2 className="text-xl font-semibold mb-4">Processing Logs</h2>
      <ul className="space-y-2">
        {logs.map((log, index) => (
          <li key={index} className="text-sm text-gray-700">
            {log}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogViewer;
