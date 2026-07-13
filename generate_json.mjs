import { esTranslations } from './temp_content.mjs';
import fs from 'fs';

fs.writeFileSync('src/i18n/es.json', JSON.stringify(esTranslations, null, 2));
