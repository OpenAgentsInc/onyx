# File Documentation

This document provides a comprehensive overview of all key files in the project and their purposes.

## Core Files

### App Root
- `src/app.tsx` - Root application component handling navigation and global state

### Components
- `src/components/Badge.tsx` - Status indicator badge component
- `src/components/Button.tsx` - Reusable button component with consistent styling
- `src/components/Card.tsx` - Container component for grouped content
- `src/components/Checkbox.tsx` - Interactive checkbox input component
- `src/components/DataTable.tsx` - Data display component for tabular information
- `src/components/RadioButtonGroup.tsx` - Group of radio button inputs
- `src/components/TextArea.tsx` - Multi-line text input component

### Chat Screen
- `src/screens/Chat/ChatContainer.tsx` - Main chat interface container and orchestrator
- `src/screens/Chat/constants.ts` - Model configurations and chat constants

#### Chat Components
- `src/screens/Chat/components/Bubble.tsx` - Individual chat message display component
- `src/screens/Chat/components/DownloadScreen.tsx` - Model download interface and progress
- `src/screens/Chat/components/LoadingIndicator.tsx` - Loading state overlay component
- `src/screens/Chat/components/ModelFileManager.tsx` - Model management modal interface

#### Chat Hooks
- `src/screens/Chat/hooks/useChatHandlers.ts` - Chat message and command handling logic
- `src/screens/Chat/hooks/useModelContext.ts` - Model context and state management
- `src/screens/Chat/hooks/useModelInitialization.ts` - Model initialization flow logic

#### Chat Utils
- `src/screens/Chat/utils/index.ts` - Chat-specific utility functions

### State Management
- `src/store/useModelStore.ts` - Zustand store for model state management, handling:
  - Model selection
  - Download state
  - Initialization state
  - Error handling
  - Progress tracking

### Theme Configuration
- `src/theme/chat.ts` - Chat-specific styling configuration
- `src/theme/colors.ts` - Global color palette definitions
- `src/theme/typography.ts` - Typography and font configurations

### Utilities
- `src/utils/ModelDownloader.ts` - Model download and file management utility

## Documentation Files

### System Documentation
- `docs/hierarchy.md` - Project structure and architectural overview
- `docs/local-models.md` - Model management system documentation
- `docs/file-documentation.md` - This file - comprehensive file documentation

## Key Responsibilities

### Model Management
- `useModelStore.ts` - Central state management
- `ModelDownloader.ts` - File download handling
- `ModelFileManager.tsx` - User interface for model management
- `useModelContext.ts` - Model context management
- `useModelInitialization.ts` - Model initialization flow

### Chat Interface
- `ChatContainer.tsx` - Main chat interface
- `Bubble.tsx` - Message display
- `useChatHandlers.ts` - Message processing

### UI Components
- `Badge.tsx` - Status indicators
- `Button.tsx` - Action triggers
- `Card.tsx` - Content grouping
- `LoadingIndicator.tsx` - Loading states

## State Flow

### Model States
1. `idle` - No active model/waiting for action
2. `downloading` - Model file being downloaded
3. `initializing` - Model being loaded into memory
4. `ready` - Model active and ready for use
5. `error` - Error state with message
6. `releasing` - Cleaning up model resources

### Download Flow
1. User selects model → `idle` → `downloading`
2. Download completes → `downloading` → `initializing`
3. Initialization done → `initializing` → `ready`
4. Error occurs → any state → `error`

### Model Switching
1. Select new model → `ready` → `releasing`
2. Cleanup complete → `releasing` → `idle`
3. Start new model → `idle` → `initializing`
4. Load complete → `initializing` → `ready`

## Error Handling

### Key Error Points
- Download interruption
- File validation failure
- Initialization errors
- Context release issues
- Storage problems
- Network failures

### Error Recovery
- Automatic cleanup of partial downloads
- Clear error messages
- Retry mechanisms
- Resource cleanup
- State reset capabilities

## File Management

### Storage Locations
- Models stored in app cache directory
- Temporary download location
- Permanent model storage

### File Operations
- Download validation
- Size verification
- Model validation
- Cleanup procedures
- Safe file moves

## Best Practices

### Code Organization
1. Component-specific logic in hooks
2. Shared utilities in utils directory
3. Clear state management in store
4. Consistent styling in theme

### Error Handling
1. Clear error messages
2. Proper cleanup
3. Recovery paths
4. State validation

### State Management
1. Single source of truth
2. Clear state transitions
3. Persistent storage
4. Error recovery

### UI/UX
1. Loading indicators
2. Progress tracking
3. Clear error messages
4. Consistent styling