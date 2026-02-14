# ⚡ QUICK FIX: GitHub Actions Permissions

## 🎯 Problem
If you see this error in GitHub Actions:
```
❌ Resource not accessible by integration
```

## ✅ Solution (2 minutes)

### Step 1: Open Repository Settings
Click this URL:
```
https://github.com/campanerasanti-web/Serendipity-Anthropos-Core/settings/actions
```

### Step 2: Scroll to "Workflow permissions"
You'll see a section that looks like this:

```
┌─────────────────────────────────────────┐
│ Workflow permissions                    │
│                                         │
│ ○ Read repository contents and         │
│   packages permissions                  │
│                                         │
│ ● Read and write permissions           │ ← Select this
│                                         │
│ ☑ Allow GitHub Actions to create and   │ ← Check this
│   approve pull requests                 │
│                                         │
│ [Save]                                  │
└─────────────────────────────────────────┘
```

### Step 3: Select These Options

1. ✅ **Select**: "Read and write permissions"
2. ✅ **Check**: "Allow GitHub Actions to create and approve pull requests"
3. ✅ **Click**: "Save" button

### Step 4: Re-run Failed Workflows

1. Go to **Actions** tab
2. Click on the failed workflow
3. Click **"Re-run jobs"** button
4. Select **"Re-run all jobs"**

## ✅ Done!

Your workflows should now run successfully.

---

## 📚 More Information

For detailed information, see:
- **[GITHUB_ACTIONS_PERMISSIONS_GUIDE.md](./GITHUB_ACTIONS_PERMISSIONS_GUIDE.md)** - Complete guide
- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - Full documentation index

---

**Status**: ✅ Workflow files updated  
**Action Required**: Repository settings configuration (Steps 1-4 above)
