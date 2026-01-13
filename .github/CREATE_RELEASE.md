# 🚀 CREAR RELEASE v0.1.0

## Opción 1: Con GitHub CLI (Cuando esté disponible)

```bash
# Autenticarse
gh auth login

# Crear release desde el tag existente
gh release create v0.1.0 \
  --title "HomeFlow v0.1.0 - Onboarding Completo" \
  --notes-file .github/RELEASE_NOTES_v0.1.0.md
```

---

## Opción 2: Manualmente en GitHub (Usar ahora)

### Paso 1: Ir a Releases

1. Ve a: https://github.com/solecitofo/homeflow/releases
2. Click en **"Create a new release"**

### Paso 2: Seleccionar Tag

- **Choose a tag:** `v0.1.0` (ya existe, selecciónalo del dropdown)
- Si no aparece, escribe `v0.1.0` y selecciona "Create new tag: v0.1.0 on publish"

### Paso 3: Título y Descripción

**Release title:**
```
HomeFlow v0.1.0 - Onboarding Completo 🏠
```

**Description:** (Copia todo lo de abajo)

```markdown
# 🎉 Primera Release de HomeFlow

Esta es la primera versión funcional de HomeFlow, tu compañero de organización del hogar con ciencia del comportamiento.

## ✨ Funcionalidades

### 🎯 Onboarding Emocional (9 Pantallas)
- **Pantalla de Bienvenida** - Introducción cálida al usuario
- **Selección de Estado Emocional** - 4 estados: abrumado, cansado, motivado, normal
- **Pantalla de Empatía** - Validación emocional personalizada
- **Inicio de Configuración** - Explicación del proceso
- **Configuración de Habitaciones (3 pasos)**:
  - Paso 1: Selección de habitaciones del hogar
  - Paso 2: Áreas problemáticas y prioridades
  - Paso 3: Disponibilidad de tiempo
- **Resumen de Configuración** - Vista previa antes de continuar
- **Primera Tarea Guiada** - Tutorial interactivo
- **Onboarding Completo** - Mensaje de éxito y transición

### 🗄️ Base de Datos Local
- **Dexie.js** - IndexedDB con API simple
- **Persistencia offline** - Datos guardados localmente
- **Esquema inicial** - Preparado para tareas, habitaciones y progreso

### 📦 Estado Global
- **Zustand** - Gestión de estado simple y performante
- **Store centralizado** - Un único source of truth
- **Persistencia** - Estado guardado en localStorage

### 📱 PWA Configuración
- **Service Worker** - Funcionalidad offline básica
- **Manifest** - Instalable como app nativa
- **Cache estratégico** - Google Fonts en cache

### 🎨 Sistema de Diseño
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animaciones fluidas y naturales
- **Lucide Icons** - Iconos consistentes
- **Tema personalizado**:
  - Color primario: `#8B7FC8` (morado cálido)
  - Tipografía optimizada
  - Componentes responsive

## 📚 Documentación

- ✅ README completo con instrucciones
- ✅ CHANGELOG con historial de versiones
- ✅ Guía de mantenimiento del repositorio
- ✅ Templates de GitHub (PR, Issues)
- ✅ Configuración de labels
- ✅ GitHub Actions para CI/CD

## 🔧 Tecnologías

- **Frontend**: React 18 + TypeScript
- **Build**: Vite 5
- **Estilos**: TailwindCSS
- **Base de datos**: Dexie.js (IndexedDB)
- **Estado**: Zustand
- **Animaciones**: Framer Motion
- **Routing**: React Router v6
- **PWA**: vite-plugin-pwa

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/solecitofo/homeflow.git

# Instalar dependencias
cd homeflow
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 🌐 Demo

La app estará disponible en GitHub Pages pronto:
https://solecitofo.github.io/homeflow/

## 🚀 Próximos Pasos (v0.2.0)

- [ ] Implementar pantalla Home con estados emocionales
- [ ] Motor de recomendación de tareas
- [ ] Biblioteca de tareas básicas
- [ ] Sistema de timer para tareas
- [ ] Persistencia completa de progreso

## 📝 Notas de Migración

Esta es la primera versión, no hay migraciones necesarias.

## 🐛 Problemas Conocidos

Ninguno reportado aún. Si encuentras algún bug, por favor [reporta un issue](https://github.com/solecitofo/homeflow/issues/new?template=bug_report.md).

## 🙏 Agradecimientos

Desarrollado con ❤️ usando Claude Code.

---

**Fecha de release:** 2026-01-13

**Full Changelog**: https://github.com/solecitofo/homeflow/commits/v0.1.0
```

### Paso 4: Opciones

- [ ] **Set as the latest release** ✅ (Marcar)
- [ ] **Set as a pre-release** ❌ (No marcar)
- [ ] **Create a discussion for this release** (Opcional)

### Paso 5: Publicar

Click en **"Publish release"** 🎉

---

## ✅ Verificación

Después de publicar:

1. Ve a https://github.com/solecitofo/homeflow/releases
2. Deberías ver "v0.1.0" como latest release
3. El badge del README se actualizará automáticamente

---

## 📋 Checklist Post-Release

- [ ] Release publicado en GitHub
- [ ] Badge actualizado en README
- [ ] Anuncio en redes (opcional)
- [ ] Documentación verificada
- [ ] GitHub Pages configurado (Settings → Pages → Source: GitHub Actions)

---

**¡Tu primera release está lista!** 🚀✨
