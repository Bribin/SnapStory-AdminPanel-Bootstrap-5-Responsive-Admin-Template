const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, 'photobook-admin-template/html');
const jsPath = path.join(__dirname, 'photobook-admin-template/assets/js/frontend.js');
const files = fs.readdirSync(htmlDir);

let frontendJs = fs.readFileSync(jsPath, 'utf8');
let jsAdditions = '';

function convertToJquery(jsCode, file) {
  // Basic conversion: document.addEventListener('DOMContentLoaded', ...) => $(function() {...})
  // document.querySelectorAll('selector') => $('selector')
  // element.addEventListener('event', fn) => $(element).on('event', fn)
  // This is a best-effort, not a full parser.
  let converted = jsCode;
  converted = converted.replace(/document\.addEventListener\(['"]DOMContentLoaded['"],\s*function\s*\(\)\s*{([\s\S]*?)}\);?/g, '$(function() {$1});');
  converted = converted.replace(/document\.querySelectorAll\(([^)]+)\)/g, '$($1)');
  converted = converted.replace(/document\.querySelector\(([^)]+)\)/g, '$($1).get(0)');
  converted = converted.replace(/\.addEventListener\((['"])(\w+)\1,\s*function\s*\(([^)]*)\)\s*{([\s\S]*?)}\)/g, '.on("$2", function($3) {$4})');
  // Add a comment for manual review if code still contains 'document.' or 'addEventListener'
  if (/document\.|addEventListener/.test(converted)) {
    converted = `// [Manual review may be needed for advanced JS below from ${file}]:\n` + converted;
  }
  return converted;
}

files.forEach(file => {
  if (!file.endsWith('.html')) return;
  if (file.startsWith('admin-')) return;
  const filePath = path.join(htmlDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Extract <script>...</script> blocks without src
  const scriptBlockRegex = /<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptBlockRegex.exec(content)) !== null) {
    const jsCode = match[1].trim();
    if (!jsCode) continue;
    const converted = convertToJquery(jsCode, file);
    jsAdditions += `\n// --- Migrated from ${file} ---\n${converted}\n`;
    content = content.replace(match[0], '');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Migrated scripts from: ${file}`);
  }
});

if (jsAdditions) {
  frontendJs += '\n\n// --- Migrated Internal Scripts ---\n' + jsAdditions;
  fs.writeFileSync(jsPath, frontendJs, 'utf8');
  console.log('Appended migrated scripts to frontend.js');
}

console.log('Script migration complete!'); 