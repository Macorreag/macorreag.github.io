#!/usr/bin/env node
/**
 * Genera los favicons del portafolio (PNG + ICO) a partir de la misma marca
 * que usa static/favicon.svg: un prompt de terminal ">_" verde neón sobre
 * fondo oscuro con borde redondeado.
 *
 * No usa dependencias externas: renderiza con funciones de distancia (SDF) y
 * escribe PNG (zlib) e ICO (entradas PNG) a mano.
 *
 * Uso: node scripts/generate-favicon.js
 * Salida: static/favicon.ico, static/favicon-32.png, static/apple-touch-icon.png
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUT_DIR = path.join(__dirname, '..', 'static');

// --- Colores (misma paleta del sitio) ---
const BG = [13, 13, 20]; // #0d0d14
const GREEN = [0, 255, 65]; // #00FF41

// Geometría normalizada (0..1), espejo exacto del SVG.
const GLYPH_STROKE = 5.5 / 64; // ancho del trazo ">_"
const GLYPH_GLOW = 12 / 64; // ancho del resplandor
const BORDER_STROKE = 2 / 64; // ancho del borde
const RECT_HALF = (63 - 1) / 2 / 64; // 0.484375
const RECT_RADIUS = 14 / 64; // 0.21875

const CHEVRON = [
  [25 / 64, 21 / 64],
  [38 / 64, 32 / 64],
  [25 / 64, 43 / 64],
];
const UNDERSCORE = [
  [24 / 64, 50 / 64],
  [40 / 64, 50 / 64],
];

// --- Helpers de geometría ---
function segDist(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const len2 = abx * abx + aby * aby;
  let t = len2 > 0 ? ((px - ax) * abx + (py - ay) * aby) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + abx * t;
  const cy = ay + aby * t;
  const dx = px - cx;
  const dy = py - cy;
  return Math.sqrt(dx * dx + dy * dy);
}

function roundedRectSDF(x, y, half, radius) {
  const dx = Math.abs(x - 0.5) - (half - radius);
  const dy = Math.abs(y - 0.5) - (half - radius);
  const ax = Math.max(dx, 0);
  const ay = Math.max(dy, 0);
  return Math.min(Math.max(dx, dy), 0) + Math.sqrt(ax * ax + ay * ay) - radius;
}

function glyphDist(x, y) {
  let d = segDist(x, y, ...CHEVRON[0], ...CHEVRON[1]);
  d = Math.min(d, segDist(x, y, ...CHEVRON[1], ...CHEVRON[2]));
  d = Math.min(d, segDist(x, y, ...UNDERSCORE[0], ...UNDERSCORE[1]));
  return d;
}

// Cobertura con borde suavizado (aa = 1 píxel en unidades normalizadas).
function edgeCoverage(dist, half, aa) {
  const t = (dist - half) / aa;
  return Math.max(0, Math.min(1, 0.5 - t));
}

// --- Render ---
function renderIcon(size) {
  const aa = 1 / size; // un píxel de suavizado
  const rgba = Buffer.alloc(size * size * 4);
  const halfBorder = BORDER_STROKE / 2;
  const halfGlyph = GLYPH_STROKE / 2;
  const halfGlow = GLYPH_GLOW / 2;

  for (let py = 0; py < size; py++) {
    const y = (py + 0.5) / size;
    for (let px = 0; px < size; px++) {
      const x = (px + 0.5) / size;

      // Acumulador en espacio premultiplicado.
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;

      const add = (color, alpha, cov) => {
        const srcA = alpha * cov;
        if (srcA <= 0) return;
        const inv = 1 - srcA;
        r = color[0] * srcA + r * inv;
        g = color[1] * srcA + g * inv;
        b = color[2] * srcA + b * inv;
        a = srcA + a * inv;
      };

      const rectSdf = roundedRectSDF(x, y, RECT_HALF, RECT_RADIUS);

      // 1) Fondo redondeado.
      add(BG, 1, edgeCoverage(rectSdf, 0, aa));
      // 2) Borde verde sutil.
      add(GREEN, 0.4, edgeCoverage(Math.abs(rectSdf), halfBorder, aa));

      const dGlyph = glyphDist(x, y);
      // 3) Resplandor detrás del trazo.
      add(GREEN, 0.22, edgeCoverage(dGlyph, halfGlow, aa));
      // 4) Trazo principal.
      add(GREEN, 1, edgeCoverage(dGlyph, halfGlyph, aa));

      const idx = (py * size + px) * 4;
      if (a > 0.001) {
        rgba[idx] = Math.round((r / a) * 255);
        rgba[idx + 1] = Math.round((g / a) * 255);
        rgba[idx + 2] = Math.round((b / a) * 255);
        rgba[idx + 3] = Math.round(a * 255);
      } else {
        rgba[idx] = 0;
        rgba[idx + 1] = 0;
        rgba[idx + 2] = 0;
        rgba[idx + 3] = 0;
      }
    }
  }
  return rgba;
}

// --- PNG ---
const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(size, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filtro None
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- ICO (entradas PNG) ---
function encodeICO(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = [];
  const blobs = [];
  let offset = 6 + count * 16;

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry[0] = img.size >= 256 ? 0 : img.size;
    entry[1] = img.size >= 256 ? 0 : img.size;
    entry[2] = 0;
    entry[3] = 0;
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    blobs.push(img.data);
    offset += img.data.length;
  }

  return Buffer.concat([header, ...entries, ...blobs]);
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // ICO con 16 / 32 / 48 px.
  const icoImages = [16, 32, 48].map(size => ({
    size,
    data: encodePNG(size, renderIcon(size)),
  }));
  fs.writeFileSync(path.join(OUT_DIR, 'favicon.ico'), encodeICO(icoImages));

  // PNG suelto para el fallback del <link> y para iOS.
  fs.writeFileSync(path.join(OUT_DIR, 'favicon-32.png'), encodePNG(32, renderIcon(32)));
  fs.writeFileSync(path.join(OUT_DIR, 'apple-touch-icon.png'), encodePNG(180, renderIcon(180)));

  console.log('Favicons generados en', OUT_DIR);
  console.log('  - favicon.ico (16/32/48)');
  console.log('  - favicon-32.png');
  console.log('  - apple-touch-icon.png (180)');
}

main();
