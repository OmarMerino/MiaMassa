var express = require('express');
const admin = require('firebase-admin');
const bodyParser= require('body-parser');
const fileUpload= require('express-fileupload');
const serviceAccount = require('../serviceAccountKey.json');
const path = require('path');

// ...
var app=express();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});



const uploadsPath = path.join(__dirname, '..', 'uploads');
app.use(express.static(uploadsPath));







app.use(express.static(uploadsPath));

const db = admin.firestore();
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

app.listen(3000,()=>{
    console.log('Express server - puerto 3000 online')
});



//get productos firebase
app.get('/getProductos', async (req, res) => {
    const snapshot = await db.collection('productos').get();
    const documentos = snapshot.docs.map(doc => doc.data());
    res.send(documentos);
    console.log(documentos);
});

//añadir producto 
app.post('/addProducto', async (req, res) => {
    const data = req.body;
    console.log(data)
    const docRef = await db.collection('productos').add(data);
    res.send(`Documento agregado con ID ${docRef.id}.`);
});



// Definimos la ruta para eliminar un producto por su ID
app.delete('/productos/:id', async (req, res) => {
    try {
      const id = req.params.id;
      // Creamos una referencia a la colección de productos en Firestore
      const productosRef = admin.firestore().collection('productos');
      
      // Creamos una referencia al documento del producto que deseamos eliminar
      const productoRef = productosRef.doc(id);
  
      // Obtenemos el documento actual
      const doc = await productoRef.get();
  
      // Si el documento no existe, retornamos un error 404
      if (!doc.exists) {
        res.status(404).send('No se encontró el producto');
      } else {
        // Si el documento existe, lo eliminamos
        await productoRef.delete();
        res.send('Producto eliminado');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Ocurrió un error al eliminar el producto');
    }
});
  

  

//subir imagen indicando el id del producto y pasando una imagen 
app.put('/upload/producto/:nombre',async (req,res)=>{
    let nombre = req.params.nombre;  
    if(!req.files){
        return res.status(400).json({
            ok:false,
            mensaje: 'no selecciono nada',
            errors: {message: 'debe de selccionar una imagen'}
        });
    }
    

    //obtener nombre del archivo

    let archivo = req.files.imagen;

    let nombreCortado = archivo.name.split('.');

    let extensionArchivo = nombreCortado[nombreCortado.length - 1]

    //extenciones que se aceptan
    let extencionesValidas = ['png','jpg','gif','jpeg'];

    if(extencionesValidas.indexOf(extensionArchivo)< 0){
        return res.status (400).json({
            ok:false,
            mensaje: 'Extencion no valida',
            errors: {message: 'las extenciones validas son:'+ extencionesValidas.join(', ')}

        });
    }

    let nombreArchivo = `${nombre}.${extensionArchivo}`;
    let path= `./uploads/${nombreArchivo}` ;
    console.log(path);
    

    archivo.mv(path, err=>{
        if (err){
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        return res.status(200).json({
            ok:true,
            mensaje:'peticion realizada correctamente'
        });
    })

    // Creamos una referencia a la colección de productos en Firestore
    const productosRef = admin.firestore().collection('productos');
    // Filtrar documentos donde el campo "nombre" sea igual al nombre proporcionado
    const query = productosRef.where('nombre', '==', nombre);
    // Obtener los documentos que cumplen con el filtro
    query.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        // Establecer el nuevo dato en cada documento
        const docRef = productosRef.doc(doc.id);
        docRef.update({ imagen: nombreArchivo })
        .then(() => {
            console.log("Dato actualizado en el documento:", doc.id);
        })
        .catch((error) => {
            console.log("Error al actualizar el dato en el documento:", doc.id, error);
        });
    });
    }).catch((error) => {
    console.log("Error al obtener los documentos:", error);
    });
    
});