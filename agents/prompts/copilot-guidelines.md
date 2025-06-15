# Directrices para GitHub Copilot - Proyecto Gatsby Portfolio

## Contexto del Proyecto

Este es un portafolio personal construido con Gatsby, basado en el starter
hello-world. El proyecto utiliza:

- **Framework**: Gatsby.js v2
- **Styling**: TailwindCSS + PostCSS
- **Iconos**: FontAwesome
- **Despliegue**: GitHub Pages

## Arquitectura del Proyecto

### Estructura de Carpetas

```
src/
├── components/     # Componentes React reutilizables
├── data/          # Datos JSON para contenido dinámico
├── imgs/          # Imágenes y assets
├── pages/         # Páginas principales del sitio
├── styles/        # Estilos CSS globales
└── templates/     # Templates para generación de páginas
```

### Convenciones de Código

- **Componentes**: PascalCase para nombres de archivos y componentes
- **Funciones**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Archivos**: kebab-case para archivos de configuración

## Directrices para el Agente

### 1. Estilo de Código

- Usar funciones de flecha para componentes funcionales
- Preferir destructuring para props
- Utilizar JSDoc para documentar funciones complejas
- Mantener componentes pequeños y enfocados (< 100 líneas)

### 2. Patrones Preferidos

```javascript
// ✅ Componente funcional con destructuring
const MyComponent = ({ title, children, ...props }) => {
  return (
    <div className="component-wrapper" {...props}>
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
};

// ✅ Uso de hooks con nombres descriptivos
const useContactForm = () => {
  const [formData, setFormData] = useState(initialState);
  // ... lógica del hook
  return { formData, handleSubmit, isLoading };
};
```

### 3. Manejo de Datos

- Usar Gatsby's GraphQL para consultas de datos
- Almacenar datos estáticos en `src/data/`
- Usar transformadores JSON para datos estructurados

### 4. Styling Guidelines

- Priorizar clases de TailwindCSS
- Usar CSS personalizado solo cuando sea necesario
- Mantener consistencia en spacing y typography

### 5. Performance

- Optimizar imágenes usando gatsby-image cuando sea posible
- Lazy loading para componentes pesados
- Minimizar el bundle size

## Tareas Comunes y Soluciones

### Agregar Nueva Página

1. Crear archivo en `src/pages/`
2. Exportar componente React como default
3. Usar Layout común si aplica

### Nuevo Componente

1. Crear en `src/components/`
2. Documentar con JSDoc
3. Exportar como named export
4. Agregar PropTypes si es complejo

### Datos Dinámicos

1. Agregar JSON en `src/data/`
2. Configurar en `gatsby-node.js` si necesita páginas dinámicas
3. Usar GraphQL query en el componente

## Contexto de Negocio

- **Propósito**: Portafolio personal para mostrar proyectos y experiencia
- **Audiencia**: Reclutadores, colegas, clientes potenciales
- **Secciones principales**: CV, proyectos, educación, contacto

## Limitaciones y Consideraciones

- Mantener compatibilidad con Gatsby v2
- Responsive design obligatorio
- SEO friendly
- Carga rápida (< 3s)
- Accesibilidad web (WCAG 2.1)

## Recursos y Referencias

- [Gatsby Documentation](https://www.gatsbyjs.com/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [React Best Practices](https://react.dev/learn)
