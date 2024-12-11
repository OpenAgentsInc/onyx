import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import fs from 'fs';
import path from 'path';

const withBreezSDK: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      
      if (!fs.existsSync(podfilePath)) {
        return config;
      }

      let podfileContent = fs.readFileSync(podfilePath, 'utf-8');
      
      // Add specific version requirements for Breez SDK
      if (!podfileContent.includes('pod \'breez_sdk_liquidFFI\'')) {
        podfileContent = podfileContent.replace(
          /target 'onyx' do/,
          `target 'onyx' do\n  pod 'breez_sdk_liquidFFI', '0.5.1'\n  pod 'BreezSDKLiquid', '0.5.1'`
        );
      }

      fs.writeFileSync(podfilePath, podfileContent);
      return config;
    },
  ]);
};

export default withBreezSDK;