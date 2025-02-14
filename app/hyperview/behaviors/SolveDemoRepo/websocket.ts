import * as Dom from "hyperview/src/services/dom"
import { parseHxmlFragment } from "../WebSocket/parser"
import { WebSocketWrapper } from "../WebSocket/wrapper"

import type { HvGetRoot, HvUpdateRoot } from 'hyperview';

class SolveDemoRepoWebSocket {
  private static instance: SolveDemoRepoWebSocket;
  private ws: WebSocketWrapper | null = null;
  private streamTarget: Element | null = null;
  private getRoot: HvGetRoot | null = null;
  private updateRoot: HvUpdateRoot | null = null;
  private contentElement: Element | null = null;

  private constructor() { }

  static getInstance(): SolveDemoRepoWebSocket {
    if (!SolveDemoRepoWebSocket.instance) {
      SolveDemoRepoWebSocket.instance = new SolveDemoRepoWebSocket();
    }
    return SolveDemoRepoWebSocket.instance;
  }

  private initializeContainer(target: Element) {
    console.log('[SolveDemoRepo] Initializing container');
    const containerHtml = `
      <view xmlns="https://hyperview.org/hyperview" id="deepseek-output" style="deepseekOutput">
        <text style="deepseekText">Analysis Progress:</text>
        <text id="stream-content" style="deepseekChunk"></text>
      </view>
    `;
    try {
      parseHxmlFragment(containerHtml, target, 'replace');
      console.log('[SolveDemoRepo] Container initialized successfully');
      return target;
    } catch (error) {
      console.error('[SolveDemoRepo] Error initializing container:', error);
      throw error;
    }
  }

  private findOrCreateContentElement(): Element | null {
    if (!this.getRoot || !this.streamTarget) return null;

    const root = this.getRoot();
    if (!root) return null;

    let content = Dom.getElementById(root, 'stream-content');
    if (!content) {
      console.log('[SolveDemoRepo] Content element not found, initializing container');
      this.initializeContainer(this.streamTarget);
      content = Dom.getElementById(root, 'stream-content');
    }
    return content;
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

        console.log('[SolveDemoRepo] Found stream target');
        this.streamTarget = target;
        this.contentElement = this.findOrCreateContentElement();
      }

      return !!this.streamTarget && !!this.contentElement;
    } catch (error) {
      console.error('[SolveDemoRepo] Error in ensureStreamTarget:', error);
      return false;
    }
  }

  private extractContent(xmlString: string): string | null {
    try {
      // Look for content in stream-content element
      const match = xmlString.match(/<text[^>]*id="stream-content"[^>]*>(.*?)<\/text>/s);
      if (match && match[1]) {
        return match[1];
      }
      return null;
    } catch (error) {
      console.error('[SolveDemoRepo] Error extracting content:', error);
      return null;
    }
  }

  private updateContent(data: string) {
    console.log('[SolveDemoRepo] Attempting to update content');

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
      const content = this.extractContent(data);
      if (content !== null) {
        // Create update XML
        const updateXml = `
          <text xmlns="https://hyperview.org/hyperview"
                id="stream-content"
                style="deepseekChunk">${content}</text>
        `;

        // Update the content element
        if (this.contentElement) {
          parseHxmlFragment(updateXml, this.contentElement, 'replace');
          this.updateRoot(root, true);
        }
      }
    } catch (error) {
      console.error('[SolveDemoRepo] Error updating content:', error);
      this.showError(error instanceof Error ? error.message : 'Error updating content');
    }
  }

  initialize(
    wsUrl: string,
    streamTargetId: string,
    getRoot: HvGetRoot,
    updateRoot: HvUpdateRoot
  ) {
    console.log('[SolveDemoRepo] Initializing WebSocket manager');
    this.getRoot = getRoot;
    this.updateRoot = updateRoot;

    if (!this.ws) {
      console.log('[SolveDemoRepo] Creating new WebSocket connection');
      this.ws = new WebSocketWrapper(wsUrl);

      this.ws.on('message', (data: string) => {
        console.log('[SolveDemoRepo] Received message:', data);
        try {
          this.updateContent(data);
        } catch (error) {
          console.error('[SolveDemoRepo] Error handling WebSocket message:', error);
          this.showError(error instanceof Error ? error.message : 'Unknown error');
        }
      });

      this.ws.on('open', () => {
        console.log('[SolveDemoRepo] WebSocket connection opened');
      });

      this.ws.on('close', () => {
        console.log('[SolveDemoRepo] WebSocket connection closed');
      });

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
      if (this.contentElement) {
        const errorXml = `
          <text xmlns="https://hyperview.org/hyperview"
                id="stream-content"
                style="deepseekChunk">Error: ${message}</text>
        `;
        parseHxmlFragment(errorXml, this.contentElement, 'replace');
        if (this.getRoot) {
          this.updateRoot?.(this.getRoot(), true);
        }
      }
    } catch (error) {
      console.error('[SolveDemoRepo] Failed to show error:', error);
    }
  }

  sendSolveCommand() {
    console.log('[SolveDemoRepo] Sending solve command');
    if (this.ws) {
      if (this.ensureStreamTarget() && this.contentElement) {
        // Clear existing content
        const clearXml = `
          <text xmlns="https://hyperview.org/hyperview"
                id="stream-content"
                style="deepseekChunk"></text>
        `;
        parseHxmlFragment(clearXml, this.contentElement, 'replace');
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
    this.contentElement = null;
    this.getRoot = null;
    this.updateRoot = null;
  }
}

export const wsManager = SolveDemoRepoWebSocket.getInstance();
