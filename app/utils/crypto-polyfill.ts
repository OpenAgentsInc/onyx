import * as Crypto from 'expo-crypto';

// Define the types for the crypto polyfill
interface CryptoPolyfill {
  getRandomValues: <T extends ArrayBufferView>(array: T) => T;
  subtle?: SubtleCrypto;
  randomUUID?: () => string;
}

// Polyfill crypto.getRandomValues
if (typeof crypto === 'undefined') {
  const cryptoPolyfill: CryptoPolyfill = {
    getRandomValues: <T extends Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array>(array: T): T => {
      const randomBytes = Crypto.getRandomValues(array);
      if (randomBytes && 'set' in array) {
        array.set(randomBytes as Uint8Array);
      }
      return array;
    },
    // Add stub implementations for required crypto methods
    subtle: undefined,
    randomUUID: () => {
      // Simple UUID v4 implementation
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  };

  (global as any).crypto = cryptoPolyfill;
}