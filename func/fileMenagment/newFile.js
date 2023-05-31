import { writeFile } from "fs/promises";
import path from "path";
import { extentionFill } from "../../consts/extentionFill.js";
import { uploadPath } from "../../consts/uploadPath.js";
import { isInFolder } from "./isInFolder.js";

export async function newFile(fileName,extention="txt", folderPath = "") {
  let name = encodeURIComponent(fileName);
  while (await isInFolder(name + extention, folderPath)) name += "_kopia";
  try {
    await writeFile(path.join(uploadPath, folderPath, `${name}.${extention}`), extentionFill[extention]);
  } catch {
    console.error("nie dodano");
  }
}
