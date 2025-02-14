import { HvBehavior } from "hyperview"
import Config from "@/config"
import { wsManager } from "./websocket"

export const SolveDemoRepoBehavior: HvBehavior = {
  action: 'solve-demo-repo',
  callback: async (behaviorElement, onUpdate, getRoot, updateRoot) => {
    console.log('[SolveDemoRepo] Behavior triggered. Connecting to:', Config.WS_URL);

    // Initialize WebSocket with stream target
    wsManager.initialize(
      Config.WS_URL || '',
      'solve-demo-output', // ID where stream updates will appear
      getRoot,
      updateRoot
    );

    // Send the solve command
    wsManager.sendSolveCommand();
  },
};
