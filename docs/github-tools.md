# GitHub Tools Integration

Onyx supports integration with GitHub through a set of tools that allow the AI to read files and navigate repositories. This document explains how to set up and use these features.

## Available Tools

The AI has access to two GitHub-related tools:

1. `view_file` - View the contents of a file in a GitHub repository
2. `view_folder` - List the contents of a directory in a GitHub repository

## Configuration

### Setting up GitHub Token

To use the GitHub tools, you need to provide a GitHub Personal Access Token. This can be done through the Configure modal:

1. Tap the Configure button (gear icon) in the bottom toolbar
2. In the Configure modal, find the "GitHub Token" section
3. Enter your GitHub Personal Access Token
4. Tap Save

The token is stored securely in the app's state management system and will be used for all GitHub-related operations.

### Enabling/Disabling Tools

You can toggle the AI's access to tools:

1. Open the Configure modal
2. Find the "Tools" section
3. Tap the toggle button to enable/disable tools
4. Tap Save

When tools are disabled, the AI will not have access to GitHub operations.

## Using GitHub Tools

Once configured, you can ask the AI to:

- View specific files: "Show me the README.md file from repository X"
- List directory contents: "What files are in the src directory of repository Y?"
- Navigate codebases: "Help me understand the structure of repository Z"

The AI will automatically use the appropriate tool to fulfill your request.

## Technical Implementation

### Store Integration

The GitHub token and tools state are managed in the ChatStore:

```typescript
export const ChatStoreModel = types
  .model("ChatStore")
  .props({
    githubToken: types.optional(types.string, ""),
    toolsEnabled: types.optional(types.boolean, true),
  })
  .actions((self) => ({
    setGithubToken(token: string) {
      self.githubToken = token
    },
    setToolsEnabled(enabled: boolean) {
      self.toolsEnabled = enabled
    }
  }))
```

### Request Format

When making requests to the AI, the app includes the GitHub token and tools configuration:

```typescript
const chatConfig = {
  body: {
    ...(toolsEnabled && {
      githubToken,
      tools: ["view_file", "view_folder"]
    })
  }
}
```

### UI Components

The configuration interface is implemented in the ConfigureModal component, which provides:

- Secure token input field
- Tools toggle switch
- Save/Cancel functionality

## Security Considerations

- The GitHub token is stored only in memory and app state
- Token input uses secure text entry
- Token is never displayed after entry
- Tools can be disabled to prevent unintended GitHub access

## Best Practices

1. Use a GitHub token with minimal required permissions
2. Enable tools only when needed
3. Monitor the AI's tool usage through the chat interface
4. Clear tokens when switching users or logging out

## Troubleshooting

Common issues and solutions:

1. **Tools not working**
   - Check if tools are enabled in Configure modal
   - Verify GitHub token is entered correctly
   - Ensure token has required permissions

2. **Cannot access private repositories**
   - Verify token has private repository access
   - Check repository name and owner are correct

3. **Token not saving**
   - Make sure to tap Save after entering token
   - Check for any error messages
   - Verify app has necessary storage permissions

## Future Enhancements

Planned improvements to the GitHub tools integration:

1. Support for writing files and creating pull requests
2. Repository search functionality
3. Commit history viewing
4. Issue and PR management
5. Token permission scope visualization
6. Multiple token management for different repositories