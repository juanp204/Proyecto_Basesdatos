const dotenv = require("dotenv");
dotenv.config({path:'./env/.env'});

console.log(process.env.DB_HOST)

const mysql = require('mysql')
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});


connection.connect((error)=>{
    if(error){
        console.log('el error de conexión es :'+error);
        return;
    }
    console.log('conectado a la base de datos');
});

module.exports = connection;
