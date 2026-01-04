const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../shared/config');

function authMiddleware(req, res, next) {
    // Verifica el token JWT en el header Authorization, cuando uso el endpoint debo mandar el header donde definimos si o si "authorization:"
    const authHeader = req.headers['authorization'];
    //authHeader tiene el formato "Bearer token
    // get localhost:3000/me
    // elijo header, add header, name: authorization, value: Bearer <token>
    //ejemplo header: Authorization, Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tYnJlIjoiQ3Jpc3RvcGhlciIsImlhdCI6MTY5ODc0MjI0MH0.DlXoYk2r8Y8K3Z8v5Z5V7jWcX9Yx1F2vXz3kX9z5Z0k
    // el bearer es un prefijo que indica que es un token JWT, osea si o si se pone bearer antes del token porque asi lo define el estandar no puedo poner otro prefijo porque no lo reconoceria el middleware
    //link documentacion: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization  
    // link de bearer token: https://es.wikipedia.org/wiki/Bearer_token
    // ejemplo de authHeader: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tYnJlIjoiQ3Jpc3RvcGhlciIsImlhdCI6MTY5ODc0MjI0MH0.DlXoYk2r8Y8K3Z8v5Z5V7jWcX9Yx1F2vXz3kX9z5Z0k"
    //el split separa el string en un array de 2 elementos: ["Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibm9tYnJlIjoiQ3Jpc3RvcGhlciIsImlhdCI6MTY5ODc0MjI0MH0.DlXoYk2r8Y8K3Z8v5Z5V7jWcX9Yx1F2vXz3kX9z5Z0k"]
    // luego tomo el segundo elemento del array que es el token en si.
    // si no hay authHeader, token sera undefined
    //authheader && evalua si authHeader es truthy, si lo es, ejecuta la segunda parte despues de &&
    // si no lo es, token sera undefined
    //token es el token en si, sin el prefijo Bearer, el && evita errores si no hay authHeader
    //token no es un boolean, es un string o undefined porque split devuelve un string
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'Token requerido' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, error: 'Token inválido' });
        req.user = user; // El usuario autenticado queda disponible en req.user
        next(); // next() permite que la petición continúe hacia el controlador
    });
}

//NO REtornamos el req.user, porque el req se pasa por referencia, no por valor
module.exports = authMiddleware;
