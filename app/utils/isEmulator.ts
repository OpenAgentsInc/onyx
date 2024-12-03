import { Platform } from 'react-native';

export const isEmulator = (): boolean => {
  if (Platform.OS === 'android' && (Platform.isTV || __DEV__)) {
    return true;
  }
  
  if (Platform.OS === 'ios' && __DEV__) {
    return true;
  }

  return false;
};