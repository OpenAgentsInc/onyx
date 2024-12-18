# App Directory Structure

```
onyx/
├── app/                              # Main application directory
│   ├── _layout.tsx                   # Root layout with font loading and navigation setup
│   └── index.tsx                     # Main screen with drone sightings dashboard
│
├── assets/                           # Static assets directory
│   └── images/                       # Image assets
│       └── icon.png                  # App icon
│
├── components/                       # Reusable UI components
│   ├── Button.tsx                    # Sacred-inspired button with primary/secondary themes
│   └── Card.tsx                      # Sacred-inspired card with title and content sections
│
├── docs/                            # Documentation directory
│   ├── hierarchy.md                  # This file - directory structure documentation
│   └── srcl.md                       # Sacred Component Library integration guide
│
├── lib/                             # Utility functions and hooks
│   └── useAutoUpdate.ts              # Hook for handling OTA updates
│
├── theme/                           # Theme configuration
│   └── typography.ts                 # Font definitions and typography settings
│
├── app.json                         # Expo app configuration
├── package.json                     # Project dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # Project overview and setup instructions
```

## Key Directories

### /app
The main application directory using Expo Router's file-based routing system. Each file corresponds to a route in the app.

### /assets
Static assets like images, fonts, and other media files. Assets here are automatically included in the app bundle.

### /components
Reusable UI components, primarily adapted from the Sacred Component Library. Each component is self-contained with its styles and types.

### /docs
Project documentation including:
- Component integration guides
- Directory structure
- Best practices
- Setup instructions

### /lib
Utility functions, custom hooks, and shared logic that can be used across the app.

### /theme
Theme-related configuration including typography, colors, and other design tokens.

## Key Files

### Root Files
- `app.json` - Expo configuration including name, version, and platform-specific settings
- `package.json` - Project dependencies, scripts, and metadata
- `tsconfig.json` - TypeScript compiler configuration
- `README.md` - Project overview and getting started guide

### App Files
- `app/_layout.tsx` - Root layout component handling navigation and font loading
- `app/index.tsx` - Main screen component with drone sightings dashboard

### Component Files
- `components/Button.tsx` - Reusable button component with multiple themes
- `components/Card.tsx` - Card component for displaying grouped content

### Theme Files
- `theme/typography.ts` - Font family definitions and typography configuration

### Utility Files
- `lib/useAutoUpdate.ts` - Hook for handling over-the-air updates

## Future Directories

As the app grows, we may add:

```
onyx/
├── api/                             # API integration and data fetching
├── contexts/                        # React Context providers
├── hooks/                           # Custom React hooks
├── types/                           # TypeScript type definitions
├── utils/                           # Utility functions
└── store/                          # State management
```

## Adding New Files

When adding new files:
1. Place components in `/components`
2. Place hooks in `/lib` or future `/hooks` directory
3. Place types in component files or future `/types` directory
4. Place documentation in `/docs`
5. Update this hierarchy document accordingly