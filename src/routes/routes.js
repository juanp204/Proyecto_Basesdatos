const express = require('express');
const router = express.Router();
const path = require('path');
//const conectado = require('../database/db')
const session = require('express-session')

const route = __dirname.slice(0,-6);
console.log(route)

// ------- html

router.get('/', (req, res) => {
    res.sendFile(path.join(route,'views/init.html'));
});

router.get('/inicialpg', (req, res) => {
    res.sendFile(path.join(route,'views/inicialpg.html'));
});

//------- css

router.get('/bootstrap.css', (req, res) => {
    res.sendFile(path.join(route,'css/bootstrap.css'));
});

router.get('/bootstrap.min.css', (req, res) => {
    res.sendFile(path.join(route,'css/bootstrap.min.css'));
});

router.get('/estilos.css', (req, res) => {
    res.sendFile(path.join(route,'css/estilos.css'));
});


// ------ js




/* router.get('/', async(req, res) => {
    const info = await jugadora;
    if( typeof req.session.loggedin != "undefined"){
        if(req.session.loggedin){
            res.render(path.join(route,'views/barraini.html'), {nombre: req.session.name});
        }
        else{
            res.render(path.join(route,'views/barrasinse.html'), {jugador: info});
        }
    }
    else{
        res.render(path.join(route,'views/barrasinse.html'), {jugador: info});
    }
}); */


module.exports = router;