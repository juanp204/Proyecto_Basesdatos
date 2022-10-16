const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({extended:false}));
app.use(express.json());

//dotenv var.entorno
const dotenv = require("dotenv");
dotenv.config({path:path.join(__dirname,'/env/.env')})

//configuracion
app.set('port', 80);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

//var.session
const session = require('express-session')
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized:true
}));

//DB
const conectado = require('./database/db');
const req = require('express/lib/request');

//rutas
app.use(require('./routes/routes.js'));

//recursos
//app.use('/multimedia', express.static('multimedia'));
//app.use('/multimedia', express.static(path.join(__dirname,'/multimedia')));


//server
app.listen(app.get('port'),()=>{
    console.log("server on :"+app.get('port'));
});