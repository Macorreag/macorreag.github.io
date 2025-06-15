# Contexto del Proyecto para Agentes AI

## Información General

- **Nombre**: Miller Correa Portfolio
- **Tipo**: Sitio web estático con Gatsby
- **Estado**: En desarrollo activo
- **Última actualización**: Junio 2025

## Stack Tecnológico

```json
{
  "framework": "Gatsby.js v2",
  "runtime": "Node.js",
  "styling": "TailwindCSS + PostCSS",
  "icons": "FontAwesome",
  "deployment": "GitHub Pages",
  "dataSource": "JSON files + Filesystem",
  "buildTool": "Gatsby CLI"
}
```

## Estructura de Datos

### Educación (`src/data/education/`)

- `online.json`: Cursos y certificaciones online
- `presencial.json`: Educación formal presencial
- `others.json`: Otras certificaciones y cursos

### Codigofacilito (`src/data/codigofacilto/`)

- `myCFInfo.json`: Información de la plataforma CodigoFacilito

## Componentes Principales

### Navigation & Layout

- `header.js`: Navegación principal
- `education-nav.js`: Navegación específica para sección educativa

### Content Display

- `post.js`: Componente individual de publicación
- `posts.js`: Lista de publicaciones
- `repo.js`: Repositorio individual
- `repos.js`: Lista de repositorios

### Specialized

- `certificate.js`: Mostrar certificaciones
- `codigofacilito.js`: Integración con plataforma CF
- `contact.form.js`: Formulario de contacto
- `medium.js`: Integración con Medium

### Templates

- `education.js`: Template para páginas de educación

## Páginas Principales

- `/`: Homepage con información general
- `/cv`: Curriculum vitae detallado

## Configuración y Build

### Scripts Disponibles

- `npm run develop`: Servidor de desarrollo
- `npm run build`: Build de producción
- `npm run deploy`: Deploy a GitHub Pages
- `npm run format`: Formatear código con Prettier
- `npm run lint`: Verificar código con ESLint

### Variables de Entorno

- Sin variables de entorno específicas actualmente
- Configuración estática en `gatsby-config.js`

## Integrations

### External APIs

- GitHub (para repositorios)
- Medium (para artículos)
- CodigoFacilito (para certificaciones)

### Assets

- Favicon configurado
- Imágenes en `src/imgs/`
- Archivos estáticos en `static/`

## SEO y Metadata

```javascript
siteMetadata: {
  title: 'Miller Correa',
  description: 'Pagina Web principal de mis estudios y demás cosas que desarrollo en la Web.',
  author: '@macorreag'
}
```

## Deployment

- **Target**: GitHub Pages
- **Branch**: `gh-pages`
- **Domain**: macorreag.github.io
- **Build command**: `gatsby build --prefix-paths`

## Performance Targets

- Lighthouse Score: 90+
- First Contentful Paint: < 2s
- Time to Interactive: < 3s
- Cumulative Layout Shift: < 0.1

## Browser Support

- Modern browsers (ES2018+)
- Mobile responsive
- Progressive enhancement approach
