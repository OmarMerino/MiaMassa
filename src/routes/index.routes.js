const express = require ('express')
const router = express.Router()
const controller = require('../controllers/index.controller')

//Base de datos
const { db } = require('../app')

//get productos firebase
router.get('/getProductos', controller.getProductos(db))
  

//añadir producto 
//router.post('/addProducto', controller.addProductos)


// Definimos la ruta para eliminar un producto por su ID
//router.delete('/productos/:id', controller.productos)


//subir imagen indicando el id del producto y pasando una imagen 
//router.put('/upload/producto/:nombre', controller.putProducto)


//Export para que se puedan utilizar en cualquier archivo las Rutas
module.exports = router