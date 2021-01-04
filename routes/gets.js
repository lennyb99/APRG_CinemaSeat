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
            var allUsers  =[]
            // Aus der DB werden alle Benutzer als "rows" ausgelesen und im array allUsers gespeichert
            for (var i = 0; i < rows.length; i++){
                allUsers.push(rows[i])
            }
            console.log(allUsers)
            //Das Array wird an user_manager übergeben und dort wieder ausgelesen (siehe user_manager)
            res.render("admin_sites/user_manager", { fehlertext: undefined, allUsers: allUsers, sessionVariables: req.session.sVariables});
        });
    });

    //Link zur Filmprogrammverwaltung
    app.get("/getmovie_manager", function(req, res){
        db.all(`SELECT * FROM filmprogramm;`, function(err,rows){
            allUsers = res.allUsers;
            allMovies = []
            for(i=0; i<rows.length;i++){
                allMovies.push(rows[i])
            }   
            res.render("admin_sites/movie_manager", { fehlertext: undefined,allMovies: allMovies, allUsers: allUsers, sessionVariables: req.session.sVariables})
        }) 
    })
    
    //Link zu Account Löschen 
    app.get("/goto_delete_account", function (req, res) {   
        db.run(`DELETE FROM benutzer WHERE email = "${req.session.sVariables.userEmail}";`,function(err,rows) {
            req.session.sVariables = undefined;
            res.render("home", {fehlertext: "Das Benutzerkonto wurde erfolgreich gelöscht.", sessionVariables: req.session.sVariables}); 
        });
    });

    //Link zu Account Löschen 
    app.get("/goto_add_user", function (req, res) {   
    
            res.render("admin_sites/add_user", {fehlertext: undefined, sessionVariables: req.session.sVariables}); 

    });

    //Link zur Film-Detailansicht
    app.get("/goto_program", function (req, res) {
        db.all(`SELECT * FROM filmprogramm;`,function(err,rows) {
            var aktuellesProgramm = []
            var kennungen = []
            var fotourl = []
            for(var i = 0; i < rows.length; i++){
                aktuellesProgramm.push(rows[i].filmtitel)
                kennungen.push(rows[i].kennung)
                fotourl.push(rows[i].fotourl)
            }
            res.render("program", {
                filmtitel : aktuellesProgramm,
                fotokennung: kennungen,
                fotourl: fotourl,
                sessionVariables: req.session.sVariables
            });
        });
    });
};