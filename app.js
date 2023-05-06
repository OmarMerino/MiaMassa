var express = require('express');
const admin = require('firebase-admin');
const bodyParser= require('body-parser');
const fileUpload= require('express-fileupload');
const serviceAccount = require('./serviceAccountKey.json');
var app=express();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(express.static('uploads'));
const db = admin.firestore();

app.use(fileUpload());
app.use(bodyParser.json());


app.use(bodyParser.urlencoded({extended:true}));

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


// Creamos una referencia a la colección de productos en Firestore
const productosRef = admin.firestore().collection('productos');


// Definimos la ruta para eliminar un producto por su ID
app.delete('/productos/:id', async (req, res) => {
    try {
      const id = req.params.id;
  
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
  
//cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
  

//subir imagen indicando el nombre del producto y pasando una imagen 
app.put('/upload/producto/:nombre',(req,res)=>{

    let nombre = req.params.nombre;
    if(!req.files){
        return res.status(400).json({
            ok:false,
            mensaje: 'no selecciono nada',
            errors: {message: 'debe de selccionar una imagen'}
        });
    }
    console.log(nombre)

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

    let nombreArchivo = `${nombre}-${new Date().getMilliseconds()}.${extensionArchivo}`;
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


});









/*

app.get('/', (req,res, next)=>{
    res.status(200).json({
        ok:true,
        mensaje:'peticion realizada correctamente'
    })
});





//get prodcuts
app.get('/productos', function(req,res){
    mc.query('SELECT * FROM productos',function(error,results,fields){
        if (error) throw error;
        return res.send({
            error: false,
            data:results,
            message: 'Lista de productos.'
        });
    })
    
});


app.post('/producto',function(req,res){
    let datosProducto = {
        //id incremental
        productName: req.body.name,
        releaseDate: req.body.date,
        productCode: req.body.code,
        price: parseInt(req.body.price),
        description: req.body.description,
        starRating: parseInt(req.body.rating),
        imageUrl: req.body.image
    }
    console.log(datosProducto); 
    if (mc){
        mc.query("INSERT INTO productos SET ?", datosProducto, function(error,result){
            if(error){
                res.status(500).json({"Mensaje": error});
            }else{
                res.status(201).json({"Mensaje":"insertado"});
            }
        });
    }
});

app.delete('/producto/:id',function(req,res){
    let id= req.params.id
    if (mc){
        console.log(id);
        mc.query("DELETE FROM productos WHERE  productId = ?", id, function(error,result){
            if(error){
                res.status(500).json({"Mensaje": error});
            }else{
                res.status(200).json({"Mensaje":"registro con id="+ id + "borrado"});
            }
        });
    }
});

app.put('/producto/:id',(req,res)=>{
    let id= req.params.id
    let producto =req.body;
    console.log(id)
    console.log(producto);

    if(!id|| !producto){
        return res.status(400).send({error: producto, message: 'Debe proveer un id y los datos de un producto'})
    }

    
    mc.query("UPDATE productos SET ? WHERE productId = ?", [producto,id], function(error,result, fields){
        if(error)throw error;
        return res.status(200).json({"Mensaje":"registro con id="+ id + "actualizado"});
        
    });
    
});




*/