const fs = require('fs');
const content = fs.readFileSync('src/app/AstrisApp.tsx', 'utf8');

const regex = /className=\"([^\"]*)\"/g;
let match;
const badClasses = [];

while ((match = regex.exec(content)) !== null) {
  const classes = match[1].split(' ');
  for (const c of classes) {
    if (c.match(/^w-[0-9]+$/) && !classes.some(x => x.startsWith('md:w-') || x.startsWith('lg:w-'))) {
      badClasses.push(`Fixed width: ${c}`);
    }
    if (c === 'flex-row' && !classes.includes('md:flex-row') && !classes.includes('flex-col')) {
      badClasses.push(`Fixed flex-row`);
    }
    if (c.startsWith('grid-cols-') && !c.includes('md:') && c !== 'grid-cols-1') {
      badClasses.push(`Fixed grid: ${c}`);
    }
    if (c.startsWith('min-w-[')) {
      badClasses.push(`Fixed min-w: ${c}`);
    }
  }
}

fs.writeFileSync('scratch/bad-classes.txt', badClasses.join('\n'));
console.log('Done, found ' + badClasses.length);
