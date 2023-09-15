const express = require('express');
const router = express.Router();
const routerTest = require('../routes/clientes.routes')

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
        this.app.use('/api/clientes', routerTest);
    }
    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Server is running on port ${this.port}`);
        })
    }
}


module.exports = Server;