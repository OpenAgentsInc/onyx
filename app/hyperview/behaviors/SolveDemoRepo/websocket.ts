import * as Dom from "hyperview/src/services/dom"
import { parseHxmlFragment } from "../WebSocket/parser"
import { WebSocketWrapper } from "../WebSocket/wrapper"

import type { HvGetRoot, HvUpdateRoot } from 'hyperview';

// Singleton instance to manage the WebSocket connection
class SolveDemoRepoWebSocket {
  private static instance: SolveDemoRepoWebSocket;
  private ws: WebSocketWrapper | null = null;
  private streamTarget: Element | null = null;
  private getRoot: HvGetRoot | null = null;
  private updateRoot: HvUpdateRoot | null = null;
  private messageCounter: number = 0;  // Add counter for unique keys

  private constructor() { }

  static getInstance(): SolveDemoRepoWebSocket {
    if (!SolveDemoRepoWebSocket.instance) {
      SolveDemoRepoWebSocket.instance = new SolveDemoRepoWebSocket();
    }
    return SolveDemoRepoWebSocket.instance;
  }

  private initializeListContainer(target: Element) {
    console.log('[SolveDemoRepo] Initializing list container');
    const listHxml = `
      <list xmlns="https://hyperview.org/hyperview">
        <section-list>
          <section>
            <items id="solve-demo-items">
            </items>
          </section>
        </section-list>
      </list>
    `;
    try {
      parseHxmlFragment(listHxml, target, 'replace');
      console.log('[SolveDemoRepo] List container initialized successfully');
      return target;
    } catch (error) {
      console.error('[SolveDemoRepo] Error initializing list container:', error);
      throw error;
    }
  }

  private findItemsContainer(): Element | null {
    if (!this.getRoot || !this.streamTarget) return null;

    const root = this.getRoot();
    if (!root) return null;

    const items = Dom.getElementById(root, 'solve-demo-items');
    return items || null;
  }

  private ensureStreamTarget(): boolean {
    if (!this.getRoot) {
      console.warn('[SolveDemoRepo] getRoot is not initialized');
      return false;
    }

    try {
      if (!this.streamTarget) {
        const root = this.getRoot();
        if (!root) {
          console.warn('[SolveDemoRepo] Root element not found');
          return false;
        }

        const target = Dom.getElementById(root, 'solve-demo-output');
        if (!target) {
          console.warn('[SolveDemoRepo] Stream target not found');
          return false;
        }

        console.log('[SolveDemoRepo] Found stream target, initializing list container');
        this.streamTarget = this.initializeListContainer(target);
        console.log('[SolveDemoRepo] Stream target initialized:', !!this.streamTarget);
      }

      return !!this.streamTarget;
    } catch (error) {
      console.error('[SolveDemoRepo] Error in ensureStreamTarget:', error);
      return false;
    }
  }

  private appendMessage(data: string) {
    console.log('[SolveDemoRepo] Attempting to append message');

    if (!this.ensureStreamTarget()) {
      console.error('[SolveDemoRepo] Failed to ensure stream target');
      return;
    }

    if (!this.updateRoot || !this.getRoot) {
      console.error('[SolveDemoRepo] updateRoot or getRoot not initialized');
      return;
    }

    const root = this.getRoot();
    if (!root) {
      console.error('[SolveDemoRepo] Root element not found');
      return;
    }

    try {
      // Find the items container using getElementById instead of querySelector
      const items = this.findItemsContainer();
      if (!items) {
        console.warn('[SolveDemoRepo] Items container not found, reinitializing');
        if (this.streamTarget) {
          this.streamTarget = this.initializeListContainer(this.streamTarget);
          return this.appendMessage(data); // Try again after reinitializing
        } else {
          console.error('[SolveDemoRepo] Stream target is null during reinitialization');
          return;
        }
      }

      console.log('[SolveDemoRepo] Appending message to list');
      // Increment counter and use it as a unique key
      this.messageCounter++;
      // Wrap incoming message in an item with a unique key
      const wrappedData = `
        <item xmlns="https://hyperview.org/hyperview" key="msg-${this.messageCounter}">
          ${data}
        </item>
      `;
      parseHxmlFragment(wrappedData, items, 'append');
      this.updateRoot(root, true);
    } catch (error) {
      console.error('[SolveDemoRepo] Error in appendMessage:', error);
      this.showError(error instanceof Error ? error.message : 'Error appending message');
    }
  }

  initialize(
    wsUrl: string,
    streamTargetId: string,
    getRoot: HvGetRoot,
    updateRoot: HvUpdateRoot
  ) {
    console.log('[SolveDemoRepo] Initializing WebSocket manager');
    // Store root access functions
    this.getRoot = getRoot;
    this.updateRoot = updateRoot;

    // Only initialize if not already connected
    if (!this.ws) {
      console.log('[SolveDemoRepo] Creating new WebSocket connection');
      this.ws = new WebSocketWrapper(wsUrl);

      // Set up message handler for streaming updates
      this.ws.on('message', (data: string) => {
        console.log('[SolveDemoRepo] Received message:', data);
        try {
          this.appendMessage(data);
        } catch (error) {
          console.error('[SolveDemoRepo] Error handling WebSocket message:', error);
          this.showError(error instanceof Error ? error.message : 'Unknown error');
        }
      });

      // Handle connection events
      this.ws.on('open', () => {
        console.log('[SolveDemoRepo] WebSocket connection opened');
      });

      this.ws.on('close', () => {
        console.log('[SolveDemoRepo] WebSocket connection closed');
      });

      // Handle connection errors
      this.ws.on('auth_error', (error) => {
        console.error('[SolveDemoRepo] WebSocket auth error:', error);
        this.showError('Authentication failed. Please try again.');
      });

      this.ws.on('error', (error) => {
        console.error('[SolveDemoRepo] WebSocket error:', error);
        this.showError('Connection error. Please try again.');
      });
    } else {
      console.log('[SolveDemoRepo] Using existing WebSocket connection');
    }
  }

  private showError(message: string) {
    console.log('[SolveDemoRepo] Showing error:', message);
    try {
      // Include unique key for error messages too
      this.messageCounter++;
      this.appendMessage(`
        <view style="error-message" key="error-${this.messageCounter}">
          <text style="error-text">${message}</text>
        </view>
      `);
    } catch (error) {
      console.error('[SolveDemoRepo] Failed to show error:', error);
    }
  }

  sendSolveCommand() {
    console.log('[SolveDemoRepo] Sending solve command');
    if (this.ws) {
      // Reset message counter when starting new solve command
      this.messageCounter = 0;
      // Ensure stream target is initialized
      if (this.ensureStreamTarget()) {
        // Clear the list by reinitializing
        this.streamTarget = this.initializeListContainer(this.streamTarget!);
      }

      const message = {
        type: 'solve_demo_repo',
        timestamp: new Date().toISOString()
      };
      console.log('[SolveDemoRepo] Sending message:', message);
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('[SolveDemoRepo] WebSocket not initialized');
      this.showError('Connection not initialized. Please try again.');
    }
  }

  cleanup() {
    console.log('[SolveDemoRepo] Cleaning up WebSocket connection');
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.streamTarget = null;
    this.getRoot = null;
    this.updateRoot = null;
  }
}

export const wsManager = SolveDemoRepoWebSocket.getInstance();
