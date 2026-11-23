# ✅ Setup checklist

About 20 minutes in total. The parts must be done in this order.

## 1. Host the website (about 5 min)

The repo is **private**, and GitHub Pages is free only for **public** repos. Pick one option:

**Option A (recommended): make the repo public and use GitHub Pages**

It's safe: the repo holds only the app's code. No names and no draws ever go into it, and the commits carry no
personal details.

- [ ] github.com/filip-domanski/santa → **Settings → General** → scroll to *Danger Zone* → **Change visibility → Public**
- [ ] **Settings → Pages** → *Source:* **Deploy from a branch** → Branch: **`main`**, folder **`/ (root)`** → **Save**
- [ ] Wait 1–2 minutes, then open **https://filip-domanski.github.io/santa/**. You should see *"Losowanie dla całej rodziny"*.

**Option B: keep the repo private and use Cloudflare Pages (free)**

- [ ] dash.cloudflare.com → create a free account → **Workers & Pages → Create → Pages → Connect to Git**
- [ ] Authorize GitHub, then choose **santa**. Production branch: **`main`**. Framework: *None*. Build command: *(empty)*. Output directory: **`/`**
- [ ] **Deploy**, then open the `https://santa-….pages.dev` address it gives you.

## 2. Create the Google Sheet backend (about 10 min)

- [ ] Go to **sheets.new**. Name the Sheet *Secret Santa (private)*. **Don't share it.**
- [ ] In the Sheet: **Extensions → Apps Script**
- [ ] Delete the sample code. Paste the whole of
      [`apps-script/Code.gs`](https://github.com/filip-domanski/santa/blob/main/apps-script/Code.gs)
      (use the "Copy raw file" button), then click 💾 **Save**.
- [ ] **Deploy → New deployment** → ⚙️ next to *Select type* → **Web app**
  - *Execute as:* **Me**
  - *Who has access:* **Anyone**
  - **Deploy → Authorize access** → choose your account → *"Google hasn't verified this app"* → **Advanced → Go to … (unsafe) → Allow**
    (it's your own script, which is why Google shows this warning)
- [ ] Copy the **Web app URL**, which ends in `/exec`
- [ ] Put the URL into the website, either way:
  - send it to Claude, who will update `config.js`, **or**
  - on GitHub open `config.js` on branch `main` → ✏️ → paste it between the quotes of `sheetApiUrl: ""` → **Commit changes**
- [ ] Go back to the Sheet and **reload** the page. Open **🎅 Secret Santa → Show admin key**; the first time it asks for permission
      again. Copy the key. Alternatively, in the Apps Script editor choose `showAdminKey` → **▶ Run**, and the key appears in the Execution log.

### 📱 Doing part 2 on a phone

The **Google Sheets app can't do this**: it has no Apps Script editor, and custom menus don't appear in it.
Use your phone's **browser in desktop mode** instead. A computer is easier if one is handy, and you only need it once.
After setup, everything else works fine on the phone.

- [ ] In Chrome (Android): **⋮ → ☑ Desktop site**. In Safari (iPhone): **aA → Request Desktop Website**.
      Do this on each new page if it switches back to the mobile version.
- [ ] Go to **sheets.new** in that browser, which creates the Sheet, and rename it *Secret Santa (private)*.
      If it opens the Sheets app instead, go to **docs.google.com/spreadsheets** in the browser and tap **+**.
- [ ] Turn your phone sideways (landscape) and zoom out. Then **Extensions → Apps Script**, which opens a new tab.
- [ ] Select all the sample code, delete it, paste `Code.gs`, and tap 💾 **Save**.
      To copy `Code.gs` on the phone: open it on GitHub, tap **Raw**, then *Select all → Copy*.
- [ ] Choose **`showAdminKey`** in the function dropdown at the top and tap **▶ Run**. The first time, it asks for permission:
      **Review permissions → your account → Advanced → Go to … (unsafe) → Allow**.
      The **Execution log** at the bottom then shows `Secret Santa admin key: …`. Copy it and keep it for part 3.
- [ ] **Deploy → New deployment → ⚙️ → Web app**, then *Execute as:* **Me**, *Who has access:* **Anyone** → **Deploy** → copy the
      **Web app URL** (`…/exec`) and send it to Claude.

Later, to re-send a lost link from the **Sheets app**: in the **Draw** tab, tap the person's *Link* cell **once** to select it,
then tap it again for the menu and choose **Copy**. Don't tap the link preview that pops up, because that opens the link,
which shows you their draw and counts as an opening.

## 3. Connect and test (about 5 min)

- [ ] About 1 minute after `config.js` is updated, open the website. A **"Twój Arkusz Google"** box appears.
      Paste the admin key and click **Połącz**.
      Do this only on your own phone or computer: that browser remembers the key.
- [ ] Do a **test draw** with made-up names, for example `Test A & Test B`, `Test C`, `Test D (EN)`, and click **Losuj**.
      A **Draw** tab should appear in the Sheet.
- [ ] Open one test link in a private or incognito window and reveal it. Open it again: it should say *"Ten link był już otwierany: 1×…"*,
      and the Sheet's *Times opened* column should go up.

## 4. The real draw

- [ ] Type the family in, one line per couple. Add `(EN)` or `(FR)` after anyone who should get English or French.
      Optionally add a budget, date and note, then click **Losuj**. This replaces the test draw, and the test links stop working.
- [ ] Send each person **their own** link privately: **Udostępnij…** on a phone, or **Kopiuj link**.
      Don't open the links yourself.
- [ ] Someone lost their link? In the Sheet's **Draw** tab, copy their **Link** cell, without clicking it, and send it again.
