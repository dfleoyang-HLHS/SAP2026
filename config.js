// 在 Firebase 主控台建立網頁應用程式後，把「firebaseConfig」的內容貼到 firebase 欄位。
// 這些值是公開的設定（不是密碼），可以放在公開的 repo；資料由 firestore.rules 保護。
// firebase 留空（apiKey 為空字串）時，網頁會以單機模式運作。
window.SAP_CONFIG = {
  // 只接受網域以此結尾的學校 Google 帳號（需與 firestore.rules 一致）。
  // 同一個網域的成員會自動進入同一個學校工作區。
  allowedSuffix: "edu.tw",
  // 管理者彙整頁（admin.html）可讀取所有學校資料的帳號；需與 firestore.rules 的 isAdmin() 一致。
  admins: ["dfleoyang@hlhs.hlc.edu.tw", "ponponmai@hlhs.hlc.edu.tw"],
  firebase: {
  apiKey: "AIzaSyCKAJnUSfVMFy5r_iKXUUx-jqFZrGG68RI",
  authDomain: "sap2026-diag.firebaseapp.com",
  projectId: "sap2026-diag",
  storageBucket: "sap2026-diag.firebasestorage.app",
  messagingSenderId: "722665502583",
  appId: "1:722665502583:web:f6f2fb2ae96b91f94a9372"
  }
};
