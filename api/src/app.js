import dotenv from  'dotenv'; // Importar el módulo dotenv para la configuración de variables de entorno
dotenv.config(); // Configurar las variables de entorno desde el archivo .env
import { createServer } from 'node:http'; // Importamos la función createServer del módulo http de Node.js
import express from 'express';
import { Server as SocketServer} from 'socket.io'; // Importamos el servidor de sockets de Socket.IO
import morgan from 'morgan';


const app = express();
const server = createServer(app); // Servidor http

// Creamos un servidor de sockets WebSocket utilizando el servidor HTTP
const io = new SocketServer(server); // Servidor websocket. Origenes permitidos configurados en el archivo client/vite.config.js

// Middleware para registrar las solicitudes HTTP en la consola durante el desarrollo.
app.use(morgan('dev'));

// Manejador de eventos para la conexión de clientes al servidor de sockets
io.on('connection', socket => {
    console.log('connected client!'); // Registramos en la consola cuando un cliente se conecta al servidor de sockets
    socket.on('message', (body) => {
        console.log(body);
        socket.broadcast.emit('message', {
            body,
            from: socket.id.slice(1,5),
        })
    })
});


export default server; // Exportar el servidor HTTP para su uso en otros archivos