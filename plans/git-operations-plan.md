# Git Operations Plan — Q-FM Cities

**Last Updated:** 2026-07-16
**Project:** `q-fm-cities-com`
**Remote:** `origin → https://github.com/Cowboy-Chad/q-fm-cities.git`
**Default Branch:** `main`

---

## 1. Current Repository State

| Item | Status |
|------|--------|
| Git initialized? | ✅ Yes |
| `.gitignore` exists? | ✅ Yes |
| Remote configured? | ✅ Yes (`origin`) |
| Upstream tracking set? | ✅ Yes (`origin/main`) |
| Git LFS configured? | ✅ Yes — tracks `music/**/*.mp3` and `music/**/*.m4a` |
| Music in `.gitignore`? | ❌ No — music is tracked via **Git LFS** |

---

## 2. ⚠️ CRITICAL: Pre-Push Safety Check

Before any `git add .` or `git push`, verify these files are **NOT** staged:

### 🔴 NEVER COMMIT (Security Risk)

| File | Reason |
|------|--------|
| `g-fm-ssh-key-file` | **Private SSH key** — if committed, anyone with repo access can impersonate you |
| `g-fm-ssh-key-file.pub` | Public key (less critical, but best not to commit) |
| `src/lib/supabase.js` | Contains Supabase credentials (listed in `.gitignore`) |

### 🟡 CHECK BEFORE COMMITTING

| File | Reason |
|------|--------|
| `music/` files | **489 MB total** — tracked via Git LFS. Verify LFS is working before push |
| `node_modules/` | Listed in `.gitignore` — verify it's not staged |

### Quick verification command:

```sh
git status
```

Look for these files in the **"Changes to be committed"** section. If you see any of the 🔴 files, **DO NOT PUSH** — remove them from staging first:

```sh
git restore --staged g-fm-ssh-key-file g-fm-ssh-key-file.pub
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
- ✅ No `g-fm-ssh-key-file` or `g-fm-ssh-key-file.pub` staged
- ✅ No `node_modules/` staged
- ✅ Music files are present (they're tracked via LFS)
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
| `git push` asks for password | Switch remote to SSH: `git remote set-url origin git@github.com:Cowboy-Chad/q-fm-cities.git` |
| Git LFS files not pushing | Run `git lfs push --all origin main` |
| Wrong commit message | `git commit --amend -m "new message"` (only if not pushed yet) |
| Accidentally committed SSH key | **STOP** — do not push. Contact repository admin. Use `git reset --soft HEAD~1` to undo |
| `! [rejected]` error | Remote has changes you don't have. Run `git pull origin main --rebase` first, then push again |

---

## 7. Current Working Directory State (as of 2026-07-16)

### Deleted files (staged for removal):
- `music/Sileverstone 1/` — 14 files (typo'd directory name, being replaced)
- `music/Silverstone 2/` — 14 files (being replaced with correct casing)
- 1 PNG image in `Sileverstone 1/`

### New untracked files:
- `music/SilverStone 1/` — 14 files (correctly named replacement)
- `music/SilverStone 2/` — 14 files (correctly named replacement)
- `g-fm-ssh-key-file` — **⚠️ DO NOT COMMIT**
- `g-fm-ssh-key-file.pub` — **⚠️ DO NOT COMMIT**

---

## Appendix: `.gitignore` Contents

Currently excludes:
- `node_modules/`, `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`
- `dist/`, `build/`
- `.env`, `.env.local`, `.env.production`, `.env.development`
- `.vscode/`, `.idea/`, `*.swp`, `*.swo`, `*~`, `.DS_Store`, `Thumbs.db`
- `src/lib/supabase.js`

> **Note:** `music/` is NOT in `.gitignore` — it's managed via **Git LFS** instead.