const express = require('express');
const router = express.Router();
const path = require('path');
const conectado = require('../database/db.js');
const session = require('express-session');
const multer = require('multer');


const route = __dirname.slice(0,-6);
console.log(route);

// ------- html

router.get('/', async (req, res) => {
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
        conectado.query(`SELECT * FROM iniciativa WHERE iniciativa_estado_id_ie = 2 ORDER BY id_iniciativa DESC LIMIT ${min},${max}`, async (error, results)=>{
        const num = results.length
        const user = req.session.user
        const id = req.session.tipeuser
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


router.get('/inicialpg', async (req, res) => {
    res.redirect('/')

});

router.get('/search', async (req, res) => {
    const id = req.body.id;
    res.redirect('/search/ ')

});

router.get('/init', async (req, res) => {
    const user = req.session.user
    const id = req.session.tipeuser
    res.render(path.join(route,'views/init.html'), {us: user, id: id});

});

router.get('/coordinador', async (req, res) => {
    const user = req.session.user
    const id = req.session.tipeuser
    res.render(path.join(route,'views/coordinador.html'), {us: user, id: id});

});



router.get('/termandcondicion', async (req, res) => {
    const user = req.session.user
    const id = req.session.tipeuser
    res.render(path.join(route,'views/TyC.html'), {us: user, id: id});

});

router.get('/registrarse', async (req, res) => {
    const user = req.session.user
    const id = req.session.tipeuser
    res.render(path.join(route,'views/registrarse.html'), {us: user, id: id});
});
//------------------------ideas
router.get('/ideas/:id', async (req, res) => {
    const idea = req.params["id"]
    conectado.query("SELECT * FROM iniciativa WHERE id_iniciativa = ?",[idea], async (error, results)=>{
        conectado.query("SELECT us_nombres, us_apellidos FROM usuario INNER JOIN grupo_estudiante ON usuario.id_usuario = grupo_estudiante.usuario_id_usuario WHERE grupo_estudiante.iniciativa_id_iniciativa = ?",[idea],(error,result)=>{
            const user = req.session.user
            const id = req.session.tipeuser
            if(results.length==0){
                res.redirect('/')
            }
            else{
                const con = `${JSON.stringify(results)}`;
                const conu = `${JSON.stringify(result)}`;
                res.render(path.join(route,'views/ideas.html'), {res: con, us: user, id: id, conu: conu});
            }
        })

    })
});

router.get('/perfil/:nom', async (req, res) => {
    conectado.query("SELECT * FROM usuario WHERE us_nickname = ?",[req.params["nom"]], async (error, results)=>{
        const user = req.session.user
        const id = req.session.tipeuser
        if(results.length==0){
            res.redirect('/')
        }
        else{
            const con = `${JSON.stringify(results)}`;
            res.render(path.join(route,'views/perfil.html'), {res: con, us: user, id: id});
        }
    })
});

router.get('/perfil/:nom', async (req, res) => {
    conectado.query("SELECT * FROM usuario WHERE us_nickname = ?",[req.params["nom"]], async (error, results)=>{
        const user = req.session.user
        const id = req.session.tipeuser
        if(results.length==0){
            res.redirect('/')
        }
        else{
            const con = `${JSON.stringify(results)}`;
            res.render(path.join(route,'views/perfil.html'), {res: con, us: user, id: id});
        }
    })
});


router.get('/user/:nom', (req, res) => {
    conectado.query(`SELECT * FROM usuario WHERE us_nickname LIKE '%${req.params["nom"]}%' ORDER BY us_nickname ASC LIMIT 6`, async (error, results)=>{
        //const con = `${JSON.stringify(results)}`;
        console.log(results)
        res.send({'results': results});
    })
});

router.get('/nuevaidea', async (req, res) => {
    const user = req.session.user
    const id = req.session.tipeuser
    res.render(path.join(route,'views/nuevaidea.html'), {us: user, id: id});

});


//------- css

router.get('/bootstrap.css', async (req, res) => {
    res.sendFile(path.join(route,'css/bootstrap.css'));
});

router.get('/bootstrap.min.css', async (req, res) => {
    res.sendFile(path.join(route,'css/bootstrap.min.css'));
});

router.get('/estilos.css', async (req, res) => {
    res.sendFile(path.join(route,'css/estilos.css'));
});


router.get

// ------ js

router.get('/decodehtml.js', async (req, res) => {
    res.sendFile(path.join(route,'scripts/decodehtml.js'));
});

router.get('/peticionusers.js', async (req, res) => {
    res.sendFile(path.join(route,'scripts/peticionusers.js'));
});

// ----------- post

const storage = multer.diskStorage({
    destination: 'src/pdffiles/',
    filename: function(req,formfile,cb){
        conectado.query("SELECT `AUTO_INCREMENT` FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'proywebdb' AND  TABLE_NAME  = 'iniciativa';", (error, result)=>{
            console.log("archivo")
            console.log(result)
            cb("",`${result[0].AUTO_INCREMENT}.pdf`)
        })
    }
})

const upload = multer({
    storage:storage
})


router.post("/nuevoproyecto",upload.array("formfile"),(req,res)=>{
    const nomproy = req.body.nomproy;
    const user = req.session.user

    if(req.session.tipeuser != undefined){
        console.log(nomproy,desc,yout)
        conectado.query('INSERT INTO iniciativa SET ?', {in_nombre:nomproy, in_texto:desc, in_video:yout}, async(error,results)=>{
            conectado.query('SELECT id_iniciativa FROM iniciativa ORDER BY id_iniciativa DESC LIMIT 1', (error, result)=>{
                console.log(result[0].id_iniciativa)
                req.session.newfile = result[0].id_iniciativa;
                console.log(req.session.userid)
                conectado.query('INSERT INTO grupo_estudiante SET ?', {usuario_id_usuario:req.session.userid, iniciativa_id_iniciativa: req.session.newfile , rol_id_rol:1}, async(error,result2)=>{
                    console.log(error)
                    console.log(result2)
                    res.redirect(`/ideas/${result[0].id_iniciativa}`)
                });
            })
        });
    }else{
        res.redirect('/')
    }
});

router.post("/comentar",(req,res)=>{
    const nomproy = req.body.comentario;
    const desc = req.body.desc;
    const yout = req.body.yout;
    if(req.session.tipeuser != undefined){
        console.log(nomproy,desc,yout)
        conectado.query('INSERT INTO iniciativa SET ?', {in_nombre:nomproy, in_texto:desc, in_video:yout}, async(error,results)=>{
            conectado.query('SELECT id_iniciativa FROM iniciativa ORDER BY id_iniciativa DESC LIMIT 1', (error, result)=>{
                console.log(result[0].id_iniciativa)
                req.session.newfile = result[0].id_iniciativa;
                console.log(req.session.userid)
                conectado.query('INSERT INTO grupo_estudiante SET ?', {usuario_id_usuario:req.session.userid, iniciativa_id_iniciativa: req.session.newfile , rol_id_rol:1}, async(error,result2)=>{
                    console.log(error)
                    console.log(result2)
                    res.redirect(`/ideas/${result[0].id_iniciativa}`)
                });
            })
        });
    }else{
        res.redirect('/')
    }
});

router.get('/cerrar', async (req, res) => {
    if(req.session.tipeuser != undefined){
        req.session.destroy();
    }
    res.redirect('/')
});

router.post('/auth', async (req, res)=>{
    const user = req.body.user;
    const pass = req.body.pass;
    console.log(user)
    if(user != "" && pass != ""){
        conectado.query('SELECT * FROM usuario WHERE us_nickname = ?',[user], (error, results)=>{
            console.log(results)
            if(results.length == 0 || pass!=results[0].us_pass || error){
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
                req.session.tipeuser = results[0].tipo_usuario_id_tu;
                req.session.userid = results[0].id_usuario;
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

router.post('/register', (req, res)=>{
    const user = req.body.name;
    const name = req.body.nombres;
    const apell = req.body.apellidos;
    const pass = req.body.pass;
    const email = req.body.email;
    const fecha = req.body.date;
    console.log(fecha)
    console.log(user)
    if(user!="" & name!="" & pass!="" & apell!="" & email!="" & fecha!=""){
        conectado.query(`SELECT * FROM usuario WHERE us_nickname = '${user}' OR us_correo = '${email}'`, async (error, results)=>{
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



router.get('/search/:search', async (req, res) => {
    search = req.params['search'].trim()
    pagq = req.query.pag
    const user = req.session.user
    const id = req.session.tipeuser
    let max, min;
    if(pagq == undefined | pagq == 1){
        max = 6
        min = 0
    }
    else{
        max = pagq+6
        min = pagq
    }
    let consulta = `SELECT * FROM iniciativa WHERE in_nombre LIKE '%${search}%' ORDER BY id_iniciativa DESC LIMIT ${min},${max}`;
    conectado.query(consulta, async (error, results)=>{
        console.log(results)
        let num;
        if(results == undefined){
            const con = `${JSON.stringify(results)}`;
            res.render(path.join(route,'views/inicialpg.html'), {
                pag: num, 
                res: con,
                us: user,
                id: id,
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
                us: user,
                id: id,
                alert:true,
                        alertTitle:"Error",
                        alertMessage: "No se encontro nada",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer:false
            });
        }
        else{
            const num = results.length
            const con = `${JSON.stringify(results)}`;
            res.render(path.join(route,'views/inicialpg.html'), {pag: num, res: con, us: user, id: id});
        }
    })
});



module.exports = router;