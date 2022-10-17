const express = require('express');
const router = express.Router();
const path = require('path');
const conectado = require('../database/db.js');
const session = require('express-session');

const route = __dirname.slice(0,-6);
console.log(route);

// ------- html

router.get('/', (req, res) => {
    pagq = parseInt(req.query.pag)
    let max, min;
    if(pagq == undefined | pagq == 1 | isNaN(pagq)){
        max = 6
        min = 0
    }
    else{
        max = pagq+6
        min = pagq
    }
    if(req.query.search == undefined & req.query.id == undefined){
        consulta = `SELECT * FROM iniciativa WHERE iniciativa_estado_id_ie = 2 ORDER BY id_iniciativa DESC LIMIT ${min},${max}`;
        conectado.query(consulta, async (error, results)=>{
        const num = results.length
        const user = req.session.user
        const id = req.session.userid
        console.log(req.session)
        const con = `${JSON.stringify(results)}`;
        res.render(path.join(route,'views/inicialpg.html'), {pag: num, res: con, us: user, id: id});
    })
    }
    else if((req.query.search != undefined) & (req.query.id == undefined)){
        res.redirect(`./search/${req.query.search}`)
    }
    else if((req.query.search == undefined) & (req.query.id != undefined)){
        res.redirect(`./ideas/${req.query.id}`)
    }
});


router.get('/inicialpg', (req, res) => {
    res.redirect('/')

});

router.get('/search', (req, res) => {
    const id = req.body.id;
    res.redirect('/search/ ')

});

router.get('/init', (req, res) => {
    res.render(path.join(route,'views/init.html'), {nombre: req.session.name});

});

router.get('/registrarse', (req, res) => {
    res.render(path.join(route,'views/registrarse.html'), {nombre: req.session.name});
});

router.get('/ideas/:id', (req, res) => {
    conectado.query("SELECT * FROM iniciativa WHERE id_iniciativa = ?",[req.params["id"]], async (error, results)=>{
        if(results.length==0){
            res.redirect('/')
        }
        else{
            const con = `${JSON.stringify(results)}`;
            res.render(path.join(route,'views/ideas.html'), {res: con});
        }
    })
});

router.get('/nuevaidea', (req, res) => {
    res.render(path.join(route,'views/nuevaidea.html'), {nombre: req.session.name});

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

router.get('/cerrar', (req, res) => {
    if(req.session.id != undefined){
        req.session.destroy();
    }
    res.redirect('/')
});

router.post('/auth',(req, res)=>{
    const user = req.body.user;
    const pass = req.body.pass;
    console.log(user)
    if(user != "" && pass != ""){
        conectado.query('SELECT * FROM usuario WHERE us_nickname = ?',[user], (error, results)=>{
            console.log(results)
            if(results.length == 0 || pass!=results[0].us_contraseña || error){
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
                req.session.user = results[0].us_nickname;
                req.session.userid = results[0].tipo_usuario_id_tu;
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
    const apell = req.body.apellidos;
    const pass = req.body.pass;
    const email = req.body.email;
    const fecha = req.body.date;
    console.log(fecha)
    console.log(user)
    if(user!="" & name!="" & pass!="" & apell!="" & email!="" & fecha!=""){
        conectado.query('SELECT * FROM usuario WHERE us_nickname = ? AND us_correo = ?', [user,email], async (error, results)=>{
            if(results.length == 0){
                conectado.query('INSERT INTO usuario SET ?', {us_nickname:user, us_pass:pass, us_nombres:name, us_apellidos:apell, us_correo:email, us_fecha_nacimiento:fecha}, async(error,result)=>{
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
                        alertMessage: "User o Email ya ocupado",
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



router.get('/search/:search', (req, res) => {
    search = req.params['search'].trim()
    pagq = req.query.pag
    let max, min;
    if(pagq == undefined | pagq == 1){
        max = 6
        min = 0
    }
    else{
        max = pagq+6
        min = pagq
    }
    let consulta = `SELECT * FROM proyectos WHERE nombre LIKE '%${search}%' ORDER BY id DESC LIMIT ${min},${max}`;
    conectado.query(consulta, async (error, results)=>{
        let num;
        if(results == undefined){
            const con = `${JSON.stringify(results)}`;
            res.render(path.join(route,'views/inicialpg.html'), {
                pag: num, 
                res: con,
                alert:true,
                        alertTitle:"Error",
                        alertMessage: "No se encontro nada",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer:false
            });
        }
        else if(results.length==0){
            const con = `${JSON.stringify(results)}`;
            res.render(path.join(route,'views/inicialpg.html'), {
                pag: num, 
                res: con,
                alert:true,
                        alertTitle:"Error",
                        alertMessage: "No se encontro nada",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer:false
            });
        }
        else{
            num = results.length;
            const con = `${JSON.stringify(results)}`;
            res.render(path.join(route,'views/inicialpg.html'), {pag: num, res: con});
        }
    })
});



module.exports = router;