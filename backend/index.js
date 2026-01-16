// importacion del modulo
const express = require('express');
const config = require('./src/shared/config')
const app = express();
const PORT = config.PORT;
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
// en enciclopedia service, vamos a devolver la url de la imagen entonces devemos exponerla. Importar Path
const path = require('path');
app.use('/pokemon', express.static(path.join(__dirname, config.IMAGE_URL)));
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
    console.log(`Servidor escucha en ${config.BASE_URL}`);
    console.log("-------------------------------------------------");

    const routes = [
        { section: "ENCICLOPEDIA", method: "GET", path: "/api/enciclopedia/pokemon", params: "type, search, limit, page, sort, order", desc: "Listar pokemons con filtros" },
        { section: "ENCICLOPEDIA", method: "GET", path: "/api/enciclopedia/pokemon/:id", params: "id", desc: "Obtener un pokemon por su ID" },
        { section: "ENCICLOPEDIA", method: "GET", path: "/api/enciclopedia/pokemon/:id/movimientos", params: "id, level, method, type, category, min_power, max_power", desc: "Listar movimientos de un pokemon" },
        { section: "ENCICLOPEDIA", method: "GET", path: "/api/enciclopedia/movimientos", params: "type, category, min_power, max_power, min_accuracy, max_accuracy, search, limit, page", desc: "Listar todos los movimientos con filtros" },
        { section: "ENCICLOPEDIA", method: "GET", path: "/api/enciclopedia/naturalezas", params: "-", desc: "Listar todas las naturalezas" },
        { section: "ENCICLOPEDIA", method: "GET", path: "/api/enciclopedia/habilidades", params: "search, limit, page", desc: "Listar todas las habilidades con filtros" },
        
        { section: "EQUIPOS", method: "GET", path: "/api/usuarios/:id_usuario/equipos", params: "id_usuario", desc: "Listar equipos de un usuario" },
        { section: "EQUIPOS", method: "GET", path: "/api/equipos/:id", params: "id", desc: "Obtener un equipo y sus integrantes" },
        { section: "EQUIPOS", method: "POST", path: "/api/equipos", params: "Body: { nombre, id_usuario }", desc: "Crear un nuevo equipo" },
        { section: "EQUIPOS", method: "PUT", path: "/api/equipos/:id", params: "id, Body: { nombre, integrantes }", desc: "Actualizar un equipo" },
        { section: "EQUIPOS", method: "DELETE", path: "/api/equipos/:id", params: "id", desc: "Eliminar un equipo" },

        { section: "USUARIOS", method: "POST", path: "/api/auth/register", params: "Body: { nombre_usuario, email, contrasenia }", desc: "Registrar un nuevo usuario" },
        { section: "USUARIOS", method: "POST", path: "/api/auth/login", params: "Body: { nombre_usuario, contrasenia }", desc: "Iniciar sesión" },
        { section: "USUARIOS", method: "GET", path: "/api/auth/me", params: "Header: Authorization: Bearer <token>", desc: "Obtener datos del usuario autenticado" },
    ];

    let currentSection = "";
    routes.forEach(route => {
        if (currentSection !== route.section) {
            console.log(`\n--- ${route.section} ---`);
            currentSection = route.section;
        }
        console.log(`  ${route.method.padEnd(6)} ${route.path.padEnd(45)} \n           Params: ${route.params}\n           Desc: ${route.desc}\n`);
    });

    console.log("-------------------------------------------------");
});
