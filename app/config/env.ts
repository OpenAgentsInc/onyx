import Constants from 'expo-constants';

interface Environment {
  releaseChannel: string;
  apiUrl: string;
  wsUrl: string;
  debug: boolean;
}

// Default development environment
const defaultEnv: Environment = {
  releaseChannel: 'development',
  apiUrl: 'http://localhost:3000',
  wsUrl: 'ws://localhost:3000',
  debug: true
};

// Get environment from Expo config or use defaults
const env: Environment = {
  releaseChannel: Constants.expoConfig?.extra?.releaseChannel || defaultEnv.releaseChannel,
  apiUrl: Constants.expoConfig?.extra?.apiUrl || defaultEnv.apiUrl,
  wsUrl: Constants.expoConfig?.extra?.wsUrl || defaultEnv.wsUrl,
  debug: Constants.expoConfig?.extra?.debug ?? defaultEnv.debug
};

export default env;