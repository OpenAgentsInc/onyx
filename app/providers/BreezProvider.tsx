import React, { createContext, useContext, useEffect, useState } from 'react';
import { defaultConfig, connect, disconnect, LiquidNetwork } from '@breeztech/react-native-breez-sdk-liquid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import '../utils/crypto-polyfill';
global.Buffer = Buffer;
import * as bip39 from 'bip39';

interface BreezContextType {
  isInitialized: boolean;
  error: Error | null;
  disconnect: () => Promise<void>;
  debugInfo: Record<string, any>;
  sdk: any;
  mnemonic: string | null;
}

const BreezContext = createContext<BreezContextType>({
  isInitialized: false,
  error: null,
  disconnect: async () => {},
  debugInfo: {},
  sdk: null,
  mnemonic: null,
});

export const useBreez = () => useContext(BreezContext);

const MNEMONIC_KEY = '@breez_mnemonic';

// Helper function to convert file:// URL to path
const fileUrlToPath = (fileUrl: string) => {
  return decodeURIComponent(fileUrl.replace('file://', ''));
};

interface BreezProviderProps {
  children: React.ReactNode;
}

export const BreezProvider: React.FC<BreezProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [debugInfo, setDebugInfo] = useState({});
  const [sdk, setSdk] = useState(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);

  useEffect(() => {
    initializeBreez();
  }, []);

  const initializeBreez = async () => {
    try {
      // Use Expo's document directory which is guaranteed to be writable
      const workingDirUrl = `${FileSystem.documentDirectory}breez`;
      const workingDir = fileUrlToPath(workingDirUrl);
      
      // Create working directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(workingDirUrl);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(workingDirUrl, { intermediates: true });
      }

      // Test directory write permissions
      try {
        const testFile = `${workingDirUrl}/test.txt`;
        await FileSystem.writeAsStringAsync(testFile, 'test');
        await FileSystem.deleteAsync(testFile, { idempotent: true });
      } catch (e) {
        throw new Error(`Working directory is not writable: ${e.message}`);
      }

      // Get or generate mnemonic
      let currentMnemonic = await AsyncStorage.getItem(MNEMONIC_KEY);
      if (!currentMnemonic) {
        // Generate a new random mnemonic
        currentMnemonic = bip39.generateMnemonic();
        console.log('Generated new mnemonic:', currentMnemonic);
        await AsyncStorage.setItem(MNEMONIC_KEY, currentMnemonic);
      } else {
        console.log('Using existing mnemonic');
      }

      // Verify mnemonic is valid
      if (!bip39.validateMnemonic(currentMnemonic)) {
        console.error('Invalid mnemonic detected, generating new one');
        currentMnemonic = bip39.generateMnemonic();
        await AsyncStorage.setItem(MNEMONIC_KEY, currentMnemonic);
      }

      setMnemonic(currentMnemonic);

      // Initialize SDK with proper working directory
      const config = await defaultConfig(
        LiquidNetwork.MAINNET,
        "MIIBfjCCATCgAwIBAgIHPYzgGw0A+zAFBgMrZXAwEDEOMAwGA1UEAxMFQnJlZXowHhcNMjQxMTI0MjIxOTMzWhcNMzQxMTIyMjIxOTMzWjA3MRkwFwYDVQQKExBPcGVuQWdlbnRzLCBJbmMuMRowGAYDVQQDExFDaHJpc3RvcGhlciBEYXZpZDAqMAUGAytlcAMhANCD9cvfIDwcoiDKKYdT9BunHLS2/OuKzV8NS0SzqV13o4GBMH8wDgYDVR0PAQH/BAQDAgWgMAwGA1UdEwEB/wQCMAAwHQYDVR0OBBYEFNo5o+5ea0sNMlW/75VgGJCv2AcJMB8GA1UdIwQYMBaAFN6q1pJW843ndJIW/Ey2ILJrKJhrMB8GA1UdEQQYMBaBFGNocmlzQG9wZW5hZ2VudHMuY29tMAUGAytlcANBABvQIfNsop0kGIk0bgO/2kPum5B5lv6pYaSBXz73G1RV+eZj/wuW88lNQoGwVER+rA9+kWWTaR/dpdi8AFwjxw0="
      );
      
      // Set working directory (using the converted path)
      config.workingDir = workingDir;

      setDebugInfo({
        workingDir: config.workingDir,
        workingDirUrl: workingDirUrl,
        mnemonicExists: !!currentMnemonic,
        network: 'MAINNET',
        config: config
      });

      const breezSdk = await connect({ mnemonic: currentMnemonic, config });
      setSdk(breezSdk);
      setIsInitialized(true);
    } catch (e) {
      console.error('Breez initialization error:', e);
      setError(e instanceof Error ? e : new Error('Failed to initialize Breez SDK'));
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setIsInitialized(false);
      setSdk(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to disconnect Breez SDK'));
    }
  };

  const value = {
    isInitialized,
    error,
    disconnect: handleDisconnect,
    debugInfo,
    sdk,
    mnemonic,
  };

  return (
    <BreezContext.Provider value={value}>
      {children}
    </BreezContext.Provider>
  );
};