# New Navigation Spec

We're converting the BottomButtons component into a Stack Navigator. This document outlines the planned changes.

**Current Implementation:**
The BottomButtons component currently uses a tab-based navigation approach.  Each tab corresponds to a different section within the app.

**Proposed Changes:**
Replace the tab-based navigation with a Stack Navigator. This will allow for a more flexible navigation flow and enable features like nested screens and modal presentations.

**Technical Details:**

* **Library:**  React Navigation's Stack Navigator will be used.
* **Components Affected:** BottomButtons.tsx, and potentially other components that interact with the navigation.
* **Screens:** Each existing tab will be converted into a separate screen within the stack.
* **Navigation Logic:** The navigation logic will be updated to use the Stack Navigator's API (push, pop, navigate).

**Benefits:**

* Improved navigation flow.
* Support for nested screens.
* Easier implementation of modal screens.
* More consistent user experience.

**Next Steps:**

1. Implement the Stack Navigator in the BottomButtons component.
2. Update the navigation logic in related components.
3. Test the new navigation thoroughly.
