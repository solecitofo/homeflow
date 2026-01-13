#!/bin/bash

# ========================================================================
# SCRIPT PARA CREAR LABELS EN GITHUB
# ========================================================================
#
# Ejecutar después de instalar y autenticar GitHub CLI:
# 1. gh auth login
# 2. bash .github/setup-labels.sh
#
# ========================================================================

echo "🏷️  Creando labels para HomeFlow..."
echo ""

# Colores para los labels
# Rojo: #d73a4a
# Verde: #0e8a16
# Azul: #0075ca
# Amarillo: #fbca04
# Morado: #7057ff
# Naranja: #d93f0b
# Rosa: #e99695
# Gris: #6a737d

# ========================================================================
# TIPOS DE ISSUES
# ========================================================================

echo "📝 Creando labels de tipo..."

gh label create "bug" \
  --description "Algo no funciona correctamente" \
  --color "d73a4a" \
  --force

gh label create "enhancement" \
  --description "Nueva funcionalidad o mejora" \
  --color "0e8a16" \
  --force

gh label create "documentation" \
  --description "Mejoras o correcciones en documentación" \
  --color "0075ca" \
  --force

gh label create "refactor" \
  --description "Refactorización de código" \
  --color "fbca04" \
  --force

gh label create "style" \
  --description "Cambios de estilos o UI" \
  --color "e99695" \
  --force

gh label create "test" \
  --description "Tests o cobertura de testing" \
  --color "7057ff" \
  --force

gh label create "chore" \
  --description "Tareas de mantenimiento" \
  --color "6a737d" \
  --force

# ========================================================================
# PRIORIDAD
# ========================================================================

echo "🎯 Creando labels de prioridad..."

gh label create "priority: high" \
  --description "Alta prioridad - Resolver pronto" \
  --color "d93f0b" \
  --force

gh label create "priority: medium" \
  --description "Prioridad media" \
  --color "fbca04" \
  --force

gh label create "priority: low" \
  --description "Baja prioridad" \
  --color "0e8a16" \
  --force

# ========================================================================
# ESTADO
# ========================================================================

echo "🔄 Creando labels de estado..."

gh label create "good first issue" \
  --description "Bueno para nuevos contribuidores" \
  --color "7057ff" \
  --force

gh label create "help wanted" \
  --description "Se necesita ayuda de la comunidad" \
  --color "0075ca" \
  --force

gh label create "wontfix" \
  --description "No se trabajará en esto" \
  --color "6a737d" \
  --force

gh label create "duplicate" \
  --description "Issue o PR duplicado" \
  --color "6a737d" \
  --force

gh label create "invalid" \
  --description "No es válido o no es un issue real" \
  --color "6a737d" \
  --force

# ========================================================================
# ÁREAS DEL PROYECTO
# ========================================================================

echo "🏗️  Creando labels por área..."

gh label create "area: onboarding" \
  --description "Relacionado con el flujo de onboarding" \
  --color "bfd4f2" \
  --force

gh label create "area: tareas" \
  --description "Sistema de tareas y recomendaciones" \
  --color "bfd4f2" \
  --force

gh label create "area: gamificación" \
  --description "Sistema de puntos y rachas" \
  --color "bfd4f2" \
  --force

gh label create "area: habitaciones" \
  --description "Gestión de habitaciones" \
  --color "bfd4f2" \
  --force

gh label create "area: database" \
  --description "Base de datos y persistencia" \
  --color "bfd4f2" \
  --force

gh label create "area: ui/ux" \
  --description "Interfaz de usuario y experiencia" \
  --color "bfd4f2" \
  --force

gh label create "area: pwa" \
  --description "PWA y funcionalidades offline" \
  --color "bfd4f2" \
  --force

# ========================================================================
# ESPECIALES
# ========================================================================

echo "✨ Creando labels especiales..."

gh label create "breaking change" \
  --description "Cambio que rompe compatibilidad" \
  --color "d93f0b" \
  --force

gh label create "needs review" \
  --description "Necesita revisión de código" \
  --color "fbca04" \
  --force

gh label create "blocked" \
  --description "Bloqueado por otro issue o dependencia" \
  --color "d73a4a" \
  --force

gh label create "question" \
  --description "Pregunta sobre el proyecto" \
  --color "d876e3" \
  --force

echo ""
echo "✅ ¡Labels creados exitosamente!"
echo ""
echo "🌐 Ver en: https://github.com/solecitofo/homeflow/labels"
echo ""
