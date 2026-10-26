<?php
session_start();
if (!isset($_SESSION["login"]) || $_SESSION["login"] !== true) {
    header("Location: login.php"); exit;
}
$view = $_GET["view"] ?? "register";
if (!in_array($view, ["register", "search", "record"], true)) $view = "register";
$number = $_GET["number"] ?? "";
?>
<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>リハビリ介入記録</title></head>
<body>
<div id="root" data-view="<?= htmlspecialchars($view, ENT_QUOTES, "UTF-8") ?>" data-number="<?= htmlspecialchars($number, ENT_QUOTES, "UTF-8") ?>"></div>
<?php
$manifestPath = __DIR__ . "/react-build/.vite/manifest.json";
if (file_exists($manifestPath)) {
  $manifest = json_decode(file_get_contents($manifestPath), true);
  $entry = $manifest["react/index.html"] ?? null;
  if ($entry) {
    foreach (($entry["css"] ?? []) as $css) echo '<link rel="stylesheet" href="react-build/' . htmlspecialchars($css, ENT_QUOTES, "UTF-8") . '">' . "\n";
    echo '<script type="module" src="react-build/' . htmlspecialchars($entry["file"], ENT_QUOTES, "UTF-8") . '"></script>';
  } else echo '<p>Reactのビルドファイルが見つかりません。npm run build を実行してください。</p>';
} else echo '<p>Reactのビルドファイルがありません。npm run build を実行してください。</p>';
?>
</body></html>
