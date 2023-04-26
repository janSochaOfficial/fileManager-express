import { rmdir } from "fs/promises";
import path from "path";
import { uploadPath } from "../../consts/uploadPath.js";

export async function deleteFolder(folderName, folderPath = "") {
  try {
    await rmdir(path.join(uploadPath, folderPath, encodeURIComponent(folderName)));
  } catch {
    console.error("nie usinięto");
  }
}
