import { writeFile } from "fs/promises";
import path from "path";
import { uploadPath } from "../../consts/uploadPath.js";

export async function saveFile(filename, data, folder = ""){
    await writeFile(path.join(uploadPath, folder, filename), data);
}

