
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

/* Passwort = geheim */
INSERT INTO benutzer (email,vorname,nachname,passwort,rolle) VALUES ("admin@a.de", "Elon","Musk", "sha1$f0b6880e$1$b7a98c8156d17d12382d9c3b3781085efd3350fa", "admin"  );
INSERT INTO benutzer (email,vorname,nachname,passwort,rolle) VALUES ("p@kreftig.de", "Pawel","Kreft", "sha1$f0b6880e$1$b7a98c8156d17d12382d9c3b3781085efd3350fa", "user"  );
INSERT INTO benutzer (email,vorname,nachname,passwort,rolle) VALUES ("m@abesha.de", "Merlin","Abesha", "sha1$f0b6880e$1$b7a98c8156d17d12382d9c3b3781085efd3350fa", "user"  );
INSERT INTO benutzer (email,vorname,nachname,passwort,rolle) VALUES ("l@burry.de", "Lennard","Burrmann", "sha1$f0b6880e$1$b7a98c8156d17d12382d9c3b3781085efd3350fa", "user"  );


/* Einfügen von Filmen */
/* Saal mit leeren Sitzen = "00f01f02f03f04f05f06f07f08f09f10f11f12f13f14f15f16f17f18f19f20f21f22f23f24f25f26f27f28f29f30f31f32f33f34f35f36f37f38f39f40f41f42f43f44f45f46f47f48f49f50f51f52f53f54f55f56f57f58f59f60f61f62f63f64f65f66f67f68f69f70f71f72f73f74f75f76f77f78f79f80f81f82f83f84f85f86f87f88f89f90f91f92f93f94f95f96f97f98f99f" */
INSERT INTO filmprogramm (filmtitel, beschreibung, eintrittspreis, kennung, trailer,fotourl,saalsitze) VALUES ("James Bond: Ein neuer Auftrag","ein neuer Auftrag für James Bond", 12.99, "jamesbondeinneuerauftrag","https://www.youtube.com/embed/k8NyWrd5CJI","https://www.comingsoon.net/assets/uploads/gallery/peanuts-1382571900/to57n3b.jpg","00f01f02f03f04f05f06f07f08f09f10f11f12f13f14f15f16f17f18f19f20f21f22f23f24f25f26f27f28f29f30f31f32f33f34f35f36f37f38f39f40f41f42f43f44f45f46f47f48f49f50f51f52f53f54f55f56f57f58f59f60f61f62f63f64f65f66f67f68f69f70f71f72f73f74f75f76f77f78f79f80f81f82f83f84f85f86f87f88f89f90f91f92f93f94f95f96f97f98f99f");
INSERT INTO filmprogramm (filmtitel, beschreibung, eintrittspreis, kennung, trailer,fotourl,saalsitze) VALUES ("Star Wars: Episode 10", "Der 10. Teil der Star Wars Saga", 14.99,"starwarsepisode10","https://www.youtube.com/embed/IdyXKJ8NcNI","https://img-9gag-fun.9cache.com/photo/aEg6Z0K_460s.jpg","00f01f02f03f04f05f06f07f08f09f10f11f12f13f14f15f16f17f18f19f20f21f22f23f24f25f26f27f28f29f30f31f32f33f34f35f36f37f38f39f40f41f42f43f44f45f46f47f48f49f50f51f52f53f54f55f56f57f58f59f60f61f62f63f64f65f66f67f68f69f70f71f72f73f74f75f76f77f78f79f80f81f82f83f84f85f86f87f88f89f90f91f92f93f94f95f96f97f98f99f");
INSERT INTO filmprogramm (filmtitel, beschreibung, eintrittspreis, kennung, trailer,fotourl,saalsitze) VALUES ("2020 The Movie", "coronananananana", 13.37,"2020themovie","https://www.youtube.com/embed/DN0gAQQ7FAQ","https://images-na.ssl-images-amazon.com/images/I/81sXGw2A0xL._SL1500_.jpg","00f01f02f03f04f05f06f07f08f09f10f11f12f13f14f15f16f17f18f19f20f21f22f23f24f25f26f27f28f29f30f31f32f33f34f35f36f37f38f39f40f41f42f43f44f45f46f47f48f49f50f51f52f53f54f55f56f57f58f59f60f61f62f63f64f65f66f67f68f69f70f71f72f73f74f75f76f77f78f79f80f81f82f83f84f85f86f87f88f89f90f91f92f93f94f95f96f97f98f99f");
INSERT INTO filmprogramm (filmtitel, beschreibung, eintrittspreis, kennung, trailer,fotourl,saalsitze) VALUES ("Marvel's The Avengers", "2/10", 1.99,"marvelstheavengers","https://www.youtube.com/embed/edoxdRs6haA","https://upload.wikimedia.org/wikipedia/en/8/8a/The_Avengers_%282012_film%29_poster.jpg","00f01f02f03f04f05f06f07f08f09f10f11f12f13f14f15f16f17f18f19f20f21f22f23f24f25f26f27f28f29f30f31f32f33f34f35f36f37f38f39f40f41f42f43f44f45f46f47f48f49f50f51f52f53f54f55f56f57f58f59f60f61f62f63f64f65f66f67f68f69f70f71f72f73f74f75f76f77f78f79f80f81f82f83f84f85f86f87f88f89f90f91f92f93f94f95f96f97f98f99f");