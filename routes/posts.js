module.exports = function(app, db, passwordHasher){

    // Login:
    // Wird aufgerufen, wenn auf den Login-Button auf der Seite "login.html" geklickt wird.
    app.post("/submit_login", function (req, res) {
        const email = req.body.email;
        const passwort = req.body.passwort;
        
        // Holt den Benutzer mit der übergebenen "email" aus der DB.
        db.get( `SELECT * FROM benutzer WHERE email = "${email}"`, function(err, rows) {
            // Wenn diese Email nicht existiert, ist rows = undefinied.
            if (rows == undefined) {
                res.render("login_and_register/login", {fehlertext: "Benutzer existiert nicht!", sessionVariables: undefined});
            }     
            else if (passwordHasher.verify(passwort, rows.passwort)) { //passwordHasher.verify(unhashedX, hashedY) vergleicht, ob hashedY mit unhashedX übereinstimmt.
                // erstellt Session(-variablen): (siehe Kommentar in navbar.ejs)
                req.session.userName = rows.vorname;
                req.session.userMail = rows.email;
                req.session.userLastname = rows.nachname;
                req.session.role = rows.rolle;
                req.session.sVariables = {
                    userName: rows.vorname,
                    userEmail: rows.email,
                    userLastname: rows.nachname,
                    role: rows.rolle
                }
                res.redirect("home");
            }
            else {
                res.render("login_and_register/login", {fehlertext: "Passwort stimmt nicht!", sessionVariables: undefined});
            }
        });  
    });
    

    // Registrierung:
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
                res.render("login_and_register/register", {fehlertext: "Email bereits vergeben!", sessionVariables: undefined});
                return;
            }
        });
    
                                                                                                                            // Fügt das gehashte Passwort in die DB ein!!!
        db.run( `INSERT INTO benutzer(email,vorname,nachname,passwort,rolle) VALUES ("${email}","${vorname}","${nachname}","${passwordHasher.generate(passwort)}", "user")`, 
            function(err, rows) {
                res.render("login_and_register/login", {fehlertext: "Erfolgreich registriert!", sessionVariables: undefined});
        });
    });

    // Wird aufgerufen, wenn über das Admin-Panel ein neuer Benutzer hinzugefügt wird
    app.post("/oncreate_admin", function (req, res) {
        const email = req.body.email;
        const passwort = req.body.passwort;
        const vorname = req.body.vorname;
        const nachname = req.body.nachname;
    
        // Holt den Benutzer mit der übergebenen "email" aus der DB und prüft, ob er bereits exisitert. Wenn ja, dann wird "register.ejs" mit einer Fehlermeldung
        // neu gerendert und diese ganze "oncreate"-Funktion wird abgebrochen.
        db.get( `SELECT email FROM benutzer WHERE email = "${email}"`, function(err, rows) {
            if (rows != undefined) {
                res.render("admin_sites/add_user", {fehlertext: "Email bereits vergeben!", sessionVariables: req.session.sVariables});
                return;
            }
        });
        
                                                                                                                            // Fügt das gehashte Passwort in die DB ein!!!
        db.run( `INSERT INTO benutzer(email,vorname,nachname,passwort,rolle) VALUES ("${email}","${vorname}","${nachname}","${passwordHasher.generate(passwort)}", "user")`, 
            function(err, rows) {
                
        });

        //Weil nach dem hinzufügen des Benutzers wieser user_manager aufgerufen wird, muss auch allUsers neu übergeben werden
        db.all(`SELECT * FROM benutzer;`,function(err,rows) {
            var allUsers  =[]
            // Aus der DB werden alle Benutzer als "rows" ausgelesen und im array allUsers gespeichert
            for (var i = 0; i < rows.length; i++){
                allUsers.push(rows[i])
            }
            console.log(allUsers)
            //Das Array wird an user_manager übergeben und dort wieder ausgelesen (siehe user_manager)
            res.render("admin_sites/user_manager", {allUsers: allUsers,fehlertext: "Erfolgreich registriert!", sessionVariables: req.session.sVariables});
        });
    });

    //Benutzer Löschen aus dem Admin-Panel heraus
      app.post("/goto_delete_account_admin", function (req, res) {  
          var delete_user = req.body.delete_user;
        db.run(`DELETE FROM benutzer WHERE email = "${delete_user}";`,function(err,rows) {
            res.render("home", {fehlertext: "Das Benutzerkonto wurde erfolgreich gelöscht.", sessionVariables: req.session.sVariables}); 
        });
    });
    
    // Wird aufgerufen, wenn der Nutzer den "jetzt Ticket kaufen" Button auf der Seite program.ejs drückt.
    app.post("/getMovieSelect", function(req, res){
        var kennung = req.body.kennung;
    console.log(kennung);
        db.get(`SELECT * FROM filmprogramm WHERE kennung = "${kennung}";`,function(err,rows){
         
            titel = rows.filmtitel
            beschreibung = rows.beschreibung
            preis = rows.eintrittspreis
            trailer = rows.trailer
            
            
            res.render("movieSelect",{titel, beschreibung, preis, trailer,kennung, sessionVariables: req.session.sVariables});
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
    
            res.render("seatSelect", {kennung, titel, sessionVariables: req.session.sVariables});
        })  
    })

    //Link zur Filmprogrammverwaltung
    app.post("/addMovie", function(req, res){
        allUsers = res.allUsers;
        
        
        res.render("admin_sites/movie_manager", { fehlertext: undefined, allUsers: allUsers, sessionVariables: req.session.sVariables})
    })

    app.post("/getBuyConfirm", function(req, res){

        sitzplatz = req.body.sitzplatz
        db.get(`SELECT * FROM filmprogramm WHERE kennung = "${kennung}";`,function(err,rows){
            
            filmtitel = rows.filmtitel
            
            // Saalsitze auslesen
            var seatsDb = rows.saalsitze
            // Saalsitze in Array
            var seats = stringToArraySeats(seatsDb);
            // Sitzplatz wird besetzt
            seats[sitzplatz[0]-1][sitzplatz[1]-1] = (1).toString()
            // Saalsitze in String
            seatsDbUpdated = arrayToStringSeats(seats)

            db.run(`UPDATE filmprogramm SET saalsitze = "${seatsDbUpdated}" WHERE kennung = "${kennung}";`, function(err){
                if(err){
                    console.log(err)
                    
                }
                console.log("updated!")
            })

            res.render("buyConfirm",{kennung,sitzplatz,filmtitel,sessionVariables: req.session.sVariables})
        });
    })




    /* Ändert das Array der Saalsitze in Stringformat, um in die Datenbank zu schicken */
    function arrayToStringSeats(seats){
        var seatsString = ""

        for (var i = 0; i < 3;i++){
            for (var j = 0; j < 3; j++){
                seatsString += i.toString() + j.toString() + seats[i][j].toString();
            }
        }

        return seatsString.toString()
    }


    /* Ändert den String aus der Datenbank in ein Array, um Zugriff und Lesbarkeit zu erleichtern*/
    function stringToArraySeats(seats){
        seatsArray = [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ];
        count = 0;

        for (var j = 0; j < 9; j++){
            seatsArray[seats[count]][seats[count+1]] = seats[count+2]
            count += 3
        }

        return seatsArray
    }


};