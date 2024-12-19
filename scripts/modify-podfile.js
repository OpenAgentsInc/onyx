const fs = require('fs');
const path = require('path');

// Function to add post install hook to Podfile
function addPostInstallHook() {
  const podfilePath = path.join(__dirname, '../ios/Podfile');
  
  if (!fs.existsSync(podfilePath)) {
    console.log('Podfile not found. Run expo prebuild first.');
    process.exit(1);
  }

  let podfileContent = fs.readFileSync(podfilePath, 'utf8');
  
  // Check if our post_install hook already exists
  if (podfileContent.includes('fix_llama_imports')) {
    console.log('Post install hook already exists');
    return;
  }

  // Find the last end statement
  const lastEndIndex = podfileContent.lastIndexOf('end');
  if (lastEndIndex === -1) {
    console.log('Could not find position to insert post_install hook');
    return;
  }

  // Add our post_install hook before the last end
  const hookContent = `
  post_install do |installer|
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
      end
    end

    # Fix llama imports
    puts "Fixing llama imports..."
    spec_file = "#{installer.sandbox.root}/build/generated/ios/RNLlamaSpec/RNLlamaSpec.h"
    if File.exist?(spec_file)
      content = File.read(spec_file)
      fixed_content = content.gsub('#import <ReactCommon/RCTTurboModule.h>', '#import "RCTTurboModule.h"')
      File.write(spec_file, fixed_content)
      puts "Successfully fixed imports in \#{spec_file}"
    else
      puts "Warning: Could not find \#{spec_file}"
    end
  end
`;

  // Insert the hook before the last end
  podfileContent = podfileContent.slice(0, lastEndIndex) + hookContent + podfileContent.slice(lastEndIndex);
  
  // Write back to Podfile
  fs.writeFileSync(podfilePath, podfileContent);
  console.log('Successfully added post_install hook to Podfile');
}

// Run the script
addPostInstallHook();