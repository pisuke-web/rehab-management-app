# shusei React統合版（学習用）

元の `shusei` を土台に、患者登録・患者一覧・患者検索・リハビリ介入記録をReactで作り直し、PHPのログイン・ログアウト・申し送り掲示板はそのまま残した統合版です。

## XAMPPで動かす
1. `shusei-react-full` フォルダを `C:\xampp\htdocs\` に置きます。
2. XAMPPでApacheを起動します。
3. VS Codeでこのフォルダを開き、ターミナルで1行ずつ実行します。

```bash
npm install
npm run build
```

4. `http://localhost/shusei-react-full/login.php` を開きます。
5. 元のPHPに設定されている学習用暗証番号 `1234` でログインします。
6. メニューからReact版の患者登録・検索を開きます。申し送りは元のPHP掲示板です。

## Reactを編集するとき
Reactのコードは `src/App.jsx` と `src/style.css` にあります。編集後、XAMPPで統合版を確認するには `npm run build` をもう一度実行します。`npm run dev` はViteの開発用サーバーで、PHPログインや掲示板を含む統合動作確認には上記のビルド手順を使ってください。

## 保存について
患者データと介入記録はブラウザの `localStorage` に保存します。PHP掲示板の保存先とは別です。学習用デモなので、実在する患者情報は入力しないでください。

## Reactで学べること
- `useState` で入力値、画面、患者データを管理
- `onChange` と `onSubmit` でフォームを処理
- `map()` で一覧を表示、`filter()` で検索
- `PatientTable` コンポーネントに患者一覧を分ける
