# How to Contribute

Thank you for your interest in contributing to this project! Please follow these guidelines to ensure a smooth contribution process.

## 1. Fork the Repository
First, fork this repository to your personal GitHub account by clicking the "Fork" button at the top right of the repository page.

## 2. Clone the Repository
Clone your forked repository to your local machine:

```bash
git clone https://github.com/<your-username>/<project-name>.git
cd <project-name>
```

## 3. Configure Upstream Remote
It is recommended to set up the original repository as an `upstream` remote. This allows you to keep your local repository in sync with the main project.

Check your current remotes:
```bash
git remote -v
```

If you don't see `upstream`, add it:
```bash
git remote add upstream https://github.com/<original-owner>/<project-name>.git
```

## 4. Create a New Branch
Always create a new branch for your changes. Do not work directly on `main`.

```bash
git checkout -b <your-branch-name>
```

## 5. Make Changes
Make the necessary changes to solve the issue or implement the feature you are working on.

*   **Environment Variables:** Store environmental keys and secrets in a `.env` file.
*   **Git Ignore:** Ensure unnecessary files (like `.env`, logs, build artifacts) are listed in `.gitignore`.

## 6. Commit Changes
Stage and commit your changes. Please write a descriptive commit message that explains *what* changed and *why*.

```bash
git add .
git commit -m "Brief summary of changes"
```

## 7. Push to GitHub
Push your branch to your forked repository:

```bash
git push origin <your-branch-name>
```

## 8. Create a Pull Request
1.  Navigate to your forked repository on GitHub.
2.  Click the "Compare & pull request" button.
3.  Write a clear title and description for your Pull Request (PR), outlining the changes you have made.
4.  Submit the PR for review.

## Syncing with Upstream
To update your local branch with the latest changes from the original repository:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```
