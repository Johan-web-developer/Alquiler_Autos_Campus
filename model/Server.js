const express = require('express');
const router = express.Router();
const routerClientes = require('../routes/clientes.routes');
const routerAutomoviles  = require('../routes/automoviles.routes');
const routerAlquileres = require('../routes/alquileres.routes');
const routerReservas = require('../routes/reservas.routes');
const routerEmpleados = require('../routes/empleados.routes');
const routerSucursales = require('../routes/sucursales.routes');

class Server {
    constructor() {
        this.app = express();
        this.middleware();
        this.port = process.env.PORT;
        this.routes();
    }
    middleware(){
        this.app.use(express.json())
    }
    routes(){
        this.app.use('/api/clientes', routerClientes);
        this.app.use('/api/automoviles', routerAutomoviles);
        this.app.use('/api/alquileres', routerAlquileres);
        this.app.use('/api/reservas', routerReservas);
        this.app.use('/api/empleados', routerEmpleados);
        this.app.use('/api/sucursales', routerSucursales);
    }
    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Server is running on port ${this.port}`);
        })
    }
}


module.exports = Server;