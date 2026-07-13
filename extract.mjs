import fs from 'fs';
import path from 'path';

// We'll read content.ts, remove imports and types, and eval it.
let content = fs.readFileSync('src/i18n/content.ts', 'utf-8');

// Remove import statements
content = content.replace(/import.*?;/g, '');
// Remove type annotations like ": Record<Lang, Record<string, any>>"
content = content.replace(/:\s*Record<.*?>\s*=/g, ' =');
// Remove type casting like "as const"
content = content.replace(/as const/g, '');
// Remove "export const" and just leave "const"
content = content.replace(/export const/g, 'const');

// We want to extract T.es and CONTENT.es and merge them.
// Let's just append an export line for Node evaluation.
content += `\n\nexport const esTranslations = { ...T.es, ...CONTENT.es };`;

fs.writeFileSync('temp_content.mjs', content);
