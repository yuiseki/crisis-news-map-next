# crisis.yuiseki.net

## 概要

- Next.js で実装されたアプリケーションです
- サーバーサイド、クライアントサイド、バッチジョブスクリプトから構成されています
- [Typescript](https://www.typescriptlang.org/)化されています
- CSS の記述に[Tailwind CSS](https://tailwindcss.com/)を使っています
- 地図表示のために[react-leaflet](https://github.com/PaulLeCam/react-leaflet)を使っています
- DB として MongoDB を使うために[Mongoose](https://mongoosejs.com/)を使っています
- テストライブラリとして[Jest](https://jestjs.io/)を使っています

## 開発時の注意

- `husky` という、コミット・プッシュ前に自動的に ESLint と tsc を実行する Git Hook が使われています
- ESLint と tsc でエラーになるコードが含まれている場合にはコミットができないので注意してください

## 開発環境

- Node.js v16.3.0
- MongoDB v4.4.6

## 基本的な開発方法

- MongoDB サーバーを用意する
  - ローカルで MongoDB を動かしても良いですが、MongoDB Atlas の無料枠でも問題ありません
- リポジトリを Fork する
- `.env.example` を元に `.env` ファイルを設置する
- `npm ci` で依存関係をインストールする
  - `npm install` はなるべく使わないでください
- `npm run dev` で開発サーバーを起動する
  - http://localhost:3000/ で表示できます
- `npm run lint` で ESLint による lint を実行する
- `npm test` で jest によるテストを実行する

## バッチジョブの実行

以下のバッチジョブが存在します

- `npm run job:river`
  - 河川の氾濫情報を収集します
- `npm run job:dispatch`
  - 消防緊急出動の情報を収集します
- `npm run job:massmedia`
  - マスメディアのニュース記事を収集します
- `npm run job:hatebu`
  - はてなブックマークからニュース記事を収集します
