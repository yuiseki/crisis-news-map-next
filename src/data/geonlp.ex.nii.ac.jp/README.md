# GeoNLPについて
GeoNLP - 文章を自動的に地図化する地名情報処理システム｜GeoNLP

https://geonlp.ex.nii.ac.jp

## データのダウンロードについて
ここから有用そうなcsvデータをダウンロードした

https://geonlp.ex.nii.ac.jp/user/geonlp

## データの構造
`geonlp_japan.json` に

  - 場所のカテゴリ名
  - そのカテゴリのファイル名
  - 場所の名前
  - 経度
  - 緯度

のcsvの列番号がまとめてあるので、
各ファイルをcsvとしてパースして各行の該当する列の値を取得すればいい。

市区町村データだけは、上位の県の列番号も含めている。