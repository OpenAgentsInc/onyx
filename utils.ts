import Constants from "expo-constants"

let cachedOrigin: string | null = null;

export const generateAPIUrl = (relativePath: string) => {
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

  if (process.env.NODE_ENV === 'development') {
    // Use cached origin if we have it
    if (!cachedOrigin) {
      // On first run, prefer the manifest URL if available
      if (Constants.manifest2?.extra?.expoClient?.debuggerHost) {
        const debuggerHost = Constants.manifest2.extra.expoClient.debuggerHost;
        cachedOrigin = `http://${debuggerHost.split(':')[0]}:3000`;
      } else {
        cachedOrigin = 'http://localhost:3000';
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