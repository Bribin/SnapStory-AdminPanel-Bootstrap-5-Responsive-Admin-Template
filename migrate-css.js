const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, 'photobook-admin-template/html');
const cssPath = path.join(__dirname, 'photobook-admin-template/assets/css/style.css');
const files = fs.readdirSync(htmlDir);

let styleCss = fs.readFileSync(cssPath, 'utf8');
let cssAdditions = '';
let classCounter = 0;

files.forEach(file => {
  if (!file.endsWith('.html')) return;
  if (file.startsWith('admin-')) return;
  const filePath = path.join(htmlDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Extract <style>...</style> blocks
  const styleBlockRegex = /<style[\s\S]*?>[\s\S]*?<\/style>/gi;
  const styleBlocks = content.match(styleBlockRegex);
  if (styleBlocks) {
    styleBlocks.forEach(block => {
      const css = block.replace(/<style[\s\S]*?>|<\/style>/gi, '').trim();
      cssAdditions += `\n/* From ${file} <style> block */\n` + css + '\n';
      content = content.replace(block, '');
      changed = true;
    });
  }

  // 2. Find inline style="..." attributes
  const inlineStyleRegex = /style="([^"]+)"/gi;
  let match;
  while ((match = inlineStyleRegex.exec(content)) !== null) {
    const styleValue = match[1];
    const className = `migrated-inline-style-${classCounter++}`;
    cssAdditions += `\n/* From ${file} inline style */\n.${className} { ${styleValue} }\n`;
    // Replace inline style with class
    content = content.replace(match[0], `class="${className}"`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Migrated CSS from: ${file}`);
  }
});

if (cssAdditions) {
  styleCss += '\n\n/* --- Migrated CSS --- */\n' + cssAdditions;
  fs.writeFileSync(cssPath, styleCss, 'utf8');
  console.log('Appended migrated CSS to style.css');
}

console.log('CSS migration complete!'); 