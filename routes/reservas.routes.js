const { MongoClient } = require('mongodb');
const express = require('express');
const router = express.Router();
const bases = process.env.DBBD;
require('dotenv').config();

//  ** 4. Mostrar todas las reservas pendientes con los datos del cliente y el automóvil reservado.
router.get('/reservas_pendientes', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        console.log('Connect to Database');
        const db = client.db('AlquilerAutos');
        const reservaCollection = db.collection('reserva');
        
        const result = await reservaCollection.aggregate([
            {
                $match: { estado: "pendiente" } 
            },
            {
                $lookup: {
                    from: "cliente",
                    localField: "id_Cliente",
                    foreignField: "id_Cliente",
                    as: "cliente_info"
                }
            },
            {
                $lookup: {
                    from: "automovil",
                    localField: "id_Automovil",
                    foreignField: "id_Automovil",
                    as: "automovil_info"
                }
            },
            {
                $unwind: "$cliente_info"
            },
            {
                $unwind: "$automovil_info"
            },
            {
                $project: {
                    _id: 0,
                    id_Reserva: 1,
                    fecha_reserva: 1,
                    fecha_inicio: 1,
                    fecha_fin: 1,
                    estado: 1,
                    "cliente_info.nombre": 1,
                    "cliente_info.apellido": 1,
                    "cliente_info.dni": 1,
                    "cliente_info.direccion": 1,
                    "cliente_info.telefono": 1,
                    "cliente_info.email": 1,
                    "automovil_info.id_Automovil": 1,
                    "automovil_info.marca": 1,
                    "automovil_info.modelo": 1,
                    "automovil_info.anio": 1,
                    "automovil_info.tipo": 1,
                    "automovil_info.Capacidad": 1,
                    "automovil_info.Precio_Diario": 1
                }
            }
        ]).toArray();

        res.json(result);
        client.close();
    } catch (error) {
        res.status(404);
    }
});

// **19.Obtener los datos del cliente que realizó la reserva
router.get('/datos_cliente_reserva/:idReserva', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        console.log('Connect to Database');
        const db = client.db('AlquilerAutos');
        const reservaCollection = db.collection('reserva');
        const clienteCollection = db.collection('cliente');

        const idReserva = req.params.idReserva;

        const reserva = await reservaCollection.findOne({ id_Reserva: idReserva });

        if (!reserva) {
            return res.status(404).json({ error: "Reserva no encontrada" });
        }

        const idCliente = reserva.id_Cliente;

        const cliente = await clienteCollection.findOne({ id_Cliente: idCliente });

        if (!cliente) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }

        res.json(cliente);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
