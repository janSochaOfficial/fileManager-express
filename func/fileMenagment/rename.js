import { rename } from "fs/promises";
import path from "path";
import { uploadPath } from "../../consts/uploadPath.js";
import { isInFolder } from "./isInFolder.js";

export async function renameInFolder(file, newName, folder = "") {
  let name = newName;
  while (await isInFolder(name, folder)) {
    name += "_kopia";
  }
  const oldPath = path.join(uploadPath, folder, file);
  const newPath = path.join(uploadPath, folder, name);
  await rename(oldPath, newPath);
}
