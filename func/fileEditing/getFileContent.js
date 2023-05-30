import { readFile } from "fs/promises";
import path from "path";
import { uploadPath } from "../../consts/uploadPath.js";
import { normalizeFolderPath } from "../helpers/normalizeFolderPath.js";

export async function  getFileContent(file, folder = ""){
    file = file.replace("/", "\\");
    return await readFile(path.join(uploadPath, folder, file));
}