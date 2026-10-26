<?php

#--------------------------------------------------
# 基本設定
#--------------------------------------------------

# 掲示板からの戻り先
$homepage = "bbs.php";

# テンプレートディレクトリ
$tmpl_dir = "./tmpl";

# 日本標準時(OS)に設定
date_default_timezone_set('Asia/Tokyo');

# DB接続
require_once "./db.php";


#--------------------------------------------------
# メインの処理
#--------------------------------------------------

parse_form();

if (isset($in["mode"]) && $in["mode"] === "post") {
    post_data();
}

bbs_data();


#--------------------------------------------------
# フォーム受け取り
#--------------------------------------------------

function parse_form(){
    global $in;

    $param = array();

    if (isset($_GET) && is_array($_GET)) {
        $param += $_GET;
    }

    if (isset($_POST) && is_array($_POST)) {
        $param += $_POST;
    }

    foreach ($param as $key => $val) {

        # 配列は受け付けない
        if (is_array($val)) {
            continue;
        }

        # 文字コードの処理
        $enc = mb_detect_encoding($val, "UTF-8, SJIS-win, EUC-JP, ISO-2022-JP", true);

        if ($enc !== false && $enc !== "UTF-8") {
            $val = mb_convert_encoding($val, "UTF-8", $enc);
        }

        # 特殊文字の処理
        $val = htmlentities($val, ENT_QUOTES, "UTF-8");

        # 改行コードの変換
        $val = str_replace("\r\n", "_kaigyou_", $val);
        $val = str_replace("\r", "_kaigyou_", $val);
        $val = str_replace("\n", "_kaigyou_", $val);

        $in[$key] = $val;
    }

    return $in;
}


#--------------------------------------------------
# 記事書き込み
#--------------------------------------------------

function post_data(){

    global $in, $pdo;

    # 時間取得
    $mytime = time();

    # IPアドレス取得
    $my_ip = isset($_SERVER["REMOTE_ADDR"])
        ? $_SERVER["REMOTE_ADDR"]
        : "";

    # エラーチェック
    $error_notes = "";

    if (!isset($in["name"]) || $in["name"] === "") {
        $error_notes .= "・名前が未入力です。<br>";
    }

    if (!isset($in["comment"]) || $in["comment"] === "") {
        $error_notes .= "・コメントが未入力です。<br>";
    }

    # エラーが存在する場合
    if ($error_notes !== "") {
        error($error_notes);
    }

    # DBへ記事を登録
    try {

        $stmt = $pdo->prepare(
            "INSERT INTO posts
                (posted_at, name, comment, ip_address)
             VALUES
                (:posted_at, :name, :comment, :ip_address)"
        );

        $stmt->execute([
            ":posted_at"  => date("Y-m-d H:i:s", $mytime),
            ":name"      => $in["name"],
            ":comment"   => $in["comment"],
            ":ip_address" => $my_ip
        ]);

    } catch (PDOException $e) {
        error("記事の登録に失敗しました。");
    }
}


#--------------------------------------------------
# 掲示板トップの表示
#--------------------------------------------------

function bbs_data(){

    global $homepage, $tmpl_dir, $pdo;

    # 記事テンプレート読み込み
    $tmpl_file = $tmpl_dir . "/data.tmpl";

    if (!file_exists($tmpl_file)) {
        error("記事テンプレートが見つかりません。");
    }

    $tmpl = file_get_contents($tmpl_file);

    if ($tmpl === false) {
        error("記事テンプレートの読み込みに失敗しました。");
    }

    # DBからデータ読み込み
    try {

        $stmt = $pdo->query(
            "SELECT id, posted_at, name, comment
             FROM posts
             ORDER BY id DESC"
        );

        $posts = $stmt->fetchAll();

    } catch (PDOException $e) {
        error("記事データの読み込みに失敗しました。");
    }

    # 記事データをテンプレートへ入れる
    $data_newpost = "";

    foreach ($posts as $post) {

        $num = $post["id"];
        $time = strtotime($post["posted_at"]);

        $name = $post["name"];
        $comment = $post["comment"];

        # 日付表示
        $date = date("Y/m/d H:i:s", $time);

        # 改行コードをHTMLの改行へ
        $comment = str_replace("_kaigyou_", "<br>", $comment);

        # 記事テンプレートより変換
        $tmpl_replaced = $tmpl;

        $tmpl_replaced = str_replace("!date!", $date, $tmpl_replaced);
        $tmpl_replaced = str_replace("!inum!", $num, $tmpl_replaced);
        $tmpl_replaced = str_replace("!name!", $name, $tmpl_replaced);
        $tmpl_replaced = str_replace("!comment!", $comment, $tmpl_replaced);

        # 1件ずつ追加
        $data_newpost .= $tmpl_replaced;
    }

    # 掲示板テンプレート読み込み
    $bbs_tmpl_file = $tmpl_dir . "/bbs.tmpl";

    if (!file_exists($bbs_tmpl_file)) {
        error("掲示板テンプレートが見つかりません。");
    }

    $tmpl_bbs = file_get_contents($bbs_tmpl_file);

    if ($tmpl_bbs === false) {
        error("掲示板テンプレートの読み込みに失敗しました。");
    }

    # 文字置換
    $tmpl_bbs = str_replace("!homepage!", $homepage, $tmpl_bbs);
    $tmpl_bbs = str_replace("!bbs_data!", $data_newpost, $tmpl_bbs);

    # 掲示板表示
    echo $tmpl_bbs;
    exit;
}


#--------------------------------------------------
# エラー画面
#--------------------------------------------------

function error($err){

    global $tmpl_dir;

    # テンプレート読み込み
    $tmpl_file = $tmpl_dir . "/error.tmpl";

    if (!file_exists($tmpl_file)) {
        die($err);
    }

    $tmpl = file_get_contents($tmpl_file);

    if ($tmpl === false) {
        die($err);
    }

    # 文字置き換え
    $tmpl = str_replace("!message!", $err, $tmpl);

    # 表示
    echo $tmpl;
    exit;
}
?>
