const fs = require('fs');
const path = require('path');

const stylesDir = '05-merge-styles/styles';

if (!fs.existsSync(stylesDir)) {
  console.error(`Directory ${stylesDir} does not exist.`);
  process.exit(1);
}

const files = fs.readdirSync(stylesDir);

const cssFiles = files.filter(file => path.extname(file) === '.css');

if (cssFiles.length === 0) {
  console.error(`No CSS files found in ${stylesDir}.`);
  process.exit(1);
}

const stylesArray = [];

cssFiles.forEach(file => {
  const filePath = path.join(stylesDir, file);

  if (!fs.existsSync(filePath)) {
    console.error(`File ${filePath} does not exist.`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  stylesArray.push(fileContent);
});

const bundledStyles = stylesArray.join('\n');

const distDir = '05-merge-styles/project-dist';

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const bundleFilePath = path.join(distDir, 'bundle.css');
fs.writeFileSync(bundleFilePath, bundledStyles, 'utf-8');

