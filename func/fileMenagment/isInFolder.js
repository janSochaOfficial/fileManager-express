import { readdir } from "fs/promises";
import { constants } from "fs";
import path from "path";
import { uploadPath } from "../../consts/uploadPath.js";

export async function isInFolder(fileName, folderPath = "") {
  const folder = await readdir(path.join(uploadPath, folderPath));
  return folder.map(e => decodeURIComponent(e)).includes(fileName);
}
