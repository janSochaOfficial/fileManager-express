import { access } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';
import { uploadPath } from '../../consts/uploadPath.js';

export async function isInFolder(fileName, folderPath = "") {
    return access(path.join(uploadPath, folderPath, fileName), constants.F_OK)
        .then(() => true)
        .catch(() => false)
}
