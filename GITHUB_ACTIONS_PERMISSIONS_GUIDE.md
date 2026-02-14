# 🔐 GitHub Actions Permissions Configuration Guide

## ⚠️ Issue: "Resource not accessible by integration"

If you encounter the error **"Resource not accessible by integration"** when running GitHub Actions workflows (especially CodeQL security scanning), it means the repository's GitHub Actions permissions need to be configured correctly.

---

## 🔧 Quick Fix: Enable Required Permissions

### Step 1: Navigate to Repository Settings

1. Go to your GitHub repository: `https://github.com/campanerasanti-web/Serendipity-Anthropos-Core`
2. Click on **⚙️ Settings** (top right of the repository page)
3. In the left sidebar, scroll down and click on **Actions**
4. Click on **General**

### Step 2: Configure Workflow Permissions

Scroll down to the **"Workflow permissions"** section and configure as follows:

#### ✅ Option 1: Read and Write Permissions (Recommended)

Select: **"Read and write permissions"**

This allows workflows to:
- ✅ Read repository contents
- ✅ Write security events (for CodeQL)
- ✅ Upload SARIF results
- ✅ Create/update build artifacts
- ✅ Publish releases

#### ✅ Option 2: Allow GitHub Actions to Create and Approve Pull Requests

Check the box: **"Allow GitHub Actions to create and approve pull requests"**

This is required if you have workflows that:
- Create pull requests automatically
- Add comments to pull requests
- Approve pull requests

### Step 3: Save Changes

Click the **"Save"** button at the bottom of the page.

---

## 🔄 Re-run Failed Workflows

After enabling the permissions:

1. Go to the **Actions** tab in your repository
2. Find the failed workflow run
3. Click on the workflow
4. Click the **"Re-run jobs"** button (top right)
5. Select **"Re-run failed jobs"** or **"Re-run all jobs"**

---

## 📋 Required Permissions by Workflow

### Security Scanning Workflow (`security.yml`)

**Requires:**
- ✅ `contents: read` - Read repository code
- ✅ `security-events: write` - Write security scan results
- ✅ `actions: read` - Read action metadata
- ✅ `statuses: write` - Update commit statuses

**Repository Setting:** Read and write permissions

### Release Workflow (`release.yml`)

**Requires:**
- ✅ `contents: write` - Create releases and tags
- ✅ `packages: write` - Publish Docker images to GHCR

**Repository Setting:** Read and write permissions

### Tests Workflow (`tests.yml`)

**Requires:**
- ✅ `contents: read` - Read repository code
- ✅ `checks: write` - (Optional) Write test results

**Repository Setting:** Read permissions (minimum)

### CI Workflows (`backend-ci.yml`, `frontend-ci.yml`)

**Requires:**
- ✅ `contents: read` - Read repository code

**Repository Setting:** Read permissions (minimum)

---

## 🛡️ Security Best Practices

### 1. Use Minimal Permissions

Each workflow should only request the permissions it actually needs. Our workflows follow this principle by:
- Defining permissions at the workflow level when possible
- Using job-level permissions for specific tasks
- Defaulting to read-only for most operations

### 2. Workflow-Level vs Repository-Level Permissions

- **Workflow-level permissions** (defined in YAML) are explicit and override repository defaults
- **Repository-level permissions** (Settings → Actions) are the default for all workflows

### 3. Token Scopes

The `GITHUB_TOKEN` automatically available in workflows has its scope limited by:
1. Repository settings (Settings → Actions → General)
2. Workflow-level `permissions:` blocks
3. Job-level `permissions:` blocks

The most restrictive setting wins.

---

## 🔍 Troubleshooting

### Error: "Resource not accessible by integration"

**Cause:** Insufficient permissions for the GitHub Actions token

**Solutions:**
1. ✅ Enable "Read and write permissions" in Settings → Actions → General
2. ✅ Add explicit `permissions:` blocks to workflows
3. ✅ Check if workflow needs pull request permissions

### Error: "Token permissions insufficient"

**Cause:** Workflow trying to perform an action not allowed by current permissions

**Solutions:**
1. Check the workflow's `permissions:` block
2. Verify repository settings allow the required permission level
3. Review the specific action that failed and its permission requirements

### CodeQL Analysis Fails

**Common Issue:** CodeQL needs to upload SARIF results but lacks permissions

**Solution:**
```yaml
permissions:
  contents: read
  security-events: write  # Required for CodeQL
```

And enable "Read and write permissions" in repository settings.

---

## 📚 Additional Resources

- [GitHub Actions Permissions Documentation](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [CodeQL Security Scanning](https://docs.github.com/en/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors)
- [SARIF File Support](https://docs.github.com/en/code-security/code-scanning/integrating-with-code-scanning/sarif-support-for-code-scanning)

---

## ✅ Verification Checklist

After configuring permissions, verify:

- [ ] Repository Settings → Actions → General → Workflow permissions set to "Read and write permissions"
- [ ] Checkbox "Allow GitHub Actions to create and approve pull requests" is checked (if needed)
- [ ] All workflows have explicit `permissions:` blocks where needed
- [ ] CodeQL workflow runs successfully
- [ ] Security scanning results appear in Security tab
- [ ] No "Resource not accessible" errors in workflow logs

---

**Last Updated:** February 14, 2026  
**Status:** ✅ Ready for Production
