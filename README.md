# Tohoku Sentiment Analyzer (東北センチメントアナライザ)

## 概要

日本語テキストの感情分析を行うWebアプリケーション。CSVファイルをアップロードすると、各テキストの感情スコアを分析し、結果を表示・ダウンロードできます。

## 主な機能

### 1. CSVファイルアップロード
- 最大100MBまでのCSVファイルを処理可能
- 1列目にテキストデータを含むCSV形式に対応
- 文字コード: UTF-8
- サンプルCSV形式:
```csv
テキスト
これは良い例文です
あまり良くない例文
```

### 2. 感情分析
- 日本語テキストの感情スコアを-1.0〜1.0の範囲で算出
  - 1.0に近いほどポジティブ
  - -1.0に近いほどネガティブ
- 分析モデル: 独自開発の深層学習モデル
- 処理速度: 約100テキスト/秒

### 3. 分析結果表示
- リアルタイムで分析結果を表示
- 表示項目:
  - 行番号
  - テキスト内容
  - 感情スコア
  - 処理ステータス
- ページネーション対応（1ページあたり50件表示）

### 4. CSV出力
- 分析結果をCSV形式でダウンロード可能
- 出力項目:
  - Row Index: 行番号
  - Text: 元テキスト
  - Score: 感情スコア（小数点以下4桁）
- 出力例:
```csv
Row Index,Text,Score
1,"これは良い例文です",0.8765
2,"あまり良くない例文",-0.4321
```

## システム構成

### フロントエンド
- フレームワーク: React 18
- ビルドツール: Vite 4
- 主要ライブラリ:
  - react-router-dom: ルーティング
  - axios: API通信
  - react-table: テーブル表示
  - tailwindcss: スタイリング

### バックエンド
- フレームワーク: FastAPI
- Pythonバージョン: 3.10
- 主要ライブラリ:
  - torch: 深層学習
  - transformers: 自然言語処理
  - pandas: CSV処理
  - uvicorn: ASGIサーバー

### インフラ
- 開発環境:
  - フロントエンド: Vite開発サーバー（localhost:3000）
  - バックエンド: Uvicorn（localhost:8000）
- 本番環境:
  - Dockerコンテナ化
  - Nginxリバースプロキシ
  - Gunicorn WSGIサーバー

## インストール手順

### 前提条件
- Node.js 18.x
- Python 3.10
- Git

### 1. リポジトリのクローン
```bash
git clone https://github.com/saotomem21/Tohoku-Sentiment-Analyzer-.git
cd Tohoku-Sentiment-Analyzer-
```

### 2. フロントエンド設定
```bash
# 依存パッケージのインストール
npm install

# 環境変数の設定
cp .env.example .env
```

### 3. バックエンド設定
```bash
cd ../sentiment-api

# Python仮想環境の作成
python -m venv venv
source venv/bin/activate

# 依存パッケージのインストール
pip install -r requirements.txt

# 環境変数の設定
cp .env.example .env
```

## 起動方法

### 開発環境
1. バックエンドサーバーの起動
```bash
cd sentiment-api
source venv/bin/activate
uvicorn sentiment_api:app --reload
```

2. フロントエンドサーバーの起動
```bash
cd ../csv-analyzer-web
npm run dev
```

3. ブラウザでアクセス
- http://localhost:3000

### 本番環境
```bash
docker-compose up -d
```

## API仕様

### エンドポイント
- POST /api/analyze
  - リクエスト:
    ```json
    {
      "texts": ["テキスト1", "テキスト2"]
    }
    ```
  - レスポンス:
    ```json
    {
      "results": [
        {
          "text": "テキスト1",
          "score": 0.8765
        }
      ]
    }
    ```

## テスト
### ユニットテストの実行
```bash
# フロントエンド
npm test

# バックエンド
pytest
```

### カバレッジレポート
```bash
# フロントエンド
npm run test:coverage

# バックエンド
pytest --cov=.
```

## コントリビューション
1. リポジトリをフォーク
2. 機能ブランチを作成
3. 変更をコミット
4. プルリクエストを作成

## ライセンス
MIT License

