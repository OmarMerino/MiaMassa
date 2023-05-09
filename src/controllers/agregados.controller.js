//Base de datos
const express = require('express');
const app = require('../app');
const { db, admin } = require('../firebase');

//Añadir las funciones al Controlador para que se puedan invocar en Rutas
const controller = {}


//agregados
controller.habilitarAgregado = async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id)
      // Creamos una referencia a la colección de agregados en Firestore
      const agregadosRef = admin.firestore().collection('agregados');
      
      // Creamos una referencia al documento del agregado que deseamos editar
      const agregadoRef = agregadosRef.doc(id);
  
      // Obtenemos el documento actual
      const doc = await agregadoRef.get();
  
      
      // Si el documento no existe, retornamos un error 404
      if (!doc.exists) {
        res.status(404).send('No se encontró el agregado');
      } else {
        // Si el documento existe, lo eliminamos
        await agregadoRef.update({
          disponibilidad: true
        })
          .then(() => {
            console.log('Documento actualizado correctamente');
          })
          .catch((error) => {
            console.error('Error al actualizar el documento:', error);
          });
        res.send('agregado id:'+id+' Habilitado');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Ocurrió un error al habilitar el agregado');
    }
  };
  
  
  
  controller.deshabilitarAgregado = async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id)
      // Creamos una referencia a la colección de agregados en Firestore
      const agregadosRef = admin.firestore().collection('agregados');
      
      // Creamos una referencia al documento del agregado que deseamos editar
      const agregadoRef = agregadosRef.doc(id);
  
      // Obtenemos el documento actual
      const doc = await agregadoRef.get();
  
      
      // Si el documento no existe, retornamos un error 404
      if (!doc.exists) {
        res.status(404).send('No se encontró el agregado');
      } else {
        // Si el documento existe, lo eliminamos
        await agregadoRef.update({
          disponibilidad: false
        })
          .then(() => {
            console.log('Documento actualizado correctamente');
          })
          .catch((error) => {
            console.error('Error al actualizar el documento:', error);
          });
        res.send('agregado id:'+id+' desabilitado');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Ocurrió un error al deshabilitar el agregado');
    }
};
  