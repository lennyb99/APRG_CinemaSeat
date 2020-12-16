
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
    eintrittspreis NUMERIC
);

/* Tabelle für Statistiken */

/* Einfügen von Benutzern */
INSERT INTO benutzer (email,vorname,nachname,passwort,rolle) VALUES ("Administrator@admin.de", "Administrator","Administrator", "1234", "admin"  );


/* Einfügen von Filmen */
INSERT INTO filmprogramm (filmtitel, beschreibung, eintrittspreis, kennung, trailer) VALUES ("James Bond: Ein neuer Auftrag","ein neuer Auftrag für James Bond", 12.99, "jamesbondeinneuerauftrag","https://www.youtube.com/embed/k8NyWrd5CJI");
INSERT INTO filmprogramm (filmtitel, beschreibung, eintrittspreis, kennung, trailer) VALUES ("Star Wars: Episode 10", "Der 10. Teil der Star Wars Saga", 14.99,"starwarsepisode10","https://www.youtube.com/embed/IdyXKJ8NcNI");
INSERT INTO filmprogramm (filmtitel, beschreibung, eintrittspreis, kennung, trailer) VALUES ("2020 The Movie", "coronananananana", 13.37,"2020themovie","https://www.youtube.com/embed/DN0gAQQ7FAQ");
INSERT INTO filmprogramm (filmtitel, beschreibung, eintrittspreis, kennung, trailer) VALUES ("Marvel's The Avengers", "2/10", 1.99,"marvelstheavengers","https://www.youtube.com/embed/edoxdRs6haA");


/* Tabelle für Kinosaal 1 */

CREATE TABLE saalOne (
    a1 INTEGER,
    a2 INTEGER,
    a3 INTEGER,
    a4 INTEGER,
    a5 INTEGER,
    a6 INTEGER,
    a7 INTEGER,
    a8 INTEGER,
    b1 INTEGER,
    b2 INTEGER,
    b3 INTEGER,
    b4 INTEGER,
    b5 INTEGER,
    b6 INTEGER,
    b7 INTEGER,
    b8 INTEGER,
    c1 INTEGER,
    c2 INTEGER,
    c3 INTEGER,
    c4 INTEGER,
    c5 INTEGER,
    c6 INTEGER,
    c7 INTEGER,
    c8 INTEGER,
    d1 INTEGER,
    d2 INTEGER,
    d3 INTEGER,
    d4 INTEGER,
    d5 INTEGER,
    d6 INTEGER,
    d7 INTEGER,
    d8 INTEGER,
    e1 INTEGER,
    e2 INTEGER,
    e3 INTEGER,
    e4 INTEGER,
    e5 INTEGER,
    e6 INTEGER,
    e7 INTEGER,
    e8 INTEGER,
    f1 INTEGER,
    f2 INTEGER,
    f3 INTEGER,
    f4 INTEGER,
    f5 INTEGER,
    f6 INTEGER,
    f7 INTEGER,
    f8 INTEGER,
    g1 INTEGER,
    g2 INTEGER,
    g3 INTEGER,
    g4 INTEGER,
    g5 INTEGER,
    g6 INTEGER,
    g7 INTEGER,
    g8 INTEGER,
    h1 INTEGER,
    h2 INTEGER,
    h3 INTEGER,
    h4 INTEGER,
    h5 INTEGER,
    h6 INTEGER,
    h7 INTEGER,
    h8 INTEGER



)