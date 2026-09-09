# ReasonMaster India — Stable Checkpoint Restore Guide

## Checkpoint Overview

- **Project:** ReasonMaster India
- **Checkpoint Name:** Stable Baseline Pre-Major Update
- **Checkpoint Tag:** `reasonmaster-india-stable-baseline-2026-09-09`
- **Branch:** `main`
- **Remote Repository:** `https://github.com/pythonwithkaranofficial-spec/reason_master_india.git`
- **Created Date:** 2026-09-09
- **Checkpoint Commit:** `3c812f7a592954ee51a58dfea97d6c57452e8ea5`

---

## What This Checkpoint Contains

This checkpoint captures the 100% verified, fully working state of the ReasonMaster India platform:
1. **Full Authentic Question Bank**: 6,438 authentic reasoning questions extracted across all 42 PDF examination sourcebooks (`public/data/extracted_reasoning_questions_master.json`).
2. **Visual Diagram Figures**: 400 crisp 150-DPI cropped question diagrams for non-verbal series, dice reasoning, and Venn diagrams (`public/images/questions/`).
3. **Synchronized Topic Banks**: All 39 topic JSON datasets in `src/data/questions/` and 27 categorized files in `src/data/extracted_by_topic/`.
4. **Figure Rendering Engine**: `NonVerbalFigureRenderer.tsx` and responsive practice/result integration supporting both SVG vectors and high-definition raster diagrams.
5. **Verified Production Build**: Tested with Next.js 16.3.4 (Turbopack) with 0 TypeScript/lint errors and all 124 static pages prerendered.

---

## How to Restore Using Git

### Method 1: Inspect or Test the Checkpoint State (Non-Destructive - Recommended)

To checkout the exact snapshot in a detached HEAD state without modifying any existing branches:

```bash
# Fetch all tags and commits from the remote repository
git fetch --all --tags

# Checkout the checkpoint tag directly
git checkout reasonmaster-india-stable-baseline-2026-09-09
```

---

### Method 2: Create a New Branch from the Checkpoint (Safest for Continued Work)

If you want to create a clean branch starting exactly from this working baseline:

```bash
git fetch --all --tags
git switch -c recovery-from-checkpoint reasonmaster-india-stable-baseline-2026-09-09
```

You can now develop, test, or deploy directly on this new branch without affecting `main`.

---

### Method 3: Reset Current `main` Branch to this Checkpoint (Destructive Warning)

> [!CAUTION]
> **DESTRUCTIVE ACTION:** The following commands will overwrite any uncommitted work and reset your current branch to the exact checkpoint commit. Only use this if you want to completely discard recent experimental changes.

```bash
# 1. Stash or backup any uncommitted changes you may want to keep
git stash save "changes_before_rollback"

# 2. Hard reset the current branch to the checkpoint tag
git reset --hard reasonmaster-india-stable-baseline-2026-09-09

# 3. Verify clean state
git status
npm run build
```

---

## Verifying the Restored State

After restoring, verify the build to ensure the site is working properly:

```bash
# Install dependencies if node_modules were modified
npm install

# Run the production build
npm run build

# Start local server to preview
npm run dev
```
