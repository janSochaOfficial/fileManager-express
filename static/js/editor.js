const textarea = document.getElementById("text-edit");
const numbers = document.getElementById("numbers");
const saveFileBtn = document.getElementById("save-file-btn");
const colorChangeBtn = document.getElementById("color-change-btn");
const fontPlusBtn = document.getElementById("font-plus-btn");
const fontMinusBtn = document.getElementById("font-minus-btn");
const saveSettingBtn = document.getElementById("save-settings-btn");

let filePath;

const renameDialog = document.getElementById("rename-dialog");
const renameBtn = document.getElementById("rename-btn");
const closeRenameBtn = document.getElementById("rename-close-btn");

let settings = {};

closeRenameBtn.addEventListener("click", (e) => {
  renameDialog.close();
  e.preventDefault();
});

renameBtn.addEventListener("click", () => {
  renameDialog.show();
});

function  loadEditorSettings() {
  fetch("/api/settings")
    .then((res) => res.json())
    .then((data) => {
      setPreset(data);
      settings = data;
    });
}

window.onload = () => {
  numbers.innerHTML = "";
  filePath = document.getElementById("file-path").innerText;
  textarea.value.split("\n").forEach((line, i) => {
    numbers.innerHTML += `<p>${i + 1}</p>`;
  });

  textarea.rows = textarea.value.split("\n").length + 1;

  loadEditorSettings();

};

textarea.addEventListener("keyup", (e) => {
  numbers.innerHTML = "";

  textarea.value.split("\n").forEach((line, i) => {
    numbers.innerHTML += `<p>${i + 1}</p>`;
  });

  textarea.rows = textarea.value.split("\n").length + 1;
});

saveFileBtn.addEventListener("click", () => {
  const fd = new FormData();
  fd.append("filecontent", textarea.value);
  fd.append("filepath", filePath);

  fetch("/save", {
    method: "POST",
    body: fd,
  });
});


const presets = [
  {
    "--line-color": "magenta",
    "--number-color": "lightblue",
    "--background-color": "none",
    "--font-color": "white"
  },
  {
    "--line-color": "blue",
    "--number-color": "black",
    "--background-color": "white",
    "--font-color": "black"
  },
  {
    "--line-color": "green",
    "--number-color": "lightgreen",
    "--background-color": "black",
    "--font-color": "green"
  }
  
]

function setPreset(settings) {
  const root = document.documentElement;

  const preset = presets[settings.preset]
  for (let key in preset) {
    root.style.setProperty(key, preset[key]);
  }
  root.style.setProperty("--font-size", settings.fontSize + "px");
}



colorChangeBtn.addEventListener("click", () => {
  settings.preset = (settings.preset + 1 < presets.length) ?  settings.preset + 1 : 0;
  setPreset(settings);
})

fontPlusBtn.addEventListener("click", () => {
  settings.fontSize = (settings.fontSize + 2 < 50) ? settings.fontSize + 1 : 50;
  setPreset(settings);
})

fontMinusBtn.addEventListener("click", () => {
  settings.fontSize = (settings.fontSize - 2 > 12) ? settings.fontSize - 2 : 12;
  setPreset(settings);
})

saveSettingBtn.addEventListener("click", () => {
  fetch("/api/settings", {  
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(settings)
  })
})