const fs = require('fs');
const file = 'src/app/AstrisApp.tsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure tables are wrapped in overflow-x-auto
// We can find generic containers that look like dashboards or lists
// For example, any div containing a table should have overflow-x-auto
content = content.replace(/<div className="([^"]*)"([^>]*)>(\s*)<table/g, (match, classes, attrs, space) => {
  if (!classes.includes('overflow-x-auto')) {
    return `<div className="${classes} overflow-x-auto"${attrs}>${space}<table`;
  }
  return match;
});

// Any fixed widths like w-72, w-14, w-16 should also scale or be flexible
content = content.replace(/\bclassName="([^"]*)"/g, (match, classes) => {
  let newClasses = classes;
  newClasses = newClasses.replace(/\bw-72\b/g, 'w-full md:w-72')
                         .replace(/\bw-[1-3]\/4\b/g, (m) => `w-full md:${m}`)
                         .replace(/\bmin-h-screen\b/g, 'min-h-screen w-full overflow-x-hidden');
  
  // Ensure the main app wrapper doesn't have horizontal scroll
  if (newClasses.includes('bg-background') && newClasses.includes('min-h-screen')) {
     if (!newClasses.includes('overflow-x-hidden')) {
       newClasses += ' overflow-x-hidden';
     }
  }

  return `className="${newClasses}"`;
});

// Also make sure all Recharts ResponsiveContainers have a min-height for mobile
// Actually they already have `height={height}`.

fs.writeFileSync(file, content);
console.log("Additional responsive fixes applied");
