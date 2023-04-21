import path from 'path';
import * as url from 'url';
// const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.join(url.fileURLToPath(new URL('.', import.meta.url)), "..");
export const uploadPath = path.join(__dirname, '../upload');