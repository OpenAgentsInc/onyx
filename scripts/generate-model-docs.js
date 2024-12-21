#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Define the files we want to document
const FILES_TO_DOCUMENT = {
  'src/store/useModelStore.ts': 'Central state management for model handling',
  'src/screens/Chat/constants.ts': 'Model configurations and constants',
  'src/screens/Chat/hooks/useModelInitialization.ts': 'Model initialization logic',
  'src/utils/ModelDownloader.ts': 'Model download handling',
  'src/screens/Chat/components/ModelFileManager.tsx': 'Model management UI',
  'src/screens/Chat/hooks/useModelContext.ts': 'Model context management',
  'src/screens/Chat/hooks/useChatHandlers.ts': 'Chat message handling',
  'src/screens/Chat/components/DownloadScreen.tsx': 'Model download UI',
  'src/screens/Chat/components/LoadingIndicator.tsx': 'Loading state UI'
};

// Categories for organizing the documentation
const CATEGORIES = {
  'State Management': [
    'src/store/useModelStore.ts'
  ],
  'Configuration': [
    'src/screens/Chat/constants.ts'
  ],
  'Core Logic': [
    'src/screens/Chat/hooks/useModelInitialization.ts',
    'src/utils/ModelDownloader.ts',
    'src/screens/Chat/hooks/useModelContext.ts',
    'src/screens/Chat/hooks/useChatHandlers.ts'
  ],
  'UI Components': [
    'src/screens/Chat/components/ModelFileManager.tsx',
    'src/screens/Chat/components/DownloadScreen.tsx',
    'src/screens/Chat/components/LoadingIndicator.tsx'
  ]
};

function generateFileDoc(filePath, baseDir) {
  try {
    const fullPath = path.join(baseDir, filePath);
    if (!fs.existsSync(fullPath)) {
      return `## ${path.basename(filePath)}\n\nFile not found: ${filePath}\n\n`;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const description = FILES_TO_DOCUMENT[filePath] || 'No description available';

    // Extract imports
    const imports = content.match(/import.*from.*/g) || [];
    
    // Extract interfaces/types
    const types = content.match(/(?:interface|type)\s+\w+/g) || [];
    
    // Extract functions/components
    const functions = content.match(/(?:function|const)\s+\w+/g) || [];

    let doc = `## ${path.basename(filePath)}\n\n`;
    doc += `**Purpose:** ${description}\n\n`;
    
    if (imports.length > 0) {
      doc += '### Dependencies\n';
      doc += imports.map(imp => `- ${imp.trim()}`).join('\n');
      doc += '\n\n';
    }

    if (types.length > 0) {
      doc += '### Types\n';
      doc += types.map(type => `- ${type.trim()}`).join('\n');
      doc += '\n\n';
    }

    if (functions.length > 0) {
      doc += '### Functions/Components\n';
      doc += functions.map(func => `- ${func.trim()}`).join('\n');
      doc += '\n\n';
    }

    return doc;
  } catch (err) {
    return `Error processing ${filePath}: ${err.message}\n\n`;
  }
}

function generateDocs(baseDir) {
  let output = '# Model Management System Documentation\n\n';
  output += 'This document provides a comprehensive overview of the model management system.\n\n';

  // Generate category-based documentation
  for (const [category, files] of Object.entries(CATEGORIES)) {
    output += `# ${category}\n\n`;
    for (const file of files) {
      output += generateFileDoc(file, baseDir);
    }
  }

  // Add system overview
  output += '# System Overview\n\n';
  output += '## State Flow\n\n';
  output += '1. Initial Load:\n';
  output += '   - Load saved state from AsyncStorage\n';
  output += '   - Check for existing model file\n';
  output += '   - Initialize if found, reset if not\n\n';
  output += '2. Model Download:\n';
  output += '   - User selects model\n';
  output += '   - Download starts with progress tracking\n';
  output += '   - Validation and initialization on completion\n\n';
  output += '3. Model Switching:\n';
  output += '   - Release current model\n';
  output += '   - Clean up resources\n';
  output += '   - Initialize new model\n\n';

  return output;
}

// Get the directory path from command-line arguments
const baseDir = process.argv[2] || process.cwd();

// Generate and save the documentation
const docs = generateDocs(baseDir);
fs.writeFileSync('docs/model-system.md', docs);
console.log('Documentation generated in docs/model-system.md');