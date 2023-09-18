const { MongoClient } = require('mongodb');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bases = process.env.DBBD;
const claveSecreta = 'campus';
require('dotenv').config()


// ** 1.Mostrar todos los clientes registrados en la base de datos
router.get('/todos_los_clientes', verificarToken,async (req, res) => {
    // Middleware de verificación de token

    try {
        const client = new MongoClient(bases);
        await client.connect();
        console.log('Connect to Database');
        const db = client.db('AlquilerAutos');
        const clienteCollection = db.collection('cliente');
        
        const result = await clienteCollection.find({}).toArray();

        // Generar un token
        const token = jwt.sign({}, claveSecreta, { expiresIn: '1h' });

        // Enviar el token junto con los datos
        res.json( {result, token} );

        client.close();
    } catch (error) {
        res.status(404);
    }
});

function verificarToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });

    try {
        const decoded = jwt.verify(token, 'secreto'); // Verifica el token usando la clave secreta
        req.user = decoded; // Almacena la información del usuario en el objeto de solicitud
        next(); // Continúa con la siguiente función en la ruta
    } catch (ex) {
        res.status(400).json({ message: 'Token inválido.' });
    }
}

// ** 9.Listar los clientes con el DNI específico.
function verificarToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });

    try {
        const decoded = jwt.verify(token, 'secreto');
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Token inválido.' });
    }
}
router.get('/clientes_por_dni/:dni', verificarToken, async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        console.log('Connect to Database');
        const db = client.db('AlquilerAutos');
        const clienteCollection = db.collection('cliente');
        
        const dniCliente = req.params.dni;

        const result = await clienteCollection.find({ dni: dniCliente }).toArray();

        res.json(result);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// **12.Listar las reservas pendientes realizadas por un cliente específico.
router.get('/reservas_pendientes_por_cliente/:idCliente', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        console.log('Connect to Database');
        const db = client.db('AlquilerAutos');
        const reservaCollection = db.collection('reserva');
        
        const idCliente = req.params.idCliente;

        const result = await reservaCollection.find({ id_Cliente: idCliente, estado: 'pendiente' }).toArray();

        res.json(result);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// **14.Obtener los datos de los clientes que realizaron al menos un alquiler.
router.get('/clientes_con_alquileres', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        console.log('Connect to Database');
        const db = client.db('AlquilerAutos');
        const clienteCollection = db.collection('cliente');
        const alquilerCollection = db.collection('alquiler');

        const clientesConAlquileres = await alquilerCollection.distinct('id_Cliente');
        
        const result = await clienteCollection.find({ id_Cliente: { $in: clientesConAlquileres } }).toArray();

        res.json(result);
        client.close();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;