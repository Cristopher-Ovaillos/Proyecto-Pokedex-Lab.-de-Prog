// Helper para obtener el código de estado HTTP según el mensaje de error
module.exports = function getHttpStatus(errorMessage) {
  if (!errorMessage) return 500;
  if (errorMessage.includes('VALIDATION_ERROR')) return 400;
  if (errorMessage.includes('NOT_FOUND_ERROR')) return 404;
  if (errorMessage.includes('CONFLICT_ERROR')) return 409;
  if (errorMessage.includes('AUTH_ERROR')) return 401;
  if (errorMessage.includes('FORBIDDEN_ERROR')) return 403;
  return 500;
};
