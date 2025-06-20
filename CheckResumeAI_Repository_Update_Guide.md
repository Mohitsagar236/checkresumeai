# CheckResumeAI Repository Update Guide

This guide explains how to keep your CheckResumeAI repository updated with the latest changes.

## Automated Update Process

I've created an automated script to help you keep your repository updated:

### Using the Auto-Commit Script

1. After making changes to any files in the workspace, run:
   ```powershell
   .\auto-commit-and-deploy.ps1
   ```

2. The script will:
   - Check for changes in both the main and project repositories
   - Prompt you to enter commit messages for each repository with changes
   - Offer to push changes to the remote GitHub repository
   - Optionally deploy to Vercel
   - Optionally verify routes after deployment

### When to Run the Script

Run the script:
- After making configuration changes (like updating vercel.json)
- After adding new features or fixing bugs
- After creating or modifying policy documents

## Manual Update Process

If you prefer to update the repository manually:

### For the project directory (e.g., after changing vercel.json):

```powershell
cd "e:\Downloads\AI-Powered Resume Analyzer SaaS\project"
git add vercel.json
git commit -m "Your descriptive commit message here"
git push
```

### For the main directory (e.g., after adding policy files):

```powershell
cd "e:\Downloads\AI-Powered Resume Analyzer SaaS"
git add CheckResumeAI_*.md
git commit -m "Your descriptive commit message here"
git push
```

## Best Practices for Repository Updates

1. **Commit Frequently**: Make small, focused commits rather than large ones
2. **Write Clear Commit Messages**: Clearly describe what changes you made
3. **Test Before Committing**: Ensure your changes work before committing them
4. **Update Documentation**: Keep documentation up-to-date with code changes
5. **Check Status Regularly**: Run `git status` to see what files have changed

## Deployment After Updates

After pushing changes to GitHub:

1. If you've connected Vercel to your GitHub repository, it will automatically deploy when you push changes
2. To manually deploy, run:
   ```powershell
   cd "e:\Downloads\AI-Powered Resume Analyzer SaaS\project"
   vercel --prod
   ```

3. After deployment, verify your SPA routing is working using:
   ```powershell
   .\verify-spa-routing.ps1
   ```

By following these practices, you'll keep your repository up-to-date and your deployment process smooth.
