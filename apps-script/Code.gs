/**
 * Secret Santa: Google Sheet backend.
 *
 * Paste this file into your Sheet (Extensions → Apps Script) and deploy it as
 * a web app. Setup steps are in README.md, under "Google Sheet backend".
 *
 * The "Draw" tab gets one row per person:
 *   Name | Language | Link | Times opened | First opened | Last opened | id | encrypted draw
 *
 * The draw is encrypted in the browser before it reaches this script. Each
 * row's key exists only in that person's link (the "Link" column), never in
 * a column of its own. Anyone who sees the id or encrypted-draw columns
 * learns nothing. Whoever can open the "Link" column can see the draw by
 * opening a link, and each opening is counted and shown to that person.
 */

const TAB = 'Draw';
const HEADERS = [
  'Name',
  'Language',
  'Link (re-send this if someone loses theirs; opening it counts as a view)',
  'Times opened',
  'First opened',
  'Last opened',
  'id',
  'encrypted draw',
];
const COL = { name: 1, lang: 2, link: 3, opens: 4, first: 5, last: 6, id: 7, data: 8 };

/* ------------------------------------------------------------------ *
 * Sheet menu
 * ------------------------------------------------------------------ */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🎅 Secret Santa')
    .addItem('Show admin key', 'showAdminKey')
    .addItem('Make a new admin key', 'resetAdminKey')
    .addToUi();
}

// Works from the Sheet's menu (shows a dialog) and from the Apps Script
// editor's ▶ Run button (the key is printed in the Execution log). Use the
// Run button on a phone, where the Sheet's custom menu isn't available.
function showAdminKey() {
  const key = adminKey_();
  console.log('Secret Santa admin key: ' + key);
  try {
    const ui = SpreadsheetApp.getUi();
    ui.alert(
      'Secret Santa admin key',
      'Paste this into the Secret Santa website, on your own device only:\n\n' + key,
      ui.ButtonSet.OK
    );
  } catch (err) {
    // Run from the editor: no dialog available, see the Execution log.
  }
}

function resetAdminKey() {
  PropertiesService.getScriptProperties().deleteProperty('ADMIN_KEY');
  showAdminKey();
}

function adminKey_() {
  const props = PropertiesService.getScriptProperties();
  let key = props.getProperty('ADMIN_KEY');
  if (!key) {
    key = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '');
    props.setProperty('ADMIN_KEY', key);
  }
  return key;
}

/* ------------------------------------------------------------------ *
 * Web app API
 *   GET  ?action=open&id=…                  → { ok, data, opens, first }
 *   POST {action:"ping", key}               → { ok }
 *   POST {action:"saveDraw", key, rows:[…]} → { ok, count }
 * ------------------------------------------------------------------ */
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'open') return json_(openLink_(String(p.id || '')));
  return json_({ ok: true, app: 'secret-santa' });
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'bad_request' });
  }
  if (!body || !safeEqual_(String(body.key || ''), adminKey_())) {
    return json_({ ok: false, error: 'bad_key' });
  }
  if (body.action === 'ping') return json_({ ok: true });
  if (body.action === 'saveDraw') return json_(saveDraw_(body.rows));
  return json_({ ok: false, error: 'bad_request' });
}

/* ------------------------------------------------------------------ *
 * Actions
 * ------------------------------------------------------------------ */
function saveDraw_(rows) {
  if (!Array.isArray(rows) || rows.length < 3 || rows.length > 200) {
    return { ok: false, error: 'bad_request' };
  }
  const values = rows.map((r) => [
    text_(r.name, 100),
    text_(r.lang, 5).toUpperCase(),
    text_(r.link, 2000),
    0,
    '',
    '',
    text_(r.id, 64),
    text_(r.data, 5000),
  ]);
  const valid = values.every(
    (v) => v[0] && /^https?:\/\//.test(v[2]) && /^s[0-9a-f]{32}$/.test(v[6]) && /^x[A-Za-z0-9_-]+$/.test(v[7])
  );
  if (!valid) return { ok: false, error: 'bad_request' };

  return withLock_(() => {
    const sh = tab_();
    sh.clear();
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    const body = sh.getRange(2, 1, values.length, HEADERS.length);
    body.setNumberFormat('@'); // keep everything as plain text…
    sh.getRange(2, COL.opens, values.length, 1).setNumberFormat('0'); // …except the counter
    sh.getRange(2, COL.first, values.length, 2).setNumberFormat('yyyy-mm-dd hh:mm'); // …and dates
    body.setValues(values);
    sh.setFrozenRows(1);
    return { ok: true, count: values.length };
  });
}

function openLink_(id) {
  if (!/^s[0-9a-f]{32}$/.test(id)) return { ok: false, error: 'not_found' };
  return withLock_(() => {
    const sh = tab_();
    const last = sh.getLastRow();
    if (last < 2) return { ok: false, error: 'not_found' };
    const ids = sh.getRange(2, COL.id, last - 1, 1).getValues();
    for (let i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) !== id) continue;
      const row = i + 2;
      const counters = sh.getRange(row, COL.opens, 1, 3);
      const [opens, first] = counters.getValues()[0];
      const before = Number(opens) || 0;
      const now = new Date();
      counters.setValues([[before + 1, first instanceof Date ? first : now, now]]);
      return {
        ok: true,
        data: String(sh.getRange(row, COL.data).getValue()),
        opens: before,
        first: first instanceof Date ? first.toISOString() : null,
      };
    }
    return { ok: false, error: 'not_found' };
  });
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */
function tab_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(TAB) || ss.insertSheet(TAB);
}

function withLock_(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    return fn();
  } finally {
    lock.releaseLock();
  }
}

// Plain text, length-limited, never interpreted as a formula.
function text_(v, max) {
  const s = String(v == null ? '' : v).slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function safeEqual_(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
