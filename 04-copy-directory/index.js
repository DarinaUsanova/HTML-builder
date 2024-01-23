const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  const sourceDir = '04-copy-directory/files';
  const destinationDir = '04-copy-directory/files-copy';

  try {
    await fs.rm(destinationDir, { recursive: true, force: true });
    await fs.mkdir(destinationDir, { recursive: true });

    const files = await fs.readdir(sourceDir);

    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const destinationPath = path.join(destinationDir, file);

      await fs.copyFile(sourcePath, destinationPath);
    }

    console.log('Directory copied successfully!');
  } catch (error) {
    console.error('Error copying directory:', error);
  }
}

copyDir();

