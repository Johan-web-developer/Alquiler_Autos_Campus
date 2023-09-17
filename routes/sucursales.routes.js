const { MongoClient } = require('mongodb');
const express = require('express');
const router = express.Router();
const bases = process.env.DBBD;
require('dotenv').config();


// ** 7.Mostrar la cantidad total de automóviles disponibles en cada sucursal.
router.get('/cantidad_automoviles_por_sucursal', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        console.log('Connect to Database');
        const db = client.db('AlquilerAutos');
        const sucursalAutomovilCollection = db.collection('sucursal_automovil');
        const sucursalCollection = db.collection('sucursal');

        const resultado = await sucursalAutomovilCollection.aggregate([
            {
                $group: {
                    _id: "$id_sucursal",
                    total_disponibles: { $sum: "$Cantidad_Disponible" }
                }
            },
            {
                $lookup: {
                    from: "sucursal",
                    localField: "_id",
                    foreignField: "id_sucursal",
                    as: "sucursal_info"
                }
            },
            {
                $project: {
                    _id: 0,
                    sucursal_id: "$_id",
                    nombre_sucursal: { $arrayElemAt: ["$sucursal.nombre", 0] },
                    total_disponibles: 1
                }
            }
        ]).toArray();

        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;