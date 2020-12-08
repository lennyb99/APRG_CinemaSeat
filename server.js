// Initialisiere Modul Express
const express = require('express');
const app = express();

// Initialisiere Modul body-parser 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Initialisiere EJS Template Engine
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// Initialisiere Datenbankmodul sqlite3
const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database('cinema.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the cinema database.');
});

// Initialisiere Modul cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Initialisiere Modul express-session
const session = require('express-session');
app.use(session({
    secret: 'example',
    resave: false,
    saveUninitialized: true
}));


app.listen(3000, function () {
    console.log('listening on 3000');
});


//Den Ordner Public Freigeben
app.use(express.static(__dirname + '/public'));




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
    res.sendFile(__dirname + "/views/login.html")
});
//Link zur Registrieungsseite
app.get("/goto_register", function (req, res) {
    res.sendFile(__dirname + "/views/register.html")

})
//Link zur Kino-infopage
app.get("/goto_info", function (req, res) {
    res.sendFile(__dirname + "/views/info.html")
});
//Link zur Fehlerhaften Registrierung
app.get("/goto_register_error", function (req, res) {
    res.sendFile(__dirname + "/views/register_error.html")
});
//Link zur Erfolgreichen Registrierung
app.get("/goto_register_success", function (req, res) {
    res.sendFile(__dirname + "/views/register_success.html")
});
//Link zu Fehlerhaften Login-Daten
app.get("/goto_login_error", function (req, res) {
    res.sendFile(__dirname + "/views/login_error.html")
});
//Link zu Erfolgreiche Anmeldung(EJS)
app.get("/submit_login", function (req, res) {
    res.render("account")
});
//Link zu Kontoeinstellungen(EJS)
app.get("/goto_account_settings", function (req, res) {
    res.render("account_settings", { "vorname": rows[0].vorname, "nachname": rows[0].nachname, "email": email, })

});

//link zur Film-Detailansicht
app.get("/goto_program", function (req, res){
    res.render("program")

});


//POST-Request zum Registrieren eines neuen Benutzers

app.post("/oncreate", function (req, res) {
    const email = req.body.email;
    const passwort = req.body.passwort;
    const vorname = req.body.vorname;
    const nachname = req.body.nachname;
    (benutzerHinzufuegen(email, vorname, nachname, passwort));
    if (benutzerHinzufuegen.inputError) {
        res.redirect("goto_register_error")
    }
    else {
        res.redirect("goto_register_success")
    }
});
//POST-Request zur Login überprüfung

app.post("/submit_login", function (req, res) {
    const email = req.body.email;
    const passwort = req.body.passwort;
    const sql = `SELECT * FROM benutzer WHERE email = "${email}"`;
    loginCheck(email, passwort);

    /*  Methode, um einen neuen Benutzer in der Datenbank anzulegen. Der Benutzername und das Passwort des neuen Nutzers 
        müssen beim Aufruf übergeben werden */

    // TODO: Überprüfung auf Benutzer bereits vorhanden
    function benutzerHinzufuegen(email, vorname, nachname, passwort) {
        var inputError = false;
        if (!email || !passwort || !vorname || !nachname) {
            inputError = true;
            return;
        }
        db.run(
            `INSERT INTO benutzer(email,vorname,nachname,passwort) VALUES ("${email}","${vorname}","${nachname}","${passwort}")`
        );
        inputError = false;
    }

    // Methode zum Zugangsdaten Prüfen und Login bzw. entsprechende Ausgabe. Es wird zunächst mit sql und rows.length geprüft
    //ob die eingegebene Email in der DB vorhanden ist, dann werden die Passwörter abgeglichen.
    function loginCheck(email, passwort) {
        state = false;
        db.all(sql, function (err, rows) {

            console.log(rows[0].passwort);
            console.log(rows[0]);
            if (rows.length) {
                console.log(rows.length);
                if (rows[0].passwort == req.body.passwort) {
                    state = true;
                    console.log(rows[0].passwort)
                };
            };
            if (state) {
                res.render("account", { "vorname": rows[0].vorname, "nachname": rows[0].nachname, "email": email, })

            };

            if (!state) {
                res.redirect("goto_login_error")
            };

        });

    };



    /* Methode, um einen bestimmten Nutzer aus der Datenbank zu entfernen. Die ID des Benutzers aus der Datenbank muss übergeben werden. */

    function benutzerLoeschen(id) {
        db.run(
            `DELETE FROM benutzer WHERE id=${id}`,
        )
    }
})
