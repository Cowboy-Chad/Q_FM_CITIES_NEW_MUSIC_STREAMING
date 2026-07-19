# Q-FM Cities — The Sound of The Open Range

A **React 18 + Vite 5** single-page music player for original songs by **Cowboy Chad**. Each music folder is a "City" you can tune into — with cloud sync scaffolding via Supabase.

![Player Screenshot](weather%20in%20Victoria%2C%20BC.png)

---

## Features

### Player
- Play/pause, prev/next, shuffle, repeat (off/all/one)
- Progress bar with click-to-seek
- Volume slider
- Track search/filter within a city

### Library
- City grid with infinite scroll
- Track grouping by folder (each folder = a city)
- Artist name extraction from filename metadata

### Cloud Scaffolding (Supabase — wired to UI)
- Email/password authentication
- Favorites sync (per-user, with local fallback)
- Playlist CRUD with track reordering
- Music file upload to Supabase Storage
- Library metadata sync

---

## Cities

| City | Tracks | Theme |
|------|--------|-------|
| Chantilly Lace | 2 | Love/romance |
| Chuck Shumer | 6 | Political parody |
| Common Mud | 4 | General |
| Gaga Parody | 14 | Lady Gaga parody |
| Gangnam 1 | 14 | KISS Tribute / Gangnam Style |
| MAGA One | 15 | Political |
| SilverStone 1 | 14 | F1 Racing |
| SilverStone 2 | 14 | F1 Racing |
| We're Blessed | 16 | Religious/spiritual |

---

## Getting Started

```sh
npm install
npm run dev
```

The app uses `import.meta.glob('/music/**/*.{mp3,m4a}')` to auto-discover audio files. Place your `.mp3` and `.m4a` files in folders under `music/` — each folder becomes a city.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 |
| **Bundler** | Vite 5 |
| **Auth** | Supabase Auth (email/password) |
| **Database** | Supabase (PostgreSQL + RLS) |
| **Storage** | Supabase Storage |
| **Styling** | Custom CSS (dark maroon theme) |

---

## Project Structure

```
├── index.html                  # Entry point
├── src/
│   ├── main.jsx               # React root with providers
│   ├── App.jsx                # Router shell with lazy-loaded routes
│   ├── lib/
│   │   ├── supabase.js        # Supabase client + env validation
│   │   └── constants.js       # App-wide constants
│   ├── context/
│   │   ├── AuthContext.jsx     # Supabase auth (wired to UI)
│   │   ├── SyncContext.jsx     # Cloud sync orchestration (wired to UI)
│   │   └── PlayerContext.jsx   # Audio player state management
│   ├── services/
│   │   ├── musicLibrary.js    # Auto-discovers music via glob import
│   │   ├── syncService.js     # Favorites/playlist sync
│   │   └── uploadService.js   # Storage uploads
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.jsx
│   │   │   ├── AppFooter.jsx
│   │   │   └── Toast.jsx
│   │   ├── cities/
│   │   │   ├── CitiesPage.jsx
│   │   │   ├── CitiesGrid.jsx
│   │   │   ├── CityCard.jsx
│   │   │   └── CityPlayerPage.jsx
│   │   ├── player/
│   │   │   ├── AlbumArt.jsx
│   │   │   ├── PlayerControls.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── VolumeControl.jsx
│   │   ├── playlist/
│   │   │   ├── Playlist.jsx
│   │   │   ├── PlaylistItem.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── FlameEffect.jsx
│   │   ├── FireworksEffect.jsx
│   │   ├── SlidingSwitch.jsx
│   │   ├── FakePayPal.jsx
│   │   └── SubscriptionPage.jsx
│   ├── styles/
│   │   ├── index.css          # Main stylesheet (imports all modules)
│   │   ├── variables.css
│   │   ├── themes.css
│   │   ├── layout.css
│   │   ├── player.css
│   │   ├── playlist.css
│   │   ├── effects.css
│   │   ├── subscription.css
│   │   ├── error-boundary.css
│   │   └── responsive.css
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   └── __tests__/
│       ├── setup.js
│       ├── components/        # 12 test files, 73 tests
│       └── services/          # musicLibrary tests
├── supabase/
│   └── schema.sql             # Database schema + RLS policies
├── music/                     # Audio files (tracked directly in Git)
└── plans/                     # Development plans
```

---

## Git LFS (Removed)

Git LFS was **permanently removed** from this repository. Cowboy Chad does not anticipate it being needed for the future of this music-playing app — the audio files are small enough to track directly in Git.

If you have a local clone with LFS hooks still active, remove them:

```sh
rm .git/hooks/pre-push
```

---

## License

Copyright © 2026 Chad Vincent Estell

This program is free software: you can redistribute it and/or modify
it under the terms of the **GNU General Public License** as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
[GNU General Public License](https://www.gnu.org/licenses/gpl-3.0.html)
for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

Built with ❤️ by Cowboy Chad