import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Por favor, proporciona la ruta del archivo SVG o PNG vectorizado.\nEjemplo: node scripts/update_logo.js /ruta/al/astris.svg");
  process.exit(1);
}

const inputLogoPath = path.resolve(args[0]);
if (!fs.existsSync(inputLogoPath)) {
  console.error(`El archivo no existe: ${inputLogoPath}`);
  process.exit(1);
}

const ext = path.extname(inputLogoPath).toLowerCase();
const projectRoot = path.join(__dirname, '..');
const assetsDir = path.join(projectRoot, 'src', 'assets');
const oldLogoPath = path.join(assetsDir, 'astris.png');
const newLogoName = `astris${ext}`;
const newLogoPath = path.join(assetsDir, newLogoName);

// Copy new logo
fs.copyFileSync(inputLogoPath, newLogoPath);
console.log(`✅ Nuevo logo copiado a: src/assets/${newLogoName}`);

// Delete old logo if the new one is not astris.png
if (ext !== '.png' && fs.existsSync(oldLogoPath)) {
  fs.unlinkSync(oldLogoPath);
  console.log('🗑️ Logo antiguo (astris.png) eliminado.');
}

// Update references in src/ directory
const searchDir = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(searchDir(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
};

const files = searchDir(path.join(projectRoot, 'src'));
let updatedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('astris.png')) {
    content = content.replace(/astris\.png/g, newLogoName);
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
    console.log(`🔄 Actualizada referencia en: ${path.relative(projectRoot, file)}`);
  }
});

console.log(`\n¡Éxito! El logo ha sido actualizado. Se modificaron ${updatedCount} archivos.`);
console.log('Recomendación: Ejecuta "npm run build" o "npm run dev" para verificar el resultado visual.');
