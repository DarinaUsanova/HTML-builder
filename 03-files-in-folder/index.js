const fs = require('fs/promises');
const path = require('path');

const folderPath = './03-files-in-folder/secret-folder';

async function displayFileInfo() {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileStat = await fs.stat(filePath);

        const fileSizeInKB = fileStat.size / 1024;
        const fileSize = fileSizeInKB.toFixed(3) + 'kb';

        const fileName = path.parse(file.name).name;
        const fileExtension = path.parse(file.name).ext.slice(1); 
        console.log(`${fileName} - ${fileExtension} - ${fileSize}`);
      } else {
        console.error(`Error: ${file.name} is not a file.`);
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

displayFileInfo();
