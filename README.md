# 數位前導指南診斷

依《混成學習與跨校遠距教學實施指南 2.0》（α-1，1018 版）與《α-2 跨校遠距共授實施指南 2.0》（1028 版）製作的互動式自我診斷網頁，協助學校團隊：

1. 選擇實施部分（α-1 混成學習／α-2 跨校遠距共授）與學校基本資料
2. 逐階段導讀指標，標記「已落實／部分落實／尚未實施／待確認／不適用」
3. 查看各階段 × 構面（KR、EC、SL、TT、AS）的落實比例與建議聚焦階段
4. 挑選 3 至 5 項年度優先改善工作，填入負責單位、期程與佐證，並複製成文字

網址：https://dfleoyang-hlhs.github.io/SAP2026/

## 資料存在哪裡

| 情況 | 資料位置 |
|---|---|
| `config.js` 的 `firebase.apiKey` 留空 | 單機模式：只存在各人的瀏覽器 |
| 填入 Firebase 設定 | Firebase Firestore 雲端資料庫：成員用學校 Google 帳號登入，全校即時共用 |

只有 `@hlhs.hlc.edu.tw` 的帳號能讀寫，由 [`firestore.rules`](firestore.rules) 在伺服器端把關；網頁上的網域檢查只是提示。

## 接上 Firebase（管理者做一次）

> 若學校帳號無法使用 Firebase 主控台，可以用個人 Gmail 帳號建立專案；成員仍然是用學校帳號登入，規則一樣只放行學校網域。

### 1. 建立專案
1. 開啟 https://console.firebase.google.com/ →「建立專案」，名稱例如 `sap2026-diag`。Google Analytics 可以關閉。
2. 進入專案後，點首頁的 **`</>`（網頁）** 圖示新增網頁應用程式，暱稱例如 `diag-web`，**不用**勾選 Firebase Hosting。
3. 畫面會顯示一段 `const firebaseConfig = { apiKey: "...", authDomain: "...", ... }`，先把它複製起來。

### 2. 開啟 Google 登入
1. 左側「建構 → Authentication」→「開始使用」。
2. 「Sign-in method（登入方式）」→ 新增 **Google** → 啟用 → 選擇專案支援電子郵件 → 儲存。
3. 「Settings（設定）」→「授權網域」→「新增網域」，加入 **`dfleoyang-hlhs.github.io`**。

### 3. 建立資料庫並設定規則
1. 左側「建構 → Firestore Database」→「建立資料庫」，位置建議選 `asia-east1（台灣）`，模式選「正式版（production）」。
2. 進入「規則」分頁，把內容全部換成本 repo 的 [`firestore.rules`](firestore.rules)，按「發布」。

### 4. 填入設定
在 GitHub 編輯 [`config.js`](config.js)，把第 1 步複製的 `firebaseConfig` 各欄位填進 `firebase: { ... }`，commit 後一兩分鐘網站就會出現「用學校 Google 帳號登入」。

`firebaseConfig` 是公開的識別資訊（不是密碼），放在公開 repo 沒有問題；真正的保護是第 3 步的安全規則。

### 5. 通知成員
把網址告訴校內成員即可，不需要存取碼。第一次開啟時按「用學校 Google 帳號登入」，標記的項目會顯示登入者的名字。

## 疑難排解

| 狀況 | 原因與處理 |
|---|---|
| 登入時出現「這個網址還沒加入 Firebase 的授權網域」 | 第 2 步的「授權網域」沒有加入 `dfleoyang-hlhs.github.io` |
| 登入後出現「你的帳號沒有讀取權限」 | 第 3 步的規則還沒發布，或登入的不是學校帳號 |
| 學校帳號登入時被 Google 擋下（應用程式遭封鎖） | 學校 Workspace 限制第三方應用程式，請資訊組在管理控制台允許此 Firebase 專案 |
| 顯示「單機模式」 | `config.js` 的 `apiKey` 還是空的，或瀏覽器擋住了 gstatic.com 的程式庫 |

## 換學校使用

同時修改兩個地方的網域：`config.js` 的 `allowedDomain`，以及 `firestore.rules` 裡 `schoolMember()` 的網域（點號寫成 `[.]`），再重新發布規則。

## 安全性與資料說明

- 學校網域內的任何人都能讀寫所有學校工作區的紀錄，不能刪除工作區本身。
- 標記紀錄會存登入者的顯示名稱與時間，不存 email。
- 免費方案（Spark）每天可讀取 5 萬次、寫入 2 萬次，一所學校使用綽綽有餘。
- 資料可以在 Firebase 主控台的 Firestore 頁面查看與匯出。

## 注意

- 兩份指南均為「整合討論版，尚未核定」；標示「新增・暫編」的指標尚待權責單位確認。
- 「已穩定」的判讀門檻（整體 70% 且 KR 80%）為本工具自訂的參考值，非指南規定。
- 診斷僅供校內盤點討論，不作學校排名或等第；正式回報依核定表單辦理。
