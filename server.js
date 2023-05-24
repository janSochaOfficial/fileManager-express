import express from "express";
import path from "path";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import ExpressFormidable from "express-formidable";
import { __dirname, uploadPath } from "./consts/uploadPath.js";

import {
  getFiles,
  getFolders,
  renameInFolder,
  newFile,
  newFolder,
  deleteFile,
  deleteFolder,
  isInFolder,
  routeExists
  
} from "./func/fileMenagment.js";
import { rename, writeFile } from "fs/promises";
import { normalizeFolderPath } from "./func/helpers/normalizeFolderPath.js";
import { renameSync } from "fs";
import { saveFile } from "./func/fileEditing/saveFile.js";
import { getFileContent } from "./func/fileEditing/getFileContent.js";

const app = express();
const PORT = 3000;

app.set("views", path.join(__dirname, "views")); // ustalamy katalog views
app.engine("hbs", exphbs({ defaultLayout: "main.hbs" })); // domyślny layout, potem można go zmienić
app.set("view engine", "hbs"); // określenie nazwy silnika szablonów

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("static"));
app.use(
  ExpressFormidable(
    {
      encoding: "utf-8",
      uploadDir: uploadPath,
      keepExtensions: true,
      multiples: true
    }
  )
);

const helpers = {
  compareString: function (p, q, options) {
    return p == q ? options.fn(this) : options.inverse(this);
  },
};

const context = {
  helpers,
};

app.get("/", (req, res) => res.redirect("/home"));

app.get("/home", function (req, res) {
  const filePromise = getFiles();
  const folderPromise = getFolders();
  Promise.all([filePromise, folderPromise]).then(([files, folders]) => {
    context.files = files;
    context.folders = folders;
    context.path = [{name: "home", link: "home" }]
    res.render("home.hbs", context);
  });
});

app.get("/home/*", function (req, res) {
  try {
    const normalizedFolderPath = normalizeFolderPath(req.params[0])
    routeExists(normalizedFolderPath).then((inFolder) => {
      if(!inFolder){
        res.redirect("/home");
        return;
      }
      const filePromise = getFiles(normalizedFolderPath);
      const folderPromise = getFolders(normalizedFolderPath);
      Promise.all([filePromise, folderPromise]).then(([files, folders]) => {
        context.files = files;
        context.folders = folders;
        let route = "home"
        context.path = [{name: "home", link:"home"}, ...normalizedFolderPath.split("\\").map(el => {
          route += "/" + el 
          return {
            name: decodeURIComponent(el),
            link: route
          }
        })] 
        res.render("home.hbs", {...context, root: normalizedFolderPath });
      });
    })
    
  }
  catch {
    res.redirect("/home");
  }
  
  
});

app.post("/files/add", function (req, res) {
  const fileName = req.fields.name;
  if (!fileName) {
    res.redirect("/home/" + rootFolder.replace("\\", "/"));
    return;
  }
  const rootFolder = req.fields.root;

  newFile(fileName, rootFolder);
  res.redirect("/home/" + rootFolder.replace("\\", "/"));
});

app.post("/files/delete", function (req, res) {
    const fileName = req.fields.name;
    const rootFolder = req.fields.root;

    if (!fileName) {
      res.redirect("/home/" + rootFolder.replace("\\", "/"));
      return;
    }

    deleteFile(fileName, rootFolder);
    res.redirect("/home/" + rootFolder.replace("\\", "/"));
});

app.post("/files/upload", function (req, res) {
    const file = req.files.file;
    const rootFolder = req.fields.root;
    console.log(rootFolder);
    if (file.length) {
      file.forEach((el) => {
        if (el && el.name) {
          const fileName = el.path.split("\\").pop();
          renameInFolder(fileName, path.join(rootFolder, encodeURIComponent(el.name)));
        }
      })
    }
    else {
      if (file && file.name) {
        const fileName = file.path.split("\\").pop();
        renameInFolder(fileName, path.join(rootFolder, encodeURIComponent(file.name)));
      }
    }
    console.log("/home/" + rootFolder.replace("\\", "/"))
    res.redirect("/home/" + rootFolder.replace("\\", "/"))
    // form.parse(req);

});


app.post("/folders/add", function (req, res) {
  const folderName = req.fields.name;
  const rootFolder = req.fields.root;
  if (!folderName) {
    res.redirect("/home/" + rootFolder.replace("\\", "/"));
    return;
  }
  newFolder(folderName, rootFolder);
  res.redirect("/home/" + rootFolder.replace("\\", "/"));

});

app.post("/folders/delete", function (req, res) {
    const folderName = req.fields.name;
    const rootFolder = req.fields.root;
    deleteFolder(folderName, rootFolder);
    res.redirect("/home/" + rootFolder.replace("\\", "/"));
  });

  app.post("/folders/rename", function (req, res) {
    const folderName = req.fields.name;
    const rootFolder = req.fields.root;
    const route = rootFolder.split("\\")
    const oldName = route.pop();
    renameInFolder(oldName, folderName, path.join(...route))
    res.redirect("/home/" +  path.join(...route).replace("\\", "/") + "/" + folderName);
  });
   
  app.get("/editor/*", function (req, res) {
    getFileContent(req.params[0]).then(content => {
      res.render("editor.hbs", {...context, filepath: req.params[0], filecontent: content})
    })
  })


  app.post("save", function (req, res) {
    saveFile(req.fields.filepath, req.fields.filecontent)
    res.redirect("/home/" + req.fields.filepath.replace("\\", "/"))
  })


app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT, "\nhttp://localhost:" + PORT);
});
