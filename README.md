# 25 Days of Love

*A little piece of us, every day.*

A private, mobile-first Christmas advent calendar web app with 25 daily surprises, a scrapbook of memories, a "Whenever You Need Me" button that works all year, hidden secrets, and a Christmas Day finale. Built with React and Vite, styled in plain CSS, with no backend and no tracking. It installs as a PWA.

---

## 1. Architecture

```
src/
├── data/                  ← EVERYTHING YOU PERSONALISE LIVES HERE
│   ├── calendar.js        the 25 days (titles, letters, photos, songs, coupons…)
│   ├── messages.js        "Whenever You Need Me" library (33 messages, 8 categories)
│   ├── easterEggs.js      the 4 hidden surprises
│   └── config.js          year, greetings, phrases, friendly microcopy
├── hooks/useAppState.jsx  one context: clock, unlock rules, progress, toasts, secrets
├── utils/
│   ├── date.js            local-timezone unlock logic (before / during / after)
│   ├── storage.js         versioned, corruption-safe LocalStorage
│   ├── devFlags.js        dev-preview switch (compiled out of production)
│   └── greeting.js
├── layout/AppShell.jsx    snowfall, bottom nav, page transitions, toasts, offline notice
├── pages/                 Home · CalendarPage · GiftPage · Memories · ForYou · NotFound
├── components/
│   ├── gifts/             one renderer per content type + GiftRenderer (type → component)
│   ├── decor/Decor.jsx    hand-built SVG ornaments, pine, wax seal, gift box
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

**How it fits together.** Content is plain data. `GiftPage` looks up a day and checks whether it is unlocked. If it is, the page marks the day opened and hands it to `GiftRenderer`, which picks a component based on `type`. All state (opened days, coupons, favourites, secrets, preferences) goes through a single reducer in `useAppState`. That reducer is saved to LocalStorage under the key `25dol:state`.

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

## 3. Replace the placeholder content

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

**Videos.** Put an `.mp4` in `public/videos/` and set `src: '/videos/day-11.mp4'`. You can use a YouTube embed instead: `embed: 'https://www.youtube-nocookie.com/embed/VIDEO_ID'`. Videos never autoplay. An embed only loads after she taps it. If no video is set, Day 11 shows `fallbackText` instead.

**Songs.** Paste a Spotify, Apple Music or YouTube link into `link`. If you also want an in-page player that loads only on tap, set `embed`, for example `https://open.spotify.com/embed/track/ID`.

**Other content:**
- **Coupons:** each one needs a unique `id`. Don't change an id after she has the app, because her redemptions are stored by id.
- **Quiz:** `answer` is the index of the correct option, counting from 0.
- **Secret:** list every answer you'll accept in `answers`. Matching ignores case, spaces and punctuation.
- **"Whenever You Need Me":** edit `src/data/messages.js`. Add as many messages as you like.
- **Easter eggs:** edit `src/data/easterEggs.js`. The file header explains how each one is triggered.
- **Greetings, year and your names:** edit `src/data/config.js`.
- **Hiding a day from Memories:** add `memory: false` to that day.

## 4. Preview any day (developer mode)

In `npm run dev`, a small green **DEV** button sits in the top-right corner. It opens a panel where you can:

- set a **simulated date**, or use the presets: Nov 23, Dec 1, Dec 12, Dec 24, Dec 25, Dec 30, or back to the real date
- turn on **Bypass locks** to open any day regardless of the date
- jump straight to any of the 25 days
- trigger any easter egg
- **reset all progress**

The simulated date and the lock bypass are stored under `25dol:dev` and are only read when dev tools are compiled in.

**Why she can't reach it:** `DEV_TOOLS_ENABLED` is `true` only in `npm run dev`, or when you build with `VITE_ENABLE_DEV_TOOLS=true`. In a normal `npm run build`, the panel, the date override and the lock bypass are all removed from the bundle. This was checked: the production build ignores a planted override.

## 5. Reset your progress

There are three ways:
- In dev, open the **DEV** panel and choose **Reset all progress**.
- In any browser, open DevTools → Application → Local Storage and delete `25dol:state`.
- From the console: `localStorage.removeItem('25dol:state'); location.reload()`.

**Before you send her the link,** open it once in a private window to make sure it starts fresh. Progress lives only in the browser that opened it, and each device has its own.

## 6. Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, choose **Add New → Project**, import the repo, and keep the defaults (Framework: **Vite**, Build: `npm run build`, Output: `dist`).
3. Don't set `VITE_ENABLE_DEV_TOOLS`.
4. Deploy. `vercel.json` already handles three things:
   - client-side routes such as `/day/5` resolve on refresh
   - `sw.js` is never cached by the CDN, so updates reach her
   - `X-Robots-Tag: noindex` is set, and `robots.txt` blocks crawlers
5. Optional: under Settings → Domains, choose a less guessable subdomain. With a Pro plan you can also turn on **Vercel Authentication** or **Password Protection** for real access control.

On her iPhone, open the link in **Safari**, tap **Share**, then **Add to Home Screen**. The Home screen shows a small dismissible card explaining this, and the ⚙︎ preferences sheet repeats the steps.

## 7. QA checklist

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

**Do these before you hand it over:**
- [ ] Replace every `[PLACEHOLDER]` (`grep -rn PLACEHOLDER src/data`)
- [ ] Add your photos and check each day in the DEV panel with Bypass locks on
- [ ] Test on a real iPhone: Add to Home Screen, launch, open a day, close, reopen
- [ ] Check that `CALENDAR_YEAR` in `config.js` is right
- [ ] Reset your own progress, or test in a private window

## 8. Known limitations

- **An unlisted URL is not security.** Anyone with the link can open the site. Anyone technical can read the bundled content, including future days, in the JavaScript. Use Vercel's password protection if that matters.
- **Unlocking relies on her device clock.** Changing the phone's date would unlock days early. That's acceptable for a gift; it isn't tamper-proof.
- **Progress is per device and per browser.** Safari and the Home Screen app share storage on recent iOS versions, but a different phone starts fresh. iOS may clear storage for sites that go unused for weeks. That isn't a problem when the app is added to the Home Screen.
- **No sound or music toggle.** Ambient audio was left out on purpose: no autoplay, nothing to annoy. Songs open in her music app, or in a player that loads only on tap.
- **Offline:** the app, your text and photos she has already viewed work offline. Videos and embeds (Spotify, YouTube) need a connection.
- **Fonts** are bundled locally through `@fontsource`, so no Google requests and no tracking.
- **Icons:** after editing `public/icons/icon.svg`, run `npm run icons` to regenerate the PNGs. This needs Playwright.
