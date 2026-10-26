<?php

session_start();

if (isset($_SESSION["login"]) && $_SESSION["login"] === true) {
header("Location: index.php");
exit;
}

$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

$password = $_POST["password"] ?? "";

if ($password === "1234") {

$_SESSION["login"] = true;

header("Location: index.php");
exit;

} else {

$error = "暗証番号が違います";
}
}

?>

<!DOCTYPE html>
<html lang="ja">

<head>
<meta charset="UTF-8">

<title>ログイン画面</title>

<style>

h1 {
background-color: purple;
color: white;
}

h2 {
background-color: gray;
color: white;
}

.error {
color: red;
}

</style>
</head>

<body>

<h1>リハビリテーション部門診療管理システム ログイン画面</h1>

<p>これから先のページは許可された職員のみ入ることができます</p>

<h2>暗証番号入力フォーム</h2>

<form method="post">

<input
type="password"
name="password"
placeholder="暗証番号"
autocomplete="off"
>

<br><br>

<button type="submit">
入力完了
</button>

</form>

<?php if ($error): ?>

<p class="error">
<?= htmlspecialchars($error, ENT_QUOTES, "UTF-8") ?>
</p>

<?php endif; ?>

</body>
</html>