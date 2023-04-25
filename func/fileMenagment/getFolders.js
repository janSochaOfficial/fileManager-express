import { readdir } from "fs/promises";
import path from "path";
import { uploadPath } from "../../consts/uploadPath.js";

export async function getFolders(folder = "") {
  const data = await readdir(path.join(uploadPath, folder));
  const folders = data.filter((file) => !file.includes("."));
  return folders.map((folder) => {
    return {
      name: folder,
      type: "folder"
    }
  });
}
