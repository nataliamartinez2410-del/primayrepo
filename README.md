# Mis Tareas — Agenda personal web

Aplicación web para organizar tareas diarias mediante calendario, agenda, prioridades, categorías, recurrencias y recordatorios del navegador.

## 1. Objetivo

El proyecto busca ofrecer una agenda personal ligera, rápida y fácil de usar desde computador o celular, sin depender actualmente de un backend, una base de datos ni un proceso de compilación.

La aplicación está diseñada como una SPA ligera basada en tecnologías web nativas: **HTML5 + CSS3 + JavaScript vanilla**.

---

## 2. Estado actual

La aplicación incluye:

- Creación de tareas.
- Edición de tareas.
- Eliminación de tareas.
- Marcar/desmarcar tareas como completadas.
- Fechas y organización por día.
- Calendario mensual.
- Vista tipo agenda.
- Vista de tareas del día.
- Búsqueda y filtrado.
- Prioridades: alta, normal y baja.
- Categorías para organizar las tareas.
- Tareas recurrentes.
- Recordatorios mediante Notifications API cuando el navegador lo permite.
- Indicadores/resúmenes de tareas.
- Persistencia local mediante `localStorage`.
- Diseño responsive para escritorio y dispositivos móviles.

> **Nota:** los datos se almacenan actualmente en el navegador/dispositivo mediante `localStorage`. No existe todavía sincronización entre dispositivos ni autenticación de usuarios.

---

## 3. Stack tecnológico

### Frontend

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica de la aplicación |
| CSS3 | Diseño, responsive layout, componentes visuales y estados |
| JavaScript ES6+ | Lógica de negocio, eventos, renderizado y persistencia |
| Web APIs | `localStorage`, fechas y notificaciones del navegador |

### Dependencias externas

Actualmente **no se utilizan frameworks ni librerías externas obligatorias**.

No requiere:

- React.
- Vue.
- Angular.
- Node.js para ejecutar la aplicación básica.
- Base de datos.
- API backend.
- Bundler.
- npm para producción.

Esto permite ejecutar el proyecto directamente desde archivos estáticos.

---

## 4. Estructura del proyecto

```text
primayrepo/
├── index.html      # Estructura principal de la aplicación
├── styles.css      # Estilos y diseño responsive
├── app.js          # Lógica de la aplicación
└── README.md       # Documentación técnica
```

### `index.html`

Contiene la estructura principal de la interfaz:

- Encabezado.
- Resumen de tareas.
- Formulario de creación/edición.
- Filtros.
- Buscador.
- Calendario.
- Agenda/listado de tareas.
- Contenedores para estados vacíos.
- Referencias a CSS y JavaScript.

### `styles.css`

Responsable de la presentación visual:

- Layout responsive.
- Grid y Flexbox.
- Tarjetas.
- Botones.
- Formularios.
- Estados de tareas.
- Prioridades.
- Categorías.
- Vista móvil.
- Estados activos y vacíos.

### `app.js`

Contiene la lógica funcional:

- Estado de las tareas.
- Creación y actualización.
- Eliminación.
- Cambio de estado.
- Filtrado.
- Búsqueda.
- Fechas.
- Recurrencias.
- Recordatorios.
- Renderizado dinámico.
- Persistencia en `localStorage`.

---

## 5. Modelo de datos

Cada tarea se representa como un objeto JavaScript. Conceptualmente utiliza una estructura similar a:

```js
{
  id: "identificador-unico",
  title: "Nombre de la tarea",
  date: "2026-08-16",
  time: "09:00",
  priority: "alta",
  category: "Trabajo",
  done: false,
  recurring: {
    enabled: true,
    type: "weekly"
  },
  reminder: {
    enabled: true,
    minutesBefore: 15
  }
}
```

Los campos pueden evolucionar a medida que se agreguen nuevas funcionalidades.

---

## 6. Persistencia

La aplicación utiliza:

```js
localStorage
```

para almacenar las tareas en el dispositivo del usuario.

### Ventajas

- No requiere servidor.
- No requiere autenticación.
- Funciona offline para las operaciones locales.
- Fácil de implementar.
- Respuesta inmediata.

### Limitaciones

- Los datos quedan asociados al navegador/dispositivo.
- No existe sincronización entre computador y celular.
- Borrar los datos del navegador puede eliminar las tareas.
- No existe recuperación desde servidor.
- No permite colaboración multiusuario.

Para una futura versión multi-dispositivo se recomienda migrar a una API + base de datos.

---

## 7. Arquitectura de la aplicación

La arquitectura actual es **client-side only**.

```text
Usuario
  ↓
Interfaz HTML
  ↓
JavaScript
  ├── Estado de tareas
  ├── Validación
  ├── Recurrencias
  ├── Recordatorios
  ├── Filtros / búsqueda
  └── Renderizado
  ↓
localStorage
```

No existe actualmente una capa de servidor.

---

## 8. Gestión del estado

El estado principal vive en memoria dentro de JavaScript.

Cuando se modifica una tarea:

1. Se actualiza el estado JavaScript.
2. Se persiste el nuevo estado en `localStorage`.
3. Se vuelve a renderizar la interfaz.
4. Los contadores y vistas se actualizan.

Este enfoque mantiene la implementación sencilla y evita dependencias de frameworks.

---

## 9. Calendario

El calendario permite representar visualmente las tareas asociadas a fechas.

La lógica debe trabajar con fechas en formato ISO cuando sea posible:

```text
YYYY-MM-DD
```

Esto facilita:

- Comparaciones.
- Ordenamiento.
- Selección de días.
- Persistencia.
- Navegación entre meses.

La presentación al usuario utiliza formatos localizados en español mediante APIs nativas de JavaScript como `Intl.DateTimeFormat`.

---

## 10. Vista agenda

La vista agenda organiza las tareas cronológicamente y permite consultar las actividades del día y próximos días.

La ordenación considera principalmente:

1. Estado de completada/pendiente.
2. Fecha.
3. Hora cuando está disponible.
4. Prioridad según la lógica de la vista.

Esto permite convertir la lista tradicional de tareas en una agenda diaria.

---

## 11. Recurrencias

La aplicación contempla tareas repetitivas.

Los tipos previstos incluyen:

- Diaria.
- Días laborales.
- Semanal.
- Mensual.

Una tarea recurrente no debería interpretarse simplemente como una única tarea infinita. La lógica debe generar o proyectar sus próximas ocurrencias a partir de una fecha base y de las reglas configuradas.

Para futuras mejoras se pueden agregar:

- Cada X días.
- Días específicos de la semana.
- Último día del mes.
- Fecha de finalización de la recurrencia.
- Número máximo de repeticiones.

---

## 12. Recordatorios

Los recordatorios utilizan las capacidades del navegador, principalmente **Notifications API**.

Flujo conceptual:

```text
Tarea
 ↓
Fecha + hora
 ↓
Regla de recordatorio
 ↓
Permiso del navegador
 ↓
Notificación
```

### Importante

Las notificaciones web tienen restricciones según el navegador, permisos, sistema operativo y contexto de ejecución.

Para una experiencia más robusta se recomienda evolucionar el proyecto a una **PWA (Progressive Web App)** con Service Worker y, para recordatorios persistentes, complementar con infraestructura de servidor cuando sea necesario.

---

## 13. Categorías

Las tareas pueden clasificarse por categoría para facilitar organización y filtrado.

Categorías iniciales:

- Trabajo.
- Personal.
- Estudio.
- Casa.
- Salud.
- Otro.

La arquitectura permite convertirlas posteriormente en categorías configurables por el usuario.

---

## 14. Prioridades

Se manejan tres niveles:

- `alta`
- `normal`
- `baja`

Las prioridades permiten destacar las tareas importantes y generar métricas en el resumen de la aplicación.

---

## 15. Responsive design

La interfaz utiliza CSS responsive para adaptarse a diferentes tamaños de pantalla.

Se contemplan principalmente:

- Escritorio.
- Laptop.
- Tablet.
- Celular.

El objetivo es mantener las funciones principales accesibles sin necesidad de una aplicación nativa.

---

## 16. Seguridad

La aplicación no maneja actualmente cuentas de usuario ni datos enviados a un servidor.

Buenas prácticas aplicadas/previstas:

- Evitar insertar directamente contenido introducido por el usuario como HTML sin escapar.
- Validar longitud y formato de campos.
- No almacenar contraseñas ni credenciales.
- No incluir secretos o API keys en el frontend.

Si se incorpora backend, será necesario añadir autenticación, autorización, validación del lado servidor, protección contra abuso y gestión segura de secretos.

---

## 17. Compatibilidad

La aplicación está pensada para navegadores modernos compatibles con:

- ES6+.
- `localStorage`.
- CSS Grid/Flexbox.
- `Intl`.
- APIs modernas del navegador utilizadas por las funcionalidades activas.

Para una futura PWA también será necesario comprobar compatibilidad con Service Workers, Web App Manifest y APIs de notificaciones según navegador y sistema operativo.

---

## 18. Ejecución local

### Método 1 — abrir directamente

Abrir `index.html` con un navegador moderno.

### Método 2 — VS Code + Live Server

1. Abrir el proyecto en Visual Studio Code.
2. Instalar la extensión **Live Server**.
3. Abrir `index.html`.
4. Seleccionar **Open with Live Server**.

### Método 3 — servidor HTTP con Python

Si Python está instalado:

```bash
python -m http.server 8000
```

Después abrir:

```text
http://localhost:8000
```

### Método 4 — Node.js

Con Node.js instalado se puede utilizar un servidor estático como `serve`:

```bash
npx serve .
```

---

## 19. Desarrollo con Git

El repositorio utiliza Git para control de versiones.

Flujo recomendado:

```text
main
 ↑
Pull Request
 ↑
feature/nombre-de-la-funcionalidad
```

Las funcionalidades importantes deben desarrollarse preferiblemente en ramas independientes y fusionarse mediante Pull Requests.

---

## 20. Historial de desarrollo de esta versión

La aplicación comenzó como una lista sencilla de tareas y posteriormente evolucionó hacia una agenda personal.

### Primera versión

Incluía:

- Crear tareas.
- Prioridad.
- Categoría.
- Fecha.
- Completar tareas.
- Eliminar tareas.
- Buscar.
- Filtrar.
- `localStorage`.
- Diseño responsive.

### Evolución a agenda avanzada

Se incorporaron:

- Calendario.
- Agenda.
- Recurrencias.
- Recordatorios.
- Categorías.
- Prioridades.
- Edición.
- Organización temporal.

La evolución se realizó mediante una rama de funcionalidad y posteriormente se integró a `main` mediante Pull Request.

---

## 21. Limitaciones conocidas

La versión actual sigue siendo principalmente una aplicación local.

No incluye todavía:

- Login.
- Usuarios múltiples.
- Sincronización en la nube.
- Base de datos remota.
- Compartir tareas.
- Calendario Google/Outlook.
- Recordatorios garantizados con la aplicación completamente cerrada.
- Backend.
- Analítica.
- Sistema de recuperación de datos en la nube.

---

## 22. Roadmap técnico recomendado

### Fase 1 — PWA

- `manifest.json`.
- Service Worker.
- Instalación en escritorio y móvil.
- Cache offline.
- Iconos de aplicación.

### Fase 2 — Mejoras de agenda

- Drag & drop.
- Vista diaria.
- Vista semanal.
- Bloques horarios.
- Tareas vencidas.
- Tareas rápidas.

### Fase 3 — Persistencia avanzada

- Backend.
- API REST o similar.
- Base de datos.
- Autenticación.
- Sincronización multi-dispositivo.

### Fase 4 — Integraciones

- Google Calendar.
- Outlook Calendar.
- Exportación `.ics`.
- Importación de calendarios.
- Notificaciones push.

### Fase 5 — Producto

- Configuración de usuario.
- Categorías personalizadas.
- Estadísticas.
- Temas claro/oscuro.
- Copias de seguridad.
- Recuperación de datos.

---

## 23. Principios de desarrollo

El proyecto prioriza:

1. **Simplicidad:** evitar dependencias innecesarias.
2. **Mantenibilidad:** separar estructura, estilos y lógica.
3. **Responsive design:** funcionar en diferentes dispositivos.
4. **Persistencia local:** mantener los datos disponibles sin backend.
5. **Progresividad:** poder evolucionar hacia PWA y posteriormente hacia una arquitectura con backend.
6. **Experiencia de usuario:** minimizar pasos para crear y completar tareas.

---

## 24. Licencia

No se ha definido todavía una licencia de código abierto para el repositorio. Si el proyecto va a ser distribuido públicamente, se recomienda definir una licencia explícita, por ejemplo MIT, Apache-2.0 o una licencia propietaria según el objetivo del proyecto.
