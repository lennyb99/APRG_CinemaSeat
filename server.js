// Importiert das Skript mit den Hilfsfunktionen.
const fl = require("./scripts/functionLibrary.js");

// Initialisiert Module -------------------------------------------------------
// "express"
const express = require('express');
const app = express();

// "body-parser"
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// "ejs"
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// "sqlite3"
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('cinema.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the cinema database.');
});

// "cookie-parser"
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// "express-session"
const session = require('express-session');
app.use(session({
    secret: 'example',
    resave: false,
    saveUninitialized: true
}));

// "password-hash"
const passwordHasher = require("password-hash");

// Den Ordner Public Freigeben --------------------------------------------------
app.use(express.static(__dirname + '/public'));

// Startet den Server -----------------------------------------------------------
app.listen(3000, function () {
    console.log('listening on 3000');
});

// GET/-POST-Requests liegen im Routes-Ordner -----------------------------------
require('./routes')(app,db,passwordHasher);