import { readdir } from 'fs/promises';
import path from 'path';
import { uploadPath } from '../../consts/uploadPath.js';
import { isInFolder } from './isInFolder.js';

export async function getFiles(file, folder = "") {

    const data = await readdir(path.join(uploadPath, folder));
    const files = data.filter(file => file.includes("."));
    console.log(`files`, files);
}