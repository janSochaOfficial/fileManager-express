const express = require("express")
const app = express()
const PORT = 3000;

const path = require("path")
const hbs = require('express-handlebars')
const bodyParser = require('body-parser')

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

const addons = ["peperoni", "mushroms", "pinaple"]

const context = {
    helpers,
    list: ["milk", "butter", "bread"]

}


app.get("/", function (req, res) {
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