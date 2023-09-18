
const { MongoClient } = require('mongodb');
const express = require('express');
const router = express.Router();
const bases = process.env.DBBD;
require('dotenv').config();

// ** 2. Obtener todos los automóviles disponibles para alquiler.
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

// ** 15.Listar todos los automóviles ordenados por marca y  modelo.
router.get('/automoviles_ordenados', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        console.log('Connect to Database');
        const db = client.db('AlquilerAutos');
        const automovilCollection = db.collection('automovil');
        
        const result = await automovilCollection.find().sort({ marca: 1, modelo: 1 }).toArray();

        res.json(result);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// **16.Mostrar la cantidad total de automóviles en cadas ucursal junto con su dirección.
router.get('/cantidad_automoviles_por_sucursal', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        console.log('Connect to Database');
        const db = client.db('AlquilerAutos');
        const sucursalCollection = db.collection('sucursal');
        const sucursalAutomovilCollection = db.collection('sucursal_automovil');

        const result = await sucursalCollection.aggregate([
            {
                $lookup: {
                    from: 'sucursal_automovil',
                    localField: 'id_sucursal',
                    foreignField: 'id_sucursal',
                    as: 'automoviles'
                }
            },
            {
                $project: {
                    nombre: 1,
                    direccion: 1,
                    cantidad_automoviles: { $size: "$automoviles" }
                }
            }
        ]).toArray();

        res.json(result);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// **18.Mostrar los automóviles con capacidad igual a 5 personas y que estén disponibles.
router.get('/automoviles_capacidad_5_disponibles', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        console.log('Connect to Database');
        const db = client.db('AlquilerAutos');
        const automovilCollection = db.collection('automovil');
        const sucursalAutomovilCollection = db.collection('sucursal_automovil');

        const automovilesCapacidad5 = await automovilCollection.find({ Capacidad: 5 }).toArray();

        const automovilesDisponibles = await sucursalAutomovilCollection.distinct('id_Automovil', { Cantidad_Disponible: { $gt: 0 } });

        const result = automovilesCapacidad5.filter(automovil => automovilesDisponibles.includes(automovil.id_Automovil));

        res.json(result);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;