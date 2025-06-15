# Tareas Comunes para Agentes AI

## Desarrollo de Componentes

### Crear Nuevo Componente React

```bash
# Ubicación: src/components/
# Patrón: ComponentName.js
# Exportar como: export default ComponentName
```

**Template básico:**

```javascript
import React from 'react';

/**
 * Descripción del componente
 * @param {Object} props - Props del componente
 * @param {string} props.title - Título a mostrar
 * @returns {JSX.Element} Componente renderizado
 */
const ComponentName = ({ title, ...props }) => {
  return (
    <div className="component-wrapper" {...props}>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
};

export default ComponentName;
```

### Agregar Nueva Página

```bash
# Ubicación: src/pages/
# Auto-ruteo: archivo page-name.js -> /page-name
```

**Template básico:**

```javascript
import React from 'react';

const PageName = () => {
  return (
    <main className="container mx-auto px-4">
      <h1 className="text-3xl font-bold">Título de la Página</h1>
    </main>
  );
};

export default PageName;
export const Head = () => <title>Título | Miller Correa</title>;
```

## Manejo de Datos

### Agregar Nuevos Datos JSON

1. Ubicar en `src/data/category/`
2. Seguir estructura existente
3. Actualizar GraphQL queries si es necesario

### Query GraphQL Común

```javascript
import { useStaticQuery, graphql } from 'gatsby';

const useDataQuery = () => {
  const data = useStaticQuery(graphql`
    query {
      allDataJson {
        nodes {
          id
          title
          description
        }
      }
    }
  `);
  return data.allDataJson.nodes;
};
```

## Styling y UI

### Clases TailwindCSS Comunes

```css
/* Layout */
.container {
  @apply mx-auto px-4;
}
.section {
  @apply py-8 md:py-12;
}

/* Typography */
.heading-1 {
  @apply text-3xl md:text-4xl font-bold;
}
.heading-2 {
  @apply text-2xl md:text-3xl font-semibold;
}
.body-text {
  @apply text-base leading-relaxed;
}

/* Components */
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
.card {
  @apply bg-white shadow-lg rounded-lg p-6;
}
```

### Responsive Design

- Mobile first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Test en múltiples dispositivos

## Testing y Quality

### Comandos de Verificación

```bash
npm run lint          # ESLint
npm run format:check  # Prettier check
npm run build         # Build test
```

### Pre-commit Checklist

- [ ] Código lintado sin errores
- [ ] Formateo consistente
- [ ] Build exitoso
- [ ] Responsive design verificado
- [ ] Accessibility básica

## Deployment

### Deploy Manual

```bash
npm run deploy
# Equivale a: gatsby build --prefix-paths && gh-pages -d public
```

### Verificar Deploy

1. Check GitHub Actions (si está configurado)
2. Visitar https://macorreag.github.io
3. Verificar funcionamiento en mobile

## Debugging Común

### Errores de Build

```bash
npm run clean    # Limpiar cache
npm install      # Reinstalar dependencias
npm run develop  # Desarrollo local
```

### Performance Issues

1. Optimizar imágenes
2. Lazy loading para componentes pesados
3. Code splitting si es necesario
4. Verificar bundle analyzer

### SEO Checklist

- [ ] Meta tags configurados
- [ ] Títulos únicos por página
- [ ] Alt text en imágenes
- [ ] Estructura semántica HTML
- [ ] Schema markup si aplica

## Git Workflow

### Commits Recomendados

```
feat: add new portfolio section
fix: resolve mobile navigation issue
docs: update README with setup instructions
style: improve button hover states
refactor: optimize data queries
```

### Branches Strategy

- `main`: Producción
- `develop`: Desarrollo
- `feature/nombre`: Features nuevas
- `hotfix/nombre`: Fixes urgentes
