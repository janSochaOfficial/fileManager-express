import { rename } from "fs/promises";
import path from "path";
import { uploadPath } from "../../consts/uploadPath.js";
import { isInFolder } from "./isInFolder.js";

export async function renameInFolder(file, newName, folder = "") {
  let name = newName.split(".")[0];
  let fileName = file;  
  while (await isInFolder(name, folder)) {
    name += "_kopia";
  }
  const oldPath = path.join(uploadPath, folder, fileName);
  const newPath = path.join(uploadPath, folder, name + "." + newName.split(".")[1]);
  await rename(oldPath, newPath);
}
