import { unlink } from 'fs/promises';
import path from 'path';
import { uploadPath } from '../../consts/uploadPath';

export async function deleteFile(fileName, folderPath = ""){
    try{
        await unlink(path.join(uploadPath, folderPath, fileName))
    }
    catch {
        console.error("nie usinięto");
    }
}
