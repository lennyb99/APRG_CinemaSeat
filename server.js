// Initialisiere Modul Express
const express = require('express');
const app = express();

// Initialisiere Modul body-parser 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

// Initialisiere EJS Template Engine
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// Initialisiere Datenbankmodul sqlite3
const sqlite3 = require('sqlite3').verbose();
// TODO:
/*
let db = new sqlite3.Database('DATENBANK.db', (err) => {
 if (err) {
 console.error(err.message);
 }
 console.log('Connected to the shop database.');
 */

// Initialisiere Modul cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Initialisiere Modul express-session
const session = require('express-session');
app.use(session({
 secret: 'example',
 resave: false,
 saveUninitialized: true
}));

app.listen(3000, function(){
    console.log('listening on 3000');
   });
   
    //TODO

// Redirect zur Startseite, falls keine angegeben. 
app.get('/', function(req, res){
    res.redirect('/home');
});

// Link zur Homepage
app.get('/home', function(req, res){
    res.sendFile(__dirname + "/views/home.html")
});
//Link zur Login-Seite
app.get("/goto_login", function(req, res){
    res.sendFile(__dirname + "/views/login.html")
    });
//Link zur Registrieungsseite
app.get("/goto_register", function(req,res){
    res.sendFile(__dirname + "/views/register.html")

})
//Link zur Kino-infopage
app.get("/goto_info", function(req,res){
    res.sendFile(__dirname + "/views/info.html")
});