

* Inicializamos el proyecto:

- npm init -y

***Esto crea un archivo package.json, contiene los metadatos y una lista de paquetes***

* Este comando, crea una carpeta node_modules, donde reside express y las dependencias.
- npm install express
Ademas, se crea un archivo package-lock.json, guarda la version exacta y el arbol de dependencias para que si se lelva el codigo a otra computadra, se instale exactamente el mismo (evita problemas, y no alguien venga y diga que en mi pc no funciona).

* crear un index.js, QUE ES UN MI PUNTO DE ENTRADA.

{
    antes de avanzar, debemos saber de async/await, porque en node.js es de un solo hilo, si hicieramos la peticion de forma sincronza todo el servidor se detendria y nadie podria entrar mientras se espera.

}

* Ahora, no podemos seguir metiendo todo los endpoint en index.js, porque se satura.  Entonces, utilizaremos modularizacion mediante el router de EXPRESS (mejora exp. de desarrollo). Ademas, utilizaremos la herramiento de nodemon para cada vez que cambiemos algo, no reiniciar  a cada rato. Instalar:
- npm install --save-dev nodemon // https://www.npmjs.com/package/nodemon
- npm install helmet
Configurar package.json y añadimos en script:
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
- npm run dev 


* Crear API RESTful. Para que sea mantenbile, escalable y noos permita cambiar de base de datos, utilizaremos la arquitectura en capas y el patron repository.
- routes: define las urls.
- controllers: recibe el pedido, validad y lo entrega.
- services: realiza la logica.
- repository: busca la info.

/src
  ├── /controllers    (Lógica de req/res)
  ├── /services       (Lógica de negocio: cálculos de stats, reglas)
  ├── /repositories    (Acceso a datos: aquí es donde SQLite vive hoy)
  ├── /routes         (Definición de rutas)
  ├── /middlewares    (Seguridad, Auth, Validaciones)
  └── app.js          (Configuración de Express)
index.js              (Arranque del servidor)

//crear archivos de Adelante hacia atras
Ruta -> Controlador -> Servicio -> Repositori

Esto nos ayuda porque si hay un error por ejemplo de algun calculo de stat, se va directo a service. no tocas las rutas ni la base de datos.
Podemos usarlo para pasarle datos falsos en service (mock_data).
* instalar CORS:

- npm install cors

* Capa de datos usando sqlite y el patron repository. 

config de infraestructura.
- Para usar una BD, debemos instalar su libreria.
    - Usamos sqlite (pero si se quiere usar otro, buscar npm por ejemplo de mysql): npm install sqlite3

Patron repository:

creamos pokemonRepository.js
- Nos ayuda por que si mañana se cambia de BD, solo creamos un nuevo repositorio con los mismos nombres de funciones. 

db.get(sql, [params], callback) //get
db.run(sql, [params], callback) // post
db.each(sql, [params], callback, [complete])
db.all(sql, [params], callback, [complete]) //getrray
https://www.codecademy.com/learn/learn-node-sqlite/modules/learn-node-sqlite-module/cheatsheet 
https://github.com/TryGhost/node-sqlite3/wiki/API 
https://www.sqlitetutorial.net/sqlite-nodejs/query/#:~:text=Querying%20data%20from%20a%20table,this%20tutorial%20to%20do%20it. 

el ? de repository es el placeholder
req.query, cuanod la url contiene ? 
/req.params: Se usa para parametros incrustados en la URL que definiste con /:id
req.body
req.file
req.user


convencion:
Operación 	Método HTTP	Nombre del Método (Convención)
Leer todos	GET	findAll o index
Leer uno	GET	findOne o show
Crear	POST	create o save
Actualizar	PUT / PATCH	update
Eliminar	DELETE	remove o delete

AYUDA:
- En service se usa await, y se llama a controller.
- debemos desarmar el cuerpo