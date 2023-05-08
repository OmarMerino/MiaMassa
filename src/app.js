var express = require ('express')
const bodyParser= require('body-parser');
const fileUpload= require('express-fileupload');
const path = require('path');
//const admin = require('firebase-admin')
// ...
var app=express();

/*admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});*/

//const db = admin.firestore();

const uploadsPath = path.join(__dirname, '..', 'uploads');
app.use(express.static(uploadsPath));

app.use(express.static(uploadsPath));


app.use(fileUpload());
app.use(bodyParser.json());


app.use(bodyParser.urlencoded({extended:true}));
//cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//Rutas
const routes = require('./routes/index.routes')
app.use(routes)

app.listen(8000,()=>{
    console.log('Express server - puerto 8000 online')
});

//Export para usar la conexion a la Base de Datos en Rutas y Controladores
module.exports = {
    app
};
