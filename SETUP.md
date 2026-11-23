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
      again. Copy the key.

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
