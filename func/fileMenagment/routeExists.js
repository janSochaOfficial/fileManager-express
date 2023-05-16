import { uploadPath } from "../../consts/uploadPath.js";
import { isInFolder } from "./isInFolder.js";
import path from "path";

export async function routeExists(route) {
    const folders = route.split("\\");
    let exists = true;
    let newPath = "";
    for(let folder of folders) {
        if (exists && await isInFolder(folder, newPath)) {
            newPath = path.join(newPath, folder);
        }
        else {
            exists = false;
        }
    }

    return exists;
}