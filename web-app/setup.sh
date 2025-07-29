#!/bin/bash

echo "📦 .env ファイルを作成します..."
if [ -f .env.sample ]; then
    cp .env.sample .env
    echo "✅ .env ファイルを作成しました"
elif [ -f .env.sample ]; then
    cp .env.sample .env
    echo "✅ .env ファイルを作成しました"
else
    echo "❌ .env.sample または .env.example が見つかりません"
    echo "📝 空の .env ファイルを作成します..."
    cat > .env << 'EOF'
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=gemaimamastoreproject.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gemaimamastoreproject
VITE_FIREBASE_STORAGE_BUCKET=gemaimamastoreproject.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=727225892227
VITE_FIREBASE_APP_ID=1:727225892227:web:0958adf8c85a3487b30ab6
VITE_FIREBASE_MEASUREMENT_ID=G-M3VBTG516S
EOF
    echo "✅ テンプレート .env ファイルを作成しました"
fi

echo "🔑 APIキー（VITE_FIREBASE_API_KEY）を入力してください:"
read API_KEY

# APIキーだけ書き換える
sed -i '' "s|VITE_FIREBASE_API_KEY=.*|VITE_FIREBASE_API_KEY=$API_KEY|" .env

echo "✅ .env に APIキーを設定しました！"
