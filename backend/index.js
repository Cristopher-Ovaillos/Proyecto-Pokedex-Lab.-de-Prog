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
    //esto es un callback ()=>{}
    //solo se ejecuta cuando el server esta listo para recibir peticiones
    // el PORT es para indicar al cliente donde enviar datos
    console.log(`Servidor escucha en http://${config.BASE_URL}`);
    console.log("-------------------------------------------------");
    console.log("ENCICLOPEDIA");
    console.log(" GET  http://localhost:3000/api/enciclopedia/pokemon");
    console.log(" GET  http://localhost:3000/api/enciclopedia/pokemon/25");
    console.log(" GET  http://localhost:3000/api/enciclopedia/pokemon?type=fire&search=char&limit=10");
    console.log(" GET  http://localhost:3000/api/enciclopedia/pokemon/25/movimientos");
    console.log(" GET  http://localhost:3000/api/enciclopedia/pokemon/25/movimientos?level=50&type=electric");
    console.log(" GET  http://localhost:3000/api/enciclopedia/movimientos");
    console.log(" GET  http://localhost:3000/api/enciclopedia/movimientos?type=fire&category=special&poder=90");
    console.log(" GET  http://localhost:3000/api/enciclopedia/movimientos/1/pokemon");
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
    console.log("USUARIO");
    console.log(" POST http://localhost:3000/api/auth/register");
    console.log(" GET http://localhost:3000/api/auth/login");
    console.log(" GET http://localhost:3000/api/auth/protected  (requiere token)");
    console.log("-------------------------------------------------");

    //lista de endpoints con body, query params, path params, headers
    // 1. enciclopedia
    // a. pokemon necesita query params
    //      params: type, search, limit, page, sort, order
    // b. pokemon por id necesita path param
    //      param: id
    // c. movimientos de un pokemon necesita path param + query params
    //      params: level, method, type, category, min_power, max_power
    // b. movimientos necesita query params
    // c. naturalezas no necesita nada
    // d. habilidades necesita query params
    // 2. equipo
    // a. listar equipos de un usuario (path param)
    // b. obtener equipo por id (path param)
    // c. crear equipo (body)
    //      body: { nombre, id_usuario }
    // d. actualizar equipo (path param + body)
    // e. eliminar equipo (path param)
    // 3. usuario
    // a. register (body)
    // b. login (body)
    // c. protected (header con token)



    /*
    enciclopedia
   
    GET  http://localhost:3000/api/enciclopedia/pokemon
        - query type, search, limit, page, sort, order
    GET  http://localhost:3000/api/enciclopedia/pokemon/:id
        - {
  "success": true,
  "data": {
    "id": 1,
    "nombre": "bulbasaur",
    "tipos": [
      "grass",
      "poison"
    ],
    "estadisticas": {
      "hp_base": 45,
      "ataque_base": 49,
      "ataque_especial_base": 65,
      "defensa_base": 49,
      "defensa_especial_base": 65,
      "velocidad_base": 45
    },
    "habilidades": [
      {
        "nombre": "overgrow",
        "descripcion": "When this Pokémon has 1/3 or less of its HP remaining, its grass-type moves inflict 1.5× as much regular damage.",
        "oculta": false
      },
      {
        "nombre": "chlorophyll",
        "descripcion": "This Pokémon's Speed is doubled during strong sunlight.\n\nThis bonus does not count as a stat modifier.",
        "oculta": true
      }
    ],
    "imagenUrl": "192.168.1.59:3000/pokemon/1.png"
  }
}
    GET  http://localhost:3000/api/enciclopedia/pokemon/:id/movimientos
        -  query:  level, method, type, category,  min_power, max_power.
    GET  http://localhost:3000/api/enciclopedia/movimientos
        - query: type, category, min_power, max_power, min_accuracy, max_accuracy, search, limit, page
    GET  http://localhost:3000/api/enciclopedia/naturalezas
    GET  http://localhost:3000/api/enciclopedia/habilidades
        -query search limit page

 
    EQUIPO"
    GET http://localhost:3000/api/usuarios/:id_usuario/equipos
    GET http://localhost:3000/api/equipos/:id
        - lista de pokemon del equipo elegido
    POST http://localhost:3000/api/equipos
    PUT http://localhost:3000/api/equipos/:id;
    DELETE http://localhost:3000/api/equipos/:id

    USUARIO
    POST http://localhost:3000/api/auth/register
    GET http://localhost:3000/api/auth/login
    * esto todavia no tiene middleware, ni hash.
 

    
    */


});
