const folderDialog = document.getElementById("folder-dialog");
const fileDialog = document.getElementById("file-dialog");

const newFileBtn = document.getElementById("new-file-btn");
const newFolderBtn = document.getElementById("new-folder-btn");

const closeFileBtn = document.getElementById("file-close-btn");
const closeFolderBtn = document.getElementById("folder-close-btn");

newFileBtn.addEventListener("click", () => {
  fileDialog.show();
});
newFolderBtn.addEventListener("click", () => {
  folderDialog.show();
});

closeFileBtn.addEventListener("click", (e) => {
  fileDialog.close();
  e.preventDefault();
});
closeFolderBtn.addEventListener("click", (e) => {
  folderDialog.close();
  e.preventDefault();
});

const fileInput = document.getElementById("file-input");
