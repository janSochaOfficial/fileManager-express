const express = require("express")
const app = express()
const PORT = 3000;

const path = require("path")
const hbs = require('express-handlebars')
const bodyParser = require('body-parser')
const fs = require("fs").promises


app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');                           // określenie nazwy silnika szablonów

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('static'))

const helpers = {
    compareString: function(p, q, options) {
        return (p == q) ? options.fn(this) : options.inverse(this);
    }
}

const uploadPath = path.join(__dirname, "upload");

const context = {
    helpers
}

app.get("/", function (req, res) {
    newFile("plik")
    deleteFile("plik.txt")
    res.render('home.hbs', context);
})

app.get("/form", function (req, res) {
    res.render('form.hbs', context);
})

app.post("/post", function (req, res) {
    console.log(req.body)
    const newCtx = {
        ...context,
        size: req.body.size
    }
    res.render('post.hbs', newCtx);
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT, "\nhttp://localhost:" + PORT)
})

async function newFile(fileName, folderPath = ""){
    let name = fileName
    while (true){
        try {
            if(await isInFolder(name + ".txt", folderPath)){
                name += "_kopia"
                continue;
            }
            await fs.writeFile(path.join(uploadPath, folderPath, `${name}.txt`), "aa")
            break;
        }
        catch {
            console.error("nie dodano");
            break;
        }
    }
}
async function newFolder(folderName, folderPath = "") {
    let name = folderName
    while (isInFolder(name, folderPath)){
        name += "_kopia"
    }

    await fs.mkdir(path.join(uploadPath, folderPath, folderName))
}

async function isInFolder(fileName, folderPath = "") {
    return fs.promises.access(path.join(uploadPath, folderPath), fs.constants.F_OK)
        .then(() => true)
        .catch(() => false)
}

async function deleteFolder(folderName, folderPath = ""){
    try{
        await fs.rmdir(path.join(uploadPath, folderPath, folderName))
    }
    catch {
        console.error("nie usinięto");
    }
}

async function deleteFile(fileName, folderPath = ""){
    try{
        await fs.unlink(path.join(uploadPath, folderPath, fileName))
    }
    catch {
        console.error("nie usinięto");
    }
}