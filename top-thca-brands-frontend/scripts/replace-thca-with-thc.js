import { readdir, readFileSync, writeFileSync, statSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = new URL('.', import.meta.url).pathname;

// Function to recursively find all files in a directory
function getAllFiles(dir, fileList = []) {
  const files = readdir(dir, { withFileTypes: true });

  files.forEach(file => {
    const filePath = join(dir, file.name);
    if (file.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      // Only include typescript/javascript/css files
      if (/\.(tsx?|jsx?|css)$/.test(file.name)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// Get all files
const srcDir = resolve(__dirname, '../src');
const files = getAllFiles(srcDir);

let totalReplaced = 0;
let filesChanged = 0;

// Process each file
files.forEach(filePath => {
  if (existsSync(filePath)) {
    let content = readFileSync(filePath, 'utf-8');
    
    // Count occurrences before replacement
    const thcaCount = (content.match(/thca-/g) || []).length;
    
    if (thcaCount > 0) {
      // Replace 'thca-' with 'thc-' in class names
      const newContent = content.replace(/thca-/g, 'thc-');
      
      // Write the file back
      writeFileSync(filePath, newContent, 'utf-8');
      
      console.log(`Updated ${filePath}: replaced ${thcaCount} occurrences`);
      totalReplaced += thcaCount;
      filesChanged++;
    }
  }
});

console.log(`Done! Replaced ${totalReplaced} occurrences in ${filesChanged} files.`); 