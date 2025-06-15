# 🤖 Guía de IA para Desarrolladores

## Configuración GitHub Copilot

Este proyecto está optimizado para trabajar con GitHub Copilot y otros agentes
de IA. A continuación se detallan las configuraciones y mejores prácticas.

### 🚀 Inicio Rápido

```bash
# Configurar entorno para IA
./agents/scripts/setup-ai-env.sh

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run develop
```

### 📁 Estructura de Archivos para IA

```
agents/
├── prompts/
│   └── copilot-guidelines.md    # Directrices para GitHub Copilot
├── project-context.md           # Contexto completo del proyecto
├── common-tasks.md             # Tareas comunes y patrones
└── scripts/
    └── setup-ai-env.sh         # Script de configuración
```

### 🛠️ Herramientas Configuradas

- **ESLint**: Análisis estático de código
- **Prettier**: Formateo automático
- **JSDoc**: Documentación automática
- **Husky**: Git hooks para calidad de código
- **Lint-staged**: Verificaciones pre-commit

### 📋 Comandos para IA

```bash
# Análisis y formateo
npm run lint          # Verificar código
npm run lint:fix      # Corregir automáticamente
npm run format        # Formatear código

# Documentación
npm run docs:generate # Generar docs automáticas

# Testing y Build
npm run build         # Verificar build
npm run deploy        # Deploy a GitHub Pages
```

### 🎯 Contexto para Agentes

Los agentes de IA pueden consultar:

1. **Directrices específicas**: `agents/prompts/copilot-guidelines.md`
2. **Contexto del proyecto**: `agents/project-context.md`
3. **Tareas comunes**: `agents/common-tasks.md`
4. **Configuración técnica**: `package.json`, `.eslintrc.js`, etc.

### 🔧 Configuración VS Code

El proyecto incluye configuraciones optimizadas para:

- Autocompletado inteligente
- Formateo automático al guardar
- Integración con TailwindCSS
- Soporte para GitHub Copilot

### 📖 Recursos Adicionales

- [Gatsby Documentation](https://www.gatsbyjs.com/docs/)
- [GitHub Copilot Best Practices](https://docs.github.com/en/copilot)
- [TailwindCSS Reference](https://tailwindcss.com/docs)
