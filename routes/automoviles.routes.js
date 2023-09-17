
const { MongoClient } = require('mongodb');
const express = require('express');
const router = express.Router();
const bases = process.env.DBBD;
require('dotenv').config()

// ** 2. Obtener todos lo sautomóviles disponibles para alquiler.
router.get('/todos_los_automoviles', async (req,res)=>{
    try {
        const client = new MongoClient(bases);
        await client.connect();
        console.log('Connect to Database');
        const db = client.db('AlquilerAutos');
        const collection = db.collection('sucursal_automovil');
        const result = await collection.find({ "Cantidad_Disponible": { $gt: 0 } }).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404);
    }
});

// ** 10.Mostrar todos los automóviles con una capacidad mayor a 5 personas.
router.get('/automoviles_mayor_5_personas', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        console.log('Connect to Database');
        const db = client.db('AlquilerAutos');
        const automovilCollection = db.collection('automovil');
        
        const result = await automovilCollection.find({ Capacidad: { $gt: 5 } }).toArray();

        res.json(result);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;