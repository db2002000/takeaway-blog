import fs from 'fs';

let content = fs.readFileSync('src/components/BrainResetMap.tsx', 'utf8');

// Replace Chinese curly quotes with their escaped equivalents
content = content
  .replace(/“/g, '\\"')  // left double quotation mark
  .replace(/”/g, '\\"'); // right double quotation mark

fs.writeFileSync('src/components/BrainResetMap.tsx', content);
console.log('Fixed Chinese quotes');