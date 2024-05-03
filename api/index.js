import server from './src/app.js';// Importamos el servidor HTTP desde el archivo app.js
const PORT = process.env.PORT ?? 3002; // Obtener el puerto del archivo de configuración .env o usar el puerto 3002 por defecto.


// Colocamos nuestro servidor a escuchar en el puerto especificado (PORT).
server.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
});



// Manejo de errores del servidor
server.on('error', (err) => {
    console.error('Internal server error', err);
});