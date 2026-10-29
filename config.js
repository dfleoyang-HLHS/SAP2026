// 在 Firebase 主控台建立網頁應用程式後，把「firebaseConfig」的內容貼到 firebase 欄位。
// 這些值是公開的設定（不是密碼），可以放在公開的 repo；資料由 firestore.rules 保護。
// firebase 留空（apiKey 為空字串）時，網頁會以單機模式運作。
window.SAP_CONFIG = {
  // 只允許這個網域的 Google 帳號登入（需與 firestore.rules 的網域一致）
  allowedDomain: "hlhs.hlc.edu.tw",
  firebase: {
  apiKey: "AIzaSyCKAJnUSfVMFy5r_iKXUUx-jqFZrGG68RI",
  authDomain: "sap2026-diag.firebaseapp.com",
  projectId: "sap2026-diag",
  storageBucket: "sap2026-diag.firebasestorage.app",
  messagingSenderId: "722665502583",
  appId: "1:722665502583:web:f6f2fb2ae96b91f94a9372"
  }
};
