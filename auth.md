# auth.md

Documento de descubrimiento de registro de agentes (Auth.md). Describe cómo un
agente de IA se autentica —o no— para interactuar con este sitio.

## Resumen

El portafolio de Miller Correa (`https://macorreag.github.io`) es **público y de
solo lectura**. No expone APIs protegidas ni requiere registro: cualquier agente
puede leer todo el contenido de forma anónima por HTTP/HTTPS.

## agent_auth

```json
{
  "agent_auth": {
    "skill": "https://macorreag.github.io/auth.md",
    "register_uri": null,
    "identity_types_supported": ["anonymous"],
    "anonymous": {
      "credential_types_supported": [],
      "claim_uri": "https://macorreag.github.io/auth.md"
    }
  }
}
```

## Métodos soportados

- `anonymous` — acceso público sin credenciales (único método soportado).
  - `credential_types_supported`: ninguno (no se emiten credenciales).

## Registro

No existe endpoint de registro (`register_uri: null`): no hay recursos
protegidos que requieran aprovisionamiento. La audiencia son agentes de IA,
crawlers y herramientas automatizadas.

## Uso de credenciales

No se emiten ni se requieren credenciales para consumir este sitio. Si en el
futuro se publicaran recursos protegidos, este documento se actualizará con el
método de registro y los flujos correspondientes.
