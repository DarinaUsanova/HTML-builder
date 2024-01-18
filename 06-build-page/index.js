const fs = require('fs');
const path = require('path');

const distDir = 'project-dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const templatePath = '06-build-page/template.html';
let templateContent = fs.readFileSync(templatePath, 'utf-8');

const tagNames = templateContent.match(/{{\s*([^}\s]+)\s*}}/g);

if (tagNames) {
  tagNames.forEach(tag => {
    const tagName = tag.match(/{{\s*([^}\s]+)\s*}}/)[1];
    const componentPath = `06-build-page/components/${tagName}.html`;
    const componentContent = fs.readFileSync(componentPath, 'utf-8');
    templateContent = templateContent.replace(tag, componentContent);
  });
}

const indexPath = path.join(distDir, 'index.html');
fs.writeFileSync(indexPath, templateContent, 'utf-8');

const stylesScriptPath = '05-merge-styles/index.js';
if (fs.existsSync(stylesScriptPath)) {
  require('../05-merge-styles/index.js');
}

const copyDirScriptPath = '04-copy-directory/index.js';
if (fs.existsSync(copyDirScriptPath)) {
  require('../04-copy-directory/index.js');
}