const { render } = require("ejs");

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
            res.render("admin_sites/user_manager", {allUsers: allUsers,fehlertext: "Neuer Benutzer hinzugefügt.", sessionVariables: req.session.sVariables});
        });
    });

    //Kontodaten verändern Admin + regular User
    app.post("/goto_edit_account", function (req, res){
        var edit_user = req.body.edit_user;
        db.run(`SELECT FROM benutzer WHERE email = "${edit_user}"; `, function(err,rows){
            res.render("user_sites/edit_account", {fehlertext: " ", sessionVariables: req.session.sVariables});
       
        });

    });


    //Änderung der Kontodaten Schreiben(Änderung in der DB)
    app.post("/edit_account", function (req, res){
        //If-Statements prüfen ob eine Eingabe getätigt wurde, wenn ja wird die Eingabe aus dem Formular in einer Variable gespeichert, wenn nein wird der Wert aus der Sessionvariable gespeichert.
        if(!req.body.email) {var email = req.session.sVariables.userEmail}
        else{var email = req.body.email} 

        if(!req.body.vorname){var vorname = req.session.sVariables.userName}
        else{var vorname = req.body.vorname}  
        
        if(!req.body.nachname){var nachname = req.session.sVariables.userLastname}
        else{var nachname = req.body.nachname}  
        
        if(!req.body.rolle){var rolle = req.session.sVariables.role}
        else{var rolle = req.body.rolle}
        var passwort;
        console.log(rolle)
        //Abfrage ob das eingegebene Passwort mit dem aus der Datenbank übereinstimmt, zur Sicherheitsüberprüfung. Eine Änderung der Nutzerdaten ist nur mit Passwort möglich, oder Admin-Rolle
       
            db.get( `SELECT * FROM benutzer WHERE email = "${req.session.sVariables.userEmail}"`, function(err, rows) {
                
                if (!passwordHasher.verify(req.body.passwort,rows.passwort)) {
                    console.log(err)
                    res.render("user_sites/edit_account", {fehlertext: "Das Passwort ist Falsch", sessionVariables: req.session.sVariables});
                    return;
                }
                if (req.body.passwort_neu){passwort = passwordHasher.generate(req.body.passwort_neu)}
                    else {passwort = rows.passwort}
                  
                
               
                //Daten werden neu in die DB geschrieben. Auch wenn nicht alle Daten geändert werden, werden alle Daten neu in die DB geschrieben
                //SetTimeout sorgt dafür dass db.run() erst nach  db.get() ausgeführt wird, ist nicht der schöne Weg, aber funktioniert
                 
                    db.run( `UPDATE benutzer SET email="${email}",vorname="${vorname}",nachname="${nachname}",passwort="${passwort}",rolle="${rolle}" WHERE email="${req.session.sVariables.userEmail}"`, function(err, rows){
                        res.render("login_and_register/login", {fehlertext: "Kontodaten geändert, bitte erneut anmelden.", sessionVariables: undefined});
                    });
              

            });
    });


  //Kontodaten verändern Admin
  app.post("/goto_user_manager_edit", function (req, res){
    var edit_user = req.body.edit_user;
    db.get(`SELECT * FROM benutzer WHERE email = "${edit_user}"; `, function(err,rows){
        req.AdminEdit = {
            userName: rows.vorname,
            userEmail: rows.email,
            userLastname: rows.nachname,
            role: rows.rolle
        }
        res.render("admin_sites/user_manager_edit", {fehlertext: " ", sessionVariables: req.session.sVariables, AdminEdit: req.AdminEdit});

    });
    
});


    //Bearbeitung eines Benutzers aus dem User-Manager heraus(nur als Admin möglich)
    app.post("/user_manager_edit", function (req, res){
    
        //If-Statements prüfen ob eine Eingabe getätigt wurde, wenn ja wird die Eingabe aus dem Formular in einer Variable gespeichert, wenn nein wird der Wert aus der Sessionvariable gespeichert.
        console.log(req.body.UserEmail)
        db.get( `SELECT * FROM benutzer WHERE email = "${req.body.UserEmail}"`, function(err, rows) {

        if(!req.body.email) {var email = rows.email}
        else{var email = req.body.email} 

        if(!req.body.vorname){var vorname = rows.vorname}
        else{var vorname = req.body.vorname}  
        
        if(!req.body.nachname){var nachname = rows.nachname}
        else{var nachname = req.body.nachname}  
        
        if(!req.body.rolle){var rolle = rows.rolle}
        else{var rolle = req.body.rolle}
        var passwort;
        console.log(rolle)

         //Passwort wird im Falle einer Änderung vorher gehashed       
        if (req.body.passwort_neu){passwort = passwordHasher.generate(req.body.passwort_neu)}
        else {passwort = rows.passwort}
                  
                //Daten werden neu in die DB geschrieben. Auch wenn nicht alle Daten geändert werden, werden alle Daten neu in die DB geschrieben
                //SetTimeout sorgt dafür dass db.run() erst nach  db.get() ausgeführt wird, ist nicht der schöne Weg, aber funktioniert
                
                    db.run( `UPDATE benutzer SET email="${email}",vorname="${vorname}",nachname="${nachname}",passwort="${passwort}",rolle="${rolle}" WHERE email="${req.body.UserEmail}"`, function(err, rows){
                       
                    });
                 
                 
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
            var fehlertext;
            titel = rows.filmtitel
            beschreibung = rows.beschreibung
            preis = rows.eintrittspreis
            trailer = rows.trailer
    
            res.render("seatSelect", {kennung, titel, sessionVariables: req.session.sVariables, fehlertext});
        })  
    })

    //Link zur Filmprogrammverwaltung
    app.post("/addMovie", function(req, res){
        db.run( `INSERT INTO filmprogramm(filmtitel,beschreibung,kennung, trailer, eintrittspreis,fotourl,saalsitze) 
                    VALUES ("${req.body.filmtitel}","${req.body.beschreibung}","${req.body.kennung}","${req.body.trailer}","${req.body.eintrittspreis}","${req.body.fotourl}","00f01f02f03f04f05f06f07f08f09f10f11f12f13f14f15f16f17f18f19f20f21f22f23f24f25f26f27f28f29f30f31f32f33f34f35f36f37f38f39f40f41f42f43f44f45f46f47f48f49f50f51f52f53f54f55f56f57f58f59f60f61f62f63f64f65f66f67f68f69f70f71f72f73f74f75f76f77f78f79f80f81f82f83f84f85f86f87f88f89f90f91f92f93f94f95f96f97f98f99f";`, 
            function(err, rows) {
        });
        db.all(`SELECT * FROM filmprogramm;`, function(err,rows){
            allUsers = res.allUsers;
            allMovies = []
            for(i=0; i<rows.length;i++){
                allMovies.push(rows[i])
            }   
            res.render("admin_sites/movie_manager", { fehlertext: undefined,allMovies: allMovies, allUsers: allUsers, sessionVariables: req.session.sVariables})
        })
    })

    app.post("/goto_delete_movie", function (req, res) {  
        var delete_movie = req.body.delete_movie;
        db.run(`DELETE FROM filmprogramm WHERE kennung = "${delete_movie}";`,function(err,rows) {
          // res.render("admin_sites/movie_manager", {fehlertext: "Der Film wurde erfolgreich gelöscht.", sessionVariables: req.session.sVariables}); 
        });
        db.all(`SELECT * FROM filmprogramm;`, function(err,rows){
            allUsers = res.allUsers;
            allMovies = []
            for(i=0; i<rows.length;i++){
                allMovies.push(rows[i])
            }   
            res.render("admin_sites/movie_manager", { fehlertext: undefined,allMovies: allMovies, allUsers: allUsers, sessionVariables: req.session.sVariables})
        })
    });

    app.post("/goto_edit_movie", function (req, res){
        edit_movie = req.body.edit_movie
        db.all(`SELECT * FROM filmprogramm WHERE kennung = "${edit_movie}";`,function(err,rows){            
            
            selectedMovie = rows[0];
            kennung = selectedMovie.kennung

            res.render("admin_sites/edit_movie", {sessionVariables: req.session.sVariables, selectedMovie : selectedMovie, kennung_old :kennung });
        })
    })

    app.post("/edit_Movie",function(req,res){
        kennung_old = req.body.kennung_old;
        if(!req.body.filmtitel_neu) {var filmtitel = selectedMovie.filmtitel}
        else{var filmtitel = req.body.filmtitel_neu} 

        if(!req.body.beschreibung_neu){var beschreibung = selectedMovie.beschreibung}
        else{var beschreibung = req.body.beschreibung_neu}  
        
        if(!req.body.kennung_neu){var kennung = selectedMovie.kennung}
        else{var kennung = req.body.kennung_neu}  
        
        if(!req.body.eintrittspreis_neu){var eintrittspreis = selectedMovie.eintrittspreis}
        else{var eintrittspreis = req.body.eintrittspreis_neu}

        if(!req.body.trailer_neu){var trailer = selectedMovie.trailer}
        else{var trailer = req.body.trailer_neu}

        if(!req.body.fotourl_neu){var fotourl = selectedMovie.fotourl}
        else{var fotourl = req.body.fotourl_neu}

        
        db.run(`UPDATE filmprogramm SET filmtitel="${filmtitel}",beschreibung="${beschreibung}",kennung="${kennung}",eintrittspreis="${eintrittspreis}",trailer="${trailer}",fotourl="${fotourl}" WHERE kennung="${kennung_old}"`,function(err){ 
        })
        db.all(`SELECT * FROM filmprogramm;`, function(err,rows){
            allUsers = res.allUsers;
            allMovies = []
            for(i=0; i<rows.length;i++){
                allMovies.push(rows[i])
            }   
            res.render("admin_sites/movie_manager", { fehlertext: undefined,allMovies: allMovies, allUsers: allUsers, sessionVariables: req.session.sVariables})
        })
    })

    

    

    app.post("/getBuyConfirm", function(req, res){

        reihe = req.body.reihe
        nummer= req.body.nummer

        
        db.get(`SELECT * FROM filmprogramm WHERE kennung = "${kennung}";`,function(err,rows){
            
            filmtitel = rows.filmtitel
            
            // Saalsitze auslesen
            var seatsDb = rows.saalsitze
            // Saalsitze in Array
            var seats = stringToArraySeats(seatsDb);
            // Sitzplatz wird besetzt
            if(seats[reihe-1][nummer-1]=="b"){
                res.render("seatSelect",{sessionVariables: req.session.sVariables, fehlertext: "Dieser Platz ist besetzt!"})
            }else{
            
            seats[reihe-1][nummer-1] = "b"
            
            // Saalsitze in String
            seatsDbUpdated = arrayToStringSeats(seats)

            db.run(`UPDATE filmprogramm SET saalsitze = "${seatsDbUpdated}" WHERE kennung = "${kennung}";`, function(err){
                if(err){
                    console.log(err)
                    
                }
                console.log("updated!")
            })

            res.render("buyConfirm",{kennung,reihe, nummer,filmtitel,sessionVariables: req.session.sVariables})}
        });
   
    })




    /* Ändert das Array der Saalsitze in Stringformat, um in die Datenbank zu schicken */
    function arrayToStringSeats(seats){
        var seatsString = ""

        for (var i = 0; i < 10;i++){
            for (var j = 0; j < 10; j++){
                seatsString += i.toString() + j.toString() + seats[i][j].toString();
            }
        }

        return seatsString.toString()
    }


    /* Ändert den String aus der Datenbank in ein Array, um Zugriff und Lesbarkeit zu erleichtern*/
    function stringToArraySeats(seats){
        seatsArray = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0]
        ];
        count = 0;
        
        for (var j = 0; j < 100; j++){
            seatsArray[seats[count]][seats[count+1]] = seats[count+2]
            count += 3
            console.log(j)
            console.log(seats[count],seats[count+1],seats[count+2])
            
        }

        return seatsArray
    }


};