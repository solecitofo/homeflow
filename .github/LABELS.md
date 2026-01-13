# 🏷️ LABELS DEL REPOSITORIO HOMEFLOW

## Cómo Crear Labels

### Opción 1: Con GitHub CLI (Recomendado)

```bash
# 1. Autenticarse (si no lo has hecho)
gh auth login

# 2. Ejecutar el script
bash .github/setup-labels.sh
```

### Opción 2: Manualmente en GitHub

1. Ve a: https://github.com/solecitofo/homeflow/labels
2. Click en **"New label"**
3. Copia los datos de abajo

---

## 📋 Lista de Labels

### 📝 TIPOS DE ISSUES

| Label | Descripción | Color |
|-------|-------------|-------|
| `bug` | Algo no funciona correctamente | `#d73a4a` 🔴 |
| `enhancement` | Nueva funcionalidad o mejora | `#0e8a16` 🟢 |
| `documentation` | Mejoras o correcciones en documentación | `#0075ca` 🔵 |
| `refactor` | Refactorización de código | `#fbca04` 🟡 |
| `style` | Cambios de estilos o UI | `#e99695` 🩷 |
| `test` | Tests o cobertura de testing | `#7057ff` 🟣 |
| `chore` | Tareas de mantenimiento | `#6a737d` ⚫ |

### 🎯 PRIORIDAD

| Label | Descripción | Color |
|-------|-------------|-------|
| `priority: high` | Alta prioridad - Resolver pronto | `#d93f0b` 🔴 |
| `priority: medium` | Prioridad media | `#fbca04` 🟡 |
| `priority: low` | Baja prioridad | `#0e8a16` 🟢 |

### 🔄 ESTADO

| Label | Descripción | Color |
|-------|-------------|-------|
| `good first issue` | Bueno para nuevos contribuidores | `#7057ff` 🟣 |
| `help wanted` | Se necesita ayuda de la comunidad | `#0075ca` 🔵 |
| `wontfix` | No se trabajará en esto | `#6a737d` ⚫ |
| `duplicate` | Issue o PR duplicado | `#6a737d` ⚫ |
| `invalid` | No es válido o no es un issue real | `#6a737d` ⚫ |

### 🏗️ ÁREAS DEL PROYECTO

| Label | Descripción | Color |
|-------|-------------|-------|
| `area: onboarding` | Relacionado con el flujo de onboarding | `#bfd4f2` 🔵 |
| `area: tareas` | Sistema de tareas y recomendaciones | `#bfd4f2` 🔵 |
| `area: gamificación` | Sistema de puntos y rachas | `#bfd4f2` 🔵 |
| `area: habitaciones` | Gestión de habitaciones | `#bfd4f2` 🔵 |
| `area: database` | Base de datos y persistencia | `#bfd4f2` 🔵 |
| `area: ui/ux` | Interfaz de usuario y experiencia | `#bfd4f2` 🔵 |
| `area: pwa` | PWA y funcionalidades offline | `#bfd4f2` 🔵 |

### ✨ ESPECIALES

| Label | Descripción | Color |
|-------|-------------|-------|
| `breaking change` | Cambio que rompe compatibilidad | `#d93f0b` 🔴 |
| `needs review` | Necesita revisión de código | `#fbca04` 🟡 |
| `blocked` | Bloqueado por otro issue o dependencia | `#d73a4a` 🔴 |
| `question` | Pregunta sobre el proyecto | `#d876e3` 🩷 |

---

## 🎨 Códigos de Color

Para referencia rápida:

```
Rojo:     #d73a4a  (bugs, errores críticos)
Naranja:  #d93f0b  (prioridad alta, breaking changes)
Amarillo: #fbca04  (refactor, prioridad media)
Verde:    #0e8a16  (enhancement, prioridad baja)
Azul:     #0075ca  (documentation, help wanted)
Morado:   #7057ff  (good first issue, tests)
Rosa:     #e99695  (style/UI)
Rosa 2:   #d876e3  (questions)
Gris:     #6a737d  (wontfix, duplicate, chore)
Azul CL:  #bfd4f2  (áreas del proyecto)
```

---

## 📖 Cómo Usar los Labels

### En Issues

```markdown
Ejemplo: Bug en el timer
Labels: bug, priority: high, area: tareas
```

### En Pull Requests

```markdown
Ejemplo: Implementar sistema de puntos
Labels: enhancement, area: gamificación
```

### Combinaciones Comunes

- `bug` + `priority: high` + `area: X` → Bug crítico en un área
- `enhancement` + `good first issue` → Buena primera contribución
- `documentation` + `help wanted` → Necesita ayuda con docs
- `refactor` + `needs review` → Refactor que necesita revisión
- `breaking change` + `priority: high` → Cambio importante urgente

---

## 🔧 Gestión de Labels

### Renombrar un Label

```bash
gh label edit "nombre-viejo" --name "nombre-nuevo"
```

### Cambiar Color

```bash
gh label edit "nombre-label" --color "d73a4a"
```

### Eliminar un Label

```bash
gh label delete "nombre-label"
```

### Listar Labels Actuales

```bash
gh label list
```

---

**Mantén tus labels organizados y consistentes** 🏷️✨
