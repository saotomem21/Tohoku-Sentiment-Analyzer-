export interface CSVData {
  headers: string[];
  rows: string[][];
}

export const processCSV = (text: string): CSVData => {
  console.log('[CSV Processor] Starting CSV processing');
  
  try {
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    console.log(`[CSV Processor] Found ${lines.length} lines`);

    const headers = lines[0].split(',').map(header => header.trim());
    console.log('[CSV Processor] Headers:', headers);

    const rows = lines.slice(1).map((line, index) => {
      const cells = line.split(',').map(cell => cell.trim());
      
      // 不足している列を空文字で埋める
      while (cells.length < headers.length) {
        cells.push('');
      }
      
      if (cells.length !== headers.length) {
        console.warn(`[CSV Processor] Row ${index + 1} has ${cells.length} columns, expected ${headers.length}`);
      }
      
      return cells;
    });

    console.log('[CSV Processor] Processed', rows.length, 'rows');
    
    return { headers, rows };
  } catch (error) {
    console.error('[CSV Processor] Error processing CSV:', error);
    throw new Error('Failed to process CSV: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

export const validateCSV = (data: CSVData): string[] => {
  console.log('[CSV Validator] Starting CSV validation');
  
  const errors: string[] = [];
  
  data.rows.forEach((row, index) => {
    if (row.length < data.headers.length) {
      const message = `Warning: Row ${index + 1} has ${row.length} columns, expected ${data.headers.length}`;
      console.warn('[CSV Validator]', message);
      errors.push(message);
    }
  });

  console.log('[CSV Validator] Found', errors.length, 'validation issues');
  
  return errors;
};
