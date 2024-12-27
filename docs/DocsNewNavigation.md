# New Navigation Spec

We're introducing a Stack Navigator to manage navigation within the Onyx app. This document outlines the planned changes.

**Current Implementation:**
The BottomButtons component currently renders individual buttons for text input, voice input, accessing repos, copying conversation text, and clearing the chat history.  These buttons trigger specific actions rather than navigating between screens.

**Proposed Changes:**
Introduce a Stack Navigator to manage the overall navigation flow.  The existing functionalities of the BottomButtons component will be integrated into this new navigation structure.

**Technical Details:**

* **Library:** React Navigation's Stack Navigator will be used.
* **Components Affected:** BottomButtons.tsx, and potentially other components that handle navigation or related actions.
* **Screens:** New screens will be created for functionalities currently handled by button actions (e.g., a dedicated Repos screen, a Settings screen).
* **Navigation Logic:** The navigation logic will be updated to use the Stack Navigator's API (push, pop, navigate).  Button presses in the BottomButtons component will trigger navigation actions rather than direct function calls.

**Benefits:**

* Improved navigation structure and flow.
* Clearer separation of concerns between components.
* Enhanced user experience with consistent navigation patterns.
* Easier implementation of future features and screens.

**Next Steps:**

1. Implement the Stack Navigator in the app's main navigation structure.
2. Create new screens for functionalities currently handled by the BottomButtons component.
3. Update the BottomButtons component to trigger navigation actions.
4. Test the new navigation thoroughly.
