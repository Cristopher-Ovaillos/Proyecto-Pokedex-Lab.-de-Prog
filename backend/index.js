// importacion del modulo
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
// helmet (adicional)
const helmet = require('helmet');
const cors = require('cors');
// import routes
const pokedexRoutes = require('./src/routes/pokedexRoutes');


//-------------
// instancia de la app
app.use(helmet({
    contentSecurityPolicy: false 
}));
app.use(cors());
//middleware para entender json
app.use(express.json());
app.get('/favicon.ico', (req, res) => res.status(204).end());

// --- conexion rutas ---
app.use('/api/pokedex', pokedexRoutes);

// express/ el proceso inicia con la llegada de un paquete http (envian dato al servidor (this))
// ... (tus otros comentarios se mantienen igual) ...

app.get('/health', (req,res) =>{
    res.status(200).json({
        status:'ok',
        date: new Date().toISOString()});
});

app.listen(PORT, ()=> {
    console.log(`Servidor escucha en http://localhost:${PORT}`);
    console.log("-------------------------------------------------");
    console.log("POKEDEX");
    console.log(" GET http://localhost:3000/api/pokedex?page=2");
    console.log(" GET http://localhost:3000/api/pokedex/1");
    console.log(" GET http://localhost:3000/api/pokedex?page=2&limit=30");
    console.log(" GET http://localhost:3000/api/pokedex/?search=bul");
    console.log("-------------------------------------------------");
    console.log("EQUIPO");
    console.log(" GET http://localhost:3000/api/pokedex?page=2");
    console.log(" GET http://localhost:3000/api/pokedex/1");
    console.log(" GET http://localhost:3000/api/pokedex?page=2&limit=30");
    console.log(" GET http://localhost:3000/api/pokedex/?search=bul");
    console.log("-------------------------------------------------");


});