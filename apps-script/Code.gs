/**
 * 數位前導指南診斷：Google 試算表後端
 *
 * 部署方式見 README.md「接上 Google 試算表」。
 * 所有紀錄存在本試算表的「docs」工作表，一列一筆：
 *   path        紀錄位置，例如 schools/abc123 或 schools/abc123/status/a1~KR-1-1
 *   collection  所屬集合（path 去掉最後一段）
 *   data        紀錄內容（JSON）
 *   by          最後修改者在網頁上填的名字
 *   updatedAt   最後修改時間（毫秒）
 *   deleted     TRUE 表示已刪除（保留這列讓其他人的網頁同步刪除）
 * 存取碼放在「專案設定 → 指令碼屬性」的 ACCESS_CODE。
 */
const SHEET_NAME = 'docs';
const HEADER = ['path', 'collection', 'data', 'by', 'updatedAt', 'deleted'];
const PATH_RE = /^schools\/[A-Za-z0-9_.~:@+-]{1,64}(\/(status|notes|picks)\/[A-Za-z0-9_.~:@+-]{1,80})?$/;
const MAX_OPS = 300;
const MAX_DATA = 20000;

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return out_({ ok: false, error: 'bad_request' }); }
  if (!checkCode_(body.code)) return out_({ ok: false, error: 'bad_code' });
  if (body.action === 'pull') return out_(pull_(Number(body.since) || 0));
  if (body.action === 'write') return out_(write_(body.ops));
  return out_({ ok: false, error: 'bad_request' });
}

function doGet() {
  return out_({ ok: true, service: '數位前導指南診斷' });
}

function pull_(since) {
  const now = Date.now();
  const rows = sheet_().getDataRange().getValues().slice(1);
  const docs = [];
  for (const r of rows) {
    const at = Number(r[4]);
    const deleted = r[5] === true || r[5] === 'TRUE';
    if (at <= since) continue;
    if (since === 0 && deleted) continue;
    let data = null;
    if (!deleted) { try { data = JSON.parse(r[2]); } catch (err) { continue; } }
    docs.push({ path: String(r[0]), data: data, by: String(r[3]), at: at });
  }
  return { ok: true, now: now, docs: docs };
}

function write_(ops) {
  if (!Array.isArray(ops) || !ops.length || ops.length > MAX_OPS) return { ok: false, error: 'bad_request' };
  for (const op of ops) {
    if (!op || !PATH_RE.test(op.path)) return { ok: false, error: 'bad_path' };
    if (op.data !== null && (typeof op.data !== 'object' || JSON.stringify(op.data).length > MAX_DATA)) return { ok: false, error: 'bad_data' };
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet_();
    const last = sh.getLastRow();
    const index = {};
    if (last > 1) sh.getRange(2, 1, last - 1, 1).getValues().forEach((v, i) => { index[v[0]] = i + 2; });
    const now = Date.now();
    const appends = [];
    for (const op of ops) {
      const row = [
        op.path,
        op.path.split('/').slice(0, -1).join('/'),
        op.data === null ? '' : JSON.stringify(op.data),
        String(op.by || '').slice(0, 40),
        now,
        op.data === null
      ];
      if (index[op.path]) sh.getRange(index[op.path], 1, 1, HEADER.length).setValues([row]);
      else appends.push(row);
    }
    if (appends.length) sh.getRange(sh.getLastRow() + 1, 1, appends.length, HEADER.length).setValues(appends);
    return { ok: true, now: now };
  } finally {
    lock.releaseLock();
  }
}

function checkCode_(code) {
  const want = PropertiesService.getScriptProperties().getProperty('ACCESS_CODE');
  return !!want && typeof code === 'string' && code === want;
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.getRange(1, 1, 1, HEADER.length).setValues([HEADER]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
