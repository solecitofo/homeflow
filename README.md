# 🏠 HomeFlow

<div align="center">

**Tu compañero de organización del hogar**

Una aplicación web basada en principios de Terapia Cognitivo-Conductual (TCC) y activación conductual, diseñada para ayudar a las personas a organizarse sin sentirse abrumadas.

[Demo](#) • [Documentación](#documentación) • [Contribuir](CONTRIBUTING.md)

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.3.1-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178c6?logo=typescript)
![PWA](https://img.shields.io/badge/PWA-ready-5a0fc8)

</div>

---

## ✨ Características Principales

### 🎯 Diferenciador Único
**No solo te organizamos, te enseñamos CÓMO hacerlo**

- **Onboarding emocional**: Empieza entendiendo cómo te sientes
- **Educación implícita**: Aprende principios de psicología del comportamiento mientras usas la app
- **Tareas personalizadas**: Según tu hogar real, no genéricas
- **Primera experiencia guiada**: Te lleva de la mano en tu primera tarea

### 🧠 Basado en Ciencia
- Activación conductual
- Micro-tareas para reducir resistencia
- Feedback emocional pre/post tarea
- Detección de patrones personales

---

## 🚀 Instalación y Ejecución

### Prerequisitos
- Node.js 18+ 
- npm o yarn

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en modo desarrollo
npm run dev

# 3. Abrir en navegador
# La app se abrirá automáticamente en http://localhost:5173
```

### Build para producción

```bash
npm run build
npm run preview
```

---

## 📁 Estructura del Proyecto

```
homeflow/
├── src/
│   ├── features/
│   │   └── onboarding/
│   │       └── components/         # Componentes del onboarding
│   │           ├── EmotionalStateSelection.tsx
│   │           ├── EmpathyScreen.tsx
│   │           ├── HomeConfigurationStart.tsx
│   │           ├── ConfigureRoomsStep1.tsx
│   │           ├── ConfigureRoomsStep2.tsx
│   │           ├── ConfigureRoomsStep3.tsx
│   │           ├── ConfigurationSummary.tsx
│   │           ├── FirstGuidedTask.tsx
│   │           └── OnboardingComplete.tsx
│   │
│   ├── shared/
│   │   └── store.ts               # Estado global (Zustand)
│   │
│   ├── db/
│   │   └── database.ts            # Base de datos (Dexie)
│   │
│   ├── App.tsx                    # Rutas principales
│   ├── main.tsx                   # Punto de entrada
│   └── index.css                  # Estilos globales
│
├── public/                        # Assets estáticos
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## 🎨 Stack Tecnológico

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server

### Estilos
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animaciones

### Estado y Datos
- **Zustand** - Estado global ligero
- **Dexie.js** - Base de datos local (IndexedDB)

### Routing
- **React Router v6** - Navegación

### PWA
- **vite-plugin-pwa** - Progressive Web App
- **Workbox** - Service worker

---

## 🎯 Flujo de Onboarding (Completado)

### Capa 1: Conexión Emocional
- Selección de estado emocional
- 4 opciones: Abrumado, Cansado, OK, Bien
- Sin registro, sin presión

### Capa 2: Empatía + Educación
- Mensaje personalizado según estado
- Insight educativo (¿Sabías que...?)
- Principio de TCC explicado naturalmente

### Capa 3: Configuración del Hogar
- **Paso 1**: Nombre del hogar + dormitorios + baños
- **Paso 2**: Espacios comunes (cocina, salón, comedor)
- **Paso 3**: Espacios adicionales (terraza, despacho, etc.)
- **Resumen**: Confirmación visual

### Capa 4: Primera Experiencia Guiada
- Tarea micro: "Recoge 3 objetos"
- Timer en vivo
- Checklist de pasos
- Educación durante la tarea
- Celebración al completar

---

## 🎨 Paleta de Colores

### Primarios
- **Púrpura suave** (`primary-500: #8B7FC8`) - Calma, introspección
- **Verde sage** (`sage-500: #A8C686`) - Crecimiento, renovación
- **Azul empático** (`empathy-500: #7EB5D6`) - Confianza

### Secundarios
- **Amarillo cálido** (`warm-500: #F4D35E`) - Energía positiva
- **Coral suave** (`coral-500: #FA8F85`) - Acción

---

## 📊 Estado del Desarrollo

### ✅ Completado (MVP Onboarding)
- [x] Setup inicial (Vite + React + TS + Tailwind)
- [x] Base de datos (Dexie)
- [x] Store global (Zustand)
- [x] Paleta de colores personalizada
- [x] PWA configuración básica
- [x] Onboarding - Capa 1 (estado emocional)
- [x] Onboarding - Capa 2 (empatía y educación)
- [x] Onboarding - Capa 3 (configuración 3 pasos)
- [x] Onboarding - Capa 4 (primera tarea guiada)
- [x] Pantalla de éxito

### 🚧 En Desarrollo
- [ ] Pantalla principal (Home)
- [ ] Sistema de sugerencias por estado
- [ ] Ejecución de tareas
- [ ] Sistema de feedback
- [ ] Biblioteca de tareas

### 📋 Próximos Pasos
1. Crear pantalla Home con 4 estados
2. Implementar motor de recomendación
3. Sistema de ejecución de tareas
4. Sección "Aprende" (educación)
5. Sistema de puntos y racha

---

## 🧪 Testing

```bash
# Ejecutar tests (cuando se implementen)
npm run test
```

---

## 📝 Convenciones de Código

### Componentes
- PascalCase para nombres
- Un componente por archivo
- Props interface siempre definida

### Estilos
- TailwindCSS utility classes
- Clases personalizadas en `@layer components`
- Animaciones con Framer Motion

### Estado
- Zustand para estado global
- React hooks para estado local
- Dexie para persistencia

---

## 🎓 Conceptos de TCC Implementados

### Activación Conductual
La acción mejora el ánimo, no al revés. No esperes a estar motivado para empezar.

### Micro-tareas
Tareas pequeñas (1-3 min) reducen la resistencia al inicio.

### Feedback Emocional
Registrar cómo te sientes antes y después crea consciencia del impacto.

### Principio de Inercia
Una vez en movimiento, es más fácil continuar.

---

## 🤝 Contribuir

Este es un proyecto open-source. Las contribuciones son bienvenidas.

### Áreas donde ayudar:
- Más tareas para la biblioteca
- Mejoras de accesibilidad
- Traducciones
- Testing
- Documentación

---

## 📄 Licencia

MIT License - Libre para uso personal y comercial

---

## 👥 Equipo

Desarrollado con ❤️ para personas que quieren organizarse sin sentirse abrumadas.

**Filosofía**: No es solo una app de tareas. Es un compañero que te enseña a entender tu mente mientras organizas tu espacio.

---

## 🐛 Reporte de Bugs

Si encuentras un bug, por favor abre un issue en GitHub con:
- Descripción del problema
- Pasos para reproducirlo
- Capturas de pantalla si es posible
- Navegador y versión

---

## 📞 Soporte

¿Preguntas? ¿Sugerencias?
- Email: [tu-email]
- GitHub Issues

---

## 🗺️ Roadmap

### v1.0 (MVP)
- ✅ Onboarding completo
- 🚧 Sistema de sugerencias
- 🚧 Ejecución de tareas
- 🚧 3 artículos educativos

### v1.1
- Lista de compras inteligente
- Vista de habitaciones
- Sistema de puntos completo

### v1.2
- Rutinas personalizadas
- Recordatorios opcionales
- Insights semanales

### v2.0
- Compartir hogar (convivientes)
- Backend + sincronización
- Modo offline mejorado

---

**¡Gracias por usar HomeFlow! 🏠✨**
