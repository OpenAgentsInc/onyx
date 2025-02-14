import * as Dom from "hyperview/src/services/dom"
import { parseHxmlFragment } from "../WebSocket/parser"
import { WebSocketWrapper } from "../WebSocket/wrapper"

import type { HvGetRoot, HvUpdateRoot } from 'hyperview';

interface SolveResponse {
  type: 'progress' | 'error' | 'complete';
  message: string;
  data?: any;
}

// Singleton instance to manage the WebSocket connection
class SolveDemoRepoWebSocket {
  private static instance: SolveDemoRepoWebSocket;
  private ws: WebSocketWrapper | null = null;
  private streamTarget: Element | null = null;
  private getRoot: HvGetRoot | null = null;
  private updateRoot: HvUpdateRoot | null = null;

  private constructor() { }

  static getInstance(): SolveDemoRepoWebSocket {
    if (!SolveDemoRepoWebSocket.instance) {
      SolveDemoRepoWebSocket.instance = new SolveDemoRepoWebSocket();
    }
    return SolveDemoRepoWebSocket.instance;
  }

  initialize(
    wsUrl: string,
    streamTargetId: string,
    getRoot: HvGetRoot,
    updateRoot: HvUpdateRoot
  ) {
    // Store root access functions
    this.getRoot = getRoot;
    this.updateRoot = updateRoot;

    // Only initialize if not already connected
    if (!this.ws) {
      this.ws = new WebSocketWrapper(wsUrl);

      // Set up message handler for streaming updates
      this.ws.on('message', (data: string) => {
        try {
          const response = JSON.parse(data) as SolveResponse;

          // Generate appropriate HXML based on message type
          let hxml = '';
          switch (response.type) {
            case 'progress':
              hxml = `
                <view style="progress-update">
                  <text style="progress-text">${response.message}</text>
                  ${response.data ? `<text style="progress-data">${JSON.stringify(response.data)}</text>` : ''}
                </view>
              `;
              break;

            case 'error':
              hxml = `
                <view style="error-message">
                  <text style="error-text">${response.message}</text>
                  ${response.data ? `<text style="error-details">${JSON.stringify(response.data)}</text>` : ''}
                </view>
              `;
              break;

            case 'complete':
              hxml = `
                <view style="completion-message">
                  <text style="complete-text">${response.message}</text>
                  ${response.data ? `<text style="complete-details">${JSON.stringify(response.data)}</text>` : ''}
                </view>
              `;
              break;

            default:
              console.warn('Unknown message type:', response.type);
              return;
          }

          // Find or update stream target
          if (!this.streamTarget && this.getRoot) {
            const root = this.getRoot();
            if (root) {
              const target = Dom.getElementById(root, streamTargetId);
              if (target) {
                this.streamTarget = target;
              }
            }
          }

          // Update the UI with the new message
          if (this.streamTarget && this.updateRoot && this.getRoot) {
            const root = this.getRoot();
            if (root) {
              parseHxmlFragment(hxml, this.streamTarget, 'append');
              this.updateRoot(root, true);

              // If complete, scroll to bottom
              if (response.type === 'complete') {
                this.streamTarget.scrollIntoView({ behavior: 'smooth', block: 'end' });
              }
            }
          }
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
          // Try to display error in UI
          if (this.streamTarget && this.updateRoot && this.getRoot) {
            const root = this.getRoot();
            if (root) {
              const errorHxml = `
                <view style="error-message">
                  <text style="error-text">Error processing message: ${error.message}</text>
                </view>
              `;
              parseHxmlFragment(errorHxml, this.streamTarget, 'append');
              this.updateRoot(root, true);
            }
          }
        }
      });

      // Handle connection errors
      this.ws.on('auth_error', (error) => {
        console.error('WebSocket auth error:', error);
        this.showError('Authentication failed. Please try again.');
      });

      this.ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.showError('Connection error. Please try again.');
      });
    }
  }

  private showError(message: string) {
    if (this.streamTarget && this.updateRoot && this.getRoot) {
      const root = this.getRoot();
      if (root) {
        const errorHxml = `
          <view style="error-message">
            <text style="error-text">${message}</text>
          </view>
        `;
        parseHxmlFragment(errorHxml, this.streamTarget, 'append');
        this.updateRoot(root, true);
      }
    }
  }

  sendSolveCommand() {
    if (this.ws) {
      // Clear previous output
      if (this.streamTarget) {
        while (this.streamTarget.firstChild) {
          this.streamTarget.removeChild(this.streamTarget.firstChild);
        }
      }

      this.ws.send(JSON.stringify({
        type: 'solve_demo_repo',
        timestamp: new Date().toISOString()
      }));
    } else {
      console.error('WebSocket not initialized');
      this.showError('Connection not initialized. Please try again.');
    }
  }

  cleanup() {
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
