const { MongoClient } = require('mongodb');
const express = require('express');
const router = express.Router();
const bases = process.env.DBBD;
require('dotenv').config();


// **6. Listar los empleados con el cargo de "Vendedor"
router.get('/empleados_vendedores', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        console.log('Connect to Database');
        const db = client.db('AlquilerAutos');
        const empleadoCollection = db.collection('empleado');
        
        const result = await empleadoCollection.find({ cargo: "Vendedor" }).toArray();

        res.json(result);
        client.close();
    } catch (error) {
        res.status(404);
    }
});


module.exports = router;