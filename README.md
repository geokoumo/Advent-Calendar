# 25 Days of Love

*A little piece of us, every day.*

A private, mobile-first Christmas advent calendar web app with 25 daily surprises, a scrapbook of memories, a "Whenever You Need Me" button that works all year, hidden secrets, and a Christmas Day finale. It has a login screen, plus an admin panel for previewing and editing every day. Built with React and Vite, styled in plain CSS, with no backend and no tracking. It installs as a PWA.

> ⚠️ **The login is front-end only.** It keeps a casual visitor out of a private gift, but it is **not secure** for a public deployment. The accounts ship inside the JavaScript bundle, so anyone technical can bypass them. See [Accounts & security](#accounts--security) for how to move to server-side authentication.

---

## 1. Architecture

```
src/
├── data/                  ← EVERYTHING YOU PERSONALISE LIVES HERE
│   ├── calendar.js        the 25 days (titles, letters, photos, songs, coupons…)
│   ├── messages.js        "Whenever You Need Me" library (33 messages, 8 categories)
│   ├── easterEggs.js      the 4 hidden surprises
│   └── config.js          year, greetings, phrases, friendly microcopy
│   └── contentStore.js    content layers (defaults → published → local admin edits) + storage adapter
├── auth/                  accounts, authService (swap for a backend), AuthContext, route guards
├── admin/                 admin dashboard, day editor (schema-driven), preview controls — a separate chunk
├── hooks/
│   ├── useAppState.jsx    clock, unlock rules, progress, toasts, secrets (one instance per mode)
│   └── useContent.jsx     the effective 25 days + save / revert / import / export
├── utils/
│   ├── date.js            local-timezone unlock logic (before / during / after)
│   ├── storage.js         versioned, corruption-safe LocalStorage
│   ├── devFlags.js        dev-preview switch (compiled out of production)
│   └── greeting.js
├── layout/
│   ├── ExperienceRoot.jsx picks whose progress the calendar uses (Gina / preview / View as Gina)
│   └── AppShell.jsx       snowfall, bottom nav, page transitions, toasts, offline notice
├── pages/                 LoginPage · Home · CalendarPage · GiftPage · Memories · ForYou · NotFound
├── components/
│   ├── gifts/             one renderer per content type + GiftRenderer (type → component)
│   ├── decor/Decor.jsx    hand-built SVG ornaments, pine, wax seal, gift box
│   ├── DayExtras.jsx      optional per-day add-ons: note, song, poem, reasons, memory, activity
│   └── …                  CalendarTile/Grid, DailyGiftCard, PhotoFrame, Modal, Toast…
├── dev/DevPanel.jsx       developer preview (dev builds only)
└── styles/                tokens.css (design system) · base · components · pages · gifts
public/
├── sw.js                  service worker (offline app shell)
├── manifest.webmanifest   PWA manifest
├── icons/                 app icons (generated from icon.svg)
├── photos/                ← put your photos here
└── videos/                ← put your videos here
```

**How it fits together.** Content is plain data, served through `useContent()`, which merges the defaults in `calendar.js` with any edits. `GiftPage` looks up a day and checks whether it is unlocked. If it is, the page marks the day opened, hands it to `GiftRenderer` (which picks a component based on `type`), and then renders any `extras`. All progress (opened days, coupons, favourites, secrets, preferences) goes through a single reducer in `useAppState`.

**Storage keys.** Each one is independent, so they can later move to a database separately:

| Key | What | Notes |
|---|---|---|
| `25dol:session` | who is signed in | role is always re-read from `accounts.js`, never trusted from storage |
| `25dol:state` | **Gina's real progress** | written only by Gina's own session |
| `25dol:preview-state` | admin preview sandbox | never touches Gina's progress |
| `25dol:gina-view-state` | "View as Gina" sandbox | seeded from this browser's progress, cleared on exit |
| `25dol:content` | admin content edits (this browser) | versioned; invalid days are ignored |
| `25dol:admin-mode` | preview / view-as-Gina mode | sessionStorage, per tab |

**Content types:** `letter` (variants: `letter`, `note`, `comfort`, `eve`), `photo`, `video`, `song` (one song or a playlist), `gift` (reveals: `unwrap`, `scratch`, `findHeart`), `coupon` (single, or `choose: true` to pick one), `date`, `game` (`quiz` or `challenge`), `secret`, `dream`, `reasons`, `finale`.

## 2. Run it locally

You need Node 18 or later.

```bash
npm install
```

```bash
npm run dev
```

Then open the printed URL. To try it on your phone, use the "Network" URL while the phone is on the same Wi-Fi. The service worker only runs in production builds. To test the PWA and offline mode locally:

```bash
npm run build && npm run preview
```

## 3. Accounts, admin panel & preview

### Accounts & security

There are two accounts, defined in `src/auth/accounts.js`:

| Username | Role | Sees |
|---|---|---|
| `Gina-Giorgos` | `user` | the Advent Calendar only |
| `admin` | `admin` | the admin dashboard, editor and preview tools |

Passwords are stored as SHA-256 hashes, never as plain text. Keep the passwords themselves out of the repository and share them privately. The header of `accounts.js` shows how to generate a new hash. The username isn't case-sensitive; the password is. A session lasts until **Sign out** (in Gina's ⚙︎ preferences sheet, or **Log out** at the top of the admin panel).

- `src/auth/authService.js` is the only code that checks credentials. Its interface (`verify`, `login`, `restore`, `logout`) is what a server implementation would provide.
- `src/auth/guards.jsx` keeps Gina out of `/admin`. The admin code is a separate chunk, so her phone never even downloads it.

**This is not real security.** All of this runs in the browser. Someone technical can read the bundle, brute-force a weak password, or edit LocalStorage to pose as the admin. Before any public deployment:
1. Replace `localAuthService` with calls to a backend that verifies passwords server-side and issues an HttpOnly session cookie.
2. Enforce the admin role on the server, and serve day content from an API that respects the unlock date.
3. Use a strong admin password. If the site stays a front-end-only prototype, also turn on Vercel Password Protection.

### Admin dashboard

Sign in as `admin` to reach `/admin`, which has four sections:
- **Overview:** the 25 days, a gifts summary (Sephora count and combined days), days unlocked by the real date, progress stored in *this browser*, preview status, and how many days have local edits.
- **Preview & testing:** a simulated date, plus Preview all 25 days, Test locks on this date, Test Day 25 finale, View as Gina, and Test the login screen.
- **Calendar:** all 25 days, each with **Preview** and **Edit**.
- **Content & data:** Export or Import content, Restore default content, Reset preview data, and Reset Gina's progress. Every destructive action asks for confirmation first.

### Content editor

Choose **Edit** on any day. The editor has five tabs:
- **Gift:** title, subtitle and teaser; the physical gift(s), with name, brand and a private note; and for gift-reveal days, the reveal style, headline, description and hiding place.
- **Surprise:** fields for that day's type, such as letter, photos, song, coupon or date details, quiz or challenge, secret, dream, love reasons, or the finale.
- **Extras:** optional on *any* day: a personal message, song dedication and link, poem, love reasons, a memory with a photo, and an activity to do together. For example, Day 2 can be "gift + virtual hug + song".
- **Animation:** gold special tile, and the opening ceremony (automatic, standard, grand or none).
- **Advanced:** change the day's type (e.g. turn Day 21 into a mini-game), or edit the raw JSON.

**Save** validates the day first; an empty title or a broken quiz is refused. An "Unsaved changes" badge and a leave-page warning protect your work. Edits persist after a refresh, and **Revert to default** works per day.

**Getting edits onto Gina's phone.** Edits are saved in the browser where you made them. To publish them:
1. **Export content** to download `content-overrides.json`.
2. Save it as `src/data/content-overrides.json`.
3. Commit and redeploy. Every device now uses your edits, and they work offline too.

### Preview mode

Previews use their own sandbox and **never write to Gina's progress** (`25dol:state`). A gold **ADMIN PREVIEW** bar is shown the whole time.

| To… | Do this |
|---|---|
| Preview one day, even a locked one, with its opening animation | Dashboard → **Preview** on that day |
| Walk through all 25 days | **Preview all 25 days** |
| Test locked/unlocked days on a date | pick a date chip (or custom date) → **Test locks on this date** |
| Test the finale | **Test Day 25 finale** |
| Change date / unlock-all / jump to a day while previewing | the ⚙︎ sliders icon in the preview bar |
| Watch an opening again from scratch | preview bar ⚙︎ → **Replay day N** |
| Leave | **Exit** in the preview bar |

**View as Gina** shows exactly her experience: the real date, real locks, no admin controls, and a sandboxed copy of this browser's progress. A thin "Viewing as Gina · Exit" strip is the only way back. **Test the login screen** opens her login page in test mode: signing in as Gina enters View as Gina, and your admin session stays as it was.

## 4. Replace the placeholder content

Every placeholder text contains **`[PLACEHOLDER]`**. To find them all:

```bash
grep -rn "PLACEHOLDER" src/data
```

**Letters and text.** Open `src/data/calendar.js` and edit the strings. Each paragraph is one item in a `body: [...]` array.

**Photos.**
1. Export at about 1600px on the long edge, JPEG quality about 80. Smaller files load faster on her phone.
2. Copy them into `public/photos/`, for example `public/photos/day-03.jpg`.
3. In `calendar.js`, change `src: null` to `src: '/photos/day-03.jpg'`. Use the `photo('caption', { date })` helper's `src` option, or edit the object directly:
   ```js
   photos: [photo('Us at the market', { src: '/photos/day-03.jpg', date: 'Dec 2025' })],
   ```
   While `src` is `null`, or if a file is missing, the app shows an elegant placeholder frame instead of a broken image.

**Videos.** Put an `.mp4` in `public/videos/` and set `src: '/videos/day-11.mp4'`. You can use a YouTube embed instead: `embed: 'https://www.youtube-nocookie.com/embed/VIDEO_ID'`. Videos never autoplay. An embed only loads after she taps it. On a `video` day with no video set, its `fallbackText` is shown instead. The Christmas Day finale video is optional.

**Songs.** Paste a Spotify, Apple Music or YouTube link into `link`. If you also want an in-page player that loads only on tap, set `embed`, for example `https://open.spotify.com/embed/track/ID`.

**Other content:**
- **Coupons:** each one needs a unique `id`. Don't change an id after she has the app, because her redemptions are stored by id.
- **Quiz:** `answer` is the index of the correct option, counting from 0.
- **Secret:** list every answer you'll accept in `answers`. Matching ignores case, spaces and punctuation.
- **"Whenever You Need Me":** edit `src/data/messages.js`. Add as many messages as you like.
- **Easter eggs:** edit `src/data/easterEggs.js`. The file header explains how each one is triggered.
- **Greetings, year and your names:** edit `src/data/config.js`.
- **Hiding a day from Memories:** add `memory: false` to that day.
- **Gift schedule:** each day's `gifts: [{ id, name, brand }]` lists the physical gift(s) behind that door (the full schedule is in the header of `calendar.js`). On a `gift` day with two or more entries (Days 14, 17, 22), the unwrapped view lists every item inside.

## 5. Developer preview (`npm run dev` only)

The admin panel above is the main way to preview and test. In addition, `npm run dev` shows a small green **DEV** button in the top-right corner of Gina's experience. It opens a panel where you can:

- set a **simulated date**, or use the presets: Nov 23, Dec 1, Dec 12, Dec 24, Dec 25, Dec 30, or back to the real date
- turn on **Bypass locks** to open any day regardless of the date
- jump straight to any of the 25 days
- trigger any easter egg
- **reset all progress**

The simulated date and the lock bypass are stored under `25dol:dev` and are only read when dev tools are compiled in.

**Why she can't reach it:** `DEV_TOOLS_ENABLED` is `true` only in `npm run dev`, or when you build with `VITE_ENABLE_DEV_TOOLS=true`. In a normal `npm run build`, the panel, the date override and the lock bypass are all removed from the bundle. This was checked: the production build ignores a planted override.

## 6. Reset your progress

There are four ways:
- Admin → **Reset Gina's progress**, with confirmation. It only affects the browser you're using.
- In dev, open the **DEV** panel and choose **Reset all progress**.
- In any browser, open DevTools → Application → Local Storage and delete `25dol:state`.
- From the console: `localStorage.removeItem('25dol:state'); location.reload()`.

**Before you send her the link,** open it once in a private window to make sure it starts fresh. Progress lives only in the browser that opened it, and each device has its own.

## 7. Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, choose **Add New → Project**, import the repo, and keep the defaults (Framework: **Vite**, Build: `npm run build`, Output: `dist`).
3. Don't set `VITE_ENABLE_DEV_TOOLS`.
4. Deploy. `vercel.json` already handles three things:
   - client-side routes such as `/day/5` resolve on refresh
   - `sw.js` is never cached by the CDN, so updates reach her
   - `X-Robots-Tag: noindex` is set, and `robots.txt` blocks crawlers
5. Optional: under Settings → Domains, choose a less guessable subdomain. With a Pro plan you can also turn on **Vercel Authentication** or **Password Protection** for real access control.

On her iPhone, open the link in **Safari**, tap **Share**, then **Add to Home Screen**. The Home screen shows a small dismissible card explaining this, and the ⚙︎ preferences sheet repeats the steps.

## 8. QA checklist

This is what was verified for this build, in Chromium with iPhone 13 and iPhone SE emulation:

- [x] Production build compiles; zero console errors across all 25 days and every page
- [x] Before Dec 1: anticipation greeting, countdown to Dec 1, all tiles locked, "patience" message
- [x] During December: today is highlighted and pulsing; past days are open; future days show a gentle toast
- [x] Opening a future day by URL (`/day/24`) shows "Still wrapped" and doesn't reveal or record anything
- [x] Opened state persists after reload; reopening doesn't double-count
- [x] Dec 24 and 25 have gilded tiles; Dec 25 is a full-width "final chapter" tile
- [x] Christmas finale: greeting → letter → photos → (video) → gift unwrap → closing; becomes a freely browsable keepsake afterwards
- [x] After Dec 25: everything is open; Home shows the "collection" state
- [x] After the finale, every day stays unlocked permanently
- [x] Coupon: confirmation required, cancel works, redemption persists, stamp survives reload; "choose one" works
- [x] Quiz, challenge checklist, scratch card (with "reveal without scratching" for accessibility), find-the-heart, secret password
- [x] For You: no repeats across 6 draws; favourites save and list
- [x] Easter egg discovery shows a modal and persists; milestone egg fires at 10 opened
- [x] Corrupted LocalStorage recovers without errors (the bad data is backed up)
- [x] No horizontal overflow at 320px or 390px
- [x] PWA: manifest valid, icons served, service worker active, app shell and For You reload **offline**
- [x] Production ignores simulated dates and lock bypass; no DEV button
- [x] Login: validation, invalid credentials, show/hide, Enter submits, loading state, session survives refresh, logout
- [x] Gina is redirected away from `/admin`; admin code is never downloaded in her session
- [x] Admin: preview locked days with the opening animation, replay, preview all, simulated-date lock tests, Day 25 finale, View as Gina, login-screen test
- [x] Gina's progress is byte-for-byte unchanged after every admin preview and test
- [x] Editor: validation, save, persistence after refresh, preview of edited extras, type change (Day 21 → mini-game), restore defaults, reset progress (with cancel paths)
- [x] Mobile (390px) and desktop (1280px) layouts without horizontal overflow; login works offline

**Do these before you hand it over:**
- [ ] Replace every `[PLACEHOLDER]` (`grep -rn PLACEHOLDER src/data`)
- [ ] Add your photos and check each day with Admin → **Preview**
- [ ] If you edited content in the admin panel, export it to `src/data/content-overrides.json` and redeploy
- [ ] Change the admin password (generate a new hash for `src/auth/accounts.js`)
- [ ] Test on a real iPhone: Add to Home Screen, launch, open a day, close, reopen
- [ ] Check that `CALENDAR_YEAR` in `config.js` is right
- [ ] Reset your own progress, or test in a private window

## 9. Known limitations

- **The login is front-end only.** It is not secure; see [Accounts & security](#accounts--security).
- **Admin edits and progress are per browser.** The admin panel cannot see or reset progress on Gina's phone. "Reset Gina's progress" only clears the browser you're using. Publish edits with Export → `content-overrides.json` → redeploy.
- **An unlisted URL is not security.** Anyone with the link can open the site. Anyone technical can read the bundled content, including future days, in the JavaScript. Use Vercel's password protection if that matters.
- **Unlocking relies on her device clock.** Changing the phone's date would unlock days early. That's acceptable for a gift; it isn't tamper-proof.
- **Progress is per device and per browser.** Safari and the Home Screen app share storage on recent iOS versions, but a different phone starts fresh. iOS may clear storage for sites that go unused for weeks. That isn't a problem when the app is added to the Home Screen.
- **No sound or music toggle.** Ambient audio was left out on purpose: no autoplay, nothing to annoy. Songs open in her music app, or in a player that loads only on tap.
- **Offline:** the app, your text and photos she has already viewed work offline. Videos and embeds (Spotify, YouTube) need a connection.
- **Fonts** are bundled locally through `@fontsource`, so no Google requests and no tracking.
- **Icons:** after editing `public/icons/icon.svg`, run `npm run icons` to regenerate the PNGs. This needs Playwright.
