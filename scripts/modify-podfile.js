const fs = require('fs');
const path = require('path');

// Function to add post install hook to Podfile
function modifyPodfile() {
  const podfilePath = path.join(__dirname, '../ios/Podfile');
  
  if (!fs.existsSync(podfilePath)) {
    console.log('Podfile not found. Run expo prebuild first.');
    process.exit(1);
  }

  let podfileContent = fs.readFileSync(podfilePath, 'utf8');
  
  // Remove any existing post_install blocks
  podfileContent = podfileContent.replace(/post_install do \|installer\|[\s\S]*?end\n/g, '');

  // Add our combined post_install hook at the end
  const hookContent = `
  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
      :ccache_enabled => podfile_properties['apple.ccacheEnabled'] == 'true',
    )

    # This is necessary for Xcode 14, because it signs resource bundles by default
    # when building for devices.
    installer.target_installation_results.pod_target_installation_results
      .each do |pod_name, target_installation_result|
      target_installation_result.resource_bundle_targets.each do |resource_bundle_target|
        resource_bundle_target.build_configurations.each do |config|
          config.build_settings['CODE_SIGNING_ALLOWED'] = 'NO'
        end
      end
    end

    # Set deployment target for all pods
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
      end
    end

    # Fix llama imports
    puts "Fixing llama imports..."
    spec_file = "\#{installer.sandbox.root}/build/generated/ios/RNLlamaSpec/RNLlamaSpec.h"
    if File.exist?(spec_file)
      content = File.read(spec_file)
      fixed_content = content.gsub('#import <ReactCommon/RCTTurboModule.h>', '#import "RCTTurboModule.h"')
      File.write(spec_file, fixed_content)
      puts "Successfully fixed imports in \#{spec_file}"
    else
      puts "Warning: Could not find \#{spec_file}"
    end
  end
end`;

  // Add the hook at the end of the file
  podfileContent = podfileContent.trim() + "\n" + hookContent + "\n";
  
  // Write back to Podfile
  fs.writeFileSync(podfilePath, podfileContent);
  console.log('Successfully modified Podfile');
}

// Run the script
modifyPodfile();