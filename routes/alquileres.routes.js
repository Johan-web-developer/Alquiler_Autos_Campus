const { MongoClient } = require('mongodb');
const express = require('express');
const router = express.Router();
const bases = process.env.DBBD;
require('dotenv').config();

// ** 3.Listar todos los alquileres activos junto con los datos de los clientes relacionados.
router.get('/alquileres_activos_con_clientes', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        console.log('Connect to Database');
        const db = client.db('AlquilerAutos');
        const alquilerCollection = db.collection('alquiler');
        
        const result = await alquilerCollection.aggregate([
            {
                $match: { estado: "completado" } // Filtra solo los alquileres activos
            },
            {
                $lookup: {
                    from: "cliente",
                    localField: "id_cliente",
                    foreignField: "id_Cliente",
                    as: "cliente_info"
                }
            },
            {
                $unwind: "$cliente_info"
            },
            {
                $project: {
                    _id: 0,
                    id_alquiler: 1,
                    fecha_inicio: 1,
                    fecha_fin: 1,
                    costo_total: 1,
                    estado: 1,
                    "cliente_info.nombre": 1,
                    "cliente_info.apellido": 1,
                    "cliente_info.dni": 1,
                    "cliente_info.direccion": 1,
                    "cliente_info.telefono": 1,
                    "cliente_info.email": 1
                }
            }
        ]).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404);
    }
});

// **5. Obtener los detalles del alquiler con el ID_Alquiler(3) específico.
router.get('/detalle_alquiler/:id', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        console.log('Connect to Database');
        const db = client.db('AlquilerAutos');
        const alquilerCollection = db.collection('alquiler');
        
        const idAlquiler = parseInt(req.params.id);

        const result = await alquilerCollection.findOne({ id_alquiler: idAlquiler });

        res.json(result);
        client.close();
    } catch (error) {
        res.status(404);
    }
});

//** 8.Obtener el costo total de un alquiler específico.
router.get('/costo_alquiler/:id', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        console.log('Connect to Database');
        const db = client.db('AlquilerAutos');
        const alquilerCollection = db.collection('alquiler');
        
        const idAlquiler = parseInt(req.params.id); // Convertir el parámetro a entero

        const result = await alquilerCollection.findOne({ id_alquiler: idAlquiler });

        if (result) {
            res.json({ costo_total: result.costo_total });
        } else {
            res.status(404).json({ error: "Alquiler no encontrado" });
        }

        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router