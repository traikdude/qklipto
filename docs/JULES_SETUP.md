# Jules CI Setup Guide

To enable the automated Jules analysis workflow, you need to configure a GitHub Personal Access Token (PAT).

## 1. Generate a GitHub PAT

1.  Go to **GitHub Settings** > **Developer settings** > **Personal access tokens** > **Tokens (classic)**.
2.  Click **Generate new token (classic)**.
3.  **Note:** "Jules CI Token".
4.  **Scopes:** Select the following scopes:
    *   `repo` (Full control of private repositories)
    *   `read:user`
    *   `workflow` (Update GitHub Action workflows)
5.  Click **Generate token**.
6.  **Copy** the token immediately.

## 2. Add Secret to Repository

You can do this via the GitHub UI or the CLI.

### Option A: GitHub UI
1.  Go to your repository: `https://github.com/traikdude/qklipto`
2.  Navigate to **Settings** > **Secrets and variables** > **Actions**.
3.  Click **New repository secret**.
4.  **Name:** `JULES_GITHUB_TOKEN`
5.  **Secret:** Paste your PAT.
6.  Click **Add secret**.

### Option B: GitHub CLI (Recommended)
If you have the token copied, run this command in your terminal:

```bash
gh secret set JULES_GITHUB_TOKEN --body "YOUR_TOKEN_HERE"
```

## 3. Trigger the Workflow

Once the secret is set, the workflow will run on the next push. You can also trigger it manually:

```bash
gh workflow run jules.yml
```
