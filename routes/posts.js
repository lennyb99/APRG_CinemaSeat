module.exports = function(app, db,passwordHasher){

    app.post("/submit_login", function (req, res) {
        const email = req.body.email;
        const passwort = req.body.passwort;
        
        // Holt den Benutzer mit der übergebenen "email" aus der DB.
        db.get( `SELECT * FROM benutzer WHERE email = "${email}"`, function(err, rows) {
            // Wenn diese Email nicht existiert, ist rows = undefinied.
            if (rows == undefined) {
                res.render("login", {fehlertext: "Der eingegebene Benutzer existiert nicht!"})
            }
            else if (passwordHasher.verify(passwort, rows.passwort) ) { //passwordHasher.verify(x, hashedY) vergleicht, ob hashedY mit x übereinstimmt.
                res.redirect("home");
                // Session wird erstellt TODO
            }
            else {
                res.render("login", {fehlertext: "Das Passwort stimmt nicht!"});
            }
        });  
    });





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

};