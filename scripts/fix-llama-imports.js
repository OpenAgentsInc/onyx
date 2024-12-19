const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../ios/build/generated/ios/RNLlamaSpec/RNLlamaSpec.h');

try {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace('#import <ReactCommon/RCTTurboModule.h>', '#import "RCTTurboModule.h"');
    fs.writeFileSync(filePath, content);
    console.log('Successfully updated RNLlamaSpec.h import statement');
  } else {
    console.log('RNLlamaSpec.h file not found. Make sure the build has generated the file first.');
  }
} catch (err) {
  console.error('Error updating import statement:', err);
}