# auth.md

Documento de descubrimiento de autenticación para agentes (Auth.md / Web Bot
Auth). Describe cómo un agente de IA puede interactuar con este sitio.

## Audiencia

Agentes de IA, crawlers y herramientas automatizadas que quieran leer o usar el
contenido del portafolio de Miller Correa.

## Identidad

- Sitio: `https://macorreag.github.io`
- Titular: Miller Correa (`@macorreag`)
- Contacto: `macorreag@unal.edu.co`
- GitHub: `https://github.com/macorreag`

## Acceso y registro

Este portafolio es **público** y de solo lectura. **No requiere autenticación**:
todos los recursos (páginas, `llms.txt`, `sitemap.xml` y el catálogo de
capacidades en `/.well-known/ai-catalog.json`) son accesibles de forma anónima
por HTTP/HTTPS.

No existe un endpoint de aprovisionamiento ni de emisión de credenciales, porque
no hay recursos protegidos.

## Métodos soportados

- `anonymous` — acceso público sin credenciales (único método soportado).

## Uso de credenciales

No se emiten ni se requieren credenciales para consumir este sitio. Si en el
futuro se publicaran recursos protegidos, este documento se actualizará con el
método de registro y los flujos correspondientes.
