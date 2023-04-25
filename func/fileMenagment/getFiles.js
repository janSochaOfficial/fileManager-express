import { readdir } from "fs/promises";
import path from "path";
import { uploadPath } from "../../consts/uploadPath.js";

export async function getFiles(folder = "") {
  const data = await readdir(path.join(uploadPath, folder));
  const files = data.filter((file) => file.includes("."));
  return files.map((file) => {
    return {
        name: file,
        extention: file.split(".")[1],
        type: "file"
    }
  });
}
