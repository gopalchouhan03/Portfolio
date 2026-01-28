const fs = require('fs');
const path = require('path');

function removeSymlinks(dir) {
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      try {
        if (file.isSymbolicLink()) {
          console.log(`Removing symlink: ${fullPath}`);
          fs.unlinkSync(fullPath);
        } else if (file.isDirectory()) {
          removeSymlinks(fullPath);
        }
      } catch (err) {
        // Skip if we can't process this file
        console.log(`Skipping ${fullPath}: ${err.message}`);
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${dir}: ${err.message}`);
  }
}

// Fix symlinks in .next directory
const nextDir = path.join(__dirname, '..', '.next');
if (fs.existsSync(nextDir)) {
  console.log('Removing symlinks from .next directory...');
  removeSymlinks(nextDir);
  console.log('Symlink removal complete');
}
