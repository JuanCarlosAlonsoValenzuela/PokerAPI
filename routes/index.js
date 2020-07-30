
const { Router } = require('express');
const { required } = require('@hapi/joi');
const router = Router();

const helpers  = require('./helpers');




router.post('/hands', async (req, res) =>{

    let jugadas = req.body;

    try {
        
        await helpers.validarEntrada(jugadas);

    }catch(err){
        // Añadir status
        res.json(err.details[0].message);
    }

    res.json(jugadas);
})

module.exports = router;