import { writeFile } from 'fs/promises';
import path from 'path';
import { uploadPath } from '../../consts/uploadPath';
import { isInFolder } from './isInFolder';

export async function newFile(fileName, folderPath = ""){
    let name = fileName
    while (await isInFolder(name + ".txt", folderPath))
        name += "_kopia"
    try {
        await writeFile(path.join(uploadPath, folderPath, `${name}.txt`), "aa")
    }
    catch {
        console.error("nie dodano");
    }
}
