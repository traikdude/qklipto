# Jules CI Detailed Setup Guide

This guide provides step-by-step instructions to configure the automated Jules analysis for your repository.

## 🏁 Phase 1: Generate the Access Token (The "Key")

We need to give the Jules workflow permission to read your code and write reports. We do this by creating a "Personal Access Token" (PAT).

1.  **Click this direct link** to open the token creation page:  
    👉 [**Generate New Token (Classic)**](https://github.com/settings/tokens/new?description=Jules%20CI%20Token&scopes=repo,workflow,read:user)  
    *(This link pre-selects the necessary scopes for you!)*

2.  **Login** to GitHub if prompted.

3.  **Review the Form:**
    *   **Note:** It should already say `Jules CI Token`.
    *   **Expiration:** Set to **"No expiration"** (or 90 days if you prefer security rotation).
    *   **Select scopes:** Ensure these boxes are checked (the link should have checked them):
        *   ✅ `repo` (Full control of private repositories)
        *   ✅ `workflow` (Update GitHub Action workflows)
        *   ✅ `read:user` (Read user profile data)

4.  **Scroll to the bottom** and click the green **Generate token** button.

5.  **⚠️ CRITICAL:** You will see a string starting with `ghp_...`.  
    **Copy this code now.** You will never see it again after you leave this page.

---

## 🔐 Phase 2: Add the Token to Your Repository (The "Lock")

Now we store that key securely in your repository settings so the automated workflow can use it.

### Option A: The Easy Way (Command Line)
Since you have the `gh` CLI tool installed, run this single command in your terminal (paste your copied token where indicated):

```bash
gh secret set JULES_GITHUB_TOKEN --body "PASTE_YOUR_GHP_TOKEN_HERE"
```

### Option B: The Manual Way (Website UI)

1.  **Click this direct link** to go to your repository's secret settings:  
    👉 [**qklipto Actions Secrets**](https://github.com/traikdude/qklipto/settings/secrets/actions)

2.  Look for the button labeled **"New repository secret"** (usually green, top right of the "Repository secrets" section). Click it.

3.  **Fill in the details:**
    *   **Name:** `JULES_GITHUB_TOKEN`  
        *(Must be exactly this, all capitals)*
    *   **Secret:** Paste the `ghp_...` code you copied in Phase 1.

4.  Click **Add secret**.

---

## 🚀 Phase 3: Run the Analysis

You are done! The setup is complete.

1.  **To start it immediately:** Run this command in your terminal:
    ```bash
    gh workflow run jules.yml
    ```

2.  **To view progress:**
    *   Go to the **[Actions Tab](https://github.com/traikdude/qklipto/actions)** on your repository.
    *   You will see a workflow named "Jules CI" running.
    *   Click on it to see the live logs and the final report.