const express = require('express');
const router = express.Router();
const path = require('path');
const conectado = require('../database/db.js');
const session = require('express-session');

const route = __dirname.slice(0,-6);
console.log(route);

// ------- html

router.get('/', (req, res) => {
    consulta = String;
    console.log(req.body.pagina)
    if(req.body.pagina == undefined){consulta = "SELECT * FROM proyectos ORDER BY id DESC LIMIT 5"};
    conectado.query(consulta, async (error, results)=>{
        const num = results.length
        const con = `${JSON.stringify(results)}`;
        res.render(path.join(route,'views/inicialpg.html'), {pag: num, res: con});
    })
});

router.get('/inicialpg', (req, res) => {
    res.render(path.join(route,'views/inicialpg.html'), {nombre: req.session.name});

});

router.get('/init', (req, res) => {
    res.render(path.join(route,'views/init.html'), {nombre: req.session.name});

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

router.get('/decodehtml.js', (req, res) => {
    res.sendFile(path.join(route,'scripts/decodehtml.js'));
});

// ----------- post

router.post('/auth',(req, res)=>{
    const user = req.body.user;
    const pass = req.body.pass;
    if(user != "" && pass != ""){
        conectado.query('SELECT * FROM users WHERE user = ?', [user], async (error, results)=>{
            if(results.length == 0 || pass!=results[0].pass || error){
                res.render(path.join(route,'views/iniciar.html'),{
                    alert:true,
                    alertTitle:"Error",
                    alertMessage: "Usuario y/o password incorrecta",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer:false
                });
            }
            else{
                req.session.loggedin = true;
                req.session.name = results[0].name;
                req.session.user = results[0].user;
                res.render(path.join(route,'views/barraini.html'), {nombre: req.session.name});
            }
        })
    }
    else{
        res.render(path.join(route,'views/iniciar.html'),{
            alert:true,
            alertTitle:"Error",
            alertMessage: "Campos vacios",
            alertIcon: "error",
            showConfirmButton: true,
            timer:false
        });
    }
    
})

router.post('/register',async(req, res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const pass = req.body.pass;
    if(user!="" || name!="" || pass!=""){
        conectado.query('SELECT * FROM users WHERE user = ?', [user], async (error, results)=>{
            if(results.length == 0){
                conectado.query('INSERT INTO users SET ?', {user:user, name:name , pass:pass}, async(error,result)=>{
                    if(error){
                        console.log(error)
                        res.render(path.join(route,'views/registrar.html'),{
                            alert:true,
                                alertTitle:"Error",
                                alertMessage: "ocurrio un error inesperado",
                                alertIcon: "error",
                                showConfirmButton: true,
                                timer:false
                        });
                    }
                    else{
                        res.redirect("iniciar");
                    }
                })
            }
            else{
                res.render(path.join(route,'views/registrar.html'),{
                    alert:true,
                        alertTitle:"Error",
                        alertMessage: "User ya ocupado",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer:false
                });
            }
        })
    }
    else{
        res.render(path.join(route,'views/registrar.html'),{
            alert:true,
                alertTitle:"Error",
                alertMessage: "Espacios vacios",
                alertIcon: "error",
                showConfirmButton: true,
                timer:false
        });
    }
})



module.exports = router;