# Requisitos y Planificación (En desarrollo)

**Descripción del Dominio:**

En laboratorio de programación 2023, se desarrollo un sitio web relacionado con la serie animada Pokemon, mas especifico con una "Pokedex". En esta nuevo projecto, el objetivo es crear una sistema-app-movil (con API propia que sera consumida para satisfacer las necesidades). 

Los usuarios que usaran la aplicacion seran los siguientes:
- Registrados: Quieren ver informacion de los pokemons, movimientos. Adicional a esto podran crear su propio equipo pokemon con las funciones escenciales(borrar, editar).

La aplicación es usado como herramienta para planificar equipos competitivos fuera del juego original, especializar a los miembros calculando estadisticas finales (EVS/IVS/naturaleza) y consultar informacion.

**La aplicacion dispondra de la generacion [1-5]*

**Requisitos Funcionales (RF)**

- RF01: Registro de usuario
    - Campos requeridos: nombre de usuario, email, contraseña.
    - Validar que email y usuario sean únicos
    - Contraseña mínima: 6 caracteres
- RF02: Inicio de sesión
    - Login con usuario/email y contraseña
    - Mostrar mensaje claro si credenciales son incorrectas
    - Opción "Recordar sesión" (opcional)
- RF03: Consulta de Pokémon
    - Listar todos los Pokémon (generacion [1-5]) con imagen, nombre, tipos, id.
    - Búsqueda por nombre (coincidencia parcial)
    - Ver detalle de Pokémon: tipos, estadísticas base, movimientos, habilidades.
- RF04: Consulta de movimientos
    - Listar movimientos disponibles
    - Filtrar por tipo de movimiento
    - Ver detalle: poder, precisión, PP, descripción.
- RF05: Creación de equipos
    - Nombre del equipo (obligatorio, único por usuario).   
    - Añadir Pokémon al equipo (mínimo 1, máximo 6)
    - Guardar equipo en la base de datos.
- RF06: Personalización de Pokémon en equipo
    - Ajustar EVs para cada estadística (0-252).
    - Ajustar IVs para cada estadística (0-31).
    - Seleccionar naturaleza de lista predefinida.
    - Seleccionar movimientos (4 máximo por Pokémon).
    - Seleccionar habilidad.
- RF07: Cálculo automático de estadísticas
    - Calcular estadísticas finales usando fórmula:
Estadística = ((Base * 2 + IV + EV/4) * Nivel/100 + 5) * Naturaleza.
    - Validación: Total EVs ≤ 510.
    - Validación: EVs por estadística ≤ 252.
- RF08: Gestión de equipos existentes
    - Listar todos los equipos del usuario.
    - Editar equipo existente (nombre, Pokémon, estadísticas).
    - Eliminar equipo con confirmación.
- RF09: Perfil de usuario
    - Ver información del perfil.
    - Cambiar nombre de usuario (disponibilidad).
    - Cambiar contraseña (confirmar contraseña actual).
- RF10: Filtros básicos
    - Filtrar Pokémon por tipo (1 o 2 tipos).
    - Filtrar Pokémon por generación (1-5).
    - Ordenar Pokémon por: número, nombre, estadística específica.


**Requisitos no Funcionales (RNF)**   
- RNF01: Código organizado
    - Separar lógica de negocio de la interfaz
    - Componentes reutilizables donde sea posible
    - Comentarios en código complejo.
- RNF02: Estructura clara
    - Separación por carpetas: components, screens, services, utils.
    - Nomenclatura consistente en inglés o español (elegir uno).
- RNF03: Mantenibilidad - El código debe ser fácil de modificar y extender.
- RNF04: Escalabilidad - La arquitectura debe permitir añadir nuevas funcionalidades.
