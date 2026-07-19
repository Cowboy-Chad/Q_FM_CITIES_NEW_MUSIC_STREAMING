# Git Operations Plan — Q-FM Cities

**Last Updated:** 2026-07-18
**Project:** `q-fm-cities-com`
**Remote:** `origin → https://github.com/Cowboy-Chad/Q_FM_CITIES_NEW_MUSIC_STREAMING.git`
**Default Branch:** `main`

---

## 1. Current Repository State

| Item | Status |
|------|--------|
| Git initialized? | ✅ Yes |
| `.gitignore` exists? | ✅ Yes |
| Remote configured? | ✅ Yes (`origin`) |
| Upstream tracking set? | ✅ Yes (`origin/main`) |
| Music in `.gitignore`? | ✅ Yes — `music/` excluded from Git |
| Git LFS? | ❌ Removed — not needed |

---

## 2. ⚠️ Pre-Push Safety Check

Before any `git add .` or `git push`, verify these files are **NOT** staged:

### 🔴 NEVER COMMIT (Security Risk)

| File | Reason |
|------|--------|
| `src/lib/supabase.js` | Contains Supabase credentials (listed in `.gitignore`) |

### 🟡 CHECK BEFORE COMMITTING

| File | Reason |
|------|--------|
| `node_modules/` | Listed in `.gitignore` — verify it's not staged |

### Quick verification command:

```sh
git status
```

---

## 3. 🚀 The Full Push Process (3 Commands)

### Step 1: Stage everything

```sh
git add .
```

### Step 2: Verify what's staged

```sh
git status
```

Confirm:
- ✅ No `node_modules/` staged
- ✅ No `music/` files staged
- ✅ All expected changes are included

### Step 3: Commit with your message

```sh
git commit -m "your message here"
```

Replace `"your message here"` with whatever message you provide on the fly.

### Step 4: Push to remote

```sh
git push origin main
```

---

## 4. 📝 Commit Message Convention (Recommended)

Follow [Conventional Commits](https://www.conventionalcommits.org/) for clear, standardized messages:

```
<type>(<scope>): <description>
```

| Type | When to use | Example |
|------|------------|---------|
| `feat` | A new feature | `feat(player): add shuffle mode` |
| `fix` | A bug fix | `fix(auth): handle session expiry` |
| `refactor` | Code restructuring | `refactor: extract CityGrid component` |
| `chore` | Maintenance, config | `chore: update dependencies` |
| `docs` | Documentation only | `docs: add API usage guide` |
| `style` | Formatting only | `style: fix indentation` |
| `perf` | Performance | `perf: lazy-load images` |

### Examples for this project:

```sh
git commit -m "feat: add SilverStone music folders"
git commit -m "fix: rename Sileverstone typo to SilverStone"
git commit -m "chore: update .gitignore with exclusions"
git commit -m "docs: add git operations plan"
```

---

## 5. 🔄 Quick Reference — All-in-One

When you're in a hurry and just want to push with a custom message, run these **4 commands** sequentially:

```sh
# 1. Stage everything
git add .

# 2. Quick safety check
git status

# 3. Commit with your message
git commit -m "<your message>"

# 4. Push to remote
git push origin main
```

---

## 6. 🛟 Troubleshooting

| Problem | Solution |
|---------|----------|
| `git push` asks for password | Remote uses HTTPS with PAT token — if token expired, generate a new one at GitHub Settings → Developer settings → Personal access tokens |
| Wrong commit message | `git commit --amend -m "new message"` (only if not pushed yet) |
| `! [rejected]` error | Remote has changes you don't have. Run `git pull origin main --rebase` first, then push again |

---

## 7. Appendix: `.gitignore` Contents

Currently excludes:
- `node_modules/`, `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`
- `dist/`, `build/`
- `.env`, `.env.local`, `.env.production`, `.env.development`
- `.vscode/`, `.idea/`, `*.swp`, `*.swo`, `*~`, `.DS_Store`, `Thumbs.db`
- `src/lib/supabase.js`
- `music/` — all audio files kept local only
- `g-fm-ssh-key-file`, `g-fm-ssh-key-file.pub` — SSH keys (deleted)
