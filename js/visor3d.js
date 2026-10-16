/* Lovely · Visor 3D interactivo de productos.
   Modelos generados por código (Three.js, incluido en js/vendor). Cada producto se define
   en SPECS: tipo de pieza, forma y colores por variante, en el mismo orden que js/data.js. */
import * as THREE from './vendor/three.module.min.js';
import { OrbitControls } from './vendor/OrbitControls.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

/* ---------- Especificaciones por producto ----------
   Relojes  v: [caja, esfera, correa, acento, centro del brazalete?]
   Gorras   v: [copa, visera, emblema]
   Gafas    v: [montura, aro, lente] */
const SPECS = {
  'reloj-t5-square': { type: 'reloj', shape: 'square', dial: 'chrono', bezel: 'plain', strap: 'silicone', sw: 0.95,
    v: [['#2B2B2B', '#151515', '#141414', '#C8323A'], ['#2B2B2B', '#151515', '#E2632B', '#E2632B'], ['#2B2B2B', '#151515', '#B3261E', '#B3261E'], ['#2B2B2B', '#151515', '#9BC53D', '#9BC53D'], ['#B98A6A', '#151515', '#1F4E5A', '#B98A6A']] },
  'reloj-joefox-sport': { type: 'reloj', shape: 'round', dial: 'anadigi', bezel: 'plain', strap: 'silicone', pushers: true,
    v: [['#1C1C1C', '#111111', '#1C1C1C', '#C6E03A'], ['#1F3A73', '#111111', '#1F3A73', '#E2632B']] },
  'reloj-joefox-steel': { type: 'reloj', shape: 'round', dial: 'anadigi', bezel: 'plain', strap: 'bracelet', pushers: true,
    v: [['#BFC3C8', '#151515', '#BFC3C8', '#D4AF37', '#D4AF37']] },
  'reloj-curren-elegance': { type: 'reloj', shape: 'round', dial: 'roman', bezel: 'plain', strap: 'bracelet', sw: 0.55, size: 0.85,
    v: [['#D4AF37', '#F4EFE6', '#D4AF37', '#D4AF37'], ['#C9CCD1', '#E8B9B5', '#C9CCD1', '#B76E79']] },
  'reloj-curren-crystal': { type: 'reloj', shape: 'round', dial: 'analog', bezel: 'crystal', strap: 'bracelet', sw: 0.55, size: 0.85,
    v: [['#C9CCD1', '#EFEAE4', '#C9CCD1', '#C48A72', '#C48A72'], ['#C48A72', '#1C2238', '#C48A72', '#C48A72'], ['#C9CCD1', '#EEF1F4', '#C9CCD1', '#9FA6B2'], ['#C48A72', '#2C7FA8', '#C48A72', '#C48A72']] },
  'reloj-skmei-skull': { type: 'reloj', shape: 'round', dial: 'skull', bezel: 'diver', strap: 'bracelet',
    v: [['#C9CCD1', '#C9CCD1', '#C9CCD1', '#B3261E'], ['#C9CCD1', '#C9CCD1', '#C9CCD1', '#1E6B3A'], ['#C9CCD1', '#D4AF37', '#C9CCD1', '#1F3A73', '#D4AF37'], ['#C9CCD1', '#C9CCD1', '#C9CCD1', '#1F4FA0']],
    bezel2: [null, null, '#B3261E', null] },
  'reloj-naviforce-dual': { type: 'reloj', shape: 'round', dial: 'anadigi', bezel: 'plain', strap: 'bracelet', pushers: true,
    v: [['#1E1E1E', '#151515', '#1E1E1E', '#C48A72'], ['#C9CCD1', '#1F3A73', '#C9CCD1', '#5B8BD9'], ['#C9CCD1', '#151515', '#C9CCD1', '#E2632B'], ['#1E1E1E', '#151515', '#1E1E1E', '#9A9A9A']] },
  'reloj-naviforce-7105': { type: 'reloj', shape: 'tonneau', dial: 'chrono', bezel: 'plain', strap: 'silicone', sw: 1.0, pushers: true,
    v: [['#1E1E1E', '#151515', '#151515', '#C48A72'], ['#D4AF37', '#151515', '#3A2A1E', '#D4AF37'], ['#1E1E1E', '#151515', '#151515', '#C9CCD1'], ['#1E1E1E', '#151515', '#151515', '#D4AF37'], ['#1F3A73', '#1F3A73', '#1F3A73', '#C9CCD1']] },
  'reloj-naviforce-sport': { type: 'reloj', shape: 'round', dial: 'anadigi', bezel: 'plain', strap: 'silicone', pushers: true,
    v: [['#1E1E1E', '#151515', '#5A3A22', '#E8A33A'], ['#2B2B2B', '#151515', '#151515', '#C9CCD1'], ['#1F3A73', '#1F3A73', '#1F3A73', '#E8C547'], ['#C48A72', '#151515', '#151515', '#C48A72']] },
  'reloj-cason-classic': { type: 'reloj', shape: 'round', dial: 'analog', bezel: 'plain', strap: 'bracelet', integrated: true,
    v: [['#C9CCD1', '#1A1A1A', '#C9CCD1', '#E8E8E8'], ['#C9CCD1', '#8E1B1B', '#C9CCD1', '#E8E8E8'], ['#C9CCD1', '#9CC9E0', '#C9CCD1', '#E8E8E8'], ['#C9CCD1', '#4B2C83', '#C9CCD1', '#E8E8E8'], ['#C9CCD1', '#1E5B3A', '#C9CCD1', '#E8E8E8'], ['#C9CCD1', '#CFC4AE', '#C9CCD1', '#E8E8E8']] },
  'reloj-iced-crystal': { type: 'reloj', shape: 'round', dial: 'analog', bezel: 'crystal', strap: 'silicone', pave: true,
    v: [['#E9E9E9', '#EDEDED', '#F5F5F5', '#2C5FD0'], ['#1E1E1E', '#C9B48A', '#151515', '#D4AF37'], ['#D4AF37', '#C9B48A', '#151515', '#D4AF37'], ['#D4AF37', '#C9B48A', '#F5F5F5', '#D4AF37'], ['#C48A72', '#C9B48A', '#F5F5F5', '#C48A72']] },
  'reloj-bariu-estuche': { type: 'reloj', shape: 'round', dial: 'analog', bezel: 'crystal', strap: 'bracelet', sw: 0.55, size: 0.85, box: true,
    v: [['#C9CCD1', '#E9ECEF', '#C9CCD1', '#C9CCD1'], ['#D4AF37', '#1A1A1A', '#D4AF37', '#D4AF37']] },
  'reloj-skmei-chrono': { type: 'reloj', shape: 'round', dial: 'chrono', bezel: 'plain', strap: 'bracelet', pushers: true,
    v: [['#1E1E1E', '#1F3A73', '#1E1E1E', '#E2632B'], ['#D4AF37', '#151515', '#C9CCD1', '#C48A72', '#D4AF37'], ['#C9CCD1', '#F2F2F2', '#C9CCD1', '#B3261E'], ['#C9CCD1', '#C9CCD1', '#C9CCD1', '#B3261E']] },
  'reloj-skmei-skeleton': { type: 'reloj', shape: 'round', dial: 'skeleton', bezel: 'plain', strap: 'bracelet',
    v: [['#C9CCD1', '#BFC3C8', '#C9CCD1', '#B3261E']] },
  'reloj-diray-digital': { type: 'reloj', shape: 'round', dial: 'digital', bezel: 'plain', strap: 'silicone', pushers: true,
    v: [['#2E3F5C', '#0F1012', '#2E3F5C', '#7FA7FF'], ['#B79A5A', '#0F1012', '#151515', '#E8C547'], ['#B3261E', '#0F1012', '#151515', '#FF6A5A'], ['#1E1E1E', '#0F1012', '#151515', '#E8A33A'], ['#C48A72', '#0F1012', '#151515', '#E8A33A']] },

  'gorra-mtn-brahman': { type: 'gorra', emblem: 'plate', v: [['#7A7A7A', '#2B2B2B', '#C9A86A'], ['#1A1A1A', '#1A1A1A', '#C9A86A'], ['#CDB38B', '#5A3A22', '#C9A86A'], ['#EDE6D6', '#1A1A1A', '#C9A86A']] },
  'gorra-heart-pin': { type: 'gorra', emblem: 'pin', quilt: true, v: [['#7A7343', '#7A7343', '#D4AF37'], ['#1A1A1A', '#1A1A1A', '#D4AF37'], ['#E9C9C9', '#E9C9C9', '#D4AF37']] },
  'gorra-u-gotica': { type: 'gorra', emblem: 'letter', v: [['#1C2541', '#1C2541', '#F2F2F2'], ['#1A1A1A', '#1A1A1A', '#F2F2F2'], ['#4A3326', '#4A3326', '#F2F2F2']] },
  'gorra-caballo': { type: 'gorra', emblem: 'horse', v: [['#5A3A22', '#EDE6D6', '#E8DCC8'], ['#E9B8C5', '#F2ECE4', '#F2ECE4'], ['#EDE6D6', '#E9B8C5', '#E9B8C5'], ['#1A1A1A', '#3A3A3A', '#D4AF37'], ['#1A1A1A', '#F2F2F2', '#F2F2F2']] },
  'gorra-shield': { type: 'gorra', emblem: 'shield', v: [['#1A1A1A', '#1A1A1A', '#C9CCD1'], ['#F2F2F2', '#F2F2F2', '#D4AF37'], ['#CDB38B', '#CDB38B', '#D4AF37']] },
  'gorra-cruz': { type: 'gorra', emblem: 'cross', v: [['#1A1A1A', '#1A1A1A', '#F2F2F2'], ['#1A1A1A', '#1A1A1A', '#B3261E']] },
  'visera-sun': { type: 'visera', v: [['#D9CBB0', '#D9CBB0', '#3A3A3A'], ['#BDBDBD', '#BDBDBD', '#3A3A3A']] },

  'gafas-club-classic': { type: 'gafas', style: 'club', v: [['#151515', '#2A2A2A', '#1E1E1E'], ['#151515', '#D4AF37', '#2A2A2A'], ['#6B4226', '#D4AF37', '#5A3A22']] },
  'gafas-sport-shield': { type: 'gafas', style: 'shield', v: [['#151515', '#151515', '#E8C547'], ['#151515', '#151515', '#3BAA6B'], ['#151515', '#151515', '#D9483B']] }
};

/* ---------- Utilidades ---------- */
const TAU = Math.PI * 2;
const hexLum = h => { const n = parseInt(h.slice(1), 16); return (((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114) / 255; };
const shade = (h, k) => { const c = new THREE.Color(h); c.multiplyScalar(k); return '#' + c.getHexString(); };
const V = (x, y, z) => new THREE.Vector3(x, y, z);

function metalMat(hex, rough) {
  const dark = hexLum(hex) < 0.25;
  return new THREE.MeshStandardMaterial({ color: hex, metalness: dark ? 0.55 : 1, roughness: rough != null ? rough : (dark ? 0.32 : 0.24) });
}
const matteMat = (hex, rough) => new THREE.MeshStandardMaterial({ color: hex, metalness: 0, roughness: rough != null ? rough : 0.7 });
const fabricMat = hex => new THREE.MeshStandardMaterial({ color: hex, metalness: 0, roughness: 0.92 });

function canvasTex(size, draw) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const ctx = c.getContext('2d'); draw(ctx, size);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  t.userData = { ctx, size, draw };
  return t;
}
function redraw(t, draw) { const { ctx, size } = t.userData; ctx.clearRect(0, 0, size, size); (draw || t.userData.draw)(ctx, size); t.needsUpdate = true; }

function roundRect(p, w, h, r) {
  const x = -w / 2, y = -h / 2;
  p.moveTo(x + r, y); p.lineTo(x + w - r, y); p.quadraticCurveTo(x + w, y, x + w, y + r);
  p.lineTo(x + w, y + h - r); p.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  p.lineTo(x + r, y + h); p.quadraticCurveTo(x, y + h, x, y + h - r);
  p.lineTo(x, y + r); p.quadraticCurveTo(x, y, x + r, y);
  return p;
}
/* Contorno de la caja del reloj, escalado por s */
function outline(kind, s, P) {
  const p = P ? new THREE.Path() : new THREE.Shape();
  if (kind === 'round') { p.absarc(0, 0, s, 0, TAU, false); return p; }
  if (kind === 'square') return roundRect(p, 1.86 * s, 2.0 * s, 0.4 * s);
  const w = 0.74 * s, W = 1.0 * s, h = 1.12 * s;
  p.moveTo(-w, h); p.lineTo(w, h);
  p.quadraticCurveTo(W, h, W * 0.98, h * 0.55); p.quadraticCurveTo(W * 1.1, 0, W * 0.98, -h * 0.55);
  p.quadraticCurveTo(W, -h, w, -h); p.lineTo(-w, -h);
  p.quadraticCurveTo(-W, -h, -W * 0.98, -h * 0.55); p.quadraticCurveTo(-W * 1.1, 0, -W * 0.98, h * 0.55);
  p.quadraticCurveTo(-W, h, -w, h);
  return p;
}
const halfH = kind => kind === 'round' ? 1 : kind === 'square' ? 1.0 : 1.12;
const halfW = kind => kind === 'round' ? 1 : kind === 'square' ? 0.93 : 1.05;

function planarUV(geo) {
  geo.computeBoundingBox();
  const b = geo.boundingBox, pos = geo.attributes.position, uv = new Float32Array(pos.count * 2);
  const w = b.max.x - b.min.x, h = b.max.y - b.min.y;
  for (let i = 0; i < pos.count; i++) { uv[i * 2] = (pos.getX(i) - b.min.x) / w; uv[i * 2 + 1] = (pos.getY(i) - b.min.y) / h; }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return geo;
}
function ringShape(kind, outer, inner) { const s = outline(kind, outer); s.holes.push(outline(kind, inner, true)); return s; }
function extrude(shape, depth, bevel) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: !!bevel, bevelThickness: bevel || 0, bevelSize: bevel || 0, bevelSegments: 3, curveSegments: 64 });
  g.translate(0, 0, -depth / 2); return g;
}
/* Cinta con grosor a lo largo de una curva en el plano YZ (correas) */
function ribbon(curve, w, th, segs) {
  const pos = [], idx = [], X = V(1, 0, 0);
  for (let i = 0; i <= segs; i++) {
    const t = i / segs, p = curve.getPointAt(t), T = curve.getTangentAt(t), n = new THREE.Vector3().crossVectors(T, X).normalize();
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => { const q = p.clone().addScaledVector(X, a * w / 2).addScaledVector(n, b * th / 2); pos.push(q.x, q.y, q.z); });
  }
  for (let i = 0; i < segs; i++) for (let k = 0; k < 4; k++) {
    const a = i * 4 + k, b = i * 4 + (k + 1) % 4, c = a + 4, d = b + 4;
    idx.push(a, c, b, b, c, d);
  }
  const last = segs * 4; idx.push(0, 1, 2, 0, 2, 3, last, last + 2, last + 1, last, last + 3, last + 2);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}
/* Eslabón con cantos redondeados (ancho w en X, largo l en Y, grosor fijo) */
function linkGeo(w, l) {
  const g = new THREE.ExtrudeGeometry(roundRect(new THREE.Shape(), w, 0.11, 0.045), { depth: l, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, curveSegments: 6 });
  g.translate(0, 0, -l / 2); g.rotateX(-Math.PI / 2); g.rotateY(0);
  // rotateX(-90°): grosor (Y del perfil) pasa a Z, largo (Z) pasa a Y
  return g;
}
function gearShape(r, teeth, hole) {
  const s = new THREE.Shape(), n = teeth * 4, d = r * 0.12;
  for (let i = 0; i <= n; i++) {
    const a = i / n * TAU, rr = (i % 4 < 2) ? r : r - d;
    i ? s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  const h = new THREE.Path(); h.absarc(0, 0, hole, 0, TAU, true); s.holes.push(h);
  if (r > 0.15) for (let k = 0; k < 4; k++) { const w = new THREE.Path(), a = k * TAU / 4 + 0.3; w.absarc(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, r * 0.2, 0, TAU, true); s.holes.push(w); }
  return s;
}

/* ---------- Esferas (texturas dibujadas) ---------- */
const DIAS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
const pad2 = n => String(n).padStart(2, '0');
function dialDrawer(spec, c) {
  const dial = c[1], acc = c[3], dark = hexLum(dial) < 0.45, ink = dark ? '#EDEDED' : '#2A2A2A';
  const idx = hexLum(c[0]) > 0.5 && hexLum(c[0]) < 0.75 && c[0] !== '#C9CCD1' ? c[0] : (dark ? '#E8E8E8' : '#3A3A3A');
  return (ctx, S) => {
    const now = new Date(), m = S / 2;
    ctx.save(); ctx.translate(m, m);
    const R = m * 0.98;
    if (spec.dial === 'digital') {
      ctx.fillStyle = '#0F1012'; ctx.fillRect(-m, -m, S, S);
      ctx.strokeStyle = acc; ctx.lineWidth = S * 0.012; ctx.beginPath(); ctx.arc(0, 0, R * 0.9, 0, TAU); ctx.stroke();
      ctx.fillStyle = '#1A1C1F';
      ctx.fillRect(-R * 0.62, -R * 0.3, R * 1.24, R * 0.62);
      ctx.fillStyle = acc; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = `700 ${S * 0.07}px Montserrat, sans-serif`; ctx.fillText(DIAS[now.getDay()] + ' ' + now.getDate(), 0, -R * 0.48);
      ctx.font = `700 ${S * 0.2}px "Courier New", monospace`; ctx.fillText(pad2(now.getHours()) + ':' + pad2(now.getMinutes()), -R * 0.06, 0);
      ctx.font = `700 ${S * 0.08}px "Courier New", monospace`; ctx.fillText(pad2(now.getSeconds()), R * 0.5, R * 0.06);
      ctx.fillStyle = '#8A8F96'; ctx.font = `600 ${S * 0.045}px Montserrat, sans-serif`;
      ctx.fillText('ALARMA', -R * 0.42, R * 0.48); ctx.fillText('CRONO', 0, R * 0.62); ctx.fillText('LUZ', R * 0.42, R * 0.48);
      ctx.restore(); return;
    }
    if (spec.dial === 'skeleton') {
      ctx.lineWidth = R * 0.24; ctx.strokeStyle = dial; ctx.beginPath(); ctx.arc(0, 0, R * 0.86, 0, TAU); ctx.stroke();
      ctx.fillStyle = '#2A2A2A';
      for (let i = 0; i < 12; i++) { ctx.save(); ctx.rotate(i * TAU / 12); ctx.fillRect(-S * 0.008, -R * 0.96, S * 0.016, R * 0.16); ctx.restore(); }
      ctx.restore(); return;
    }
    const g = ctx.createRadialGradient(-R * 0.2, -R * 0.3, R * 0.1, 0, 0, R);
    g.addColorStop(0, shade(dial, dark ? 1.6 : 1.04)); g.addColorStop(1, shade(dial, dark ? 0.85 : 0.88));
    ctx.fillStyle = g; ctx.fillRect(-m, -m, S, S);
    if (spec.pave) { let sd = 7; const rnd = () => (sd = sd * 16807 % 2147483647) / 2147483647; for (let i = 0; i < 900; i++) { const a = rnd() * TAU, r = Math.sqrt(rnd()) * R * 0.8; ctx.fillStyle = `rgba(255,255,255,${0.25 + rnd() * 0.6})`; ctx.fillRect(Math.cos(a) * r, Math.sin(a) * r, 2.2, 2.2); } }
    ctx.strokeStyle = ink; ctx.globalAlpha = 0.55;
    for (let i = 0; i < 60; i++) { ctx.save(); ctx.rotate(i * TAU / 60); ctx.lineWidth = S * 0.004; ctx.beginPath(); ctx.moveTo(0, -R * 0.94); ctx.lineTo(0, -R * 0.88); ctx.stroke(); ctx.restore(); }
    ctx.globalAlpha = 1;
    if (spec.dial === 'roman') {
      const N = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
      ctx.fillStyle = idx === '#3A3A3A' ? '#2A2A2A' : idx; ctx.font = `500 ${S * 0.075}px Georgia, serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      N.forEach((t, i) => { const a = i * TAU / 12 - Math.PI / 2; ctx.fillText(t, Math.cos(a) * R * 0.72, Math.sin(a) * R * 0.72); });
    } else {
      for (let i = 0; i < 12; i++) {
        ctx.save(); ctx.rotate(i * TAU / 12);
        if (spec.dial === 'skull') { ctx.fillStyle = '#F2F2F2'; ctx.beginPath(); ctx.arc(0, -R * 0.78, S * (i % 3 ? 0.022 : 0.032), 0, TAU); ctx.fill(); ctx.strokeStyle = '#555'; ctx.lineWidth = 2; ctx.stroke(); }
        else { ctx.fillStyle = idx; ctx.fillRect(-S * (i % 3 ? 0.009 : 0.016), -R * 0.86, S * (i % 3 ? 0.018 : 0.032), R * (i % 3 ? 0.12 : 0.17)); }
        ctx.restore();
      }
    }
    if (spec.dial === 'chrono') {
      [[-0.42, 0], [0, 0.42], [0.42, 0]].forEach(([x, y], k) => {
        const cx = x * R, cy = y * R, r = R * 0.2;
        ctx.fillStyle = shade(dial, dark ? 1.9 : 0.9); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
        ctx.strokeStyle = k === 1 ? acc : ink; ctx.lineWidth = S * 0.006; ctx.stroke();
        for (let i = 0; i < 12; i++) { const a = i * TAU / 12; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r * 0.75, cy + Math.sin(a) * r * 0.75); ctx.lineTo(cx + Math.cos(a) * r * 0.92, cy + Math.sin(a) * r * 0.92); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.stroke(); }
        const a = k === 0 ? now.getSeconds() / 60 * TAU : k === 1 ? 0.7 : 2.2;
        ctx.strokeStyle = acc; ctx.lineWidth = S * 0.008; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(a) * r * 0.85, cy - Math.cos(a) * r * 0.85); ctx.stroke();
      });
    }
    if (spec.dial === 'anadigi') {
      ctx.fillStyle = '#0D0F0D'; ctx.fillRect(-R * 0.36, R * 0.26, R * 0.72, R * 0.24); ctx.strokeStyle = shade(c[0], 1.2); ctx.lineWidth = 3; ctx.strokeRect(-R * 0.36, R * 0.26, R * 0.72, R * 0.24);
      ctx.fillStyle = acc; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 ${S * 0.07}px "Courier New", monospace`;
      ctx.fillText(pad2(now.getHours()) + ':' + pad2(now.getMinutes()) + ':' + pad2(now.getSeconds()), 0, R * 0.385);
      ctx.fillStyle = '#0D0F0D'; ctx.fillRect(-R * 0.22, -R * 0.5, R * 0.44, R * 0.17);
      ctx.fillStyle = acc; ctx.font = `700 ${S * 0.05}px "Courier New", monospace`; ctx.fillText(DIAS[now.getDay()] + ' ' + pad2(now.getDate()), 0, -R * 0.415);
    }
    if (spec.dial === 'analog' || spec.dial === 'roman') {
      ctx.fillStyle = '#F7F7F2'; ctx.fillRect(R * 0.52, -R * 0.08, R * 0.2, R * 0.16); ctx.strokeStyle = '#999'; ctx.lineWidth = 2; ctx.strokeRect(R * 0.52, -R * 0.08, R * 0.2, R * 0.16);
      ctx.fillStyle = '#111'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `600 ${S * 0.055}px Montserrat, sans-serif`; ctx.fillText(now.getDate(), R * 0.62, R * 0.005);
    }
    ctx.restore();
  };
}
function diverBezelDrawer(c, c2) {
  return (ctx, S) => {
    const m = S / 2; ctx.save(); ctx.translate(m, m);
    ctx.fillStyle = c[3]; ctx.beginPath(); ctx.arc(0, 0, m, 0, TAU); ctx.fill();
    if (c2) { ctx.fillStyle = c2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, m, -Math.PI / 2, Math.PI / 2, true); ctx.fill(); }
    ctx.fillStyle = '#F2F2F2'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 ${S * 0.06}px Montserrat, sans-serif`;
    for (let i = 0; i < 60; i += 5) {
      const a = i / 60 * TAU - Math.PI / 2, r = m * 0.92;
      if (i === 0) { ctx.beginPath(); ctx.moveTo(0, -m * 0.97); ctx.lineTo(-S * 0.025, -m * 0.87); ctx.lineTo(S * 0.025, -m * 0.87); ctx.fill(); continue; }
      if (i % 10 === 0) { ctx.save(); ctx.translate(Math.cos(a) * r, Math.sin(a) * r); ctx.rotate(a + Math.PI / 2); ctx.fillText(i, 0, 0); ctx.restore(); }
      else { ctx.save(); ctx.rotate(a + Math.PI / 2); ctx.fillRect(-S * 0.006, -m * 0.97, S * 0.012, m * 0.08); ctx.restore(); }
    }
    ctx.restore();
  };
}

/* ---------- Textos de cada pieza ---------- */
const SHAPE_TXT = { round: 'redonda', square: 'cuadrada', tonneau: 'tonneau (en forma de barril)' };
function watchTexts(s) {
  const dial = {
    chrono: 'Esfera de cronógrafo: tres subesferas para medir tiempos (segundos, minutos y horas del cronómetro) sin perder la hora principal. Los índices aplicados le dan profundidad.',
    anadigi: 'Doble pantalla: agujas para la hora analógica y ventanas digitales para segunda hora, alarma y cronómetro. Lo mejor de los dos mundos en una sola esfera.',
    digital: 'Pantalla digital de alto contraste: hora, día y segundos de un vistazo, más funciones de alarma, cronómetro y luz.',
    skull: 'Esfera con calavera en relieve: la pieza protagonista del diseño. El relieve capta la luz de forma distinta según el ángulo, por eso se ve diferente cada vez que mueves la muñeca.',
    skeleton: 'Esfera esqueleto: una corona exterior con los índices y el centro abierto para ver el mecanismo. La fecha se muestra en rodillos giratorios, un detalle de inspiración industrial.',
    roman: 'Esfera con números romanos y ventana de fecha. Un código clásico que nunca pasa de moda.',
    analog: s.pave ? 'Esfera con brillos repartidos por toda la superficie e índices marcados para leer la hora sin perder el brillo.' : 'Esfera limpia con índices aplicados y ventana de fecha. El color profundo cambia de tono según la luz.'
  }[s.dial];
  const bezel = {
    plain: 'Bisel: el anillo que enmarca la esfera. Define la silueta del reloj y protege el borde del cristal.',
    crystal: 'Bisel con brillos: piedras engastadas alrededor del cristal que captan la luz y le dan el toque de joya.',
    diver: 'Bisel de estilo buceo con escala de minutos. Aporta el color protagonista y sirve para marcar un tiempo transcurrido.'
  }[s.bezel];
  const strap = s.strap === 'bracelet'
    ? (s.integrated ? 'Brazalete integrado: los eslabones nacen directamente de la caja, sin asas visibles, para una línea continua y moderna.' : 'Brazalete de eslabones metálicos: cada eslabón se articula para adaptarse a la muñeca. Se puede ajustar quitando eslabones.')
    : 'Correa de silicona: flexible, ligera y cómoda para todo el día. Resiste el sudor y se limpia con un paño húmedo.';
  const t = {
    cristal: ['Cristal', 'Cubre y protege la esfera. Su superficie limpia deja leer la hora desde casi cualquier ángulo.'],
    bisel: ['Bisel', bezel],
    esfera: ['Esfera', dial],
    caja: ['Caja', `Caja ${SHAPE_TXT[s.shape]}: aloja y protege todas las piezas. Su forma define el carácter del reloj en la muñeca.`],
    corona: ['Corona' + (s.pushers ? ' y pulsadores' : ''), s.pushers ? 'La corona ajusta la hora. Los pulsadores laterales activan las funciones (cronómetro, luz, modos). Úsalos con suavidad, sin forzar.' : 'La perilla lateral para ajustar la hora y la fecha. Tira de ella con suavidad, sin forzar.'],
    maquinaria: ['Mecanismo', 'El corazón del reloj. Lo mostramos con engranajes para que veas cómo el movimiento llega a las agujas. En los relojes de cuarzo, una pila y un circuito marcan el ritmo con mucha precisión.'],
    tapa: ['Tapa trasera', 'Cierra la caja y protege el mecanismo del polvo. Para cambiar la pila, llévalo a un relojero: así se conserva el sellado.'],
    correa: [s.strap === 'bracelet' ? 'Brazalete' : 'Correa', strap],
    cierre: [s.strap === 'bracelet' ? 'Cierre' : 'Hebilla', s.strap === 'bracelet' ? 'Cierre desplegable: abre y cierra con un clic y mantiene el reloj seguro en la muñeca.' : 'Hebilla metálica con pasador: ajuste fino en varias posiciones.']
  };
  if (s.dial !== 'digital') t.agujas = ['Agujas', 'Horas, minutos y segundero. En este visor marcan la hora real de tu dispositivo.'];
  if (s.dial === 'skull') t.relieve = ['Calavera en relieve', 'Pieza tridimensional aplicada sobre la esfera. Es el sello de este modelo.'];
  if (s.dial === 'skeleton') t.rodillos = ['Fecha en rodillos', 'Tres rodillos giratorios muestran día y fecha. Un detalle mecánico poco común que se convierte en el centro de la conversación.'];
  if (s.box) t.estuche = ['Estuche', 'Llega en su estuche con cojín interior, listo para regalar.'];
  return t;
}

/* ---------- Construcción de modelos ---------- */
function Model() {
  const root = new THREE.Group(), parts = [], tick = [];
  function part(key, title, text, o) {
    const g = new THREE.Group(); root.add(g);
    const p = Object.assign({ key, title, text, g, off: V(0, 0, 0), rot: V(0, 0, 0), anchor: V(0, 0, 0), normal: V(0, 0, 1), hot: true }, o || {});
    p.anchorObj = new THREE.Object3D(); p.anchorObj.position.copy(p.anchor); g.add(p.anchorObj);
    parts.push(p); return p;
  }
  return { root, parts, tick, part };
}

function buildWatch(spec, c, bezel2) {
  const M = Model(), T = watchTexts(spec), K = spec.shape, D = 0.38, top = D / 2, hh = halfH(K), hw = halfW(K);
  const caseM = () => metalMat(c[0]);
  const sz = spec.size || 1;
  M.root.scale.setScalar(sz);

  // Caja
  const pc = M.part('caja', ...T.caja, { anchor: V(hw * 0.74, -hh * 0.74, 0), normal: V(1, -1, 0.4).normalize() });
  pc.g.add(new THREE.Mesh(extrude(ringShape(K, 1, 0.84), D, 0.035), caseM()));
  const Ly = hh + (K === 'round' ? 0.18 : 0.02);
  if (K === 'round') {
    const lg = new THREE.BoxGeometry(spec.integrated ? 0.9 : 0.2, 0.42, 0.26);
    (spec.integrated ? [[0, 1], [0, -1]] : [[-1, 1], [1, 1], [-1, -1], [1, -1]]).forEach(([sx, sy]) => {
      const m = new THREE.Mesh(lg, caseM()); m.position.set(sx * (spec.sw || 0.7) * 0.42, sy * (0.92), -0.02); m.rotation.x = sy * 0.18; pc.g.add(m);
    });
  }
  // Movimiento (dentro de la caja)
  const pm = M.part('maquinaria', ...T.maquinaria, { anchor: V(-0.28, 0.22, 0.02), normal: V(0, 0, 1), off: V(0, 0, -1.05), opens: true });
  const plate = new THREE.Mesh(planarUV(extrude(outline(K, 0.8), 0.04)), matteMat('#B9BEC5', 0.45)); plate.material.metalness = 0.9; plate.position.z = -0.1; pm.g.add(plate);
  const brass = () => metalMat('#C9A23A', 0.3);
  [[0.3, 18, -0.28, 0.2, 0.3], [0.22, 14, 0.3, 0.28, -0.45], [0.16, 12, 0.12, -0.32, 0.8], [0.1, 9, 0, 0, -1.2]].forEach(([r, n, x, y, sp]) => {
    const gm = new THREE.Mesh(extrude(gearShape(r, n, 0.03), 0.03), brass()); gm.position.set(x, y, -0.04); pm.g.add(gm);
    const j = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), new THREE.MeshStandardMaterial({ color: '#B3261E', roughness: 0.1 })); j.position.set(x, y, -0.02); pm.g.add(j);
    M.tick.push(dt => { gm.rotation.z += sp * dt; });
  });
  const bal = new THREE.Group(); bal.position.set(-0.3, -0.34, -0.03); pm.g.add(bal);
  bal.add(new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.015, 8, 40), brass()));
  for (let k = 0; k < 3; k++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.012, 0.012), brass()); sp.rotation.z = k * Math.PI / 3; bal.add(sp); }
  M.tick.push((dt, t) => { bal.rotation.z = Math.sin(t * 9) * 1.4; });
  const bat = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 40), metalMat('#D6D8DC', 0.2)); bat.rotation.x = Math.PI / 2; bat.position.set(0.36, -0.22, -0.05); pm.g.add(bat);

  // Esfera
  const dz = top - 0.05;
  const pd = M.part('esfera', ...T.esfera, { anchor: V(0.3, -0.42, dz + 0.01), off: V(0, 0, 0.6) });
  const dtex = canvasTex(768, dialDrawer(spec, c));
  const dgeo = K === 'round' ? new THREE.CircleGeometry(0.85, 96) : planarUV(new THREE.ShapeGeometry(outline(K, 0.85), 64));
  const dmat = new THREE.MeshStandardMaterial({ map: dtex, roughness: 0.45, metalness: 0.1, transparent: spec.dial === 'skeleton', alphaTest: spec.dial === 'skeleton' ? 0.5 : 0 });
  const dm = new THREE.Mesh(dgeo, dmat); dm.position.z = dz; pd.g.add(dm);
  let lastSec = -1;
  M.tick.push(() => { const s = new Date().getSeconds(); if (s !== lastSec) { lastSec = s; redraw(dtex); } });
  if (spec.dial === 'skull') {
    const pr = M.part('relieve', ...T.relieve, { anchor: V(0, 0.32, dz + 0.2), off: V(0, 0, 0.75) });
    const sk = metalMat(c[1] === '#D4AF37' ? '#D4AF37' : '#D9DCE0', 0.3);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 32, 24), sk); head.scale.set(1, 1.05, 0.42); head.position.set(0, 0.08, dz); pr.g.add(head);
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.1), sk); jaw.position.set(0, -0.28, dz + 0.04); pr.g.add(jaw);
    const holeM = matteMat('#151515', 0.6);
    [[-0.13, 0.04], [0.13, 0.04]].forEach(([x, y]) => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 14), holeM); e.scale.set(1, 0.9, 0.4); e.position.set(x, y, dz + 0.12); pr.g.add(e); });
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 3), holeM); nose.rotation.z = Math.PI; nose.position.set(0, -0.09, dz + 0.13); pr.g.add(nose);
  }
  if (spec.dial === 'skeleton') {
    const pr = M.part('rodillos', ...T.rodillos, { anchor: V(0.2, -0.3, dz + 0.1), off: V(0, 0, 0.75) });
    const now = new Date(), vals = [DIAS[now.getDay()].slice(0, 2), pad2(now.getDate()), pad2(now.getMonth() + 1)];
    vals.forEach((txt, i) => {
      const tx = canvasTex(256, (ctx, S) => { ctx.fillStyle = '#E9E9E9'; ctx.fillRect(0, 0, S, S); ctx.fillStyle = '#111'; ctx.font = `700 ${S * 0.3}px Montserrat, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, S / 2, S / 2); });
      tx.wrapS = THREE.RepeatWrapping; tx.repeat.set(3, 1);
      const r = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.4 }));
      r.rotation.z = Math.PI / 2; r.rotation.x = Math.PI; r.position.set((i - 1) * 0.24, -0.32, dz - 0.04); pr.g.add(r);
      const fr = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.26, 0.04), metalMat('#5A5A5A')); fr.position.set((i - 1) * 0.24, -0.32, dz - 0.16); pr.g.add(fr);
    });
  }
  // Agujas
  if (spec.dial !== 'digital') {
    const ph = M.part('agujas', ...T.agujas, { anchor: V(0, 0.42, dz + 0.06), off: V(0, 0, 0.95) });
    const hc = hexLum(c[0]) > 0.5 && c[0] === '#D4AF37' ? '#D4AF37' : (hexLum(c[1]) < 0.45 || spec.dial === 'skeleton' ? '#E9E9E9' : '#2A2A2A');
    const mk = (len, w, z, color) => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.BoxGeometry(w, len, 0.012), metalMat(color, 0.25)); m.position.y = len / 2 - 0.08; g.add(m); g.position.z = z; ph.g.add(g); return g; };
    const H = mk(0.46, 0.06, dz + 0.03, hc), Mi = mk(0.7, 0.045, dz + 0.045, hc), S = mk(0.78, 0.014, dz + 0.06, c[3]);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 20), metalMat(hc)); cap.rotation.x = Math.PI / 2; cap.position.z = dz + 0.07; ph.g.add(cap);
    M.tick.push(() => { const n = new Date(), s = n.getSeconds() + n.getMilliseconds() / 1000, mi = n.getMinutes() + s / 60, h = (n.getHours() % 12) + mi / 60; S.rotation.z = -s / 60 * TAU; Mi.rotation.z = -mi / 60 * TAU; H.rotation.z = -h / 12 * TAU; });
  }
  // Bisel
  const pb = M.part('bisel', ...T.bisel, { anchor: V(-hw * 0.66, hh * 0.66, top + 0.08), off: V(0, 0, 1.25) });
  const bz = new THREE.Mesh(extrude(ringShape(K, 1.0, 0.86), 0.07, 0.02), caseM()); bz.position.z = top + 0.035; pb.g.add(bz);
  if (spec.bezel === 'diver') {
    const bt = canvasTex(1024, diverBezelDrawer(c, bezel2));
    const r = new THREE.Mesh(new THREE.RingGeometry(0.87, 0.99, 120), new THREE.MeshStandardMaterial({ map: bt, roughness: 0.25, metalness: 0.2 }));
    r.position.z = top + 0.095; pb.g.add(r);
  }
  if (spec.bezel === 'crystal') {
    const pts = (K === 'round' ? new THREE.Path().absarc(0, 0, 0.93, 0, TAU) : outline(K, 0.93, true)).getSpacedPoints(64);
    const st = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.038, 0), new THREE.MeshPhysicalMaterial({ color: '#FFFFFF', roughness: 0, metalness: 0.2, iridescence: 0.8, iridescenceIOR: 1.6, envMapIntensity: 2.4 }), 64);
    const o = new THREE.Object3D();
    for (let i = 0; i < 64; i++) { o.position.set(pts[i].x, pts[i].y, top + 0.11); o.rotation.set(Math.PI / 2, i * 0.37, 0); o.updateMatrix(); st.setMatrixAt(i, o.matrix); }
    pb.g.add(st);
  }
  // Cristal
  const pcr = M.part('cristal', ...T.cristal, { anchor: V(0.34, 0.4, top + 0.1), off: V(0, 0, 1.6) });
  const glass = new THREE.Mesh(K === 'round' ? new THREE.CylinderGeometry(0.87, 0.87, 0.03, 96) : extrude(outline(K, 0.87), 0.03), new THREE.MeshPhysicalMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.12, roughness: 0, metalness: 0, clearcoat: 1, envMapIntensity: 1.6, depthWrite: false }));
  if (K === 'round') glass.rotation.x = Math.PI / 2;
  glass.position.z = top + 0.08; pcr.g.add(glass);
  // Corona y pulsadores
  const pk = M.part('corona', ...T.corona, { anchor: V(hw + 0.2, 0, 0), normal: V(1, 0, 0), off: V(0.55, 0, 0) });
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.16, 28), caseM()); crown.rotation.z = Math.PI / 2; crown.position.x = hw + 0.08; pk.g.add(crown);
  if (spec.pushers) [-0.55, 0.55].forEach(a => { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.14, 20), metalMat(c[0])); b.rotation.z = Math.PI / 2 - a; b.position.set(Math.cos(a) * (hw + 0.04), Math.sin(a) * (hh + 0.04), 0); pk.g.add(b); });
  // Tapa trasera (se abre como una bisagra)
  const pt = M.part('tapa', ...T.tapa, { anchor: V(hw * 0.4, 0, -0.08), normal: V(0, 0, -1), off: V(0, 0, -1.75), rot: V(0, -0.85, 0), opens: true });
  const backTex = canvasTex(512, (ctx, S) => { ctx.fillStyle = '#AEB3BA'; ctx.fillRect(0, 0, S, S); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 3; [0.44, 0.36, 0.2].forEach(r => { ctx.beginPath(); ctx.arc(S / 2, S / 2, S * r, 0, TAU); ctx.stroke(); }); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.font = `600 ${S * 0.05}px Montserrat, sans-serif`; ctx.textAlign = 'center'; ctx.fillText('ACERO INOXIDABLE', S / 2, S * 0.29); });
  const back = new THREE.Mesh(planarUV(extrude(outline(K, 0.92), 0.05, 0.015)), [new THREE.MeshStandardMaterial({ map: backTex, metalness: 0.9, roughness: 0.35 }), metalMat('#B9BEC5')]);
  back.position.z = -top - 0.03; pt.g.add(back);
  for (let k = 0; k < 4; k++) { const a = k * TAU / 4 + 0.78, sc = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 12), metalMat('#8E949C')); sc.rotation.x = Math.PI / 2; sc.position.set(Math.cos(a) * 0.78 * hw, Math.sin(a) * 0.78 * hh, -top - 0.07); pt.g.add(sc); }

  // Correa / brazalete
  const sw = spec.sw || 0.7;
  const pS = M.part('correa', ...T.correa, { anchor: V(0, Ly + 0.62, -0.7), normal: V(0, 1, 0.3).normalize(), off: V(0, 0, 0) });
  const halves = [1, -1].map(sy => {
    const pts = [V(0, sy * (Ly - 0.06), -0.02), V(0, sy * (Ly + 0.5), -0.36), V(0, sy * (Ly + 0.76), -1.2), V(0, sy * (Ly + 0.42), -2.25), V(0, sy * 0.36, -2.9)];
    return new THREE.CatmullRomCurve3(pts);
  });
  halves.forEach((cv, i) => {
    const g = new THREE.Group(); g.userData.sy = i ? -1 : 1; pS.g.add(g);
    if (spec.strap === 'bracelet') {
      const n = 24, L = cv.getLength() / n, X = V(1, 0, 0), mtx = new THREE.Matrix4();
      const side = metalMat(c[2]), mid = metalMat(c[4] || c[2], 0.2);
      for (let k = 0; k < n; k++) {
        const t = (k + 0.5) / n, p = cv.getPointAt(t), Tg = cv.getTangentAt(t), N = new THREE.Vector3().crossVectors(Tg, X).normalize();
        mtx.makeBasis(X, Tg, N);
        [[-0.34, side, 0.3], [0, mid, 0.36], [0.34, side, 0.3]].forEach(([x, m, w]) => {
          const b = new THREE.Mesh(linkGeo(sw * w, L * 1.02), m);
          b.quaternion.setFromRotationMatrix(mtx); b.position.copy(p).addScaledVector(X, x * sw); g.add(b);
        });
      }
    } else {
      const sm = matteMat(c[2], 0.55); sm.side = THREE.DoubleSide;
      g.add(new THREE.Mesh(ribbon(cv, sw * (K === 'round' ? 0.9 : 1), 0.1, 80), sm));
      if (i === 0) { const kp = new THREE.Mesh(new THREE.BoxGeometry(sw * 0.98, 0.08, 0.16), matteMat(c[2], 0.55)); kp.position.copy(cv.getPointAt(0.82)); kp.lookAt(kp.position.clone().add(cv.getTangentAt(0.82))); g.add(kp); }
    }
  });
  pS.split = true;
  const pq = M.part('cierre', ...T.cierre, { anchor: V(0, 0, -3.02), normal: V(0, 0, -1), off: V(0, 0, -0.55) });
  if (spec.strap === 'bracelet') { const cl = new THREE.Mesh(new THREE.BoxGeometry(sw * 0.98, 0.8, 0.13), metalMat(c[2], 0.18)); cl.position.set(0, 0, -2.95); pq.g.add(cl); }
  else {
    const fr = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.035, 10, 4), metalMat('#C9CCD1', 0.2)); fr.rotation.set(0, Math.PI / 2, Math.PI / 4); fr.scale.set(1, sw * 1.2, 1); fr.position.set(0, 0.1, -2.95); pq.g.add(fr);
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), metalMat('#C9CCD1')); pin.position.set(0, 0, -2.96); pq.g.add(pin);
  }
  // Estuche
  if (spec.box) {
    const pe = M.part('estuche', ...T.estuche, { anchor: V(0.9, -2.1, 0.9), normal: V(0, 0, 1), off: V(0, -1.2, 0) });
    const cream = matteMat('#EFE6D6', 0.6);
    const bx = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.0, 3.9), cream); bx.position.set(0, -2.25, -1.45); pe.g.add(bx);
    const cush = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.3, 3.5), fabricMat('#E8DCC6')); cush.position.set(0, -1.65, -1.45); pe.g.add(cush);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.18, 3.9), cream); lid.position.set(0, -0.2, -3.4); lid.rotation.x = -1.35; pe.g.add(lid);
    const gold = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.06, 0.06), metalMat('#D4AF37')); gold.position.set(0, -1.9, 0.51); pe.g.add(gold);
  }
  M.root.rotation.x = -0.08;
  return M;
}

/* ---------- Gorras y visera ---------- */
const SY = 0.82, SZ = 1.08;
const onDome = (theta, phi, r) => V(-Math.cos(phi) * Math.sin(theta) * r, Math.cos(theta) * r * SY, Math.sin(phi) * Math.sin(theta) * r * SZ);
const domeNormal = (theta, phi) => V(-Math.cos(phi) * Math.sin(theta), Math.cos(theta) / SY, Math.sin(phi) * Math.sin(theta) / SZ).normalize();

function visorGeo(depth, hw, droop) {
  const U = 48, Vn = 14, pos = [], uv = [], idx = [];
  for (let i = 0; i <= U; i++) for (let j = 0; j <= Vn; j++) {
    const u = i / U * 2 - 1, v = j / Vn, x = u * hw;
    const zin = SZ * Math.sqrt(Math.max(0, 1 - x * x)), zout = zin + depth * Math.pow(Math.max(0, 1 - u * u), 0.55);
    const z = zin + (zout - zin) * v, y = -0.02 - droop * v * 0.35 - droop * x * x * (0.25 + v);
    pos.push(x, y, z); uv.push(i / U, v);
  }
  for (let i = 0; i < U; i++) for (let j = 0; j < Vn; j++) { const a = i * (Vn + 1) + j, b = a + Vn + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}
function visorPart(M, c, depth, droop, text) {
  const pv = M.part('visera', 'Visera', text, { anchor: V(0.35, -0.12, SZ + depth * 0.6), normal: V(0, 1, 0.4).normalize(), off: V(0, -0.1, 0.65) });
  const top = new THREE.Mesh(visorGeo(depth, 0.97, droop), new THREE.MeshStandardMaterial({ color: c[1], roughness: 0.9, side: THREE.DoubleSide }));
  const under = new THREE.Mesh(visorGeo(depth, 0.97, droop), new THREE.MeshStandardMaterial({ color: shade(c[1], 0.8), roughness: 0.95, side: THREE.DoubleSide }));
  under.position.y = -0.035; pv.g.add(top, under);
  const stitch = new THREE.MeshStandardMaterial({ color: hexLum(c[1]) < 0.4 ? '#8A8A8A' : shade(c[1], 0.7), roughness: 0.9 });
  [0.3, 0.5, 0.7].forEach(v => {
    const pts = []; for (let i = 0; i <= 40; i++) { const u = (i / 40 * 2 - 1) * 0.92, x = u * 0.97, zin = SZ * Math.sqrt(Math.max(0, 1 - x * x)), zout = zin + depth * Math.pow(Math.max(0, 1 - u * u), 0.55); pts.push(V(x, -0.02 - droop * v * 0.35 - droop * x * x * (0.25 + v) + 0.006, zin + (zout - zin) * v)); }
    pv.g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.005, 4), stitch));
  });
  return pv;
}
function emblemTex(type, color, crown) {
  return canvasTex(512, (ctx, S) => {
    ctx.clearRect(0, 0, S, S); ctx.lineJoin = ctx.lineCap = 'round';
    if (type === 'letter') {
      ctx.font = `700 ${S * 0.82}px "UnifrakturCook", "Old English Text MT", Georgia, serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 10; ctx.strokeStyle = shade(color, 0.6); ctx.strokeText('U', S / 2, S * 0.54); ctx.fillStyle = color; ctx.fillText('U', S / 2, S * 0.54);
    }
    if (type === 'cross') {
      const p = new Path2D('M256 70 L256 450 M150 190 L362 190 M256 450 C 200 470 180 420 230 400');
      ctx.strokeStyle = color; ctx.lineWidth = 64; ctx.stroke(p); ctx.strokeStyle = crown; ctx.lineWidth = 30; ctx.stroke(p);
    }
    if (type === 'horse') {
      const p = new Path2D('M150 430 C 120 330 150 220 230 160 C 250 110 300 80 330 90 L 318 130 C 360 140 400 190 410 240 C 420 270 395 290 370 275 C 350 265 330 250 300 250 C 280 300 300 360 360 430 M230 160 C 200 120 190 100 205 80 C 230 100 245 125 250 145');
      ctx.strokeStyle = color; ctx.lineWidth = 26; ctx.stroke(p); ctx.strokeStyle = crown; ctx.lineWidth = 8; ctx.stroke(p);
    }
  });
}
function buildCap(spec, c, sun) {
  const M = Model();
  const panelTxt = spec.quilt ? 'Copa acolchada con textura en relieve: seis paneles que dan volumen y un acabado delicado al tacto.' : 'Copa de seis paneles estructurados: mantienen la forma y enmarcan el diseño frontal.';
  if (!sun) {
    let bump = null;
    if (spec.quilt) { bump = canvasTex(512, (ctx, S) => { ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, S, S); ctx.strokeStyle = '#303030'; ctx.lineWidth = 6; for (let i = -S; i < S * 2; i += 64) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + S, S); ctx.stroke(); ctx.beginPath(); ctx.moveTo(i, S); ctx.lineTo(i + S, 0); ctx.stroke(); } }); bump.colorSpace = THREE.NoColorSpace; bump.wrapS = bump.wrapT = THREE.RepeatWrapping; bump.repeat.set(2, 2); }
    for (let k = 0; k < 6; k++) {
      const phi0 = Math.PI / 2 + k * Math.PI / 3, phiC = phi0 + Math.PI / 6;
      const front = k === 0 || k === 5;
      const p = M.part('panel' + k, front ? 'Panel frontal' : 'Paneles', panelTxt, { anchor: onDome(0.95, phiC, 1.02), normal: domeNormal(0.95, phiC), off: domeNormal(0.9, phiC).multiplyScalar(0.38), hot: k === 0 });
      const m = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 24, phi0 + 0.006, Math.PI / 3 - 0.012, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: c[0], roughness: 0.92, bumpMap: bump, bumpScale: 2, side: THREE.DoubleSide }));
      m.scale.set(1, SY, SZ); p.g.add(m);
      if (k !== 0 && k !== 5) {
        const ey = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.012, 8, 20), fabricMat(shade(c[0], hexLum(c[0]) < 0.3 ? 1.8 : 0.7)));
        ey.position.copy(onDome(0.52, phiC, 1.005)); ey.lookAt(ey.position.clone().add(domeNormal(0.52, phiC))); p.g.add(ey);
        if (k === 1) { p.eyelet = ey; }
      }
    }
    const pe = M.part('ojales', 'Ojales de ventilación', 'Pequeños orificios bordados en los paneles laterales: dejan circular el aire y mantienen la cabeza fresca.', { anchor: onDome(0.52, Math.PI / 2 + Math.PI / 3 + Math.PI / 6, 1.06), normal: domeNormal(0.52, Math.PI / 2 + Math.PI / 2) });
    pe.follow = 'panel1';
    const pb = M.part('boton', 'Botón superior', 'Une los seis paneles en el punto más alto y remata la costura. Va forrado en la misma tela de la copa.', { anchor: V(0, SY + 0.06, 0), normal: V(0, 1, 0), off: V(0, 0.5, 0) });
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 12), fabricMat(c[0])); btn.scale.y = 0.5; btn.position.y = SY; pb.g.add(btn);
    const pf = M.part('forro', 'Banda interior', 'Banda de confort cosida por dentro: absorbe el sudor y hace que la gorra se sienta suave en la frente.', { anchor: V(0.0, 0.05, SZ * 0.82), normal: V(0, 0, 1), off: V(0, -0.45, 0), opens: true });
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.975, 0.975, 0.14, 64, 1, true), new THREE.MeshStandardMaterial({ color: '#2B2B2B', roughness: 0.95, side: THREE.DoubleSide })); band.scale.z = SZ; band.position.y = 0.06; pf.g.add(band);
    const lining = new THREE.Mesh(new THREE.SphereGeometry(0.985, 36, 18, 0, TAU, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#2B2B2B', roughness: 0.95, side: THREE.BackSide })); lining.scale.set(1, SY, SZ); pf.g.add(lining);
    const pa = M.part('ajuste', 'Ajuste trasero', 'Cierre ajustable en la parte de atrás: adapta la talla en segundos para que quede firme sin apretar.', { anchor: V(0, 0.2, -SZ - 0.06), normal: V(0, 0, -1), off: V(0, 0, -0.5) });
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.1, 0.04), fabricMat(shade(c[0], 0.85))); strap.position.set(0, 0.12, -SZ - 0.01); pa.g.add(strap);
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.05), metalMat('#C9CCD1')); buckle.position.set(0.18, 0.12, -SZ - 0.03); pa.g.add(buckle);
    // Emblema
    const ET = { plate: ['Placa metálica', 'Placa frontal en metal con borde en relieve y parche bordado de fondo. Aporta un acabado premium de estilo campestre.'], pin: ['Pin de corazón', 'Pin de corazón con brillo y lazo fino: el detalle delicado que hace diferente a esta gorra.'], letter: ['Letra gótica bordada', 'Letra en estilo gótico bordada en relieve (3D): las puntadas densas levantan el diseño sobre la tela.'], horse: ['Caballo bordado', 'Silueta de caballo bordada en relieve con contorno en contraste. La firma visual de este modelo.'], shield: ['Escudo metálico', 'Escudo en metal pulido aplicado al frente: minimalista, elegante y con buen peso visual.'], cross: ['Cruz bordada', 'Cruz bordada en contorno con hilo de color sobre la copa. Sobria y con significado.'] }[spec.emblem];
    const th = 1.0, nrm = domeNormal(th, Math.PI / 2), pos = onDome(th, Math.PI / 2, 1.0);
    const pE = M.part('emblema', ET[0], ET[1], { anchor: pos.clone().addScaledVector(nrm, 0.12).add(V(0.36, 0.16, 0)), normal: nrm, off: nrm.clone().multiplyScalar(0.75).add(V(0, 0.1, 0)) });
    if (spec.emblem === 'letter' || spec.emblem === 'cross' || spec.emblem === 'horse') {
      const tex = emblemTex(spec.emblem, c[2], c[0]); tex.repeat.x = -1; tex.offset.x = 1;
      const span = spec.emblem === 'horse' ? 0.52 : 0.5;
      const patch = new THREE.Mesh(new THREE.SphereGeometry(1.012, 24, 24, Math.PI / 2 - span, span * 2, th - span * 0.85, span * 1.7), new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.4, roughness: 0.75, side: THREE.DoubleSide }));
      patch.scale.set(1, SY, SZ); pE.g.add(patch);
    } else {
      const holder = new THREE.Group(); holder.position.copy(pos.clone().addScaledVector(nrm, 0.02)); holder.lookAt(holder.position.clone().add(nrm)); pE.g.add(holder);
      if (spec.emblem === 'plate') {
        const patch = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.52, 0.02), fabricMat('#E8E2D4')); holder.add(patch);
        const pl = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.03), metalMat(c[2], 0.35)); pl.position.z = 0.025; holder.add(pl);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.012, 6, 4), metalMat(shade(c[2], 0.7))); rim.rotation.z = Math.PI / 4; rim.scale.set(0.78, 1, 1); rim.position.z = 0.045; holder.add(rim);
      }
      if (spec.emblem === 'shield') {
        const s = new THREE.Shape(); s.moveTo(-0.13, 0.17); s.lineTo(0.13, 0.17); s.quadraticCurveTo(0.14, -0.05, 0, -0.2); s.quadraticCurveTo(-0.14, -0.05, -0.13, 0.17);
        const sh = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 3 }), metalMat(c[2], 0.18)); holder.add(sh);
      }
      if (spec.emblem === 'pin') {
        const s = new THREE.Shape(); s.moveTo(0, -0.1); s.bezierCurveTo(-0.16, 0.0, -0.1, 0.13, 0, 0.06); s.bezierCurveTo(0.1, 0.13, 0.16, 0.0, 0, -0.1);
        const ht = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 4 }), new THREE.MeshPhysicalMaterial({ color: '#F4EFE8', roughness: 0.15, clearcoat: 1, iridescence: 0.5 })); ht.position.y = 0.08; holder.add(ht);
        const gold = metalMat(c[2], 0.2);
        [[[0, -0.02], [-0.07, -0.14], [-0.04, -0.22]], [[0, -0.02], [0.07, -0.13], [0.03, -0.24]]].forEach(pts => holder.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(([x, y]) => V(x, y, 0.02))), 20, 0.008, 6), gold)));
        const knot = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 8), gold); knot.position.set(0, -0.02, 0.025); holder.add(knot);
      }
    }
    visorPart(M, c, 0.95, 0.22, 'Visera curva con costuras paralelas: protege del sol y le da al rostro una línea más definida. Mantiene su forma día tras día.');
  } else {
    const pb = M.part('banda', 'Banda', 'Banda acolchada que rodea la cabeza sin cubrirla: deja pasar el aire y sujeta la visera con comodidad.', { anchor: V(-0.7, 0.2, 0.55), normal: V(-1, 0, 0.6).normalize(), off: V(0, 0.35, -0.2) });
    const band = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.3, 72, 1, true), new THREE.MeshStandardMaterial({ color: c[0], roughness: 0.92, side: THREE.DoubleSide })); band.scale.z = SZ; band.position.y = 0.13; pb.g.add(band);
    const pc = M.part('cierre', 'Cierre ajustable', 'Cierre de contacto en la parte trasera: ajusta la talla al instante y se abre fácil para guardarla.', { anchor: V(0, 0.15, -SZ - 0.05), normal: V(0, 0, -1), off: V(0, 0, -0.55) });
    const vel = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 0.04), matteMat(c[2], 0.95)); vel.position.set(0, 0.13, -SZ - 0.02); pc.g.add(vel);
    visorPart(M, c, 1.45, 0.14, 'Ala extra ancha: da sombra amplia al rostro en la playa o la piscina. Es ligera y se adapta a cualquier peinado.');
  }
  M.root.rotation.y = -0.5;
  return M;
}

/* ---------- Gafas ---------- */
function clubLens() {
  const s = new THREE.Shape();
  s.moveTo(-0.5, 0.3); s.quadraticCurveTo(0, 0.4, 0.5, 0.33);
  s.quadraticCurveTo(0.56, -0.05, 0.36, -0.32); s.quadraticCurveTo(0, -0.46, -0.38, -0.3);
  s.quadraticCurveTo(-0.55, -0.1, -0.5, 0.3);
  return s;
}
function scaleShape(sh, k, P) { const p = P ? new THREE.Path() : new THREE.Shape(); const pts = sh.getPoints(48).map(v => v.clone().multiplyScalar(k)); p.setFromPoints(pts); return p; }
function buildGlasses(spec, c) {
  const M = Model(), club = spec.style === 'club';
  const lensMat = club
    ? new THREE.MeshPhysicalMaterial({ color: c[2], transparent: true, opacity: 0.82, roughness: 0.05, metalness: 0.1, clearcoat: 1, side: THREE.DoubleSide })
    : new THREE.MeshPhysicalMaterial({ color: c[2], roughness: 0.04, metalness: 0.95, iridescence: 1, iridescenceIOR: 1.8, iridescenceThicknessRange: [200, 900], side: THREE.DoubleSide, envMapIntensity: 1.6 });
  let hingeX, hingeZ;
  if (club) {
    const pl = M.part('lentes', 'Lentes', 'Lentes oscuros con acabado degradado: reducen el brillo del sol y descansan la vista. Su forma club suaviza las facciones.', { anchor: V(-0.75, -0.05, 0.08), off: V(0, 0, 0.75) });
    [-1, 1].forEach(sx => { const m = new THREE.Mesh(new THREE.ShapeGeometry(clubLens(), 48), lensMat); m.scale.x = -sx; m.position.set(sx * 0.62, 0, 0); pl.g.add(m); });
    const pr = M.part('aros', 'Aros', 'Aros finos que abrazan cada lente por debajo: sostienen el cristal sin restarle protagonismo al diseño.', { anchor: V(0.62, -0.42, 0.04), off: V(0, -0.05, 0.4) });
    [-1, 1].forEach(sx => { const rs = scaleShape(clubLens(), 1.07); rs.holes.push(scaleShape(clubLens(), 1.0, true)); const m = new THREE.Mesh(new THREE.ExtrudeGeometry(rs, { depth: 0.04, bevelEnabled: false, curveSegments: 48 }), metalMat(c[1], 0.25)); m.material.side = THREE.DoubleSide; m.scale.x = -sx; m.position.set(sx * 0.62, 0, -0.02); pr.g.add(m); });
    const pbw = M.part('montura', 'Montura superior (ceja)', 'La pieza que define el estilo club: una “ceja” de acetato que enmarca la mirada y aporta carácter retro.', { anchor: V(-0.6, 0.45, 0.1), normal: V(0, 0.5, 1).normalize(), off: V(0, 0.45, 0.3) });
    [-1, 1].forEach(sx => {
      const s = new THREE.Shape(); s.moveTo(-0.58, 0.34); s.quadraticCurveTo(0, 0.52, 0.56, 0.43); s.lineTo(0.6, 0.2); s.quadraticCurveTo(0, 0.3, -0.52, 0.16); s.lineTo(-0.58, 0.34);
      const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 }), new THREE.MeshPhysicalMaterial({ color: c[0], roughness: 0.25, clearcoat: 0.8, side: THREE.DoubleSide }));
      m.scale.x = -sx; m.position.set(sx * 0.62, 0, -0.04); pbw.g.add(m);
    });
    const pbr = M.part('puente', 'Puente', 'Une los dos lentes sobre la nariz. Su curva reparte el peso para que las gafas no se sientan pesadas.', { anchor: V(0, 0.36, 0.06), off: V(0, 0.35, 0.2) });
    pbr.g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(-0.14, 0.22, 0), V(0, 0.3, 0.03), V(0.14, 0.22, 0)]), 20, 0.022, 8), metalMat(c[1])));
    hingeX = 1.16; hingeZ = -0.04;
  } else {
    const pl = M.part('lentes', 'Lente panorámico', 'Una sola pieza envolvente con acabado espejo: amplía el campo de visión, corta el viento y refleja el sol. El color cambia según el ángulo de la luz.', { anchor: V(-0.6, 0.05, 0.06), off: V(0, 0, 0.75) });
    const U = 60, Vn = 12, pos = [], idx = [];
    const yT = u => 0.38 - 0.06 * u * u, yB = u => -0.4 + 0.22 * u * u + 0.3 * Math.exp(-Math.pow(u / 0.17, 2));
    const P3 = (u, y) => { const a = u * 0.78; return V(1.8 * Math.sin(a), y, 1.8 * (Math.cos(a) - 1)); };
    for (let i = 0; i <= U; i++) for (let j = 0; j <= Vn; j++) { const u = i / U * 2 - 1, v = j / Vn, p = P3(u, yB(u) + (yT(u) - yB(u)) * v); pos.push(p.x, p.y, p.z); }
    for (let i = 0; i < U; i++) for (let j = 0; j < Vn; j++) { const a = i * (Vn + 1) + j, b = a + Vn + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    pl.g.add(new THREE.Mesh(g, lensMat));
    const pbw = M.part('montura', 'Montura superior', 'Barra superior ligera que sostiene el lente y le da firmeza sin añadir peso. Perfil deportivo y aerodinámico.', { anchor: V(0.4, 0.44, 0.0), normal: V(0, 1, 0.5).normalize(), off: V(0, 0.45, 0.15) });
    const top = []; for (let i = 0; i <= 40; i++) { const u = i / 40 * 2 - 1; top.push(P3(u * 1.0, yT(u) + 0.02)); }
    pbw.g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(top), 80, 0.045, 10), new THREE.MeshPhysicalMaterial({ color: c[0], roughness: 0.4, clearcoat: 0.5 })));
    const e = P3(1, 0.3); hingeX = e.x + 0.02; hingeZ = e.z;
  }
  const pp = M.part('plaquetas', 'Plaquetas nasales', 'Apoyos suaves sobre la nariz: evitan que las gafas se deslicen y reparten la presión.', { anchor: V(0.16, -0.1, -0.02), normal: V(0, -0.3, 1).normalize(), off: V(0, -0.4, -0.35) });
  [-1, 1].forEach(sx => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 10), new THREE.MeshPhysicalMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.55, roughness: 0.2 })); m.scale.set(0.6, 1.2, 0.5); m.position.set(sx * 0.17, club ? -0.08 : -0.05, club ? -0.1 : -0.06); m.rotation.z = sx * 0.4; pp.g.add(m); });
  const ph = M.part('bisagras', 'Bisagras', 'Unen el frente con las patillas. Permiten plegar las gafas para guardarlas sin forzar la montura.', { anchor: V(hingeX + 0.08, 0.32, hingeZ), normal: V(1, 0, 0.3).normalize(), hot: true });
  const temples = [];
  [-1, 1].forEach(sx => {
    const piv = new THREE.Group(); piv.position.set(sx * hingeX, 0.3, hingeZ); M.root.add(piv);
    const hg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.1), metalMat(club ? c[1] : '#8A8A8A')); hg.position.set(sx * hingeX, 0.3, hingeZ); ph.g.add(hg);
    const tm = new THREE.MeshPhysicalMaterial({ color: c[0], roughness: 0.3, clearcoat: 0.6 });
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 2.3), tm); arm.position.set(0, 0, -1.2); piv.add(arm);
    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.09, 0.55), tm); tip.position.set(0, -0.2, -2.52); tip.rotation.x = 0.7; piv.add(tip);
    temples.push({ piv, sx });
  });
  const pt = M.part('patillas', 'Patillas', 'Patillas rectas con terminal curvo detrás de la oreja: sujetan sin apretar y mantienen las gafas en su sitio.', { anchor: V(-hingeX - 0.05, 0.38, -1.4), normal: V(-1, 0.3, 0).normalize(), off: V(0, 0, 0) });
  temples.forEach(t => { M.root.remove(t.piv); pt.g.add(t.piv); });
  pt.temples = temples;
  M.fold = 0;
  M.tick.push(() => { temples.forEach(t => { t.piv.rotation.y = t.sx * (M.fold * 1.48 - (M.explodeT || 0) * 0.35); t.piv.position.y = 0.3 + t.sx * M.fold * 0.03; t.piv.position.x = t.sx * (hingeX + (M.explodeT || 0) * 0.35); }); });
  M.root.rotation.y = 0.45;
  return M;
}

function build(product, ci) {
  const s = SPECS[product.id]; if (!s) return null;
  const c = s.v[ci] || s.v[0];
  if (s.type === 'reloj') return buildWatch(s, c, s.bezel2 && s.bezel2[ci]);
  if (s.type === 'gorra') return buildCap(s, c, false);
  if (s.type === 'visera') return buildCap(s, c, true);
  return buildGlasses(s, c);
}
export const has3D = id => !!SPECS[id];

/* ---------- Visor (interfaz) ---------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function openViewer(product, colorIndex, onColor) {
  const spec = SPECS[product.id]; if (!spec) return;
  const lastFocus = document.activeElement;
  const isWatch = spec.type === 'reloj', isGlasses = spec.type === 'gafas';
  const el = document.createElement('div');
  el.className = 'v3d'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Vista 3D de ' + product.name);
  el.innerHTML =
    '<div class="v3d-stage"><div class="v3d-hot" aria-label="Piezas del producto"></div><p class="v3d-load">Cargando modelo 3D…</p></div>' +
    '<div class="v3d-top"><div><div class="v3d-eyebrow">Explora en 3D</div><strong>' + product.name + '</strong></div><button class="v3d-x" aria-label="Cerrar vista 3D"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
    '<div class="v3d-bar">' +
      '<button class="v3d-btn v3d-open" aria-pressed="false">' + (isWatch ? 'Abrir el reloj' : 'Ver piezas por separado') + '</button>' +
      (isGlasses ? '<button class="v3d-btn v3d-fold" aria-pressed="false">Plegar patillas</button>' : '') +
      '<button class="v3d-btn v3d-spin" aria-pressed="' + (!reduce) + '">Girar</button>' +
      '<button class="v3d-btn v3d-reset">Centrar</button>' +
      (product.colors.length > 1 ? '<div class="v3d-sw" role="group" aria-label="Color">' + product.colors.map((x, i) => '<button data-i="' + i + '" aria-label="' + x.name + '" style="background:' + x.hex + '"></button>').join('') + '</div>' : '') +
    '</div>' +
    '<aside class="v3d-info"><div class="v3d-detail" aria-live="polite"><div class="v3d-eyebrow">Diseño</div><h3>Toca una pieza</h3><p>Gira el modelo con el dedo o el ratón, acerca con dos dedos o la rueda, y toca los puntos dorados para conocer cada pieza.' + (isWatch ? ' Usa «Abrir el reloj» para ver el mecanismo por dentro.' : '') + '</p></div>' +
    '<ol class="v3d-list"></ol><p class="v3d-note">Modelo 3D ilustrativo para explorar el diseño. Colores y proporciones aproximados: las fotos muestran el producto real.</p></aside>';
  document.body.appendChild(el); document.body.style.overflow = 'hidden';
  const $ = s => el.querySelector(s), stage = $('.v3d-stage'), hotLayer = $('.v3d-hot');
  $('.v3d-x').focus();

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
  catch (e) { $('.v3d-load').textContent = 'Tu dispositivo no permite ver modelos 3D. Puedes ver las fotos del producto.'; $('.v3d-x').onclick = close; return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  stage.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  const key = new THREE.DirectionalLight('#FFFFFF', 1.4); key.position.set(3, 5, 4); scene.add(key);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.autoRotate = !reduce; controls.autoRotateSpeed = 1.2; controls.enablePan = false;
  controls.addEventListener('start', () => { controls.autoRotate = false; $('.v3d-spin').setAttribute('aria-pressed', 'false'); });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: canvasTex(256, (ctx, S) => { const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, S, S); }), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; scene.add(shadow);

  let M = null, ci = colorIndex || 0, explode = 0, exTarget = 0, fold = 0, foldTarget = 0, sel = null, home = null, camAnim = null;
  const clock = new THREE.Clock();

  function dispose(o) { o.traverse(n => { if (n.geometry) n.geometry.dispose(); if (n.material) [].concat(n.material).forEach(m => { if (m.map) m.map.dispose(); if (m.bumpMap) m.bumpMap.dispose(); m.dispose(); }); }); }
  function load(i) {
    ci = i;
    if (M) { scene.remove(M.root); dispose(M.root); }
    M = build(product, i); scene.add(M.root);
    M.parts.forEach(p => { p.base = p.g.position.clone(); p.baseRot = p.g.rotation.clone(); });
    const box = new THREE.Box3().setFromObject(M.root), size = box.getSize(V(0, 0, 0)), ctr = box.getCenter(V(0, 0, 0));
    shadow.position.set(ctr.x, box.min.y - 0.02, ctr.z); shadow.scale.set(size.x * 1.5, size.z * 1.5, 1);
    if (!home) {
      const r = size.length() * 0.5, dist = r / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * 0.95;
      const dir = isWatch ? V(0.25, 0.25, 1) : isGlasses ? V(0.15, 0.3, 1) : V(0.2, 0.45, 1);
      home = { target: ctr.clone(), pos: ctr.clone().add(dir.normalize().multiplyScalar(dist)), dist };
      controls.target.copy(home.target); camera.position.copy(home.pos);
      controls.minDistance = dist * 0.35; controls.maxDistance = dist * 2.2;
    }
    hotLayer.innerHTML = ''; const list = $('.v3d-list'); list.innerHTML = '';
    let n = 0;
    M.parts.filter(p => p.hot).forEach(p => {
      n++; p.n = n;
      const b = document.createElement('button'); b.className = 'v3d-dot'; b.textContent = n; b.setAttribute('aria-label', n + '. ' + p.title);
      b.onclick = () => select(p); hotLayer.appendChild(b); p.dot = b;
      const li = document.createElement('li'); const lb = document.createElement('button'); lb.innerHTML = '<span>' + n + '</span>' + p.title; lb.onclick = () => select(p); li.appendChild(lb); list.appendChild(li); p.item = lb;
    });
    $$sw().forEach((b, j) => b.setAttribute('aria-pressed', j === i ? 'true' : 'false'));
    if (sel) { const again = M.parts.find(p => p.key === sel.key); sel = null; if (again) select(again, true); }
    $('.v3d-load').hidden = true;
  }
  const $$sw = () => Array.prototype.slice.call(el.querySelectorAll('.v3d-sw button'));

  function highlight(p, on) {
    p.g.traverse(n => { if (n.material) [].concat(n.material).forEach(m => { if ('emissive' in m) { m.emissive.set(on ? '#3A2C08' : '#000000'); } }); });
  }
  function select(p, quiet) {
    if (sel) { highlight(sel, false); sel.dot && sel.dot.classList.remove('on'); sel.item && sel.item.removeAttribute('aria-current'); }
    sel = p; highlight(p, true); p.dot && p.dot.classList.add('on'); p.item && p.item.setAttribute('aria-current', 'true');
    $('.v3d-detail').innerHTML = '<div class="v3d-eyebrow">Pieza ' + (p.n || '') + '</div><h3>' + p.title + '</h3><p>' + p.text + '</p>';
    if (p.opens && exTarget === 0 && !quiet) setOpen(true);
  }
  function setOpen(on) {
    exTarget = on ? 1 : 0; const b = $('.v3d-open'); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.textContent = on ? (isWatch ? 'Cerrar el reloj' : 'Unir las piezas') : (isWatch ? 'Abrir el reloj' : 'Ver piezas por separado');
    if (on && isWatch) { camAnim = { from: camera.position.clone(), to: home.target.clone().add(V(1, 0.35, 0.55).normalize().multiplyScalar(home.dist * 1.25)), t: 0 }; }
    if (!on && isWatch) camAnim = { from: camera.position.clone(), to: home.pos.clone(), t: 0 };
    if (reduce) { explode = exTarget; if (camAnim) { camera.position.copy(camAnim.to); camAnim = null; } }
  }
  $('.v3d-open').onclick = () => setOpen(exTarget === 0);
  if (isGlasses) $('.v3d-fold').onclick = e => { foldTarget = foldTarget ? 0 : 1; e.currentTarget.setAttribute('aria-pressed', foldTarget ? 'true' : 'false'); e.currentTarget.textContent = foldTarget ? 'Desplegar patillas' : 'Plegar patillas'; if (reduce) fold = foldTarget; };
  $('.v3d-spin').onclick = e => { controls.autoRotate = !controls.autoRotate; e.currentTarget.setAttribute('aria-pressed', String(controls.autoRotate)); };
  $('.v3d-reset').onclick = () => { camAnim = { from: camera.position.clone(), to: (exTarget && isWatch) ? home.target.clone().add(V(1, 0.35, 0.55).normalize().multiplyScalar(home.dist * 1.25)) : home.pos.clone(), t: reduce ? 1 : 0 }; controls.target.copy(home.target); };
  $$sw().forEach(b => b.onclick = () => { const i = +b.getAttribute('data-i'); load(i); onColor && onColor(i); });

  function resize() { const w = stage.clientWidth, h = stage.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  const ro = new ResizeObserver(resize); ro.observe(stage);

  const tmp = V(0, 0, 0), nrm = V(0, 0, 0), toCam = V(0, 0, 0);
  let raf, t = 0;
  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05); t += dt;
    explode += (exTarget - explode) * Math.min(1, dt * 4.5); fold += (foldTarget - fold) * Math.min(1, dt * 5);
    const e = ease(Math.min(1, Math.max(0, explode)));
    M.explodeT = e; M.fold = fold;
    M.parts.forEach(p => {
      p.g.position.copy(p.base).addScaledVector(p.off, e);
      p.g.rotation.set(p.baseRot.x + p.rot.x * e, p.baseRot.y + p.rot.y * e, p.baseRot.z + p.rot.z * e);
      if (p.split) p.g.children.forEach(h => { if (h.userData.sy) h.position.y = h.userData.sy * 0.85 * e; });
      if (p.key === 'tapa') p.g.position.x = p.base.x - 0.9 * e;
    });
    M.tick.forEach(f => f(dt, t));
    if (camAnim) { camAnim.t = Math.min(1, camAnim.t + dt / 0.9); camera.position.lerpVectors(camAnim.from, camAnim.to, ease(camAnim.t)); if (camAnim.t >= 1) camAnim = null; }
    controls.update();
    renderer.render(scene, camera);
    const w = stage.clientWidth, h = stage.clientHeight;
    camera.getWorldPosition(toCam);
    M.parts.forEach(p => {
      if (!p.dot) return;
      const src = p.follow ? M.parts.find(q => q.key === p.follow) : null;
      (src && src.eyelet ? src.eyelet : p.anchorObj).getWorldPosition(tmp);
      nrm.copy(p.normal).transformDirection(M.root.matrixWorld);
      const facing = nrm.dot(toCam.clone().sub(tmp).normalize());
      tmp.project(camera);
      p.dot.style.transform = 'translate(' + ((tmp.x + 1) / 2 * w) + 'px,' + ((1 - tmp.y) / 2 * h) + 'px)';
      p.dot.classList.toggle('back', facing < -0.05);
    });
  }
  function onKey(e) { if (e.key === 'Escape') close(); }
  function close() {
    cancelAnimationFrame(raf); ro.disconnect(); document.removeEventListener('keydown', onKey);
    if (M) dispose(M.root); dispose(shadow); controls.dispose(); pmrem.dispose(); renderer.dispose();
    el.remove(); document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('.v3d-x').onclick = close;
  document.addEventListener('keydown', onKey);
  resize(); load(ci); frame();
  if (document.fonts && spec.emblem === 'letter') document.fonts.load('700 40px "UnifrakturCook"').then(() => load(ci)).catch(() => {});
}
