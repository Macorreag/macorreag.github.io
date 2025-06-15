#!/bin/bash

# Script de inicialización para desarrollo con AI
# Autor: GitHub Copilot Assistant
# Propósito: Configurar entorno óptimo para trabajo con agentes AI

echo "🤖 Configurando entorno para GitHub Copilot..."

# Verificar dependencias necesarias
echo "📦 Verificando dependencias..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

# Instalar dependencias si no existen
echo "📥 Instalando dependencias..."
npm install

# Configurar Git hooks
echo "🪝 Configurando Git hooks..."
npm run prepare

# Verificar configuración
echo "🔍 Verificando configuración..."
npm run lint -- --quiet
npm run format:check

# Generar documentación inicial
echo "📚 Generando documentación..."
mkdir -p docs-ai
npm run docs:generate 2>/dev/null || echo "⚠️ JSDoc no disponible, instalar con: npm install -g jsdoc"

# Verificar build
echo "🏗️ Verificando build..."
npm run build

echo "✅ Entorno configurado correctamente para GitHub Copilot"
echo ""
echo "🚀 Comandos útiles:"
echo "  npm run develop       - Servidor de desarrollo"
echo "  npm run lint:fix      - Corregir issues de linting"
echo "  npm run format        - Formatear código"
echo "  npm run docs:generate - Generar documentación"
echo ""
echo "📖 Consulta las guías en ./agents/ para más información"
