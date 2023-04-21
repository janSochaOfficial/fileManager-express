import { mkdir } from 'fs/promises';
import path from 'path';
import { uploadPath } from '../../consts/uploadPath';
import { isInFolder } from './isInFolder';

export async function newFolder(folderName, folderPath = "") {
    let name = folderName
    while (isInFolder(name, folderPath)){
        name += "_kopia"
    }

    await mkdir(path.join(uploadPath, folderPath, folderName))
}
