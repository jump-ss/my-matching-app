# Chat Matching App

このアプリは、ユーザーがプロフィールカードをスワイプして「いいね」を付けることができるマッチングアプリです。ユーザーは「いいね」したプロフィールとチャットをすることができます。

## 機能

- OpenAI によるプロフィール自動生成
- プロフィールカードのスワイプ (いいね/スキップ)
- いいねしたプロフィール一覧の表示
- いいねしたプロフィールとのチャット機能 (対話相手は OpenAI)

## 前提条件

- Node.js (推奨バージョン: v14.x 以上)
- サーバー側の API (このチャットマッチングアプリは、API に依存しています。API が提供するエンドポイントに注意してください。)

## セットアップ方法

1. このリポジトリをクローンまたはダウンロードします。
2. クローンしたディレクトリに移動し、以下のコマンドを実行して必要なパッケージをインストールします。

```
npm install
```

3. プロジェクトのルートディレクトリに `.env` ファイルを作成し、必要な環境変数を設定します。
   REACT_APP_OPENAI_API_KEY=OpenAI API の公式サイトから取得する
4. サーバー側の API を起動します。

```
node server/index.js
```

5. プロジェクトのルートディレクトリで以下のコマンドを実行してアプリを起動します。

```
npm start
```

6. ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてアプリを表示します。

## 使用技術

- React
- Material-UI
- Express
- OpenAI API

## ライセンス

このプロジェクトは、MIT ライセンスの下で公開されています。

## 今後の対応予定

- commponet をファイルごとに分離。現状は GPT が認知できるように一ファイルにロジックを詰め込んでいるが、各機能がお互い影響を与えないように分割化を検討する
- エンジニア特化したマッチングアプリにしたい
- プロフィールの強化（プロフィール画像の追加、職業、スキル、趣味、日本語化、人格の付与）
- 人格に応じてチャット相手が話すように変更する
- チャット相手のブロック機能と FB
- バックエンドの Rails 化、および各種データの永続化（プロフィール、いいね履歴、チャット履歴）
- ユーザー認証とプロフィール管理機能の実装
- レスポンシブデザイン対応
- よりリアルなプロフィールと対話の改善
