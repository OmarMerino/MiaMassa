const express = require ('express')
const router = express.Router()
const controller = require('../controllers/agregados.controller')

//get productos firebase

//agregados
router.put('/habilitarAgregado/:id', (req, res) => {
    controller.habilitarAgregado(req, res);
});

router.put('/deshabilitarAgregado/:id', (req, res) => {
    controller.deshabilitarAgregado(req, res);
});
module.exports = router
