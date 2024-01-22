const fs = require('fs').promises;
const path = require('path');

async function mergeStyles() {
  const stylesDir = '05-merge-styles/styles';

  try {
    const files = await fs.readdir(stylesDir);
    const cssFiles = files.filter(file => path.extname(file) === '.css');

    if (cssFiles.length === 0) {
      console.error(`No CSS files found in ${stylesDir}.`);
      process.exit(1);
    }

    const stylesArray = await Promise.all(cssFiles.map(async file => {
      const filePath = path.join(stylesDir, file);

      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return fileContent;
      } catch (error) {
        console.error(`Error reading file ${filePath}: ${error.message}`);
        process.exit(1);
      }
    }));

    const bundledStyles = stylesArray.join('\n');

    const distDir = '05-merge-styles/project-dist';

    try {
      await fs.mkdir(distDir, { recursive: true });
    } catch (error) {
      console.error(`Error creating directory ${distDir}: ${error.message}`);
      process.exit(1);
    }

    const bundleFilePath = path.join(distDir, 'bundle.css');

    try {
      await fs.writeFile(bundleFilePath, bundledStyles, 'utf-8');
      console.log('Styles successfully merged.');
    } catch (error) {
      console.error(`Error writing file ${bundleFilePath}: ${error.message}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error reading directory ${stylesDir}: ${error.message}`);
    process.exit(1);
  }
}

mergeStyles();


