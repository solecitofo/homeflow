# 🔄 GitHub Actions Workflows

Este directorio contiene los workflows automáticos de CI/CD para HomeFlow.

## 📋 Workflows Disponibles

### 1. CI (Integración Continua)
**Archivo:** `ci.yml`
**Se ejecuta en:** Push y Pull Requests a `main`

**Jobs:**
- **Lint** - Verifica el código con ESLint
- **Build** - Compila el proyecto y sube artifacts
- **Type Check** - Verifica tipos con TypeScript

**Badge:**
```markdown
![CI](https://github.com/solecitofo/homeflow/actions/workflows/ci.yml/badge.svg)
```

---

### 2. Deploy (GitHub Pages)
**Archivo:** `deploy.yml`
**Se ejecuta en:** Push a `main` o manualmente

**Jobs:**
- **Build** - Compila el proyecto para producción
- **Deploy** - Despliega a GitHub Pages

**Configuración requerida:**
1. Ve a Settings → Pages
2. Source: GitHub Actions
3. La app estará en: `https://solecitofo.github.io/homeflow/`

**Badge:**
```markdown
![Deploy](https://github.com/solecitofo/homeflow/actions/workflows/deploy.yml/badge.svg)
```

---

### 3. Dependency Review
**Archivo:** `dependency-review.yml`
**Se ejecuta en:** Pull Requests

**Función:**
- Revisa nuevas dependencias en PRs
- Alerta sobre vulnerabilidades
- Comenta automáticamente en el PR

---

## 🚀 Cómo Usar

### Ver Estado de los Workflows

```bash
# Listar workflows
gh workflow list

# Ver runs de un workflow
gh run list --workflow=ci.yml

# Ver detalles de un run
gh run view <run-id>
```

### Ejecutar Workflow Manualmente

```bash
# Deploy manual
gh workflow run deploy.yml
```

### En la Interfaz Web

1. Ve a la pestaña **Actions** en GitHub
2. Selecciona el workflow que quieres ver
3. Click en un run específico para ver detalles

---

## ⚙️ Configuración

### Variables de Entorno

Si necesitas añadir secrets o variables:

```bash
# Añadir secret
gh secret set SECRET_NAME

# Listar secrets
gh secret list
```

O en la web: Settings → Secrets and variables → Actions

---

## 🔧 Mantenimiento

### Actualizar Node Version

Cambiar en todos los workflows:
```yaml
node-version: '20'  # Actualizar aquí
```

### Añadir Nuevos Checks

Editar `ci.yml` y añadir un nuevo job:
```yaml
  new-job:
    name: Nuevo Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # ... tus steps
```

---

## 📊 Status Badges

Añadir al README.md:

```markdown
## Status

![CI](https://github.com/solecitofo/homeflow/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/solecitofo/homeflow/actions/workflows/deploy.yml/badge.svg)
![Version](https://img.shields.io/github/package-json/v/solecitofo/homeflow)
![License](https://img.shields.io/github/license/solecitofo/homeflow)
```

---

## 🐛 Troubleshooting

### Build Falla

1. Verifica que `npm run build` funcione localmente
2. Revisa los logs del workflow
3. Verifica las dependencias en `package.json`

### Deploy Falla

1. Verifica que GitHub Pages esté habilitado
2. Asegúrate que el workflow tenga permisos de Pages
3. Revisa que `base` en `vite.config.ts` esté correcto

### Lint Falla

1. Ejecuta `npm run lint` localmente
2. Corrige los errores
3. Haz commit y push

---

## 📚 Recursos

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [GitHub Pages](https://docs.github.com/en/pages)

---

**¡Los workflows automatizan tu flujo de desarrollo!** 🤖✨
