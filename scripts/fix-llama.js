const fs = require('fs');
const path = require('path');

const specFile = path.join(__dirname, '../ios/build/generated/ios/RNLlamaSpec/RNLlamaSpec.h');

try {
  if (!fs.existsSync(specFile)) {
    console.error('RNLlamaSpec.h not found');
    process.exit(1);
  }

  let content = fs.readFileSync(specFile, 'utf8');
  content = content.replace('#import <ReactCommon/RCTTurboModule.h>', '#import "RCTTurboModule.h"');
  fs.writeFileSync(specFile, content);
  console.log('Successfully fixed RNLlamaSpec.h imports');
} catch (error) {
  console.error('Error fixing imports:', error);
  process.exit(1);
}