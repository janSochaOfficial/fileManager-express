import path from "path";

export function normalizeFolderPath(folderPath) {
    return path.join(...folderPath.split("/").map((el) => encodeURIComponent(el)));
}