# 🎁 Family Secret Santa

A single-page Secret Santa draw where **nobody ever sees the pairings**, not even the person running it.

- Couples (or whole households) go on one line and never draw each other.
- Nobody draws themselves.
- Each person gets a private link that shows only *their* draw.
- No server, no accounts, no database. The whole app is one `index.html`.

## How it works

1. The organizer opens the site and types in the family, **one line per couple/household**:

   ```
   Anna & Tom
   Kasia, Piotr
   Grandma Ela
   Ola
   ```

   Optionally they add a budget, date/place and a note.

2. They click **Draw names**. The draw runs in the browser, using cryptographic randomness, and is never shown on screen.
   The page then lists each name next to a **Copy link** button (and **Share…** on phones).

3. The organizer sends each person their own link, by WhatsApp, SMS, email or whatever the family uses.

4. A person opens their link, sees "Hi Anna! 🎅", taps **Reveal**, and sees who they're buying for.

### Why nobody can see the pairings

- The draw only ever exists in memory for a moment. What's left are the links, and each one holds a single
  encrypted `{giver, recipient}` record.
- That record sits in the URL **fragment** (the part after `#`). Browsers never send the fragment to the web server,
  so the host never sees anything either.
- Nothing is saved to disk, cookies or local storage. When the organizer closes the page, the only copies of the draw
  are the links in each person's messages.

**One honest caveat:** whoever sends the links *could* open one and see that person's draw. Nothing stops this without
a server and accounts. The page warns the organizer not to, and the organizer is in exactly the same position as
everyone else, so they can take part in the draw too.

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
