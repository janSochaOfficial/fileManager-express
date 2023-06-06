import { deleteFile } from "../fileMenagment.js";
import { rename } from "fs/promises";
import path from "path";
import { uploadPath } from "../../consts/uploadPath.js";


export async function saveImage(image, oldPath){
    await deleteFile(oldPath)
    await rename(image.path, path.join(uploadPath, oldPath))
} 