// Importiert das Skript "functionLibrary.js" mit den Hilfsfunktionen.
const fl = require("./scripts/functionLibrary.js");

// Initialisiert Module ------------------------------------------
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


//Den Ordner Public Freigeben ----------------------------------------
app.use(express.static(__dirname + '/public'));


// Startet den Server ------------------------------------------------
app.listen(3000, function () {
    console.log('listening on 3000');
});


// GET-Requests ------------------------------------------------------
// Redirect zur Startseite, falls keine angegeben. 
app.get('/', function (req, res) {
    res.redirect('/home');
});

// Link zur Homepage
app.get('/home', function (req, res) {
    res.sendFile(__dirname + "/views/home.html")
});

//Link zur Login-Seite
app.get("/goto_login", function (req, res) {
    res.render("login.ejs", {fehlertext: ""});
});

//Link zur Registrieungsseite
app.get("/goto_register", function (req, res) {
    res.render("register", {fehlertext: ""});

})
//Link zur Kino-infopage
app.get("/goto_info", function (req, res) {
    res.sendFile(__dirname + "/views/info.html")
});

//Link zu Erfolgreiche Anmeldung(EJS)
app.get("/submit_login", function (req, res) {
    res.render("account")
});

//Link zu Kontoeinstellungen(EJS)
app.get("/goto_account_settings", function (req, res) {
    res.render("account_settings", { "vorname": rows[0].vorname, "nachname": rows[0].nachname, "email": email, })
});

//Link zur Film-Detailansicht
app.get("/goto_program", function (req, res){
    res.render("program")
});


// POST-Requests --------------------------------------------------------------

// Registrierung eines neuen Benutzers:
// Wird aufgerufen, wenn auf den Registrieren-Button auf der Seite "register.html" geklickt wird.
app.post("/oncreate", function (req, res) {
    const email = req.body.email;
    const passwort = req.body.passwort;
    const vorname = req.body.vorname;
    const nachname = req.body.nachname;
    
    // Holt den Benutzer mit der übergebenen "email" aus der DB und prüft, ob er bereits exisitert. Wenn ja, dann wird "register.ejs" mit einer Fehlermeldung
    // neu gerendert und diese ganze "oncreate"-Funktion wird abgebrochen.
    db.get( `SELECT email FROM benutzer WHERE email = "${email}"`, function(err, rows) {
        if (rows != undefined) {
            res.render("register", {fehlertext: "Diese Email ist bereits vergeben!"})
            return;
        }
    });
    
                                                                                                                       // Fügt das gehashte Passwort in die DB ein!!!
    db.run( `INSERT INTO benutzer(email,vorname,nachname,passwort,rolle) VALUES ("${email}","${vorname}","${nachname}","${passwordHasher.generate(passwort)}", "user")`, 
        function(err, rows) {
            res.render("login", {fehlertext: "Erfolgreich registriert!"})
        });
});


// Login:
// Wird aufgerufen, wenn auf den Login-Button auf der Seite "login.html" geklickt wird.
app.post("/submit_login", function (req, res) {
    const email = req.body.email;
    const passwort = req.body.passwort;
    
    // Holt den Benutzer mit der übergebenen "email" aus der DB.
    db.get( `SELECT * FROM benutzer WHERE email = "${email}"`, function(err, rows) {
        // Wenn diese Email nicht existiert, ist rows = undefinied.
        if (rows == undefined) {
            res.render("login", {fehlertext: "Der eingegebene Benutzer existiert nicht!"})
        }
        else if ( passwordHasher.verify(passwort, rows.passwort) ) { //passwordHasher.verify(x, hashedY) vergleicht, ob hashedY mit x übereinstimmt.
            res.redirect("home.html");
            // Session wird erstellt TODO
        }
        else {
            res.render("login", {fehlertext: "Das Passwort stimmt nicht!"});
        }
    });  
});