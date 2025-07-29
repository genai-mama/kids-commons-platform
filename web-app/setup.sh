#!/bin/bash

echo "📦 .env ファイルを作成します..."
cp .env.example .env

echo "🔑 APIキー（VITE_FIREBASE_API_KEY）を入力してください:"
read API_KEY

# APIキーだけ書き換える
sed -i '' "s|VITE_FIREBASE_API_KEY=.*|VITE_FIREBASE_API_KEY=$API_KEY|" .env

echo "✅ .env に APIキーを設定しました！"