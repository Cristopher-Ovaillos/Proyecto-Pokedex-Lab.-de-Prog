// importacion del modulo
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
// helmet 
const helmet = require('helmet');
const cors = require('cors');
// import routes
const enciclopediaRoutes = require('./src/routes/enciclopediaRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const equiposRoutes = require('./src/routes/equipoRoutes')
// instancia de la app

app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(cors());
//middleware para entender json
app.use(express.json());
//se producia un error en la consola debido a solicitud de archivo, esto maneja ese error.
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Rutas
app.use('/api/enciclopedia', enciclopediaRoutes);
app.use('/api/auth', usuarioRoutes);
app.use('/api', equiposRoutes);
//express/ el proceso inicia con la llegada de un paquete http (envian dato al servidor (this))
//express recibe esa info cruda, lo empaqueta en un objeto javascript para ser facil de leer.
//ese objeto se llama req.
//express crea un objeto para contestar al emisor.
// definicion de una ruta
//orden peticion y luego la respuesta (solo existen tres parametros(req,rest,NEXT)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        date: new Date().toISOString()
    });
});

//encender el servidor
//express le pide a node.js que abra un socket tcp en un puerto (3000)
//haciendo esto, internamente se convierte en un proceso persistente que se queda esperando señaes de la red
// node.js, solicita al SO usar este puerto  (syscall)
app.listen(PORT, () => {
    //esto es un callback ()=>{}
    //solo se ejecuta cuando el server esta listo para recibir peticiones
    // el PORT es para indicar al cliente donde enviar datos
    console.log(`Servidor escucha en http://localhost:${PORT}`);
    console.log("-------------------------------------------------");
    console.log("ENCICLOPEDIA");
    console.log(" GET  http://localhost:3000/api/enciclopedia/pokemon");
    console.log(" GET  http://localhost:3000/api/enciclopedia/pokemon/25");
    console.log(" GET  http://localhost:3000/api/enciclopedia/pokemon?type=fire&search=char&limit=10");
    console.log(" GET  http://localhost:3000/api/enciclopedia/pokemon/25/movimientos");
    console.log(" GET  http://localhost:3000/api/enciclopedia/pokemon/25/movimientos?level=50&type=electric");
    console.log(" GET  http://localhost:3000/api/enciclopedia/movimientos");
    console.log(" GET  http://localhost:3000/api/enciclopedia/movimientos?type=fire&category=special&poder=90");
    console.log(" GET  http://localhost:3000/api/enciclopedia/naturalezas");
    console.log(" GET  http://localhost:3000/api/enciclopedia/habilidades");
    console.log(" GET  http://localhost:3000/api/enciclopedia/habilidades?search=fire");
    console.log("-------------------------------------------------");
    console.log("EQUIPO");
    console.log(" GET http://localhost:3000/api/usuarios/:id_usuario/equipos");
    console.log(" GET http://localhost:3000/api/equipos/:id");
    console.log(" POST http://localhost:3000/api/equipos");
    console.log(" PUT http://localhost:3000/api/equipos/:id");
    console.log(" DELETE http://localhost:3000/api/equipos/:id");
    console.log("-------------------------------------------------");
    console.log("-------------------------------------------------");
    console.log("USUARIO");
    console.log(" POST http://localhost:3000/api/auth/register");
    console.log(" GET http://localhost:3000/api/auth/login");
    console.log("-------------------------------------------------");


});