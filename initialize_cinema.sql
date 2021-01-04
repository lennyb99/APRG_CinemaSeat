
/*  
    Initialisiert die Datenbank.
    Erfolgt aus sqlite3 heraus mit dem Befehl .read initialize_cinema.sql
*/

/* Tabelle für Benutzer */

CREATE TABLE benutzer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    vorname TEXT NOT NULL,
    nachname TEXT NOT NULL,
    passwort TEXT NOT NULL,
    rolle TEXT NOT NULL
);

/* Tabelle für Filme */

CREATE TABLE filmprogramm (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filmtitel TEXT NOT NULL,
    beschreibung TEXT NOT NULL,
    kennung TEXT NOT NULL,
    trailer TEXT NOT NULL,
    fotourl TEXT,
    eintrittspreis NUMERIC,
    saalsitze TEXT NOT NULL
);

/* Tabelle für Statistiken */

/* Einfügen von Benutzern */
INSERT INTO benutzer (email,vorname,nachname,passwort,rolle) VALUES ("Administrator@admin.de", "Administrator","Administrator", "1234", "admin"  );


/* Einfügen von Filmen */
/* Saal mit leeren Sitzen = "000010020100110120200210220" */
INSERT INTO filmprogramm (filmtitel, beschreibung, eintrittspreis, kennung, trailer,fotourl,saalsitze) VALUES ("James Bond: Ein neuer Auftrag","ein neuer Auftrag für James Bond", 12.99, "jamesbondeinneuerauftrag","https://www.youtube.com/embed/k8NyWrd5CJI","https://www.comingsoon.net/assets/uploads/gallery/peanuts-1382571900/to57n3b.jpg","000010020100110120200210220");
INSERT INTO filmprogramm (filmtitel, beschreibung, eintrittspreis, kennung, trailer,fotourl,saalsitze) VALUES ("Star Wars: Episode 10", "Der 10. Teil der Star Wars Saga", 14.99,"starwarsepisode10","https://www.youtube.com/embed/IdyXKJ8NcNI","https://img-9gag-fun.9cache.com/photo/aEg6Z0K_460s.jpg","000010020100110120200210220");
INSERT INTO filmprogramm (filmtitel, beschreibung, eintrittspreis, kennung, trailer,fotourl,saalsitze) VALUES ("2020 The Movie", "coronananananana", 13.37,"2020themovie","https://www.youtube.com/embed/DN0gAQQ7FAQ","https://images-na.ssl-images-amazon.com/images/I/81sXGw2A0xL._SL1500_.jpg","000010020100110120200210220");
INSERT INTO filmprogramm (filmtitel, beschreibung, eintrittspreis, kennung, trailer,fotourl,saalsitze) VALUES ("Marvel's The Avengers", "2/10", 1.99,"marvelstheavengers","https://www.youtube.com/embed/edoxdRs6haA","https://upload.wikimedia.org/wikipedia/en/8/8a/The_Avengers_%282012_film%29_poster.jpg","000010020100110120200210220");