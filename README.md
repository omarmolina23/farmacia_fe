# Nueva Esperanza Design - Frontend

Este es el frontend de **Nueva Esperanza Design**, una aplicación web desarrollada con **React** y **Vite** para ofrecer una experiencia rápida y eficiente.

## Tecnologías Utilizadas

- [React](https://react.dev/) - Biblioteca para interfaces de usuario
- [Vite](https://vitejs.dev/) - Herramienta de construcción rápida
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [React Router](https://reactrouter.com/) - Manejo de rutas
- [Axios](https://axios-http.com/) - Cliente HTTP para comunicación con la API

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados:

- Node.js (v18 o superior)
- npm o yarn

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/usuario/nueva-esperanza-frontend.git
   cd nueva-esperanza-frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o usando yarn
   yarn install
   ```

3. Configura las variables de entorno:
   - Copia el archivo `.env.example` y renómbralo a `.env`
   - Ajusta las variables según tu configuración

## Uso

### Modo desarrollo

Ejecuta el servidor de desarrollo con recarga automática:
```bash
npm run dev
```

### Modo producción

Compila y sirve la aplicación para producción:
```bash
npm run build
npm run preview
```

## Conexión con el Backend

La aplicación se conecta al backend en **NestJS** y **Fastify**. Para configurar la URL de la API, edita el archivo `.env`:
```env
VITE_API_URL=http://localhost:3000
```

## Despliegue

Para desplegar la aplicación en un servidor estático:

```bash
npm run build
```

Luego, sube el contenido de la carpeta `dist` a un hosting como Vercel, Netlify o un servidor con Nginx.

## Contribución

Si deseas contribuir, sigue estos pasos:

1. Haz un fork del repositorio
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios y haz un commit (`git commit -m 'Añadir nueva funcionalidad'`)
4. Sube los cambios a tu fork (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT. Para más detalles, consulta el archivo `LICENSE`.

---

¡Gracias por usar **Nueva Esperanza Design**!

