# frontend-scalable

Arquitectura escalable basada en Features para React Native (Expo) con NativeWind v4.

## Eficiencia y Arquitectura

Este proyecto utiliza el patron **Feature-First** (o Domain-Driven directory structure). Esto mejora la escalabilidad porque:
1.  **Encapsulamiento:** Todo lo relacionado con una funcionalidad (vistas, componentes, logica) vive en una sola carpeta (`src/features/auth`).
2.  **Mantenibilidad:** Evita tener carpetas gigantes de "components" mezclados. Si borras la carpeta de una feature, borras todo su codigo sin dejar basura.
3.  **Configuracion Centralizada:** Los colores y URLs de API no estan hardcodeados (ver `src/constants` y `src/config`).

## Setup Inicial

1.  Instalar dependencias:
    `npm install`
2.  Iniciar proyecto:
    `npx expo start -c` (La bandera -c limpia la cache, vital para cambios de Tailwind/Babel)

## Documentacion Oficial (Referencia)

* **Estilos:** [NativeWind v4](https://www.nativewind.dev/v4/overview) & [Tailwind CSS](https://tailwindcss.com/docs)
* **Navegacion:** [React Navigation](https://reactnavigation.org/docs/getting-started)
* **Iconos (Opcional):** [Expo Vector Icons](https://icons.expo.fyi/)
* **Expo:** [Expo Documentation](https://docs.expo.dev/)

## Estructura de Carpetas

* `src/config`: Variables de entorno y Endpoints.
* `src/constants`: Tema (Colores, Fuentes). Modificar aqui actualiza Tailwind.
* `src/features`: Modulos de la aplicacion (Auth, Profile, Feed).
* `src/components/ui`: Atomos visuales reutilizables (Botones genericos, Inputs).

