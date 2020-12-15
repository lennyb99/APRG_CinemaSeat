module.exports = function(app, db,passwordHasher){

    //Link zur Kino-infopage
    app.get("/goto_info", function (req, res) {
        res.render("info.ejs")
    });
    

    // Redirect zur Startseite, falls keine angegeben. 
    app.get('/', function (req, res) {
        res.redirect('/home');
    });

    // Link zur Homepage
    app.get('/home', function (req, res) {
        res.render("home.ejs")
    });

    //Link zur Login-Seite
    app.get("/goto_login", function (req, res) {
        res.render("login.ejs", {fehlertext: ""});
    });

    //Link zur Registrieungsseite
    app.get("/goto_register", function (req, res) {
        res.render("register", {fehlertext: ""});

    })
    // INFO LINK HIER REIN!!

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
        
        db.all(`SELECT * FROM filmprogramm;`,function(err,rows){
            var aktuellesProgramm = []
            var kennungen = []
            for(var i = 0; i < rows.length; i++){
                aktuellesProgramm.push(rows[i].filmtitel)
                kennungen.push(rows[i].kennung)
            }
            res.render("program", {
                filmtitel : aktuellesProgramm,
                fotokennung: kennungen
            })
        })
    });
    
}