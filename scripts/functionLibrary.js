module.exports = {checkPassword};
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^




function benutzerLoeschen(id) {
    db.run(
        `DELETE FROM benutzer WHERE id=${id}`,
    )
}