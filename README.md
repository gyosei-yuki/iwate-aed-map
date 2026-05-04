# 🚑 岩手県広域AEDマップ（最寄りナビ搭載版）

岩手県内各市町村が公開している「AED設置場所」のオープンデータを統合し、**現在地から一番近いAEDを即座に検索・ナビゲーション**する、実用性重視の非公式Webアプリケーションです。

> **🌍 ライブデモ（稼働中のアプリはこちら）：**
> [https://gyosei-yuki.github.io/iwate-aed-map/](https://gyosei-yuki.github.io/iwate-aed-map/)

---

## ✨ 主な機能

* **🗺️ 10市町村データの一括統合：** 盛岡市、宮古市、北上市、久慈市、二戸市、奥州市、葛巻町、平泉町、一戸町のデータをシームレスに表示。
* **📍 ワンタップ最寄りナビ：** `Geolocation API` と `Leaflet (distance)` を用いて、現在地から最も近いAEDを計算。現在地とターゲットを赤い点線で結び、自動でズームイン。
* **🚗 Google Maps 連携：** 選択したAEDまでのルート案内と、設置場所周辺のストリートビューを1タップで起動可能。
* **📱 SNS共有機能：** 自分の最寄りAEDをX（旧Twitter）やLINEで簡単にシェア可能。

---

## 💻 技術スタック

* **Frontend Framework:** Vue 3 (Composition API / CDN)
* **Map Library:** Leaflet (v1.9.4)
* **Map Tile:** OpenStreetMap (© OpenStreetMap contributors)
* **CSV Parser:** PapaParse (v5.4.1)
* **Architecture:** `index.html`, `style.css`, `app.js` の完全モジュール化（コンポーネント分離）

---

## 📜 ライセンス・クレジット

* **ソースコード:** [MIT License](LICENSE)（※本リポジトリのプログラム部分）
* **背景地図:** © OpenStreetMap contributors (CC BY-SA 2.0 / ODbL)
* **データ出典:** 岩手県内各市町村 オープンデータカタログサイト（クリエイティブ・コモンズ 表示 4.0 国際）
  * *※実用性確保のため、元データの明らかな座標エラー等については開発者（行政書士 渋谷佑生 事務所）にて独自に補正・クレンジングを行っております。*

## 🔗 データ出典元（オープンデータ）

本アプリは、以下の各自治体が公開しているオープンデータを利用・統合しています。（順不同）
データセットの詳細や元データ（CSV）については、各リンク先をご参照ください。

※ 特に、CSVファイルの最終更新日は各市区町村の情報をご確認ください。

* [盛岡市：AED設置施設一覧](https://www.city.morioka.iwate.jp/kurashi/anzen_anshin/kasai/1000947.html)
* [宮古市：AED設置施設一覧](https://iwate.dataeye.jp/resources/412)
* [北上市：AED設置施設一覧](https://www.city.kitakami.iwate.jp/life/soshikikarasagasu/toshipromotionka/jouhouseisakusuishinshitsu/1_1/opendata/18880.html)
* [久慈市：AED設置施設一覧](https://www.city.kuji.lg.jp/soshiki/johoshisutemu/1/3/1/1379.html)
* [二戸市：AED設置施設一覧](https://iwate.dataeye.jp/resources/432)
* [奥州市：AED設置施設一覧](https://iwate.dataeye.jp/resources/441)
* [葛巻町：AED設置施設一覧](https://www.town.kuzumaki.lg.jp/docs/2021030900014/)
* [平泉町：AED設置施設一覧](https://www.town.hiraizumi.iwate.jp/%e5%b9%b3%e6%b3%89%e7%94%ba%e3%82%aa%e3%83%bc%e3%83%97%e3%83%b3%e3%83%87%e3%83%bc%e3%82%bf-35378/)
* [一戸町：AED設置施設一覧](https://iwate.dataeye.jp/resources/114)

---

## 👤 開発者情報

**行政書士 渋谷佑生 事務所**
* デジタルアーカイブをきっかけに、岩手県のオープンデータの活用をはじめました。
