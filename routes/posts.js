module.exports = function(app, db,passwordHasher){

    // Login:
    // Wird aufgerufen, wenn auf den Login-Button auf der Seite "login.html" geklickt wird.
    app.post("/submit_login", function (req, res) {
        const email = req.body.email;
        const passwort = req.body.passwort;
        
        // Holt den Benutzer mit der übergebenen "email" aus der DB.
        db.get( `SELECT * FROM benutzer WHERE email = "${email}"`, function(err, rows) {
            // Wenn diese Email nicht existiert, ist rows = undefinied.
            if (rows == undefined) {
                res.render("login", {fehlertext: "Der eingegebene Benutzer existiert nicht!"});
            }
            else if (passwordHasher.verify(passwort, rows.passwort)) { //passwordHasher.verify(unhashedX, hashedY) vergleicht, ob hashedY mit unhashedX übereinstimmt.
                // erstellt Session:
                req.session.userName = rows.vorname;
                res.render("home", {sessionUserName: req.session.userName});
            }
            else {
                res.render("login", {fehlertext: "Das Passwort stimmt nicht!"});
            }
        });  
    });


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
                res.render("register", {fehlertext: "Diese Email ist bereits vergeben!"});
                return;
            }
        });
    
                                                                                                                            // Fügt das gehashte Passwort in die DB ein!!!
        db.run( `INSERT INTO benutzer(email,vorname,nachname,passwort,rolle) VALUES ("${email}","${vorname}","${nachname}","${passwordHasher.generate(passwort)}", "user")`, 
            function(err, rows) {
                res.render("login", {fehlertext: "Erfolgreich registriert!"});
        });
    });


    // Wird aufgerufen, wenn der Nutzer den "jetzt Ticket kaufen" Button auf der Seite program.ejs drückt.
    app.post("/getMovieSelect", function(req, res){
        var kennung = req.body.kennung;

        db.get(`SELECT * FROM filmprogramm WHERE kennung = "${kennung}";`,function(err,rows){
            
            titel = rows.filmtitel
            beschreibung = rows.beschreibung
            preis = rows.eintrittspreis
            trailer = rows.trailer
            
            
            res.render("movieSelect",{titel, beschreibung, preis, trailer, kennung, sessionUserName: req.session.userName});
        })  
    })


    // Wird aufgerufen, wenn der Nutzer den "Zur Sitzwahl" Button drückt und leitet weiter zu seatSelect.ejs
    app.post("/getSeatSelect", function(req,res){
        kennung = req.body.kennung

        db.get(`SELECT * FROM filmprogramm WHERE kennung = "${kennung}";`,function(err,rows){
            
            titel = rows.filmtitel
            beschreibung = rows.beschreibung
            preis = rows.eintrittspreis
            trailer = rows.trailer
    
            res.render("seatSelect",{kennung, titel, sessionUserName: req.session.userName});
        })  
    })

};