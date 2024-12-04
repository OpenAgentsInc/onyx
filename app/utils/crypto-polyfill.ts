import * as Crypto from 'expo-crypto';

// Polyfill crypto.getRandomValues
if (typeof crypto === 'undefined') {
  global.crypto = {
    getRandomValues: (arr) => {
      const randomBytes = Crypto.getRandomValues(arr);
      arr.set(randomBytes);
      return arr;
    }
  };
}