import axios, { AxiosError } from 'axios';

// 日本語文字を含むか判定する正規表現
const japaneseRegex = /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFF9F\u4E00-\u9FAF\u3400-\u4DBF]/;

export interface SentimentResult {
  row_index: number;
  text: string;
  label: 'negative' | 'neutral' | 'positive';
  score: number;
}

export const analyzeCSVSentiment = async (rows: string[][]): Promise<SentimentResult[]> => {
  console.log('[Sentiment Analyzer] Starting analysis for', rows.length, 'rows');
  
  try {
    console.log('[Sentiment Analyzer] Sending request to API');
    // CSVデータをBlobに変換（ヘッダー付き）
    const headers = ['text']; // 必須カラム
    // 日本語を含む行のみフィルタリング
    const filteredRows = rows.filter(row => {
      const text = row[0];
      return japaneseRegex.test(text);
    });

    const csvContent = [
      headers.join(','), // ヘッダー行
      ...filteredRows.map(row => row.slice(0, 1).join(',')) // 最初のカラムのみ使用
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const file = new File([blob], 'data.csv', { type: 'text/csv' });

    // FormDataを作成
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('http://localhost:8000/analyze-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000 // 30秒タイムアウト
    });

    console.log('[Sentiment Analyzer] Received response:', response.status);
    return response.data.results;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        // サーバーからのエラーレスポンス
        console.error('[Sentiment Analyzer] API Error Response:', {
          status: axiosError.response.status,
          data: axiosError.response.data,
          headers: axiosError.response.headers
        });
        throw new Error(`API Error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
      } else if (axiosError.request) {
        // リクエストは送信されたがレスポンスがない
        console.error('[Sentiment Analyzer] No response received:', axiosError.request);
        throw new Error('No response received from the API server');
      } else {
        // リクエスト設定エラー
        console.error('[Sentiment Analyzer] Request setup error:', axiosError.message);
        throw new Error(`Request error: ${axiosError.message}`);
      }
    } else {
      // その他のエラー
      console.error('[Sentiment Analyzer] Unexpected error:', error);
      throw new Error('Unexpected error occurred during sentiment analysis');
    }
  }
};
