module.exports = function(app, db, passwordHasher) {

    // Link zur Homepage mit "/" ...
    app.get("/", function (req, res) {
        res.redirect("/home"), {fehlertext: undefined};
    });
    // und mit "/home"
    app.get("/home", function (req, res) {
        res.render("home", {sessionVariables: req.session.sVariables, fehlertext: undefined});
    });
    
    //Link zur "Über das Kino"-Seite
    app.get("/goto_info", function (req, res) {
        res.render("info", {sessionVariables: req.session.sVariables})
    });

    // Link zur Login-Seite
    app.get("/goto_login", function (req, res) {
        // Prüft ob man bereits eingeloggt ist. Wenn ja, kommt man zur Startseite.
        if (req.session.sVariables) {
            res.redirect('/home'),{fehlertext: undefined};
        }
        else {
            res.render("login_and_register/login", {fehlertext: undefined, sessionVariables: req.session.sVariables});
        }
    });

    // Link zur Registrieungsseite
    app.get("/goto_register", function (req, res) {
        // Prüft ob man bereits eingeloggt ist. Wenn ja, kommt man zur Startseite.
        if (req.session.sVariables) {
            res.redirect('/home'),{fehlertext: undefined};
        }
        else {
            res.render("login_and_register/register", {fehlertext: undefined, sessionVariables: req.session.sVariables});
        }
    });


    //Link zu Erfolgreiche Anmeldung(EJS)
    app.get("/submit_login", function (req, res) {
        res.render("user_sites/account")
    });

    //Link zum Logout
    app.get("/goto_logout", function (req, res){
        req.session.sVariables = undefined;
       res.render("home", {fehlertext: "Erfolgreich abgemeldet", sessionVariables: req.session.sVariables});
   });

     //Link zu Kontoeinstellungen
    app.get("/goto_account_settings", function (req, res) {        
            res.render("user_sites/account_settings", {sessionVariables: req.session.sVariables}); 
    }); 
   
     //Link zur Benutzerverwaltung (Admin Only)
     app.get("/goto_user_manager", function (req, res) {
        db.all(`SELECT * FROM benutzer;`,function(err,rows) {
            
            res.render("admin_sites/user_manager", { "vorname": rows[0].vorname, "nachname": rows[0].nachname, "email": rows[0].email, "rolle": rows[0].rolle, sessionVariables: req.session.sVariables});
        });
    });
    
    //Link zu Account Löschen 
    app.get("/goto_delete_account", function (req, res) {   
        db.run(`DELETE FROM benutzer WHERE email = "${req.session.sVariables.userEmail}";`,function(err,rows) {
            req.session.sVariables = undefined;
            res.render("home", {fehlertext: "Das Benutzerkonto wurde erfolgreich gelöscht.", sessionVariables: req.session.sVariables}); 
        });
    });


    //Link zur Film-Detailansicht
    app.get("/goto_program", function (req, res) {
        db.all(`SELECT * FROM filmprogramm;`,function(err,rows) {
            var aktuellesProgramm = []
            var kennungen = []
            for(var i = 0; i < rows.length; i++){
                aktuellesProgramm.push(rows[i].filmtitel)
                kennungen.push(rows[i].kennung)
            }
            res.render("program", {
                filmtitel : aktuellesProgramm,
                fotokennung: kennungen,
                sessionVariables: req.session.sVariables
            });
        });
    });

    // Link zur Benutzerverwaltung
    app.get("/goto_user_manager", function (req, res) {
        db.all(`SELECT * FROM benutzer;`,function(err,rows) {
            var vornamen = []
            var nachnamen = []
            var emails = []
            for(var i = 0; i < rows.length; i++){
                vornamen.push(rows[i].vorname)
                nachnamen.push(rows[i].nachname)
                emails.push(rows[i].email)
            }
            console.log(rows)
            console.log(rows.length)
            res.render("admin_sites/user_manager", {
                vornamen: vornamen, nachname: nachnamen, email: emails});
        });
        console.log(rows)
        console.log(rows.length)
    });

};