module.exports = function(app, db, passwordHasher) {

    //Link zur Kino-infopage
    app.get("/goto_info", function (req, res) {
        res.render("info.ejs", {sessionUserName: req.session.userName})
    });

    // Redirect zur Startseite, falls keine angegeben. 
    app.get('/', function (req, res) {
        res.redirect('/home', {sessionUserName: req.session.userName});
    });

    // Link zur Homepage
    app.get('/home', function (req, res) {
        res.render("home", {sessionUserName: req.session.userName});
    });

    //Link zur Login-Seite
    app.get("/goto_login", function (req, res) {
        res.render("login.ejs", {fehlertext: "", sessionUserName: req.session.userName});
    });

    //Link zur Registrieungsseite
    app.get("/goto_register", function (req, res) {
        res.render("register", {fehlertext: "", sessionUserName: req.session.userName});
    });

    // INFO LINK HIER REIN!!

    //Link zu Erfolgreiche Anmeldung(EJS)
    app.get("/submit_login", function (req, res) {
        res.render("account")
    });

    //Link zu Kontoeinstellungen(EJS)
    app.get("/goto_account_settings", function (req, res) {
        db.all(`SELECT * FROM benutzer;`,function(err,rows) {
            
            res.render("account_settings", { "vorname": rows[0].vorname, "nachname": rows[0].nachname, "email": rows[0].email, "rolle": rows[0].rolle,sessionUserName: req.session.userName });
        });
    });
   
     //Link zur Benutzerverwaltung (Admin Only)
     app.get("/goto_user_manager", function (req, res) {
        db.all(`SELECT * FROM benutzer;`,function(err,rows) {
            
            res.render("user_manager", { "vorname": rows[0].vorname, "nachname": rows[0].nachname, "email": rows[0].email, "rolle": rows[0].rolle,sessionUserName: req.session.userName });
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
                sessionUserName: req.session.userName
            });
        });
    });

    //Link zur benutzerverwaltung
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
            res.render("user_manager", {
                vornamen: vornamen, nachname: nachnamen, email: emails});
        });
        console.log(rows)
        console.log(rows.length)
    });
};