const fs = require('fs');
const path = require('path');

// Function to recursively find all files in a directory
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      // Only include typescript/javascript/css/html files
      if (/\.(tsx?|jsx?|css|html)$/.test(file)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// Get all files
const srcDir = path.resolve(__dirname, '../src');
const files = getAllFiles(srcDir);

let totalReplaced = 0;
let filesChanged = 0;

// Process each file
files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Count occurrences before replacement
    const thcaCount = (content.match(/THCA/g) || []).length;
    
    if (thcaCount > 0) {
      // Replace 'THCA' with 'THC'
      const newContent = content.replace(/THCA/g, 'THC');
      
      // Write the file back
      fs.writeFileSync(filePath, newContent, 'utf-8');
      
      console.log(`Updated ${filePath}: replaced ${thcaCount} occurrences`);
      totalReplaced += thcaCount;
      filesChanged++;
    }
  }
});

console.log(`Done! Replaced ${totalReplaced} occurrences in ${filesChanged} files.`); 