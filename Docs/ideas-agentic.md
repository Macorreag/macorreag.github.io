# Roadmap: portafolio más agéntico — versión *rápido, gratis y sin filtrar claves*

Revisión del roadmap anterior con tres restricciones duras:

1. **Agilizar** — menos latencia, menos fricción, menos pasos.
2. **Gratis** — vivir dentro de la capa gratuita, no "casi gratis".
3. **Nunca exponer una API key** — el navegador jamás habla con un proveedor de LLM.

Esto reordena las prioridades: lo determinista y lo precalculado suben; lo que depende de
un LLM en el camino crítico baja o se rediseña.

---

## 0. Estado: bloque 1-5 implementado

Aplicado sobre `portfolio-mcp` (`wrangler.jsonc`, `src/prompt.ts`, `src/assistant.ts`,
`src/index.ts`, `integration/README.md`) y sobre el `deploy.yml` de este repo.

| Métrica | Antes | Después | Mejora |
|---|---|---|---|
| System prompt | ~1.706 tokens | ~1.366 tokens | −20% |
| Turno típico | ~56,2 Neuronas | ~11,9 Neuronas | **×4,7** |
| Petición «bomba» (historial máximo) | ~851,8 Neuronas | ~17,3 Neuronas | **×49** |
| Turnos/día gratis | ~178 | ~842 | ×4,7 |
| Conversaciones de 3 turnos/día | ~59 | ~280 | ×4,7 |

La petición «bomba» es la que más importa: antes **13 mensajes** bien construidos agotaban
la cuota diaria compartida y dejaban el copiloto sin servicio para todos hasta medianoche
UTC. Ahora eso ya no es posible dentro de los topes del esquema.

Detalle de lo implementado:

1. `CHAT_MODEL` → `@cf/qwen/qwen3-30b-a3b-fp8`, y `DEFAULT_MODEL` alineado para que un
   fallback nunca caiga en el modelo caro.
2. Reglas del prompt deduplicadas: estaban escritas dos veces (ES e EN) cuando la regla 1
   ya obliga a responder en el idioma del usuario.
3. Historial acotado (4 turnos, 1.000 caracteres por mensaje, 12 mensajes, 6.000
   caracteres de contexto) aplicado **en servidor**, más `max_tokens` 450 → 200.
4. `/api/chat`: validación de `Origin`, tope de cuerpo, rate limit 20/10 min por IP y
   preflight propio. `/mcp` intacto (su `*` lo pone la librería y es correcto).
5. Canary de credenciales en CI, antes de subir el artefacto de Pages.

Extra no previsto: **neutralización del *thinking mode* de Qwen3**. Su chat template lo
trae activado por defecto, así que sin desactivarlo habría gastado cientos de tokens
razonando (a 30.475 Neuronas/M de salida, más caro que la respuesta) y podría haber
filtrado el razonamiento al usuario. Se ataca en dos capas: el marcador `/no_think` en el
system prompt y un filtro de flujo que desbasta los bloques de razonamiento aunque lleguen
partidos entre chunks.

Segundo extra, detectado **solo al mirar la respuesta real en producción**: Qwen3 abre
cada respuesta con `\n\n` (el hueco donde iría el bloque de razonamiento), así que la
burbuja del chat empezaba con una línea en blanco. No lo habría visto ningún test local
—el `smoke test` daba verde— pero sí la inspección de los bytes de la respuesta. Se
corrige descartando el espacio en blanco inicial del flujo (y recortando al final en el
widget). Lección aplicable: **un despliegue no está verificado hasta que se lee la salida
real**, no solo hasta que los códigos HTTP cuadran.

> **Corrección de un error del documento anterior.** Afirmé que `/api/chat` respondía con
> `access-control-allow-origin: *`. **Es falso para `portfolio-mcp`**: ese `*` está en el
> otro Worker (`mcp-macorreag`) y en el handler de `/mcp`, que es donde corresponde. El
> `/api/chat` de `portfolio-mcp` no emitía cabeceras CORS propias; el riesgo real era la
> ausencia de rate limit y de validación de origen, no un CORS abierto. Lo que sí ocurría:
> el preflight `OPTIONS` de `/api/chat` caía en el handler de `/mcp` y heredaba su CORS
> abierto. Eso quedó cerrado con un preflight propio.

---

## 1. El presupuesto real (medido, no estimado)

Workers AI: **10.000 Neuronas/día gratis**, $0.011 por 1.000 Neuronas después
([pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)). Es un
presupuesto **diario compartido por todos los visitantes** — no hay cuota por usuario.

Tu system prompt (`prompt.ts` + `data.ts`) pesa **≈1.700 tokens** y se reenvía en
**cada** mensaje, porque `/api/chat` es stateless.

### Coste por turno según modelo

| Modelo | Neuronas/M in | Neuronas/M out | Coste ≈ por turno* | Turnos/día gratis |
|---|---|---|---|---|
| `@cf/meta/llama-4-scout-17b-16e-instruct` ← **el actual** | 24.545 | 77.273 | **≈56** | ~178 |
| `@cf/openai/gpt-oss-20b` | 18.182 | 27.273 | ≈38 | ~263 |
| `@cf/qwen/qwen3-30b-a3b-fp8` | **4.625** | **30.475** | **≈13** | **~746** |
| `@cf/ibm-granite/granite-4.0-h-micro` | 1.542 | 10.158 | ≈4,5 | ~2.200 |

\* turno = 1.700 de system + ~15 de pregunta + ~180 de respuesta.

**Hallazgo #1 — cambiar una línea multiplica por 4 la cuota gratis.**
`qwen3-30b-a3b-fp8` ya está en el union `TextModel` de `assistant.ts`, así que migrar es
editar `wrangler.jsonc → vars.CHAT_MODEL`. Es un MoE de 30B con 3B activos: **más rápido
y 4,2× más barato** que el scout actual. Verifica el soporte de *tool calling* de ese
modelo antes de apostar por la idea #3.

**Hallazgo #2 — el historial es el verdadero agujero.**
El esquema acepta hasta **30 mensajes de 4.000 caracteres**. Un cliente malicioso manda
30 × 4.000 chars ≈ 30.000 tokens → **~780 Neuronas en una sola petición**. Trece mensajes
así agotan el día entero y **dejan el copiloto muerto para todo el mundo**. El coste
además crece O(n²) por conversación, porque reenvías todo el historial cada turno.

**Hallazgo #3 — regalas ~40% de los tokens de entrada.**
Las 10 reglas del system prompt están escritas **dos veces**, en español y en inglés
(patrón `"… / …"`). La regla 1 ya obliga a responder en el idioma del usuario, así que la
duplicación es redundante. Recortarlo baja el prompt de ~1.700 a ~1.300 tokens en **cada
mensaje de cada visitante**.

---

## 2. Arquitectura en niveles: la llamada más barata es la que no haces

```
Tier 0 · Determinista      0 Neuronas · 0 ms   ← debe cubrir ~60% de las interacciones
  ├─ Paleta Ctrl+K (keywords + sinónimos + query params)
  ├─ Chips del copiloto → respuesta precalculada en el BUILD
  └─ Deep links con estado en la URL
Tier 1 · Caché             0 Neuronas · ~5 ms
  └─ KV / AI Gateway por hash de pregunta normalizada (TTL largo)
Tier 2 · Modelo barato     ~13 Neuronas        ← el 90% de lo que sí usa LLM
  └─ qwen3-30b-a3b-fp8
Tier 3 · Modelo grande     ~120 Neuronas       ← solo síntesis, con rate limit
  └─ 70B, únicamente para el CV/pitch a medida
```

**Los 6 chips del copiloto ya son un contrato cerrado.** "¿Quién es Miller?", "¿En qué
trabaja?", "Tecnologías", "Open source", "Estudios", "Contacto" — seis preguntas fijas. Se
pueden **precalcular en el build** y servirse desde KV: el clic más común del sitio pasa a
costar 0 Neuronas y 0 ms. Hoy cada clic quema ~13-56 Neuronas.

### Por qué el build-time es el mejor multiplicador

GitHub Actions corre gratis y no consume tu cuota de Workers AI:

- Resúmenes de repos (README → descripción para reclutador / para dev).
- Respuestas canónicas de las preguntas frecuentes.
- Narraciones del tour guiado (6 textos fijos).
- Explicación de cada skill enlazada a la experiencia real.

Todo eso queda como **JSON estático en `public/`**: latencia de CDN, coste cero, y
**el sitio sigue funcionando si el Worker se cae**. Es lo contrario de depender del
runtime para todo.

---

## 3. Secretos: la regla que no se negocia

**Estado actual: correcto.** El Worker usa el binding `env.AI` — no hay ninguna API key
en el navegador, y `.env*` está en `.gitignore`. Solo `NOTION_API_KEY` existe, y vive en
scripts Node de build. Bien. La misión es **no romperlo**.

### La regla

> **El navegador nunca habla directamente con un proveedor de LLM.** Cero excepciones.

Toda llamada a un modelo pasa por el Worker, que es el único que tiene credenciales.
Esto no es solo seguridad: es lo que te permite cachear, limitar y cambiar de modelo sin
tocar el front.

### Las trampas concretas

1. **`GATSBY_` es una trampa de Gatsby.** Cualquier variable `GATSBY_*` se **incrusta en
   el bundle del cliente** en build time. Nunca nombres nada `GATSBY_LLM_KEY`,
   `GATSBY_OPENAI_KEY` ni similares — acabaría en `public/` y publicado en GitHub Pages.
   Lo mismo aplica a cualquier `REACT_APP_`/`VITE_` si algún día migras el front.
2. **`wrangler.jsonc → vars` es texto plano.** Visible en el repo y en el dashboard.
   Todo secreto va con `wrangler secret put NOMBRE`. El binding `AI` no necesita key: esa
   es justamente su ventaja frente a meter un token de Cloudflare a mano.
3. **Si agregas un segundo proveedor** (Groq, Gemini, OpenRouter — que tienen capas
   gratuitas), la key vive como **Worker secret** y la llama el Worker. Nunca el navegador.
   Cloudflare **AI Gateway** permite además que la key viva solo en el gateway.
4. **GitHub Actions:** solo `${{ secrets.X }}`, jamás `echo` de la variable. Revisa que
   ningún script imprima el valor en el log del workflow.
5. **El widget es HTML server-rendered por el Worker.** Hoy solo interpola datos del
   perfil, que son públicos — correcto. Mantenlo así: nunca interpolares `env.*` en ese
   HTML.

### Guardarraíl barato que sí recomiendo

Un **canary en CI** que falle el build si aparece una cadena con forma de clave en
`public/`. Cinco líneas en el workflow:

```
grep -rInE 'sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{35}|gsk_[A-Za-z0-9]{40,}|ghp_[A-Za-z0-9]{36}' public/ && exit 1 || exit 0
```

Publicas un sitio estático en GitHub Pages: si una clave llega a `public/`, ya es
pública. Este grep es la última línea de defensa y cuesta cero.

---

## 4. CORS y abuso (el riesgo más urgente)

Estado **antes** del bloque 1-5, verificado sobre el código:

- `/api/chat`: **sin rate limit, sin validación de origen y sin cabeceras CORS propias**
  (el `*` que circulaba en la documentación era de `/mcp`, no de aquí).
- El preflight `OPTIONS` de `/api/chat` no estaba atendido, así que caía en el handler de
  `/mcp` y heredaba su CORS abierto.

No filtra claves — **filtra tu cuota gratuita**. Y como el presupuesto es **diario y
compartido**, un solo abusador deja el copiloto muerto para todos hasta medianoche UTC.
Con `Access-Control-Allow-Origin` ausente, un navegador de terceros no puede *leer* la
respuesta, pero **sí puede enviar la petición**: un `POST` con `content-type: text/plain`
es un *simple request*, no dispara preflight y consume igual. Y cualquier cliente que no
sea un navegador (`curl`, un script) no tiene restricción alguna.

Mínimo viable, todo gratis:

1. `Origin`/`Referer` restringido a `https://macorreag.github.io` (+ `localhost` en dev).
   Ojo: esto frena el abuso desde navegadores, **no** desde `curl`. Por eso también:
2. **Rate limit por IP** con token bucket en KV o Durable Object
   (p. ej. 20 mensajes / 10 min). Workers KV gratis alcanza de sobra.
3. **Tope de historial real**: truncar a los últimos ~4 turnos y bajar el límite de
   `content` de 4.000 a ~1.000 caracteres. Esto solo ya elimina el agujero del Hallazgo #2.
4. `max_tokens` de 450 → ~200 para el copiloto (es una caja resumen; el prompt ya pide
   respuestas de 2-4 frases).

---

## 5. Las ideas, filtradas por las tres restricciones

### ✅ Suben de prioridad (barato, rápido, gratis)

**A. Paleta de comandos `Ctrl+K` — determinista, sin backend.** *(era #3)*
Ahora es **la idea #1**. Cero Neuronas, cero latencia, cero infraestructura, y es la que
más "se siente" agéntica. El LLM queda como fallback para lo ambiguo. Además aísla el
sitio de una caída del Worker.

**B. Un registro único de herramientas (`tools.ts`).** *(era #1)*
Sigue siendo la base estructural: es lo que permite poner Tier 0 delante de cada tool sin
duplicar lógica. Tres adaptadores: MCP / WebMCP / chat.

**C. Fuente de verdad única (`/.well-known/portfolio.json`).** *(era #8)*
Gratis, y urgente: hoy el rol diverge entre `header.js` (*"Senior Systems Architect"*),
`mcp-macorreag/src/data.ts` (*"Senior Developer"*) y `portfolio-mcp/src/data.ts`
(*"Ingeniero de Sistemas"*). Respuestas contradictorias entre el chat y el MCP destruyen
la confianza. Además alimenta el build-time de todo lo demás.

**D. Presupuesto: cambiar de modelo, recortar prompt, limitar historial.** *(nuevo — §1, §4)*
Unas horas de trabajo que **multiplican por 4+ la cuota gratis** y cierran el agujero de
abuso. Mejor relación impacto/esfuerzo de toda la lista.

**E. Precalcular en el build.** *(nuevo, absorbe #6 y parte de #4)*
Resúmenes de repos, respuestas de los chips, narraciones del tour. El LLM se usa una vez
en CI, no una vez por visitante.

**F. Deep links con estado en la URL.** *(era #5)*
Gratis. `/?section=open-source&lang=Python&q=graphql`. Cada respuesta del agente se vuelve
un enlace compartible — y una vista cacheable.

**G. Anti-alucinación estructural.** *(era #7)*
Ahora es gratis *además* de correcto: hechos desde recuperación estructurada, pie de
fuente por respuesta, plantilla de "no lo sé". Menos LLM, más fiabilidad.

**H. Cerrar los huecos del audit.** *(era #10)*
`agent-card.json` (A2A), `agent-skills/index.json` (reusa tu `.audit/skills/*.md`),
`api-catalog`, `Link` headers. Archivos estáticos, coste cero, señal de madurez.

**I. Observabilidad de preguntas → cache canónico.** *(era #12, ahora con doble motivo)*
Registrar preguntas en Analytics Engine / KV. Cada pregunta frecuente que detectes se
convierte en **respuesta precalculada del Tier 1**: el bucle se paga solo bajando el
coste. Requiere declarar el logging en `auth.md`.

### ⚠️ Se rediseñan

**J. Tool-calling en el copiloto.** *(era #2)*
Sigue siendo lo que convierte el chat en agente, pero **ahora tiene precio**: cada
esquema de tool se reenvía en cada petición y sube el input en cada turno. Con qwen3
(4.625/M in) es asumible; con el scout actual, caro. Orden correcto: primero Tier 0 y el
cambio de modelo, **después** tools. Y el plan B del bloque ```` ```action {...}``` ```` no
consume nada extra de input: si el presupuesto aprieta, empieza por ahí.

**K. CV/pitch a medida.** *(era #9)*
Sigue siendo la mejor salida de negocio y es asumible: ~180 tokens de salida con qwen3
≈ 5,5 Neuronas. Pero necesita **rate limit estricto** (es el endpoint más atractivo para
abusar) y los hechos siempre desde `portfolio.json`, nunca elegidos por el modelo.

**L. Tour guiado.** *(era #4)*
Barato **si** las narraciones se precomputan (6 textos fijos, Tier 0). Caro si cada paso
consulta al modelo. Implementar en versión estática.

### ❌ Se aplazan

**M. MCP con escritura** (`request_contact`, `subscribe`). *(era #11)*
Es la mayor superficie de abuso nueva: un endpoint de escritura con CORS abierto es un
buzón de spam. No lo abras hasta tener rate limit y validación funcionando y probados.

**N. Reordenar secciones dinámicamente.** Descartado: rompe anchors, caché y orientación,
y añade coste. Resalta y filtra, no reordenes.

---

## 6. Plan de ejecución

| # | Acción | Esfuerzo | Efecto | Estado |
|---|---|---|---|---|
| 1 | `CHAT_MODEL` → `qwen3-30b-a3b-fp8` | 1 línea | ×4,2 cuota gratis | ✅ |
| 2 | Recortar reglas ES/EN duplicadas | S | −340 tokens en cada mensaje | ✅ |
| 3 | Truncar historial + `max_tokens: 200` | S | Petición bomba ×49 más barata | ✅ |
| 4 | Rate limit + `Origin` check + preflight | S/M | El copiloto no se cae para todos | ✅ |
| 5 | Canary de claves en CI | S | Red de seguridad de secretos | ✅ |
| 6 | Paleta `Ctrl+K` determinista | M | 0 Neuronas, 0 ms | ✅ |
| 7 | `portfolio.json` canónico + build-time | M | Consistencia + precalculado | siguiente |
| 8 | Chips del copiloto precalculados en KV | S | El clic más común pasa a gratis | — |
| 9 | `tools.ts` unificado + tool-calling | L | El chat por fin *actúa* | — |
| 10 | Huecos del audit (A2A, skills, catalog) | S/M | Nivel 3-4 del scanner | — |

Los puntos **1-6 están hechos y verificados**: `tsc --noEmit` limpio, tests del filtro de
razonamiento en verde (incluido el caso de etiqueta partida entre chunks) y el canary
probado contra el build real y contra claves plantadas.

> **Desplegado en producción.** Versión `04d7f8bc-376e-421c-a0b0-9bc2cba152af` de
> `macorreag-portfolio-mcp`, verificada en vivo con 12/12 comprobaciones (respuesta
> correcta en español, 1,2-1,5 s de latencia, sin fugas de razonamiento).

### Operación: el login se hace aparte, y desde la carpeta del Worker

`wrangler login` abre un navegador, así que es un paso que solo puede dar una persona y
**no** va dentro de ningún script automático. Además tiene que ejecutarse **desde la
carpeta del Worker**, porque desde otra ruta wrangler no encuentra el `wrangler.jsonc`
del proyecto:

```sh
cd /home/mialco/portfolio-mcp && npx wrangler login
```

Ojo con un detalle que puede costar caro: **esa sesión ve dos cuentas** (`Factual Passive`
y `Mialco2009@gmail.com's Account`). Desplegar en la equivocada crea un Worker que nadie
usa. Lo que lo evita es que `wrangler.jsonc` fija `account_id`
(`e35d5b403445a91b2cc77c9ee0e8545a`): el deploy va a esa cuenta aunque wrangler tenga otra
como predeterminada. Por eso conviene comprobar `npx wrangler whoami` antes de desplegar.

El resto del ciclo (deploy + smoke test) sí está automatizado en
`.diff-tmp/deploy-wizard.sh`, que **detecta** si hay sesión y, si no la hay, se detiene y
te dice qué comando ejecutar en lugar de intentar el login por su cuenta.

Lo que sigue, en orden: **7** (fuente de verdad única, antes de añadir más
funcionalidad), **10** (huecos del audit, baratos y de señal alta) y **8** (chips
precalculados). La **9** (tool-calling) va después: encarece cada turno, así que primero
conviene tener el Tier 0 cubriendo lo que pueda cubrir.

### Paleta de comandos: qué es y qué no

Implementada en `src/components/command-palette.js`, montada desde el `Nav` para que
exista en todas las páginas. **No usa ningún LLM ni hace ninguna petición**: todo sale de
datos que ya están en el bundle (secciones, páginas de formación, categorías de skills) o
de la caché de sesión que escriben `repos.js` y `blog.js` (repos y posts ya cargados).
Si el Worker del copiloto está caído, la paleta funciona igual.

Los repos y posts solo aparecen si esas secciones ya se cargaron en la pestaña: la paleta
no dispara peticiones propias a propósito, para no competir con la carga de la página.

Lo que **no** hace todavía (es la idea #5/#6, la siguiente ola): filtrar la grilla de
repos en vivo o reflejar el estado en la URL. Ahora mismo abre el repo en GitHub. El
siguiente paso natural es que el comando filtre la sección en la página y deje
`?lang=Python` en la barra de direcciones, para que el enlace sea compartible.

Verificación disponible sin navegador: `node .diff-tmp/test-command-palette.mjs` (31
comprobaciones), que incluye la lógica de búsqueda ejecutada desde el archivo real y —lo
más importante— que cada `id` de sección que declara la paleta **exista de verdad** en el
DOM. Un typo ahí no rompe el build: el comando simplemente no haría nada al pulsarlo.

---

## 7. Lo que cambió respecto a la v1

| Idea v1 | Ahora | Motivo |
|---|---|---|
| #3 Paleta | **#1** | Es Tier 0 puro: gratis y sin latencia |
| #6 Repos consultable | **Split** | Filtros/búsqueda al cliente (gratis); "explicar repo" al build (no al runtime) |
| #2 Tool-calling | **Rediseñada** | Los esquemas de tools encarecen cada turno: va después del cambio de modelo |
| #11 MCP escritura | **Aplazada** | Superficie de abuso con CORS abierto |
| — | **Nuevas D, E, I** | Presupuesto de Neuronas, build-time, cache canónico |

---

## 8. Invariantes a preservar (no solo al inicio, siempre)

1. El navegador nunca ve una credencial de LLM.
2. Nada con prefijo `GATSBY_` que sea secreto.
3. Secretos en `wrangler secret`, no en `wrangler.jsonc → vars`.
4. Toda funcionalidad nueva pasa por Tier 0 antes de tocar un modelo.
5. El sitio sigue siendo usable si el Worker responde 500 o está caído — hoy el iframe
   del copiloto es un punto único de fallo sin fallback.
