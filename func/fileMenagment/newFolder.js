import { mkdir } from "fs/promises";
import path from "path";
import { uploadPath } from "../../consts/uploadPath.js";
import { isInFolder } from "./isInFolder.js";

export async function newFolder(folderName, folderPath = "") {
  let name = folderName;
  while (await isInFolder(name, folderPath)) {
    name += "_kopia";
    console.log("newFolder")
  }
  await mkdir(path.join(uploadPath, folderPath, folderName));
}
