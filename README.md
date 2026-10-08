# MK AnimeVerse – Gold & Black

A static anime streaming website (no build step, no dependencies) with a **gold & black liquid theme**, floating water background, click-to-drop effect, and a full **admin / live editor** for managing content.

> Pure HTML + CSS + JavaScript. Open `index.html` and it works.

## Features

- **Gold & black theme** (dark default, cream-gold light mode) with a toggle in the header.
- **Floating water effect on every page** – drifting gold glows, rising bubbles and a wavy water surface. **Click or tap anywhere** and a gold drop falls and splashes into the water. Respects *reduced motion* settings.
- **Responsive UI** – desktop sidebar layout; on phones a slide-out menu, bottom navigation, two-column grids and swipeable rows.
- Pages: Home (hero slider), Trending, Latest, Library (filters, A–Z), Genres, My List, Anime detail, Player, Search.
- **Languages:** English, தமிழ், हिन्दी. Player settings for quality, audio and subtitles.
- **Accounts:** login / sign up with a **show / hide password** button (demo, stored in the browser). **The first account created becomes the admin.**
- **First-run admin setup:** when no account exists, a **Set up admin account** screen opens automatically: name, email, secret code, password and confirm password (each with show / hide). That first account becomes the admin.

## Admin features

Log in as admin, then:

| Where | What you can do |
|---|---|
| **Admin → Add / Edit anime** | Title, genres, year, rating, episodes, format, status, description, featured |
| **Profile image & back cover image** | Upload or paste a link for each anime (auto-resized) |
| **Main video** | Upload a video file **or paste one link**. YouTube, Vimeo, Dailymotion, Google Drive and direct `.mp4/.webm` links are detected automatically |
| **Episodes section** | Per-episode title and video (upload or link), **Upload many videos** (matched by file name such as `S01E05`), **Paste links** (one per line), Clear all |
| **Website branding** | Site name, tagline and logo |
| **✏️ Edit page** (floating button) | Tap any text on any page to edit it; replace posters and covers in place; **Go to…** menu to move between pages; 🗑 Delete on cards and anime pages |
| **Export / Import JSON** | Back up or move your library |

**Autosave:** every admin change (forms, episodes, images, branding and on-page text edits) saves automatically about one second after you stop typing. There is **no undo and no reset-to-default** – the only destructive buttons are **Delete** (anime, episodes, images). Press **✓ Done** to close the form.

## Player

`player.js` is a custom player (the rest of the site is unchanged):

- **MP4 / WebM** from your own host or CDN, or uploaded files. Paste any direct link.
- **HLS `.m3u8`**: paste the link as a main or per-episode video (hls.js loads from a CDN only when needed; Safari/iOS play it natively). Quality list comes from the stream.
- **Audio menu**: embedded audio tracks (HLS/Safari) plus dub links from Admin → *Quality, subtitle and dub sources*.
- **Subtitles**: `.vtt` links from the same section (`.srt` is converted), embedded tracks, or **＋ Load subtitle file** from the viewer's device.
- **Episode list** beside the player with a preview frame taken from each uploaded/linked video, and a **seek-bar preview**. Auto-next, resume position, keyboard shortcuts (Space, ←/→, J/L, ↑/↓, M, F, C, Shift+N).
- **URL templates**: use `{ep}` or `{ep2}` in a video, dub or subtitle link, e.g. `https://cdn.example.com/show/ep{ep2}/index.m3u8`.
- Your host must allow **CORS** for subtitles, HLS and thumbnails.

## Project structure

```
index.html   Page shell (header, sidebar, modals)
style.css    Theme, layout, mobile styles
script.js    App logic: routing, pages, admin, live editor, video input
player.js    Video player, HLS, audio/subtitle menus, episode thumbnails
effects.js   Gold water + click-drop canvas effect
```

## Run locally

Just open `index.html` in a browser. Or serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Because it is fully static, you can host it for free:

- **GitHub Pages:** push this folder to a repository → *Settings → Pages* → deploy from the `main` branch.
- **Netlify / Vercel / Cloudflare Pages:** drag and drop the folder, no build command needed.

## Forgot your password? (all users)

- When someone **signs up** they choose their own **secret code** (at least 4 characters) in addition to their password.
- On the login form tap **Forgot password?**, enter your **email + your secret code**, then choose a new password. This works for every user, including the admin.
- Codes are stored only as salted SHA-256 hashes. Five wrong tries lock the form for 15 minutes.
- Accounts created before this update have no personal code: the **admin** account can still reset with the original code **1124**; ordinary old users must sign up again.

**This is convenience, not real security.** Everything runs in the browser, short codes can be guessed, and the lock-out can be bypassed. Use server-side accounts and an email reset link before going public.

## Important limits (please read)

- **All data is stored in the visitor's own browser** (localStorage and IndexedDB): anime, edits, images, accounts and uploaded videos. Other visitors will **not** see your admin changes on a public site.
- The login is a **demo, not real security**. Before going public, connect a real backend (database, authentication, file storage).
- Uploaded videos stay in the browser where they were added. For public streaming, host files elsewhere and paste links.
- Browser storage is limited (about 5 MB). Prefer **image links** over uploads when you have many titles.
- `.mkv` files do not play in browsers; convert to `.mp4`.
- The sample anime are original placeholders. **Only stream content you own or have permission to use.**

## Customize

- **Colors:** edit the CSS variables at the top of `style.css` (`--accent`, `--accent2`, `--bg`, …).
- **Water effect:** adjust blob/bubble counts and colors in `effects.js`.
- **Texts and languages:** the `I18N` object at the top of `script.js`.

## Browser support

Current Chrome, Edge, Firefox and Safari (desktop and mobile).
