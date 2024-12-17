import Constants from "expo-constants"

let cachedOrigin: string | null = null;

export const generateAPIUrl = (relativePath: string) => {
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

  if (process.env.NODE_ENV === 'development') {
    // Use cached origin if we have it
    if (!cachedOrigin) {
      // Try to get the local IP address from various Expo sources
      let hostAddress = null;
      
      // Modern Expo SDK
      if (Constants.expoConfig?.hostUri) {
        hostAddress = Constants.expoConfig.hostUri.split(':')[0];
      }
      // Fallback to manifest
      else if (Constants.manifest?.debuggerHost) {
        hostAddress = Constants.manifest.debuggerHost.split(':')[0];
      }

      if (hostAddress && hostAddress !== 'localhost') {
        cachedOrigin = `http://${hostAddress}:3000`;
      } else {
        // If we're running in Expo Go, we need the device's local network IP
        try {
          // This is a development-only value that represents the host machine's IP
          const devServerHost = process.env.EXPO_DEVSERVER_URL || '';
          const match = devServerHost.match(/http:\/\/([\d.]+):/);
          if (match && match[1]) {
            cachedOrigin = `http://${match[1]}:3000`;
          } else {
            cachedOrigin = 'http://localhost:3000';
          }
        } catch {
          cachedOrigin = 'http://localhost:3000';
        }
      }
      
      console.log('Setting cached API origin to:', cachedOrigin);
    }
    
    const finalUrl = cachedOrigin.concat(path);
    console.log('Using API URL:', finalUrl);
    return finalUrl;
  }

  if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
    throw new Error(
      'EXPO_PUBLIC_API_BASE_URL environment variable is not defined',
    );
  }

  return process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);
};