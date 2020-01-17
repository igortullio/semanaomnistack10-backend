const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const routes = require('./routes');
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect(
    'mongodb+srv://omnistack:omnistack@cluster0-glgcy.mongodb.net/test?retryWrites=true&w=majority', 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        tlsAllowInvalidHostnames: true, 
        tlsAllowInvalidCertificates: true
    } 
)
    .then(() => console.log('DB connect'))
    .catch(e => console.log('DB error', e));

app.use(cors())    
app.use(express.json());
app.use(routes);

server.listen(3333);

/*
Métodos HTTP: GET, POST, PUT, DELETE

Tipos de parâmetros:
    Query Params: request.query (Filtros, ordenação, paginação, ...)
    Route Params: request.params (Identificar um recurso na alteração ou remoção)
    Body: request.body (Dados para criação ou alteração de um registro)
*/