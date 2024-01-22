const fs = require('fs').promises;
const path = require('path');

const distDir = '06-build-page/project-dist';

async function createDistDir() {
  try {
    await fs.mkdir(distDir);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      console.error(`Error creating directory ${distDir}: ${error.message}`);
    }
  }
}

const templatePath = '06-build-page/template.html';

async function readTemplateContent() {
  try {
    return await fs.readFile(templatePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file ${templatePath}: ${error.message}`);
    throw error;
  }
}
function findTags(templateContent) {
  const tagRegex = /\{\{([^}]+)\}\}/g;
  return templateContent.match(tagRegex) || [];
}

async function replaceTags(templateContent, tags) {
  for (const tag of tags) {
    const componentName = tag.slice(2, -2);
    const componentPath = path.join('06-build-page/components', `${componentName}.html`);

    try {
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      templateContent = templateContent.replace(tag, componentContent);
    } catch (error) {
      console.error(`Error reading file ${componentPath}: ${error.message}`);
    }
  }

  return templateContent;
}

async function writeIndexFile(indexPath, templateContent) {
  try {
    await fs.writeFile(indexPath, templateContent, 'utf-8');
  } catch (error) {
    console.error(`Error writing file ${indexPath}: ${error.message}`);
  }
}

async function bundleStyles() {
  const stylesDir = '06-build-page/styles';

  try {
    const cssFiles = await fs.readdir(stylesDir);
    const stylesArray = await Promise.all(cssFiles.map(async file => {
      const filePath = path.join(stylesDir, file);
      return await fs.readFile(filePath, 'utf-8');
    }));

    const bundledStyles = stylesArray.join('\n');
    const stylePath = path.join(distDir, 'style.css');
    
    try {
      await fs.writeFile(stylePath, bundledStyles, 'utf-8');
    } catch (error) {
      console.error(`Error writing file ${stylePath}: ${error.message}`);
    }
  } catch (error) {
    console.error(`Error reading directory ${stylesDir}: ${error.message}`);
  }
}

async function copyAssets() {
  const assetsSrc = '06-build-page/assets';
  const assetsDest = path.join(distDir, 'assets');

  try {
    await copyFolderRecursive(assetsSrc, assetsDest);
  } catch (error) {
    console.error(`Error copying assets: ${error.message}`);
  }
}

async function copyFolderRecursive(source, target) {
  try {
    await fs.mkdir(target, { recursive: true });
    const files = await fs.readdir(source);

    for (const file of files) {
      const srcPath = path.join(source, file);
      const destPath = path.join(target, file);

      const stats = await fs.stat(srcPath);
      if (stats.isDirectory()) {
        await copyFolderRecursive(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error(`Error copying folder: ${error.message}`);
    throw error;
  }
}

async function main() {
  await createDistDir();
  
  const templateContent = await readTemplateContent();
  const tags = findTags(templateContent);
  const modifiedTemplate = await replaceTags(templateContent, tags);
  
  const indexPath = path.join(distDir, 'index.html');
  await writeIndexFile(indexPath, modifiedTemplate);
  
  await bundleStyles();
  await copyAssets();
}


main().then(() => console.log('All done!'));

