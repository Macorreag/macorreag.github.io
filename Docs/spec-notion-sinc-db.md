**Flujo de sincronización entre Notion (REST API) y una app en Gatsby**, usando solo capas gratuitas.

---

## 📌 Prompt técnico para LLM

**Rol del modelo**

> Actúa como un Senior Full-Stack Engineer especializado en Gatsby, GitHub Actions y APIs REST, con experiencia integrando CMS headless (Notion) en sitios estáticos.
> 

---

### 🎯 Objetivo

Diseñar e implementar un **componente y flujo de sincronización** que consuma una **base de datos (tabla) de Notion mediante su API REST** y actualice automáticamente una **aplicación Gatsby** durante el build, usando **GitHub Actions**.

---

### 🧩 Contexto técnico

- Framework: **Gatsby**
- CMS headless: **Notion (API REST oficial)**
- Orquestación: **GitHub Actions**
- Hosting: **Static site (ej. GitHub Pages / Netlify – capa gratuita)**
- Lenguaje preferido: **JavaScript / Node.js**
- Autenticación Notion: **Integration Token (Bearer)**
- No usar GraphQL directamente desde Notion (solo REST)
- La API de Notion **no tiene costo por consumo**
- Existen implementaciones mediante Pluggins que podrían ser de gran ayuda como gatsby-source-notion si es posible utiliza esta app para realizar el uso del consumo de la API
- Debes dejar un placeholder en la pagina inicial que muestre que es lo que se renderizaria de ejemplo y se vea en la primera pagina solo para desarrollo local ya que en PRD el deber es consultar notion y traer los datos

---

### 🏗️ Arquitectura deseada

1. **GitHub Action**
    - Se ejecuta por `schedule` y/o `push`
    - Inyecta secrets (`NOTION_API_KEY`, `NOTION_DATABASE_ID`)
2. **Script de sincronización**
    - Consume la API REST de Notion
    - Obtiene los registros de una base de datos
    - Normaliza el JSON (title, rich_text, select, date, etc.)
    - Guarda el resultado como archivo local (`/data/notion.json`)
3. **Gatsby**
    - Usa `gatsby-node.js` o `gatsby-source-filesystem`
    - Crea nodos a partir del JSON
    - Renderiza páginas/componentes con el diseño existente
4. **Build & Deploy**
    - Gatsby build
    - Deploy automático del sitio estático

---

### 🧠 Lo que el LLM debe entregar

1. **Explicación del flujo completo**
    - Paso a paso
    - Qué ocurre en cada capa
2. **Script Node.js**
    - Fetch a Notion REST API
    - Manejo de paginación
    - Transformación del response a un JSON limpio
    - Ejemplo de mapeo de propiedades de Notion
3. **Ejemplo de GitHub Action (`.yml`)**
    - Uso de secrets
    - Cache de dependencias
    - Build de Gatsby
    - Deploy
4. **Integración en Gatsby**
    - Ejemplo en `gatsby-node.js`
    - Creación de nodos
    - Query con GraphQL interno de Gatsby
    - Uso en un componente React
5. **Buenas prácticas**
    - Manejo de errores
    - Rate limits
    - Seguridad de tokens
    - Optimización para capas gratuitas

---

### 🧪 Suposiciones

- La base de datos de Notion contiene campos como:
    
    ### Campos identificables en tu DB
    
    | UI Notion | Tipo Notion | API REST |
    | --- | --- | --- |
    | Habilidad Detallada | `title` | `properties["Habilidad Detallada"].title[0].plain_text` |
    | Descripción | `rich_text` | `properties["Descripción"].rich_text` |
    | Habilidad | `multi_select` | `properties["Habilidad"].multi_select` |
    | Experiencia | `number` / `rich_text` | `properties["Experiencia"]` |
    | Date | `date` | `properties["Date"].date` |
    | Versión | `number` | `properties["Versión"].number` |
- Solo se renderizan registros `Published = true`

---

### 📤 Formato de salida esperado

- Código con bloques claros
- Comentarios explicativos
- Estructura de carpetas sugerida
- Diagramas ASCII simples (opcional)

---

### 🚫 Restricciones

- No usar SDKs de pago
- No depender de servicios propietarios fuera de Notion y GitHub
- No usar GraphQL externo a Gatsby
- EL usuario va a proporcionar en otro momento la API KEy de notion necesario

