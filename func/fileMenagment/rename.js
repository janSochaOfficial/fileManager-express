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
  if (newName.split(".")[1])
    name += "." + newName.split(".")[1]
  const newPath = path.join(uploadPath, folder, name);
  await rename(oldPath, newPath);
}
