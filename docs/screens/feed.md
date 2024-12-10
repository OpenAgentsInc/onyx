# Onyx App: Feed Screen Documentation

## Overview
The Feed screen is the primary hub for users to interact with available tasks, community posts, and updates. It integrates data from decentralized protocols like Nostr to create a dynamic and engaging experience. The Feed screen is designed to balance usability and information density, ensuring users can quickly find and act on relevant tasks or content.

---

## Key Features
1. **Task Cards**:
   - Displays a list of tasks available for completion.
   - Each card includes:
     - Task title and brief description.
     - Reward in satoshis (Bitcoin).
     - Difficulty level or time estimate.
     - A button to "Start Task" or delegate it to the AI agent.

2. **Community Posts**:
   - Shows tagged posts and comments from the Nostr network.
   - Focuses on relevant and user-engaging content.
   - Allows users to interact with posts (like, comment, or share).

3. **Dynamic Filtering**:
   - Users can filter content by:
     - Task type (e.g., microtasks, AI agent tasks).
     - Reward amount.
     - Most recent or popular community posts.

4. **Real-Time Updates**:
   - Utilizes WebSocket connections (via Nostr) to update feed items in real-time.

5. **Visual Hierarchy**:
   - Tasks are prioritized over posts.
   - Featured or trending tasks are highlighted at the top.

---

## Layout Design
### Header Section:
- **Search Bar**:
  - Enables users to search for tasks, posts, or keywords.
- **Filter Button**:
  - Opens a side panel with advanced filtering options.
- **Notification Icon**:
  - Shows updates on new tasks, comments, or interactions.

### Main Content:
- **Task Feed**:
  - A vertical scroll of task cards with actionable buttons.
  - Cards include:
    - Icon or image (if applicable).
    - Title, description, and reward amount.
    - Progress indicator for ongoing tasks.
- **Community Feed**:
  - Nested below tasks or accessible via tabs.
  - Includes posts, discussions, and tagged content from Nostr.
  - Displays user avatars, timestamps, and engagement stats (likes/comments).

### Footer Section:
- **Fixed Action Button**:
  - Large button for starting new recordings or quick access to the microphone feature.
  - Positioned centrally for easy reach.

---

## User Interactions
### Tasks:
1. **View Task Details**:
   - Tap a task card to open a detailed view.
   - Includes full instructions, reward details, and an option to accept the task.
2. **Start Task**:
   - Immediately begin the task by tapping the "Start Task" button.
   - The task moves to an "Active Tasks" section.

### Community Posts:
1. **Like/Comment**:
   - Tap on engagement icons to interact with posts.
2. **Expand Content**:
   - Tap a post to see full details, including comments and metadata.

### Filters:
- **Apply Filters**:
  - Adjust feed content to focus on specific tasks or community topics.
- **Clear Filters**:
  - Reset filters to see the full feed again.

---

## Nostr Integration
- **Tagging**:
  - Relevant posts are tagged with keywords to align with user interests.
- **Moderation**:
  - Onyx uses AI to flag inappropriate or irrelevant posts while maintaining decentralization.

---

## Visual Style
- **Color Palette**:
  - Neutral tones for background.
  - Highlight colors for task rewards and actionable items.
- **Typography**:
  - Bold headers for task titles.
  - Smaller, readable fonts for descriptions and metadata.

---

## Performance Considerations
- **Caching**:
  - Frequently accessed tasks and posts are cached for offline access.
- **Lazy Loading**:
  - Content is loaded incrementally as users scroll down.
- **Optimization**:
  - Images and media are compressed to reduce load times.

---

## Future Enhancements
1. **Gamification Elements**:
   - Add streaks or badges for task completion milestones.
2. **Enhanced AI Agent Integration**:
   - Display suggestions for tasks that match user behavior or history.
3. **Community Engagement Features**:
   - Introduce polls or voting mechanisms for posts.

---

## Conclusion
The Feed screen is the cornerstone of the Onyx app, combining task discovery and community engagement. It leverages decentralized technologies and modern UI/UX principles to provide a seamless and rewarding user experience.
