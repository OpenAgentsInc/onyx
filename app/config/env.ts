import Constants from 'expo-constants';

// Get the release channel from Expo
const releaseChannel = Constants.expoConfig?.releaseChannel;

// Define environment configurations
const ENV = {
  dev: {
    NEXUS_API_KEY: 'dev_key_123', // Development API key
  },
  staging: {
    NEXUS_API_KEY: 'staging_key_123', // Staging API key
  },
  prod: {
    NEXUS_API_KEY: 'prod_key_123', // Production API key
  },
};

// Get the environment based on the release channel
function getEnvVars() {
  if (releaseChannel === undefined) return ENV.dev; // Development
  if (releaseChannel.indexOf('prod') !== -1) return ENV.prod; // Production
  if (releaseChannel.indexOf('staging') !== -1) return ENV.staging; // Staging
  return ENV.dev; // Default to development
}

export default getEnvVars();