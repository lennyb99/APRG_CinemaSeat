module.exports = {benutzerLoeschen}; // Wenn neue Funktionen in anderen Dateien verwendet werden sollen, müssen sie hier in die {} geschrieben werden.

function benutzerLoeschen(id) {
    db.run( `DELETE FROM benutzer WHERE id=${id}` );
};