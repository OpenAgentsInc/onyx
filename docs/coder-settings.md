# Onyx Coder Settings

The Onyx Coder is a powerful tool that allows you to analyze and modify codebases directly through the app. This document explains the various settings and configurations available.

## GitHub Authentication

### GitHub Tokens
You can manage multiple GitHub Personal Access Tokens (PATs) in the settings:

- **Adding Tokens**: Click "Add Token" to add a new GitHub PAT
  - Provide a memorable name for the token
  - Enter the GitHub PAT
  - The token will be securely stored
  
- **Managing Tokens**:
  - **Edit**: Modify the name or token value
  - **Remove**: Delete a token from the app
  - **Active Token**: Click a token to make it active - this token will be used for GitHub operations
  - For security, tokens are displayed in truncated form (e.g., `ghp1...f4d2`)

### Creating GitHub Tokens
1. Go to GitHub Settings > Developer Settings > Personal Access Tokens
2. Generate a new token with these permissions:
   - `repo` (Full control of private repositories)
   - `read:org` (Read organization data)
   - `read:user` (Read user data)

## Repository Management

### Connected Repositories
You can connect multiple repositories to Onyx:

- **Adding Repositories**:
  - Click "Add Repo"
  - Enter:
    - Owner (GitHub username or organization)
    - Repository name
    - Branch name
  
- **Managing Repositories**:
  - **Edit**: Modify repository details
  - **Remove**: Disconnect a repository
  - **Active Repository**: Click a repository to make it active
  - The active repository is highlighted and will be the target of code operations

### Repository Structure
Each repository connection includes:
- Owner: The GitHub user or organization that owns the repo
- Name: The repository name
- Branch: The specific branch to work with

## Available Tools

The coder includes several tools that can be toggled on/off:

- **View File**: Read file contents from repositories
- **View Hierarchy**: Browse repository file structure
- **Create File**: Create new files in repositories
- **Rewrite File**: Modify existing files
- **Delete File**: Remove files from repositories
- **Post GitHub Comment**: Comment on GitHub issues
- **Fetch Commit Contents**: View file contents from specific commits
- **Scrape Webpage**: Extract content from web pages

Each tool can be enabled/disabled independently to customize the coder's capabilities.

## Usage Notes

1. **Token Security**:
   - Tokens are stored securely in the app
   - Never share or expose your GitHub tokens
   - Use tokens with minimum required permissions
   - Rotate tokens periodically for security

2. **Repository Access**:
   - The active token must have access to the repositories you connect
   - Private repositories require appropriate token permissions
   - Organization repositories may require additional permissions

3. **Branch Management**:
   - Always specify the correct branch for repository operations
   - Changes are made to the specified branch only
   - Consider using feature branches for experimental changes

4. **Tool Selection**:
   - Enable only the tools you need
   - Tools can be toggled at any time
   - Some tools may require specific token permissions

## Best Practices

1. **Token Management**:
   - Use descriptive names for tokens (e.g., "Personal Projects", "Work Repos")
   - Create separate tokens for different purposes
   - Regularly review and remove unused tokens

2. **Repository Organization**:
   - Keep the repository list focused on active projects
   - Remove repositories when no longer needed
   - Use consistent branch naming conventions

3. **Security**:
   - Never commit tokens to repositories
   - Review token permissions regularly
   - Revoke compromised tokens immediately
   - Use read-only tokens when possible

## Troubleshooting

Common issues and solutions:

1. **Token Issues**:
   - Verify token has required permissions
   - Check token hasn't expired
   - Ensure token is active in GitHub settings

2. **Repository Access**:
   - Confirm repository exists and is accessible
   - Check branch name is correct
   - Verify token has access to the repository

3. **Tool Problems**:
   - Ensure required token permissions are granted
   - Check if repository is properly connected
   - Verify active token and repository are set