import { SentimentResult } from './sentimentAnalyzer';

export const exportToCSV = (results: SentimentResult[], filename: string) => {
  const headers = ['Row Index', 'Text', 'Score'];
  const rows = results.map(result => [
    result.row_index,
    result.text.replace(/"/g, '""'), // ダブルクォートをエスケープ
    result.score.toFixed(4)
  ]);

  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers, ...rows]
      .map(row => row.join(',')) // 各フィールドをカンマで結合
      .join('\n'); // 各行を改行で結合

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
