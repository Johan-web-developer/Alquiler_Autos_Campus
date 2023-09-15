const { MongoClient } = require('mongodb');
const express = require('express');
const router = express.Router();
const bases = process.env.DBBD;
require('dotenv').config()


// *! 1.Mostrar todos los clientes registrados en la base de datos
router.get('/todos_los_clientes', async (req,res)=>{
    try {
        const client = new MongoClient(bases);
        await client.connect();
        console.log('Connect to Database');
        const db = client.db('AlquilerAutos');
        const collection = db.collection('cliente');
        const result = await collection.find().toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404);
    }
});


module.exports = router;