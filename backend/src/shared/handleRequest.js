// Helper para manejar peticiones async en los controllers
// Evita repetir try/catch en cada método

module.exports = function handleRequest(controllerMethod) {
  return async function (req, res, next) {
    try {
      await controllerMethod(req, res, next);
    } catch (err) {
      // Puedes personalizar el manejo de errores aquí
      res.status(err.status || 500).json({ error: err.message });
    }
  };
};