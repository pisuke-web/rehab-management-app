<?php
session_start();

if (!isset($_SESSION["login"]) || $_SESSION["login"] !== true) {
header("Location: login.php");
exit;
}
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
        <link rel="stylesheet" href="index.css">
</head>
<body>
    <h1>リハビリテーション部門診療管理システム</h1>
    <nav>
        <ul>
            <li><a href="patients.php">患者登録／患者一覧（React版）</a></li>
            <li><a href="patients.php?view=search">患者検索（React版）</a></li>
            <li><a href="bbs1/bbs.php">申し送り入力／申し送り閲覧</a></li>
        </ul>
    </nav>


<button onclick="location.href='logout.php'">
退出
</button>
</body>
</html>
