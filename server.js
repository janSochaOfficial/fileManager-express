import express from "express";
import path from "path";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import ExpressFormidable from "express-formidable";
import nocache from "nocache";
import cookieParser from "cookie-parser";

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
  routeExists,
} from "./func/fileMenagment.js";
import { rename, writeFile } from "fs/promises";
import { normalizeFolderPath } from "./func/helpers/normalizeFolderPath.js";
import { read, renameSync } from "fs";
import { saveFile } from "./func/fileEditing/saveFile.js";
import { getFileContent } from "./func/fileEditing/getFileContent.js";
import { textExtentions, imageExtentions } from "./consts/extentions.js";
import { imageFilters } from "./consts/imageFilters.js";
import { saveImage } from "./func/fileEditing/saveImage.js";
import { logIn, register } from "./func/userManagment/index.js";
import { autoLogout } from "./func/helpers/autoLogout.js";

const app = express();
const PORT = 3000;

app.set("views", path.join(__dirname, "views")); // ustalamy katalog views
app.engine("hbs", exphbs({ defaultLayout: "main.hbs" })); // domyślny layout, potem można go zmienić
app.set("view engine", "hbs"); // określenie nazwy silnika szablonów

app.use(express.static("static"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  ExpressFormidable({
    encoding: "utf-8",
    uploadDir: uploadPath,
    keepExtensions: true,
    multiples: true,
  })
);
app.use(cookieParser("ASANKARJANAVXUAJSERLK"));
app.use(autoLogout());
app.use(nocache());

const helpers = {
  compareString: function (p, q, options) {
    return p == q ? options.fn(this) : options.inverse(this);
  },
};

const context = {
  helpers,
  extentions: textExtentions,
};

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", function (req, res) {
  console.log(req.user);
  const filePromise = getFiles(req.user);
  const folderPromise = getFolders(req.user);
  Promise.all([filePromise, folderPromise]).then(([files, folders]) => {
    context.files = files;
    context.folders = folders;
    context.path = [{ name: "home", link: "home" }];
    res.render("home.hbs", { ...context });
  });
});

app.get("/home/*", function (req, res) {
  try {
    const normalizedFolderPath = normalizeFolderPath(req.params[0]);
    routeExists(normalizedFolderPath).then((inFolder) => {
      if (!inFolder) {
        res.redirect("/home");
        return;
      }
      const filePromise = getFiles(path.join(req.user, normalizedFolderPath));
      const folderPromise = getFolders(
        path.join(req.user, normalizedFolderPath)
      );
      Promise.all([filePromise, folderPromise]).then(([files, folders]) => {
        context.files = files;
        context.folders = folders;
        let route = "home";
        context.path = [
          { name: "home", link: "home" },
          ...normalizedFolderPath.split("\\").map((el) => {
            route += "/" + el;
            return {
              name: decodeURIComponent(el),
              link: route,
            };
          }),
        ];
        res.render("home.hbs", {
          ...context,
          root: req.user + normalizedFolderPath,
        });
      });
    });
  } catch {
    res.redirect("/home");
  }
});

app.post("/files/add", function (req, res) {
  const fileName = req.fields.name;
  const extention = req.fields.extention;
  if (!fileName) {
    res.redirect("/home/" + rootFolder.replace("\\", "/"));
    return;
  }
  const rootFolder = req.fields.root;

  newFile(fileName, extention, path.join(req.user, rootFolder));
  res.redirect("/home/" + rootFolder.replace("\\", "/"));
});

app.post("/files/delete", function (req, res) {
  const fileName = req.fields.name;
  const rootFolder = req.fields.root;

  if (!fileName) {
    res.redirect("/home/" + rootFolder.replace("\\", "/"));
    return;
  }

  deleteFile(fileName, path.join(req.user, rootFolder));
  res.redirect("/home/" + rootFolder.replace("\\", "/"));
});

app.post("/files/upload", function (req, res) {
  const file = req.files.file;
  const rootFolder = req.fields.root;

  if (file.length) {
    file.forEach((el) => {
      if (el && el.name) {
        const fileName = el.path.split("\\").pop();
        renameInFolder(
          fileName,
          path.join(req.user, rootFolder, encodeURIComponent(el.name))
        );
      }
    });
  } else {
    if (file && file.name) {
      const fileName = file.path.split("\\").pop();
      renameInFolder(
        fileName,
        path.join(req.user, rootFolder, encodeURIComponent(file.name))
      );
    }
  }
  res.redirect("/home/" + rootFolder.replace("\\", "/"));
  // form.parse(req);
});

app.post("/folders/add", function (req, res) {
  const folderName = req.fields.name;
  const rootFolder = req.fields.root;

  if (!folderName) {
    res.redirect("/home/" + rootFolder.replace("\\", "/"));
    return;
  }
  newFolder(folderName, path.join(req.user, rootFolder));
  res.redirect("/home/" + rootFolder.replace("\\", "/"));
});

app.post("/folders/delete", function (req, res) {
  const folderName = req.fields.name;
  const rootFolder = req.fields.root;

  deleteFolder(folderName, path.join(req.user, rootFolder));
  res.redirect("/home/" + rootFolder.replace("\\", "/"));
});

app.post("/folders/rename", function (req, res) {
  const folderName = req.fields.name;
  const rootFolder = req.fields.root;
  const route = rootFolder.split("\\");
  const oldName = route.pop();
  renameInFolder(oldName, folderName, path.join(...route));
  res.redirect(
    "/home/" + path.join(...route).replace("\\", "/") + "/" + folderName
  );
});

app.get("/editor/*", function (req, res) {
  const extention = req.params[0].split(".").pop();
  if (textExtentions.includes(extention)) {
    getFileContent(path.join(req.user, req.params[0])).then((content) => {
      res.render("editor.hbs", {
        ...context,
        filepath: req.params[0],
        filecontent: content,
      });
    });
  } else if (imageExtentions.includes(extention)) {
    res.render("imageEditor.hbs", {
      ...context,
      filters: imageFilters,
      filepath: req.params[0],
    });
  } else {
    res.send("No Editor for this file exatention :(");
  }
});

app.post("/save", function (req, res) {
  saveFile(
    path.join(req.user, req.fields.filepath),
    req.fields.filecontent
  ).then(() => {
    res.send();
  });
});

app.get("/inspect/*", function (req, res) {
  const filepath = path.join(req.user, req.params[0].replace("/", "\\"));
  res.sendFile(path.join(uploadPath, filepath));
});

app.post("/file/rename", function (req, res) {
  const filepath = req.fields.filepath;
  let root = req.fields.filepath.split("\\");
  root.pop();
  root = root.join("/");
  const newname = req.fields.name;
  renameInFolder(filepath, path.join(req.user, newname)).then(() => {
    res.redirect("/editor/" + root + "/" + newname);
  });
});

app.get("/api/settings", function (req, res) {
  getFileContent("../data/editorSettings.json").then((content) => {
    res.send(content);
  });
});

app.post("/api/settings", function (req, res) {
  console.log(req.body);
  const preset = req.body;

  saveFile("../data/editorSettings.json", JSON.stringify(preset)).then(() => {
    res.send();
  });
});

app.post("/api/save-image", function (req, res) {
  saveImage(
    req.files["new-image"],
    path.join(req.user, req.fields["image-name"])
  );

  res.send();
});

app.get("/login", function (req, res) {
  if (req.signedCookies.user) {
    res.redirect("/home");
  }

  res.render("login.hbs", context);
});

app.post("/login", function (req, res) {
  logIn(req.fields.username, req.fields.password).then((message) => {
    if (message === "ok") {
      res.cookie("user", req.fields.username, {
        signed: true,
        maxAge: 10 * 60 * 1000,
        httpOnly: true,
      });
      res.redirect("/home");
    } else {
      res.render("login.hbs", { ...context, error: message });
    }
  });
});

app.get("/register", function (req, res) {
  if (req.cookies.user) {
    res.redirect("/home");
  }

  res.render("register.hbs", context);
});

app.post("/register", function (req, res) {
  console.log(req.fields)
  register(
    req.fields.username,
    req.fields.password,
    req.fields.passwordconfirm
  ).then((message) => {
    if (message === "ok") {
      res.cookie("user", req.fields.username, {
        signed: true,
        maxAge: 10 * 60 * 1000,
        httpOnly: true,
      });
      newFolder(req.fields.username);
      res.redirect("/home");
    } else {
      res.render("register.hbs", { ...context, error: message });
    }
  });
});

app.get("/logout", function (req, res) {
  res.clearCookie("user");
  res.redirect("/login");
});

app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT, "\nhttp://localhost:" + PORT);
});
