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

### Legacy Token Support
For backward compatibility, the system maintains support for existing tokens:

- **Legacy Migration**: If you had a token before the multi-token update:
  - Your token is automatically migrated as "Legacy Token"
  - It remains active and functional
  - You can continue using the old token or add new ones
  
- **Token Synchronization**:
  - The system maintains both old and new token storage
  - Changes to the legacy token update the new system
  - Changes to the active token in the new system update the legacy token
  - This ensures smooth transition and no disruption to existing functionality

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
   - Consider migrating legacy tokens to named tokens for better organization

2. **Repository Organization**:
   - Keep the repository list focused on active projects
   - Remove repositories when no longer needed
   - Use consistent branch naming conventions

3. **Security**:
   - Never commit tokens to repositories
   - Review token permissions regularly
   - Revoke compromised tokens immediately
   - Use read-only tokens when possible

## Technical Implementation

### Token Storage System
The coder uses a dual storage system for tokens:

1. **Legacy Storage**:
   - Maintains a single token field for backward compatibility
   - Automatically syncs with the active token in the new system
   - Ensures existing integrations continue to work

2. **New Token System**:
   - Stores multiple named tokens
   - Each token has a unique ID, name, and value
   - Supports selecting an active token
   - Automatically migrates legacy tokens

3. **Synchronization**:
   - When setting an active token, updates legacy storage
   - When updating legacy token, updates or creates token in new system
   - Maintains consistency between both systems
   - Handles token removal and updates in both systems

## Troubleshooting

Common issues and solutions:

1. **Token Issues**:
   - Verify token has required permissions
   - Check token hasn't expired
   - Ensure token is active in GitHub settings
   - For legacy tokens, try removing and re-adding as a named token

2. **Repository Access**:
   - Confirm repository exists and is accessible
   - Check branch name is correct
   - Verify token has access to the repository

3. **Tool Problems**:
   - Ensure required token permissions are granted
   - Check if repository is properly connected
   - Verify active token and repository are set

4. **Migration Issues**:
   - If legacy token isn't showing up, try re-entering it
   - If new tokens aren't working, check active token selection
   - Verify both legacy and new token storage are properly synced