module.exports = {benutzerLoeschen};


function benutzerLoeschen(id) {
    db.run(
        `DELETE FROM benutzer WHERE id=${id}`,
    )
}