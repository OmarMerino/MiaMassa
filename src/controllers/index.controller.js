//Base de datos
const { db } = require('../app');

//Añadir las funciones al Controlador para que se puedan invocar en Rutas
const controller = {
    getProductos: getProductos(db)
}


//Get Productos.
function getProductos(db) {
    return async function(req, res) {
      try {
        const snapshot = await db.collection('productos').get();
        const documentos = snapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          };
        });
        res.send(documentos);
        console.log(documentos);
      } catch (error) {
        console.log('Error obteniendo los documentos:', error);
        res.status(500).send('Error obteniendo los documentos');
      }
    }
}

//Add producto.
controller.addProducto = async (req, res) => {
    const data = req.body;
    console.log(data)
    const docRef = await db.collection('productos').add(data);
    res.send(`Documento agregado con ID ${docRef.id}.`);
};

//Delete producto
controller.productos = async (req, res) => {
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
};

//Proceso de actualizar producto, subir imagen.
controller.putProducto = async (req,res)=>{
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
    
};

module.exports = controller
module.exports = {
    getProductos
};