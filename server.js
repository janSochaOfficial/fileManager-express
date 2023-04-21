import express from "express";
import path from "path";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import { __dirname } from "./consts/uploadPath.js";

import { newFile } from "./func/fileMenagment.js"


const app = express()
const PORT = 3000;

app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', exphbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');                           // określenie nazwy silnika szablonów

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('static'))

const helpers = {
    compareString: function(p, q, options) {
        return (p == q) ? options.fn(this) : options.inverse(this);
    }
}

const context = {
    helpers
}

app.get("/", function (req, res) {
    res.render('home.hbs', context);
})

app.post("/files/add", function (req, res) {
    

    res.redirect("/");
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