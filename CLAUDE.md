# CLAUDE.md

このファイルは、このリポジトリでコードを作業する際に Claude Code (claude.ai/code) にガイダンスを提供します。

## プロジェクト概要

これは「#生成AIママ部」のコミュニティWebサイトです。家事育児の効率化からコーディングまで、生成AIを活用するママのためのDiscordコミュニティの成果物を紹介するProduct Hunt風のプラットフォームです。

## アーキテクチャ

このプロジェクトは、ビルドプロセスのないシンプルなクライアントサイド Web アプリケーションです：

**フロントエンド:**
- HTML5 (セマンティックマークアップ)
- CSS3 (Flexbox, Grid, グラデーション、アニメーション)
- Vanilla JavaScript (ES6+)

**ホスティング:**
- Firebase Hosting (静的サイトホスティング)

**特徴:**
- レスポンシブデザイン
- SPA (Single Page Application) 風の動作
- 完全に静的なサイト（サーバーサイド処理なし）
- Product Hunt風のモダンなUIデザイン
- パープル系カラーパレット

### 主要コンポーネント

- `index.html` - Product Hunt風レイアウトのメイン HTML 構造
- `css/style.css` - メインスタイルシート（パープル系カラーパレット、Product Hunt風デザイン）
- `css/responsive.css` - レスポンシブデザイン専用スタイル
- `js/data.js` - サンプルデータ（products, stats, news）と関連関数
- `js/navigation.js` - SPA ナビゲーションシステム
- `js/app.js` - メインアプリケーションロジック（検索、フィルタ、いいね機能など）

## よく使用されるコマンド

静的 Web アプリケーションのため、ビルドツールは不要です：

```bash
# ローカルサーバーでの提供（ローカルサーバーがある場合）
python -m http.server 8000  # Python 3
# または
python -m SimpleHTTPServer 8000  # Python 2

# Firebaseにデプロイ
firebase deploy
```

## 開発に関する注意点

- すべてのテキストは日本語です
- Product Hunt風のデザインを採用（クリーンなレイアウト、カード型UI、パープル系カラーパレット）
- キーボードナビゲーション（/で検索フォーカス、Escape でクリア）などのアクセシビリティ機能を含む
- タッチジェスチャーサポート付きでモバイル最適化
- 外部依存関係やフレームワークなし - 純粋なバニラ JavaScript
- SPAナビゲーション、検索・フィルタ機能、いいね機能を実装
- js/data.js の products データはサンプルデータとして使用
- Intersection Observer を使用したアニメーション効果
- localStorage を使用したいいねの永続化

## 主な機能

- **ホームページ**: ヒーローセクション、統計、注目の成果物、最新ニュース
- **Productsページ**: 成果物一覧、カテゴリフィルタ、ソート、検索
- **Newsページ**: ニュース一覧
- **Aboutページ**: コミュニティ説明
- **いいね機能**: 成果物への評価とlocalStorage永続化
- **検索機能**: リアルタイム検索とデバウンス処理
- **レスポンシブデザイン**: モバイルファースト設計
