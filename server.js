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
} from "./func/fileMenagment.js";
import { rename } from "fs/promises";

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

app.get("/", function (req, res) {
  const filePromise = getFiles();
  const folderPromise = getFolders();
  Promise.all([filePromise, folderPromise]).then(([files, folders]) => {
    context.files = files;
    context.folders = folders;
    res.render("home.hbs", context);
  });
});

app.post("/files/add", function (req, res) {
  const fileName = req.fields.name;
  newFile(fileName);
  res.redirect("/");
});

app.post("/files/delete", function (req, res) {
    const fileName = req.fields.name;
    deleteFile(fileName);
    res.redirect("/");
});

app.post("/files/upload", function (req, res) {
    const file = req.files.file;
    if (file) {
        const fileName = file.path.split("\\").pop();
        renameInFolder(fileName, file.name);
        res.redirect("/");

    }
    else{
      res.redirect("/");
    }
});


app.post("/folders/add", function (req, res) {
  const folderName = req.fields.name;
  newFolder(folderName);
  res.redirect("/");

});

app.post("/folders/delete", function (req, res) {
    const folderName = req.fields.name;
    deleteFolder(folderName);
    res.redirect("/");
  });
app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT, "\nhttp://localhost:" + PORT);
});
