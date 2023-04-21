import { rmdir } from 'fs/promises';
import path from 'path';
import { uploadPath } from '../../consts/uploadPath';

export async function deleteFolder(folderName, folderPath = ""){
    try{
        await rmdir(path.join(uploadPath, folderPath, folderName))
    }
    catch {
        console.error("nie usinięto");
    }
}
