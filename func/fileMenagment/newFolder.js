import { mkdir } from "fs/promises";
import path from "path";
import { uploadPath } from "../../consts/uploadPath.js";
import { isInFolder } from "./isInFolder.js";

export async function newFolder(folderName, folderPath = "") {
  let name = encodeURIComponent(folderName);
  while (await isInFolder(name, folderPath)) {
    name += "_kopia";
  }
  await mkdir(path.join(uploadPath, folderPath, name));
}
