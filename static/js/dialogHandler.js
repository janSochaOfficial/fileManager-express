const folderDialog = document.getElementById("folder-dialog");
const fileDialog = document.getElementById("file-dialog");
const renameDialog = document.getElementById("rename-dialog");

const newFileBtn = document.getElementById("new-file-btn");
const newFolderBtn = document.getElementById("new-folder-btn");
const renameBtn = document.getElementById("rename-btn");

const closeFileBtn = document.getElementById("file-close-btn");
const closeFolderBtn = document.getElementById("folder-close-btn");
const closeRenameBtn = document.getElementById("rename-close-btn");

newFileBtn.addEventListener("click", () => {
  fileDialog.show();
});
newFolderBtn.addEventListener("click", () => {
  folderDialog.show();
});
renameBtn.addEventListener("click", () => {
  renameDialog.show();
});

closeFileBtn.addEventListener("click", (e) => {
  fileDialog.close();
  e.preventDefault();
});
closeFolderBtn.addEventListener("click", (e) => {
  folderDialog.close();
  e.preventDefault();
});
closeRenameBtn.addEventListener("click", (e) => {
  renameDialog.close();
  e.preventDefault();
});

const fileInput = document.getElementById("file-input");
