# 🎁 Family Secret Santa

A single-page Secret Santa draw where **nobody ever sees the pairings**, not even the person running it.

- Couples (or whole households) go on one line and never draw each other.
- Nobody draws themselves.
- Each person gets a private link that shows only *their* draw.
- No server, no accounts, no database. The whole app is one `index.html`.
- 🇵🇱 Polish by default, plus English and French: per person and for the organizer screen.
- Optional **Google Sheet backend**: re-send lost links, see how many times each link was opened, and make old links stop working after a redraw.

> **Setting it up?** Follow the step-by-step checklist in [SETUP.md](SETUP.md).

## How it works

1. The organizer opens the site and types in the family, **one line per couple/household**:

   ```
   Anna (EN) & Tom
   Kasia, Piotr
   Babcia Ela
   Marek (FR) & Basia
   Ola
   ```

   Optionally they add a budget, date/place and a note.

2. They click **Draw names**. The draw runs in the browser, using cryptographic randomness, and is never shown on screen.
   The page then lists each name next to a **Copy link** button (and **Share…** on phones).

3. The organizer sends each person their own link, by WhatsApp, SMS, email or whatever the family uses.

4. A person opens their link, sees "Hi Anna! 🎅", taps **Reveal**, and sees who they're buying for.

### Languages

- Everyone gets their page in **Polish** unless you add a tag after their name: `(EN)` or `(FR)`.
  `[EN]` and lowercase also work, and `(PL)` is allowed but not needed. In the example above, Anna gets English, Marek
  gets French, and everyone else gets Polish.
- The person's language is saved inside their link. Their page, the default title and the
  **Share…** message are all in that language. A **PL / EN / FR** switch at the top still lets them change it.
- The organizer screen also has the switch. It starts in Polish and remembers the choice in that browser.
- Budget, date and note are shown exactly as typed, untranslated. If you leave the title empty, everyone sees a
  default title in their own language.

### What's inside a link

Everything that person's page shows is in their link, and nothing is stored anywhere else:
their name, their recipient's name, their language, and the title, budget, date and note.

It is **encrypted** (AES-GCM) with a random key that is unique to that link. **The key is part of the same link**, so the
encryption hides the content from a glance at the URL and makes a damaged or edited link fail instead of showing a wrong
name. It does **not** stop someone who has the full link and opens it, or who decodes it on purpose.
In other words, a link is exactly as private as the chat you send it through.

### Why nobody can see the pairings

- The draw only ever exists in memory for a moment. What's left are the links, and each one holds a single
  encrypted `{giver, recipient}` record.
- That record sits in the URL **fragment** (the part after `#`). Browsers never send the fragment to the web server,
  so the host never sees anything either.
- Without the Google Sheet backend, the draw is never saved to disk, cookies or browser storage (only the organizer's
  language choice is). When the organizer closes the page, the only copies of the draw are the links in each person's
  messages. With the backend, see "Google Sheet backend" below.

**One honest caveat:** whoever sends the links *could* open one and see that person's draw. Nothing stops this without
a server and accounts. The page warns the organizer not to, and the organizer is in exactly the same position as
everyone else, so they can take part in the draw too.

## Google Sheet backend (optional)

Without it, everything above still works. With it:

- The draw is saved **encrypted** in a private Google Sheet that only you can see.
- **Lost link?** Copy it again from the Sheet's *Link* column and re-send it.
- **Times opened / First opened / Last opened** are recorded for each link. The person also sees it on their page:
  "This link has already been opened 2 times, first on 3 Dec, 18:02". If anyone peeks, the owner finds out.
- **Drawing again** replaces the old rows, so old links show "this link is no longer valid" instead of an outdated draw.
- Links are shorter: they hold only a row ID and that row's key.

### What the Sheet contains, and who can read what

| Column | Contains | Readable? |
|---|---|---|
| Name, Language | The giver's name and language | Yes |
| **Link** | The full link, including the key for that row | **Opening it reveals that person's draw**, and that opening is counted |
| Times opened, First/Last opened | The open counter | Yes |
| id, encrypted draw | The AES-GCM-encrypted draw | No. The key isn't stored in any column, only inside the link. |

So anyone looking at the Sheet sees who takes part, but not who drew whom. The only way to see a draw is to open
that person's link, and the person will see that it happened. Keep the Sheet private (don't share it), since the
*Link* column is what makes re-sending possible. Note that whoever owns the Sheet could also edit the counter columns,
so the counter discourages peeking and catches accidental opens, but it isn't proof.

### Setup (about 10 minutes, once)

1. **Create a Google Sheet** in your own Google account, for example "Secret Santa". Don't share it.
2. In the Sheet: **Extensions → Apps Script**. Delete what's there, paste the contents of
   [`apps-script/Code.gs`](apps-script/Code.gs), and click 💾 **Save**.
3. **Deploy → New deployment →** ⚙️ **Web app**:
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**. This is required so family members can open their links without signing in.
     It's safe: rows can only be fetched by their random ID, and saving a draw needs your admin key.
   - Click **Deploy**, then allow the permissions. Google warns "Google hasn't verified this app" because it's your
     own script: click **Advanced → Go to … (unsafe)**.
   - Copy the **Web app URL** (`https://script.google.com/macros/s/…/exec`).
4. Paste that URL into [`config.js`](config.js) as `sheetApiUrl`, and commit. On GitHub you can do this with the ✏️
   button on the file.
5. Reload the Sheet. A **🎅 Secret Santa** menu appears. Click **Show admin key** and copy the key.
6. Open the website. It now shows **Your Google Sheet**: paste the admin key and click **Connect**. The key is
   remembered in that browser only.
7. Draw as usual. A **Draw** tab appears in your Sheet.

If you later change `Code.gs`, use **Deploy → Manage deployments → ✏️ → Version: New version** so the URL stays the
same. If you think your admin key has leaked, use **🎅 Secret Santa → Make a new admin key**.

## Hosting it (GitHub Pages, free, about 2 minutes)

1. Put `index.html` on the repository's default branch (for example `main`).
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, then pick `main` and `/ (root)` → **Save**.
3. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

> GitHub Pages is free for **public** repositories. A private repo needs a paid plan. Being public is fine:
> the repo only holds the empty app, never anyone's names or draws.

Netlify Drop, Cloudflare Pages or any static host works the same way: just upload `index.html`.

Don't send links from a page opened as a local file (`file://…`). Those links only work on your own computer.
The page warns you if you try.

## Notes

- If you click **Start over** after sending some links, tell everyone to ignore the old ones. Old links keep showing
  the old draw.
- If someone loses their link, they can scroll back in the chat where you sent it. Otherwise you'll have to redraw for
  everyone, because nobody (by design) can look it up.
- A valid draw exists as long as no single line holds more than half of everyone.
