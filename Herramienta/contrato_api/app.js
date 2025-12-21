// importacion del modulo
const express = require('express');
const app= express();
const PORT= process.env.PORT || 3000;
// helmet (adicional)
const helmet = require('helmet');

// instancia de la app

app.use(helmet({
    // Desactivamos CSP momentáneamente para que Chrome DevTools no lance el error que mencionaste
    contentSecurityPolicy: false 
}));
//middleware para entender json
app.use(express.json());
app.get('/favicon.ico', (req, res) => res.status(204).end());
// --- NUEVA RUTA PARA EVITAR EL 404 EN EL HOME ---
app.get('/', (req, res) => {
    res.send('Servidor Arriba - Ruta Raíz');
});

// definicion de una ruta
//orden peticion y luego la respuesta (solo existen tres parametros, NEXT)


//express/ el proceso inicia con la llegada de un paquete http (envian dato al servidor (this))
//express recibe esa info cruda, lo empaqueta en un objeto javascript para ser facil de leer.
//ese objeto se llama req.
//express crea un objeto para contestar al emisor.

app.get('/health', (req,res) =>{
// => es function con return
    res.status(200).json({
        status:'ok',
        date: new Date().toISOString()});
});

//encender el servidor
//express le pide a node.js que abra un socket tcp en un puerto (3000)
//haciendo esto, internamente se convierte en un proceso persistente que se queda esperando señaes de la red

// node.js, solicita al SO usar este puerto  (syscall)
app.listen(PORT, ()=> {
    //esto es un callback ()=>{}
        //solo se ejecuta cuando el server esta listo para recibir peticiones
    // el PORT es para indicar al cliente donde enviar datos
    console.log(`Servidor escucha en http://localhost:${PORT}`);
});