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
    const id = req.body.id;
    res.redirect('/')

});

router.get('/init', (req, res) => {
    res.render(path.join(route,'views/init.html'), {nombre: req.session.name});

});

router.get('/registrarse', (req, res) => {
    res.render(path.join(route,'views/registrarse.html'), {nombre: req.session.name});
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
    console.log(user)
    if(user != "" && pass != ""){
        conectado.query('SELECT * FROM users WHERE usern = ?',[user], (error, results)=>{
            console.log(results)
            if(results.length == 0 || pass!=results[0].pass || error){
                res.render(path.join(route,'views/init.html'),{
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
                res.redirect('/')
            }
        });
    }
    else{
        res.render(path.join(route,'views/init.html'),{
            alert:true,
            alertTitle:"Error",
            alertMessage: "Campos vacios",
            alertIcon: "error",
            showConfirmButton: true,
            timer:false
        });
    }
    
});

router.post('/register',async(req, res)=>{
    const user = req.body.name;
    const name = req.body.nombres;
    const pass = req.body.pass;
    console.log(user)
    if(user!="" || name!="" || pass!=""){
        conectado.query('SELECT * FROM users WHERE usern = ?', [user], async (error, results)=>{
            if(results.length == 0){
                conectado.query('INSERT INTO users SET ?', {usern:user, nombre1:name}, async(error,result)=>{
                    if(error){
                        console.log(error)
                        res.render(path.join(route,'views/registrarse.html'),{
                            alert:true,
                                alertTitle:"Error",
                                alertMessage: "ocurrio un error inesperado",
                                alertIcon: "error",
                                showConfirmButton: true,
                                timer:false
                        });
                    }
                    else{
                        res.redirect("/init");
                    }
                })
            }
            else{
                res.render(path.join(route,'views/registrarse.html'),{
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
        res.render(path.join(route,'views/registrarse.html'),{
            alert:true,
                alertTitle:"Error",
                alertMessage: "Espacios vacios",
                alertIcon: "error",
                showConfirmButton: true,
                timer:false
        });
    }
})

router.get('/ideas', (req, res) => {
    console.log(req.query.id)
    conectado.query("SELECT * FROM proyectos WHERE id = ?",[req.query.id], async (error, results)=>{
        const con = `${JSON.stringify(results)}`;
        console.log(results)
        res.render(path.join(route,'views/ideas.html'), {res: con});
    })
});


module.exports = router;