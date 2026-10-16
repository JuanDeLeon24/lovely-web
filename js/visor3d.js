/* Lovely · Visor 3D de relojes.
   Modelos PBR generados por código en milímetros (Three.js r160 en js/vendor).
   Con glb: true en SPECS se carga assets/models/<id>.glb (modelo profesional) en lugar del generado.
   SPECS: medidas aproximadas por modelo y colores por variante, en el mismo orden que js/data.js.
   v: [caja, esfera, correa, acento, centro del brazalete?] */
import * as THREE from './vendor/three.module.min.js';
import { OrbitControls } from './vendor/OrbitControls.js';

const SPECS = {
  'reloj-t5-square': { shape: 'square', W: 44, H: 47, T: 14, LW: 24, bezel: 'screws', screws: 4, dial: 'chrono', indices: 'baton', hands: 'sword', strap: 'rubber', pushers: 2, pusherAccent: true,
    v: [['#2B2B2B', '#151515', '#141414', '#C8323A'], ['#2B2B2B', '#151515', '#E2632B', '#E2632B'], ['#2B2B2B', '#151515', '#B3261E', '#B3261E'], ['#2B2B2B', '#151515', '#9BC53D', '#9BC53D'], ['#C48A72', '#151515', '#1F4E5A', '#C48A72']] },
  'reloj-joefox-sport': { shape: 'round', D: 50, T: 16, LW: 24, caseMat: 'resin', bezel: 'screws', screws: 4, dial: 'anadigi', indices: 'baton', hands: 'sword', strap: 'rubber', pushers: 4,
    v: [['#1C1C1C', '#111111', '#1C1C1C', '#C6E03A'], ['#1F3A73', '#111111', '#1F3A73', '#E2632B']] },
  'reloj-joefox-steel': { shape: 'round', D: 47, T: 14, LW: 24, bezel: 'print', ring: 'hours', dial: 'anadigi', indices: 'baton', hands: 'sword', strap: 'oyster', pushers: 4,
    v: [['#C9CCD1', '#151515', '#C9CCD1', '#D4AF37', '#D4AF37']], bezelColor: ['#D4AF37'] },
  'reloj-curren-elegance': { shape: 'round', D: 34, T: 9, LW: 16, bezel: 'plain', dial: 'analog', numerals: 'roman', indices: 'none', hands: 'dauphine', strap: 'three', sunray: true,
    v: [['#D4AF37', '#F4EFE6', '#D4AF37', '#D4AF37'], ['#C9CCD1', '#E8B9B5', '#C9CCD1', '#B76E79']] },
  'reloj-curren-crystal': { shape: 'round', D: 32, T: 9, LW: 14, bezel: 'gems', rows: 1, dial: 'analog', mop: true, indices: 'gem', hands: 'dauphine', strap: 'three',
    v: [['#C9CCD1', '#EFEAE4', '#C9CCD1', '#C48A72', '#C48A72'], ['#C48A72', '#1C2238', '#C48A72', '#C48A72'], ['#C9CCD1', '#EEF1F4', '#C9CCD1', '#9FA6B2'], ['#C48A72', '#2C7FA8', '#C48A72', '#C48A72']] },
  'reloj-skmei-skull': { shape: 'round', D: 42, T: 13, LW: 20, bezel: 'diver', dial: 'skull', indices: 'dot', hands: 'sword', strap: 'oyster', guards: true,
    v: [['#C9CCD1', '#C9CCD1', '#C9CCD1', '#B3261E'], ['#C9CCD1', '#C9CCD1', '#C9CCD1', '#1E6B3A'], ['#C9CCD1', '#D4AF37', '#C9CCD1', '#1F3A73', '#D4AF37'], ['#C9CCD1', '#C9CCD1', '#C9CCD1', '#1F4FA0']],
    bezel2: [null, null, '#B3261E', null] },
  'reloj-naviforce-dual': { shape: 'round', D: 46, T: 14, LW: 24, bezel: 'print', ring: 'minutes', dial: 'anadigi', indices: 'baton', hands: 'sword', strap: 'oyster', pushers: 4, guards: true,
    v: [['#1E1E1E', '#151515', '#1E1E1E', '#C48A72'], ['#C9CCD1', '#1F3A73', '#C9CCD1', '#5B8BD9'], ['#C9CCD1', '#151515', '#C9CCD1', '#E2632B'], ['#1E1E1E', '#151515', '#1E1E1E', '#9A9A9A']] },
  'reloj-naviforce-7105': { shape: 'tonneau', W: 44, H: 52, T: 14, LW: 26, bezel: 'screws', screws: 8, dial: 'chrono', numerals: 'twelve', indices: 'baton', hands: 'sword', strap: 'rubber', ribs: true, pushers: 2, date: 4.5,
    v: [['#1E1E1E', '#151515', '#151515', '#C48A72'], ['#D4AF37', '#151515', '#3A2A1E', '#D4AF37'], ['#1E1E1E', '#151515', '#151515', '#C9CCD1'], ['#1E1E1E', '#151515', '#151515', '#D4AF37'], ['#1F3A73', '#1F3A73', '#1F3A73', '#C9CCD1']] },
  'reloj-naviforce-sport': { shape: 'round', D: 47, T: 14, LW: 24, bezel: 'plain', dial: 'anadigi', numerals: 'arabic', indices: 'none', hands: 'sword', strapBy: ['leather', 'rubber', 'rubber', 'rubber'], pushers: 4,
    v: [['#1E1E1E', '#151515', '#5A3A22', '#E8A33A'], ['#2B2B2B', '#151515', '#151515', '#C9CCD1'], ['#1F3A73', '#1F3A73', '#1F3A73', '#E8C547'], ['#C48A72', '#151515', '#151515', '#C48A72']] },
  'reloj-cason-classic': { shape: 'round', D: 40, T: 10.5, LW: 26, integrated: true, bezel: 'plain', dial: 'analog', sunray: true, indices: 'baton', hands: 'baton', strap: 'hlink', day: true, date: 3,
    v: [['#C9CCD1', '#1A1A1A', '#C9CCD1', '#E8E8E8'], ['#C9CCD1', '#8E1B1B', '#C9CCD1', '#E8E8E8'], ['#C9CCD1', '#9CC9E0', '#C9CCD1', '#E8E8E8'], ['#C9CCD1', '#4B2C83', '#C9CCD1', '#E8E8E8'], ['#C9CCD1', '#1E5B3A', '#C9CCD1', '#E8E8E8'], ['#C9CCD1', '#CFC4AE', '#C9CCD1', '#E8E8E8']] },
  'reloj-iced-crystal': { shape: 'round', D: 40, T: 12, LW: 22, bezel: 'gems', rows: 2, dial: 'analog', pave: true, indices: 'baton', hands: 'baton', handsAccent: true, strap: 'rubber', day: true, date: 3,
    v: [['#E9E9E9', '#EDEDED', '#F5F5F5', '#2C5FD0'], ['#1E1E1E', '#C9B48A', '#151515', '#D4AF37'], ['#D4AF37', '#C9B48A', '#151515', '#D4AF37'], ['#D4AF37', '#C9B48A', '#F5F5F5', '#D4AF37'], ['#C48A72', '#C9B48A', '#F5F5F5', '#C48A72']] },
  'reloj-bariu-estuche': { shape: 'round', D: 28, T: 9, LW: 13, bezel: 'gems', rows: 1, dial: 'analog', sunray: true, indices: 'baton', hands: 'baton', strap: 'jubilee', date: 3, box: true,
    v: [['#C9CCD1', '#E9ECEF', '#C9CCD1', '#C9CCD1'], ['#D4AF37', '#1A1A1A', '#D4AF37', '#D4AF37']] },
  'reloj-skmei-chrono': { shape: 'round', D: 44, T: 13, LW: 22, bezel: 'print', ring: 'tachy', dial: 'chrono', indices: 'baton', hands: 'sword', strap: 'oyster', pushers: 2, date: 4.5,
    v: [['#1E1E1E', '#1F3A73', '#1E1E1E', '#E2632B'], ['#D4AF37', '#151515', '#C9CCD1', '#C48A72', '#D4AF37'], ['#C9CCD1', '#F2F2F2', '#C9CCD1', '#B3261E'], ['#C9CCD1', '#C9CCD1', '#C9CCD1', '#B3261E']] },
  'reloj-skmei-skeleton': { shape: 'round', D: 46, T: 15, LW: 24, bezel: 'screws', screws: 4, dial: 'skeleton', indices: 'baton', hands: 'sword', strap: 'oyster',
    v: [['#C9CCD1', '#BFC3C8', '#C9CCD1', '#B3261E']] },
  'reloj-diray-digital': { shape: 'round', D: 46, T: 15, LW: 24, caseMat: 'resin', bezel: 'plain', dial: 'digital', indices: 'none', strap: 'rubber', pushers: 4,
    v: [['#2E3F5C', '#0F1012', '#2E3F5C', '#7FA7FF'], ['#B79A5A', '#0F1012', '#151515', '#E8C547'], ['#B3261E', '#0F1012', '#151515', '#FF6A5A'], ['#1E1E1E', '#0F1012', '#151515', '#E8A33A'], ['#C48A72', '#0F1012', '#151515', '#E8A33A']] }
};
export const has3D = id => !!SPECS[id];

/* ---------- Utilidades ---------- */
const TAU = Math.PI * 2;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const hexLum = h => { const n = parseInt(h.slice(1), 16); return (((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114) / 255; };
const shade = (h, k) => { const c = new THREE.Color(h); c.multiplyScalar(k); return '#' + c.getHexString(); };
const pad2 = n => String(n).padStart(2, '0');
const DIAS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

function canvas(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h || w;
  if (draw) draw(c.getContext('2d'), w, h || w);
  return c;
}
function tex(c, color, rep) {
  const t = new THREE.CanvasTexture(c); t.colorSpace = color === false ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
  return t;
}
/* Polilínea con esquinas redondeadas (perfiles de torno) */
function fillet(pts, rad, n) {
  n = n || 6; const out = [];
  for (let i = 0; i < pts.length; i++) {
    const p = new THREE.Vector2(...pts[i]);
    if (i === 0 || i === pts.length - 1) { out.push(p); continue; }
    const a = new THREE.Vector2(...pts[i - 1]), b = new THREE.Vector2(...pts[i + 1]);
    const r = Math.min(rad, a.distanceTo(p) / 2.01, b.distanceTo(p) / 2.01);
    const s = p.clone().add(a.clone().sub(p).setLength(r)), e = p.clone().add(b.clone().sub(p).setLength(r));
    for (let k = 0; k <= n; k++) { const t = k / n, u = 1 - t; out.push(new THREE.Vector2(u * u * s.x + 2 * u * t * p.x + t * t * e.x, u * u * s.y + 2 * u * t * p.y + t * t * e.y)); }
  }
  return out;
}
/* Torno alrededor del eje Z (la cara del reloj mira a +Z) */
function lathe(pts, rad, segs) {
  const g = new THREE.LatheGeometry(fillet(pts, rad == null ? 0.4 : rad), segs || 192);
  g.rotateX(Math.PI / 2); return g;
}
/* UV planares de -R..R para pintar marcas sobre superficies giradas */
function planarUV(g, R, RY) {
  const p = g.attributes.position, uv = new Float32Array(p.count * 2), ry = RY || R;
  for (let i = 0; i < p.count; i++) { uv[i * 2] = (p.getX(i) / R + 1) / 2; uv[i * 2 + 1] = (p.getY(i) / ry + 1) / 2; }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return g;
}
function roundRect(p, w, h, r) {
  const x = -w / 2, y = -h / 2; r = Math.min(r, w / 2, h / 2);
  p.moveTo(x + r, y); p.lineTo(x + w - r, y); p.quadraticCurveTo(x + w, y, x + w, y + r);
  p.lineTo(x + w, y + h - r); p.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  p.lineTo(x + r, y + h); p.quadraticCurveTo(x, y + h, x, y + h - r);
  p.lineTo(x, y + r); p.quadraticCurveTo(x, y, x + r, y);
  return p;
}
function outline(kind, w, h, asPath) {
  const p = asPath ? new THREE.Path() : new THREE.Shape();
  if (kind === 'round') { p.absarc(0, 0, w / 2, 0, TAU, false); return p; }
  if (kind === 'square') return roundRect(p, w, h, w * 0.2);
  const a = w * 0.36, A = w / 2, b = h / 2;
  p.moveTo(-a, b); p.lineTo(a, b);
  p.quadraticCurveTo(A, b, A * 0.98, b * 0.55); p.quadraticCurveTo(A * 1.08, 0, A * 0.98, -b * 0.55);
  p.quadraticCurveTo(A, -b, a, -b); p.lineTo(-a, -b);
  p.quadraticCurveTo(-A, -b, -A * 0.98, -b * 0.55); p.quadraticCurveTo(-A * 1.08, 0, -A * 0.98, b * 0.55);
  p.quadraticCurveTo(-A, b, -a, b);
  return p;
}
function extrudeC(shape, depth, bevel, segs) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: segs || 5, curveSegments: 96 });
  g.translate(0, 0, -depth / 2); return g;
}

/* ---------- Texturas procedurales (cacheadas) ---------- */
const CACHE = {};
function brushedMap() {
  return CACHE.brushed || (CACHE.brushed = tex(canvas(1024, 256, (x, W, H) => {
    x.fillStyle = 'rgb(128,128,128)'; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 2600; i++) { const v = 100 + Math.random() * 70 | 0; x.fillStyle = `rgba(${v},${v},${v},.55)`; x.fillRect(Math.random() * W, Math.random() * H, 30 + Math.random() * 400, 1); }
  }), false, [3, 6]));
}
function grainMap() {
  return CACHE.grain || (CACHE.grain = tex(canvas(512, 512, (x, W) => {
    const d = x.createImageData(W, W);
    for (let i = 0; i < d.data.length; i += 4) { const v = 110 + Math.random() * 40; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    x.putImageData(d, 0, 0);
  }), false, [4, 4]));
}
function ribMap() {
  return CACHE.rib || (CACHE.rib = tex(canvas(64, 256, (x, W, H) => {
    for (let y = 0; y < H; y++) { const v = 128 + 110 * Math.sin(y / H * TAU * 4) | 0; x.fillStyle = `rgb(${v},${v},${v})`; x.fillRect(0, y, W, 1); }
  }), false, [1, 14]));
}
function sunrayAniso() {
  return CACHE.sun || (CACHE.sun = tex(canvas(512, 512, (x, W) => {
    const d = x.createImageData(W, W), c = W / 2;
    for (let j = 0; j < W; j++) for (let i = 0; i < W; i++) {
      let dx = i - c, dy = -(j - c); const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
      const k = (j * W + i) * 4; d.data[k] = (dx + 1) * 127.5; d.data[k + 1] = (dy + 1) * 127.5; d.data[k + 2] = 255; d.data[k + 3] = 255;
    }
    x.putImageData(d, 0, 0);
  }), false));
}
function azurageMap() {
  return CACHE.azu || (CACHE.azu = tex(canvas(512, 512, (x, W) => {
    x.fillStyle = '#808080'; x.fillRect(0, 0, W, W);
    for (let r = 2; r < W / 2; r += 5) { x.strokeStyle = r % 10 < 5 ? '#9a9a9a' : '#666'; x.lineWidth = 2.5; x.beginPath(); x.arc(W / 2, W / 2, r, 0, TAU); x.stroke(); }
  }), false));
}

/* ---------- Materiales PBR ---------- */
const REAL = { '#D4AF37': '#E7C36E', '#C48A72': '#E2AE95', '#C9CCD1': '#C8CBCF', '#BFC3C8': '#C2C5C9', '#E9E9E9': '#DADDE0' };
function metal(hex, finish) {
  const col = REAL[hex] || hex, dark = hexLum(hex) < 0.3, brushed = finish === 'brushed';
  const m = new THREE.MeshPhysicalMaterial({ color: col, metalness: 1, roughness: brushed ? 0.42 : (dark ? 0.24 : 0.12) });
  if (brushed) { m.roughnessMap = brushedMap(); m.anisotropy = 0.8; }
  if (dark && !brushed) { m.clearcoat = 0.4; m.clearcoatRoughness = 0.15; }
  return m;
}
const resin = hex => new THREE.MeshPhysicalMaterial({ color: hex, roughness: 0.5, metalness: 0, clearcoat: 0.25, clearcoatRoughness: 0.4, roughnessMap: grainMap() });
const rubber = (hex, ribs) => new THREE.MeshPhysicalMaterial({ color: hex, roughness: 0.62, metalness: 0, sheen: 0.4, sheenRoughness: 0.6, sheenColor: new THREE.Color('#888888'), bumpMap: ribs ? ribMap() : grainMap(), bumpScale: ribs ? 0.6 : 0.15, side: THREE.DoubleSide });
const leather = hex => new THREE.MeshPhysicalMaterial({ color: hex, roughness: 0.72, metalness: 0, sheen: 0.5, sheenColor: new THREE.Color(shade(hex, 1.6)), bumpMap: grainMap(), bumpScale: 0.45, side: THREE.DoubleSide });
const lume = () => new THREE.MeshStandardMaterial({ color: '#EEF0E4', roughness: 0.55, emissive: '#C8F0C8', emissiveIntensity: 0.06 });
const sapphire = () => new THREE.MeshPhysicalMaterial({ color: '#F4F8FF', metalness: 0, roughness: 0, ior: 1.77, specularIntensity: 0.55, envMapIntensity: 0.9, transparent: true, opacity: 0.1, depthWrite: false });
const ceramic = hex => new THREE.MeshPhysicalMaterial({ color: hex, metalness: 0, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.04 });
const gemMat = () => new THREE.MeshPhysicalMaterial({ color: '#2A2C30', metalness: 0, roughness: 0, ior: 2.42, specularIntensity: 1, specularColor: new THREE.Color('#FFFFFF'), iridescence: 0.45, iridescenceIOR: 1.6, envMapIntensity: 4, flatShading: true });
/* Gema talla brillante (corona + pabellón, 16 facetas) */
function gemGeo(d) {
  const r = d / 2, g = new THREE.LatheGeometry([[0, -0.86 * r], [r, 0], [r, 0.06 * r], [0.55 * r, 0.32 * r], [0, 0.32 * r]].map(([a, b]) => new THREE.Vector2(a, b)), 16);
  g.rotateX(Math.PI / 2); return g;
}

/* ---------- Textos de cada pieza ---------- */
const SHAPE_TXT = { round: 'redonda', square: 'cuadrada', tonneau: 'tonneau (en forma de barril)' };
function texts(s, strap) {
  const dial = {
    chrono: 'Esfera de cronógrafo: tres subesferas con acabado de círculos concéntricos para medir tiempos sin perder la hora principal. Índices aplicados en relieve.',
    anadigi: 'Doble pantalla: agujas para la hora analógica y pantallas digitales para segunda hora, alarma y cronómetro.',
    digital: 'Pantalla digital de alto contraste: hora, día y segundos de un vistazo, con funciones de alarma, cronómetro y luz.',
    skull: 'Esfera con calavera esculpida en relieve: la pieza protagonista. El volumen capta la luz distinto en cada ángulo.',
    skeleton: 'Esfera esqueleto: un anillo exterior con los índices y el centro abierto para ver el mecanismo. La fecha se lee en rodillos giratorios.',
    analog: s.numerals === 'roman' ? 'Esfera con números romanos y acabado rayos de sol que cambia de tono con la luz.' : s.pave ? 'Esfera cubierta de pequeños brillos e índices marcados para leer la hora sin perder el brillo.' : s.mop ? 'Esfera con efecto nácar e índices de cristal: un brillo suave que cambia de color según el ángulo.' : 'Esfera con acabado rayos de sol, índices aplicados y ' + (s.day ? 'ventanas de día y fecha.' : 'ventana de fecha.')
  }[s.dial];
  const bezel = {
    plain: 'Bisel pulido: el anillo que enmarca la esfera, con el borde biselado para atrapar la luz.',
    gems: 'Bisel con piedras talla brillante engastadas alrededor del cristal: el toque de joya del reloj.',
    diver: 'Bisel giratorio de estilo buceo con inserto brillante y escala de minutos, más el canto estriado para girarlo con firmeza.',
    print: { tachy: 'Bisel con escala taquimétrica: junto al cronógrafo permite calcular velocidades sobre una distancia fija.', hours: 'Bisel con escala de 24 horas para leer una segunda zona horaria.', minutes: 'Bisel con escala de minutos grabada.' }[s.ring],
    screws: 'Bisel con tornillos a la vista: un detalle de inspiración industrial que da carácter técnico.'
  }[s.bezel];
  const st = {
    oyster: ['Brazalete', 'Brazalete de eslabones de tres piezas: laterales cepillados y centro pulido. Cada eslabón se articula para adaptarse a la muñeca.'],
    jubilee: ['Brazalete', 'Brazalete de cinco piezas con eslabones centrales pequeños y pulidos: más flexible y con un brillo más fino.'],
    three: ['Brazalete', 'Brazalete fino de eslabones articulados, pensado para muñecas delgadas.'],
    hlink: ['Brazalete integrado', 'Brazalete integrado: los eslabones nacen directamente de la caja, sin asas visibles, para una línea continua.'],
    rubber: ['Correa', 'Correa de caucho flexible y ligera, cómoda todo el día y fácil de limpiar.'],
    leather: ['Correa de cuero', 'Correa de cuero con costura a los lados: se suaviza y se adapta a la muñeca con el uso.']
  }[strap];
  const buckle = strap === 'rubber' || strap === 'leather';
  const t = {
    caja: ['Caja', `Caja ${SHAPE_TXT[s.shape]} de unos ${s.D || s.W} mm${s.integrated ? ' con brazalete integrado' : ''}, con flancos cepillados y biseles pulidos. Aloja y protege todas las piezas.`],
    bisel: ['Bisel', bezel],
    esfera: ['Esfera', dial],
    cristal: ['Cristal', 'Cubre y protege la esfera. Su superficie limpia deja leer la hora desde casi cualquier ángulo.'],
    corona: ['Corona' + (s.pushers ? ' y pulsadores' : ''), (s.pushers ? 'La corona estriada ajusta la hora; los pulsadores activan funciones como cronómetro o luz.' : 'Corona estriada para ajustar hora y fecha. Tira de ella con suavidad, sin forzar.') + (s.guards ? ' Las protecciones laterales la resguardan de golpes.' : '')],
    maquinaria: ['Mecanismo', 'El corazón del reloj, mostrado con engranajes para que veas cómo el movimiento llega a las agujas. En los relojes de cuarzo, una pila y un circuito marcan el ritmo.'],
    tapa: ['Tapa trasera', 'Cierra la caja y protege el mecanismo. Para cambiar la pila, llévalo a un relojero y así se conserva el sellado.'],
    correa: st,
    cierre: [buckle ? 'Hebilla' : 'Cierre', buckle ? 'Hebilla pulida con pasador: ajuste fino en varias posiciones.' : 'Cierre desplegable: abre y cierra con un clic y mantiene el reloj seguro en la muñeca.']
  };
  if (s.dial !== 'digital') t.agujas = ['Agujas', 'Agujas pulidas con bisel' + (s.hands === 'sword' ? ' y material luminiscente' : '') + '. En este visor marcan la hora real de tu dispositivo.'];
  if (s.dial === 'skull') t.relieve = ['Calavera en relieve', 'Escultura metálica aplicada sobre la esfera: el sello de este modelo.'];
  if (s.dial === 'skeleton') t.rodillos = ['Fecha en rodillos', 'Tres rodillos giratorios muestran día, fecha y mes. Un detalle mecánico poco común.'];
  if (s.box) t.estuche = ['Estuche', 'Llega en su estuche con cojín interior, listo para regalar.'];
  return t;
}

/* ---------- Modelo ---------- */
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
const add = (g, geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); g.add(m); return m; };

/* Asa con perfil curvo, extruida a lo ancho (eje X) */
function lugGeo(R, L, T, thick, w) {
  const s = new THREE.Shape(), zt = T / 2 - 1.6;
  s.moveTo(R - 3, zt); s.quadraticCurveTo(R + L * 0.45, zt - 0.2, R + L, zt - 2.6);
  s.quadraticCurveTo(R + L + 0.4, zt - 2.6 - thick * 0.5, R + L - 0.2, zt - 2.6 - thick);
  s.quadraticCurveTo(R + L * 0.4, -T / 2 + 1.6, R - 3, -T / 2 + 1.2); s.lineTo(R - 3, zt);
  const g = new THREE.ExtrudeGeometry(s, { depth: w, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.5, bevelSegments: 5, curveSegments: 40 });
  g.translate(0, 0, -w / 2);
  g.applyMatrix4(new THREE.Matrix4().makeBasis(V(0, 1, 0), V(0, 0, 1), V(1, 0, 0)));
  return g;
}
/* Corona estriada (eje X) */
function crownGeo(r, len, flutes) {
  const g = lathe([[0, 0], [r * 0.55, 0], [r * 0.55, 0.8], [r, 1.1], [r, len - 0.5], [r * 0.8, len], [0, len]], 0.3, flutes * 4);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), rr = Math.hypot(x, y);
    if (rr > r * 0.9 && z > 1.3 && z < len - 0.6) { const a = Math.atan2(y, x), k = 1 - 0.07 * Math.pow(0.5 + 0.5 * Math.cos(a * flutes), 2); p.setXY(i, x * k, y * k); }
  }
  g.computeVertexNormals(); g.rotateY(Math.PI / 2); return g;
}
/* Correa con sección redondeada a lo largo de una curva */
function strapGeo(curve, wFn, h, segs, prof) {
  const pos = [], uv = [], idx = [], X = V(1, 0, 0), L = curve.getLength();
  for (let i = 0; i <= segs; i++) {
    const t = i / segs, p = curve.getPointAt(t), T = curve.getTangentAt(t), N = new THREE.Vector3().crossVectors(X, T).normalize(), w = wFn(t);
    for (let k = 0; k <= prof; k++) {
      const a = k / prof * TAU, c = Math.cos(a), s = Math.sin(a), e = 0.28;
      const q = p.clone().addScaledVector(X, Math.sign(c) * Math.pow(Math.abs(c), e) * w / 2).addScaledVector(N, Math.sign(s) * Math.pow(Math.abs(s), e) * h / 2);
      pos.push(q.x, q.y, q.z); uv.push(k / prof, t * L / 18);
    }
  }
  for (let i = 0; i < segs; i++) for (let k = 0; k < prof; k++) { const a = i * (prof + 1) + k, b = a + prof + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}
/* Pieza de eslabón: ancho X, largo Y, grosor Z, con cantos redondeados */
function linkGeo(w, l, h, r, bev) {
  const b = Math.min(bev || 0.7, h * 0.3, w * 0.25, l * 0.25);
  return extrudeC(roundRect(new THREE.Shape(), Math.max(0.2, w - b * 2), Math.max(0.2, l - b * 2), r == null ? Math.min(w, l) * 0.25 : Math.max(0, r - b)), Math.max(0.1, h - b * 2), b, 6);
}
function gearShape(r, teeth, hole) {
  const s = new THREE.Shape(), n = teeth * 4, d = Math.max(0.25, r * 0.1);
  for (let i = 0; i <= n; i++) { const a = i / n * TAU, rr = (i % 4 < 2) ? r : r - d; i ? s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  const h = new THREE.Path(); h.absarc(0, 0, hole, 0, TAU, true); s.holes.push(h);
  if (r > 3) for (let k = 0; k < 5; k++) { const w = new THREE.Path(), a = k * TAU / 5; w.absarc(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, r * 0.2, 0, TAU, true); s.holes.push(w); }
  return s;
}
function handShape(type, len, w) {
  const s = new THREE.Shape(), t = -len * 0.16;
  if (type === 'dauphine') { s.moveTo(0, len); s.lineTo(w / 2, len * 0.12); s.lineTo(w * 0.28, t); s.lineTo(-w * 0.28, t); s.lineTo(-w / 2, len * 0.12); s.lineTo(0, len); }
  else if (type === 'sword') { s.moveTo(0, len); s.lineTo(w / 2, len * 0.72); s.lineTo(w * 0.38, 0); s.lineTo(w * 0.22, t); s.lineTo(-w * 0.22, t); s.lineTo(-w * 0.38, 0); s.lineTo(-w / 2, len * 0.72); s.lineTo(0, len); }
  else { s.moveTo(w * 0.34, len); s.lineTo(w / 2, len * 0.9); s.lineTo(w / 2, t); s.lineTo(-w / 2, t); s.lineTo(-w / 2, len * 0.9); s.lineTo(-w * 0.34, len); }
  return s;
}

/* ---------- Impresiones (esfera y bisel) ---------- */
function dialPrint(s, c, Rd) {
  const S = 2048, k = S / 2 / Rd, dark = hexLum(c[1]) < 0.5, ink = dark ? 'rgba(238,238,238,.92)' : 'rgba(30,30,30,.9)';
  return tex(canvas(S, S, (x) => {
    x.translate(S / 2, S / 2); x.scale(k, k); x.lineCap = 'round';
    const r0 = Rd * 0.965;
    if (s.dial !== 'skeleton') for (let i = 0; i < 60; i++) {
      x.save(); x.rotate(i * TAU / 60); x.strokeStyle = ink; x.lineWidth = i % 5 ? 0.12 : 0.28;
      x.beginPath(); x.moveTo(0, -r0); x.lineTo(0, -r0 + (i % 5 ? 0.9 : 1.6)); x.stroke(); x.restore();
    }
    x.fillStyle = ink; x.textAlign = 'center'; x.textBaseline = 'middle';
    if (s.numerals === 'roman') {
      const N = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
      x.fillStyle = c[0] === '#D4AF37' ? '#B8923A' : (dark ? '#EDEDED' : '#2A2A2A'); x.font = `500 ${Rd * 0.17}px "Times New Roman", Georgia, serif`;
      N.forEach((t, i) => { const a = i * TAU / 12 - Math.PI / 2; x.save(); x.translate(Math.cos(a) * Rd * 0.74, Math.sin(a) * Rd * 0.74); x.rotate(a + Math.PI / 2); x.fillText(t, 0, 0); x.restore(); });
    }
    if (s.numerals === 'arabic') {
      x.font = `800 ${Rd * 0.3}px Montserrat, Arial, sans-serif`; x.fillStyle = c[3];
      [[12, 0, -0.66], [3, 0.68, 0], [9, -0.68, 0]].forEach(([n, a, b]) => x.fillText(n, a * Rd, b * Rd));
    }
    if (s.numerals === 'twelve') { x.font = `800 ${Rd * 0.26}px Montserrat, Arial, sans-serif`; x.fillStyle = c[3]; x.fillText('12', 0, -Rd * 0.68); }
    if (s.dial === 'chrono') {
      [[-0.45, 0], [0, 0.45], [0.45, 0]].forEach(([a, b], n) => {
        const cx = a * Rd, cy = b * Rd, r = Rd * 0.22;
        for (let i = 0; i < 30; i++) { const an = i / 30 * TAU; x.strokeStyle = ink; x.lineWidth = i % 5 ? 0.08 : 0.16; x.beginPath(); x.moveTo(cx + Math.sin(an) * r * 0.82, cy - Math.cos(an) * r * 0.82); x.lineTo(cx + Math.sin(an) * r * (i % 5 ? 0.92 : 0.96), cy - Math.cos(an) * r * (i % 5 ? 0.92 : 0.96)); x.stroke(); }
        x.font = `600 ${r * 0.24}px Montserrat, Arial, sans-serif`; x.fillStyle = ink;
        (n === 1 ? [12, 3, 6, 9] : [60, 15, 30, 45]).forEach((t, i) => { const an = i * TAU / 4; x.fillText(t, cx + Math.sin(an) * r * 0.62, cy - Math.cos(an) * r * 0.62); });
      });
    }
  }));
}
function ringPrint(type, R0, R1, col, bg, bg2) {
  const S = 2048, k = S / 2 / R1;
  return tex(canvas(S, S, (x) => {
    x.translate(S / 2, S / 2); x.scale(k, k);
    if (bg) { x.fillStyle = bg; x.beginPath(); x.arc(0, 0, R1, 0, TAU); x.arc(0, 0, R0, 0, TAU, true); x.fill(); }
    if (bg2) { x.fillStyle = bg2; x.beginPath(); x.arc(0, 0, R1, -Math.PI / 2, Math.PI / 2, true); x.arc(0, 0, R0, Math.PI / 2, -Math.PI / 2, false); x.fill(); }
    x.fillStyle = col; x.textAlign = 'center'; x.textBaseline = 'middle';
    const rm = (R0 + R1) / 2, fs = (R1 - R0) * 0.5;
    x.font = `700 ${fs}px Montserrat, Arial, sans-serif`;
    const label = (txt, a) => { x.save(); x.rotate(a); x.translate(0, -rm); x.fillText(txt, 0, 0); x.restore(); };
    if (type === 'diver') {
      for (let i = 0; i < 60; i++) {
        const a = i / 60 * TAU;
        if (i === 0) { x.beginPath(); x.moveTo(0, -R1 + 0.5); x.lineTo(-fs * 0.6, -R0 - 0.6); x.lineTo(fs * 0.6, -R0 - 0.6); x.closePath(); x.fill(); continue; }
        if (i % 10 === 0) label(String(i), a);
        else if (i < 15 || i % 5 === 0) { x.save(); x.rotate(a); x.fillRect(-0.18, -R1 + 0.7, 0.36, i % 5 ? 1.0 : 2.0); x.restore(); }
      }
    } else if (type === 'tachy') {
      [500, 400, 300, 250, 200, 180, 160, 140, 120, 110, 100, 90, 80, 70, 65, 60].forEach(v => label(String(v), (3600 / v) / 60 * TAU));
      x.font = `700 ${fs * 0.7}px Montserrat, Arial, sans-serif`; label('TACHYMETER', TAU * 0.8);
    } else if (type === 'hours') {
      for (let i = 2; i <= 24; i += 2) label(String(i), i / 24 * TAU);
    } else {
      for (let i = 5; i <= 60; i += 5) label(pad2(i % 60 || 60), i / 60 * TAU);
    }
  }));
}

/* ---------- Construcción del reloj ---------- */
function buildWatch(spec, ci) {
  const c = spec.v[ci] || spec.v[0], strapType = spec.strapBy ? spec.strapBy[ci] || spec.strapBy[0] : spec.strap;
  const M = Model(), T = texts(spec, strapType), K = spec.shape, round = K === 'round';
  const W = round ? spec.D : spec.W, H = round ? spec.D : spec.H, R = W / 2, RH = H / 2, Th = spec.T, LW = spec.LW;
  const bezH = 1.8, zt = Th / 2 - bezH - 0.2, Rin = round ? R - Math.max(2.2, R * 0.13) : 0, zd = zt - 1.1;
  const Rd = round ? Rin - 0.9 : W * 0.38, RdH = round ? Rd : H * 0.38;
  const caseCol = c[0], isResin = spec.caseMat === 'resin';
  const caseBr = () => isResin ? resin(caseCol) : metal(caseCol, 'brushed'), casePol = () => isResin ? resin(shade(caseCol, 1.1)) : metal(caseCol, 'polished');
  const dark = hexLum(c[1]) < 0.5;
  const now = new Date();

  /* Caja */
  const pc = M.part('caja', ...T.caja, { anchor: V(R * 0.72, -RH * 0.72, 0), normal: V(1, -1, 0.3).normalize() });
  let lugEnd;
  if (round) {
    const z0 = -Th / 2 + 1.2;
    const prof = [[Rin, z0], [R - 0.8, z0], [R, z0 + 1.4], [R + 0.15, (z0 + zt) / 2], [R, zt - 0.9], [R - 0.5, zt], [Rin + 0.2, zt], [Rin, zt - 0.6], [Rin, z0]];
    add(pc.g, lathe(prof, 0.5, 220), caseBr());
    const L = Math.max(5, spec.D * 0.17), lugT = Math.max(3, Th * 0.32);
    if (spec.integrated) {
      [1, -1].forEach(sy => { const m = add(pc.g, lugGeo(R - 2.5, 4, Th, Th * 0.32, LW + 2), caseBr()); if (sy < 0) m.rotation.z = Math.PI; });
      lugEnd = { y: R + 1.8, z: -1.4 };
    } else {
      const lw = Math.max(2.2, spec.D * 0.06);
      [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([sx, sy]) => {
        const m = add(pc.g, lugGeo(R - 1.2, L, Th, lugT, lw), caseBr()); m.position.x = sx * (LW / 2 + lw / 2 + 0.3); if (sy < 0) m.rotation.z = Math.PI;
      });
      lugEnd = { y: R + L - 2.2, z: Th / 2 - 4.6 - lugT * 0.45 };
    }
    if (spec.guards) [1, -1].forEach(sy => { const g = new THREE.Shape(); g.moveTo(R - 1, sy * 2.6); g.quadraticCurveTo(R + 2.6, sy * 3.2, R + 2.4, sy * 5.6); g.lineTo(R - 1, sy * 7.2); g.closePath(); add(pc.g, extrudeC(g, Th * 0.5, 0.6, 4), casePol(), 0, 0, -0.3); });
  } else {
    const ring = outline(K, W, H); ring.holes.push(outline(K, W * 0.82, H * 0.82, true));
    const depth = Th - bezH - 2.6; add(pc.g, extrudeC(ring, depth, 1.1, 6), caseBr(), 0, 0, zt - depth / 2 - 1.1);
    [1, -1].forEach(sy => { const h = new THREE.Shape(); roundRect(h, LW + 5, 7, 2.4); add(pc.g, extrudeC(h, Th * 0.42, 1, 5), caseBr(), 0, sy * (RH - 0.8), -Th * 0.12); });
    lugEnd = { y: RH + 1.6, z: -Th * 0.12 };
  }

  /* Mecanismo */
  const pm = M.part('maquinaria', ...T.maquinaria, { anchor: V(-Rd * 0.7, -Rd * 0.05, zd - 1.5), off: V(0, 0, -14), opens: true });
  const perlage = tex(canvas(512, 512, (x, S) => { x.fillStyle = '#808080'; x.fillRect(0, 0, S, S); for (let j = 0; j < 14; j++) for (let i = 0; i < 14; i++) { const g = x.createRadialGradient(i * 38 + 19, j * 38 + 19, 2, i * 38 + 19, j * 38 + 19, 22); g.addColorStop(0, '#9a9a9a'); g.addColorStop(1, '#6a6a6a'); x.fillStyle = g; x.beginPath(); x.arc(i * 38 + 19, j * 38 + 19, 22, 0, TAU); x.fill(); } }), false);
  add(pm.g, lathe([[0, 0], [Rd * 0.98, 0], [Rd * 0.98, 1.4], [0, 1.4]], 0.3, 128), new THREE.MeshPhysicalMaterial({ color: '#C3C7CC', metalness: 1, roughness: 0.38, bumpMap: perlage, bumpScale: 0.6 }), 0, 0, zd - 4.2);
  const brass = () => new THREE.MeshPhysicalMaterial({ color: '#D9B25C', metalness: 1, roughness: 0.22 });
  const gs = Rd / 16;
  [[4.8, 40, -5.2, 3.8, 0.3], [3.4, 30, 4.8, 4.6, -0.45], [2.6, 24, 2.4, -5.6, 0.8], [1.6, 14, 0, 0, -1.2]].forEach(([r, n, gx, gy, sp]) => {
    const gm = add(pm.g, extrudeC(gearShape(r * gs, n, 0.4 * gs), 0.5, 0.08, 2), brass(), gx * gs, gy * gs, zd - 2.9);
    add(pm.g, new THREE.SphereGeometry(0.45 * gs, 16, 12), new THREE.MeshPhysicalMaterial({ color: '#B0182A', roughness: 0.05, clearcoat: 1 }), gx * gs, gy * gs, zd - 2.5);
    M.tick.push(dt => { gm.rotation.z += sp * dt; });
  });
  const bal = new THREE.Group(); bal.position.set(-5 * gs, -5.4 * gs, zd - 2.7); pm.g.add(bal);
  bal.add(new THREE.Mesh(new THREE.TorusGeometry(2.6 * gs, 0.22 * gs, 12, 64), brass()));
  for (let k = 0; k < 3; k++) { const b = new THREE.Mesh(new THREE.BoxGeometry(5.2 * gs, 0.25 * gs, 0.2), brass()); b.rotation.z = k * Math.PI / 3; bal.add(b); }
  M.tick.push((dt, t) => { bal.rotation.z = Math.sin(t * 9) * 1.4; });
  const bridge = new THREE.Shape(); bridge.moveTo(-8 * gs, 7 * gs); bridge.quadraticCurveTo(0, 10 * gs, 8 * gs, 7.5 * gs); bridge.lineTo(9 * gs, 5 * gs); bridge.quadraticCurveTo(0, 7 * gs, -8.5 * gs, 4.2 * gs); bridge.closePath();
  add(pm.g, extrudeC(bridge, 0.6, 0.15, 3), metal('#C8CCD1', 'brushed'), 0, 0, zd - 2.2);
  add(pm.g, lathe([[0, 0], [3.4 * gs, 0], [3.4 * gs, 1.1], [0, 1.1]], 0.25, 64), metal('#D9DCE0', 'polished'), 5.5 * gs, -3.5 * gs, zd - 3.1);

  /* Esfera */
  const pd = M.part('esfera', ...T.esfera, { anchor: V(Rd * 0.3, -Rd * 0.7, zd + 0.4), off: V(0, 0, 8) });
  const dialMat = new THREE.MeshPhysicalMaterial({ color: c[1], metalness: 0.15, roughness: 0.45 });
  if (spec.sunray || spec.dial === 'analog' || spec.dial === 'anadigi' || spec.dial === 'chrono') { dialMat.anisotropy = 1; dialMat.anisotropyMap = sunrayAniso(); dialMat.metalness = 0.45; dialMat.roughness = 0.3; }
  if (spec.mop) { dialMat.iridescence = 1; dialMat.iridescenceIOR = 1.45; dialMat.iridescenceThicknessRange = [180, 520]; dialMat.metalness = 0; dialMat.roughness = 0.25; dialMat.sheen = 0.5; dialMat.sheenColor = new THREE.Color('#FFE8F0'); }
  if (spec.dial === 'skeleton') add(pd.g, lathe([[Rd * 0.66, 0], [Rd, 0], [Rd, 0.5], [Rd * 0.66, 0.5]], 0.15, 160), dialMat, 0, 0, zd - 0.4);
  else add(pd.g, round ? new THREE.CircleGeometry(Rd, 160) : planarUV(new THREE.ShapeGeometry(outline(K, Rd * 2, RdH * 2), 96), Rd, RdH), dialMat, 0, 0, zd);
  if (round) add(pd.g, lathe([[Rd - 0.1, zd + 0.02], [Rin + 0.05, zt - 0.3], [Rin + 0.05, zt - 0.2], [Rd - 0.1, zd + 0.1]], 0.05, 160), new THREE.MeshStandardMaterial({ color: dark ? shade(c[1], 1.4) : shade(c[1], 0.94), metalness: 0.4, roughness: 0.4 }));
  const printGeo = round ? new THREE.CircleGeometry(Rd, 160) : planarUV(new THREE.ShapeGeometry(outline(K, Rd * 2, RdH * 2), 96), Rd, Rd);
  if (spec.dial !== 'skeleton') add(pd.g, printGeo, new THREE.MeshStandardMaterial({ map: dialPrint(spec, c, Rd), transparent: true, roughness: 0.5, depthWrite: false }), 0, 0, zd + 0.03);
  if (spec.pave) {
    const n = 900, im = new THREE.InstancedMesh(gemGeo(0.7), gemMat(), n), o = new THREE.Object3D();
    for (let i = 0; i < n; i++) { const r = Math.sqrt((i + 0.5) / n) * Rd * 0.93, a = i * 2.39996; o.position.set(Math.cos(a) * r, Math.sin(a) * r, zd + 0.12); o.rotation.set(0, 0, a); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }
    pd.g.add(im);
  }
  /* Índices aplicados */
  const idxCol = c[0] === '#D4AF37' || c[0] === '#C48A72' ? c[0] : (dark ? '#D9DCE0' : '#3A3A3A');
  const idxM = metal(idxCol, 'polished');
  for (let i = 0; i < 12; i++) {
    const a = i * TAU / 12, ex = Math.sin(a), ey = Math.cos(a);
    const rr = round ? Rd * 0.84 : Math.min(Rd / Math.max(Math.abs(ex), 0.001), RdH / Math.max(Math.abs(ey), 0.001)) * 0.84;
    if (spec.numerals === 'arabic' && i % 3 === 0 && i !== 6) continue;
    if (spec.numerals === 'twelve' && i === 0) continue;
    if (spec.dial === 'anadigi' && (i === 6 || i === 0)) continue;
    if (spec.day && i === 3) continue;
    if (spec.date === 4.5 && i === 4) continue;
    if (spec.dial === 'chrono' && (i === 3 || i === 6 || i === 9)) continue;
    if (spec.dial === 'skeleton') { const g = add(pd.g, linkGeo(1.4, Rd * 0.16, 1, 0.3, 0.15), idxM, ex * Rd * 0.83, ey * Rd * 0.83, zd + 0.3); g.rotation.z = -a; continue; }
    if (spec.indices === 'baton') {
      const big = i % 3 === 0, l = Rd * (big ? 0.2 : 0.13), w = Math.max(0.9, Rd * (big ? 0.07 : 0.045));
      const g = new THREE.Group(); g.position.set(ex * (rr - l / 2), ey * (rr - l / 2), zd + 0.35); g.rotation.z = -a; pd.g.add(g);
      add(g, linkGeo(w, l, 0.8, w * 0.15, 0.12), idxM);
      if (spec.hands === 'sword') add(g, new THREE.PlaneGeometry(w * 0.5, l * 0.8), lume(), 0, 0, 0.42);
    }
    if (spec.indices === 'dot') {
      const r = i % 3 ? Rd * 0.05 : Rd * 0.07;
      add(pd.g, lathe([[0, 0], [r + 0.3, 0], [r + 0.3, 0.7], [0, 0.7]], 0.2, 48), idxM, ex * rr, ey * rr, zd);
      add(pd.g, new THREE.CircleGeometry(r, 40), lume(), ex * rr, ey * rr, zd + 0.72);
    }
    if (spec.indices === 'gem') {
      const d = i % 3 ? 1.1 : 1.6;
      add(pd.g, lathe([[0, 0], [d * 0.6, 0], [d * 0.6, 0.4], [0, 0.4]], 0.1, 32), idxM, ex * rr, ey * rr, zd);
      add(pd.g, gemGeo(d), gemMat(), ex * rr, ey * rr, zd + 0.5);
    }
  }
  /* Subesferas del cronógrafo */
  if (spec.dial === 'chrono') {
    const azu = azurageMap();
    [[-0.45, 0], [0, -0.45], [0.45, 0]].forEach(([a, b], n) => {
      const cx = a * Rd, cy = b * Rd, r = Rd * 0.22;
      add(pd.g, new THREE.CircleGeometry(r * 0.98, 96), new THREE.MeshPhysicalMaterial({ color: dark ? shade(c[1], 1.8) : shade(c[1], 0.9), metalness: 0.4, roughness: 0.35, bumpMap: azu, bumpScale: 0.6 }), cx, cy, zd + 0.01);
      add(pd.g, new THREE.TorusGeometry(r, 0.18, 12, 96), metal(n === 1 ? c[3] : idxCol, 'polished'), cx, cy, zd + 0.15);
      const hand = new THREE.Group(); hand.position.set(cx, cy, zd + 0.5); pd.g.add(hand);
      const hs = new THREE.Shape(); hs.moveTo(0, r * 0.85); hs.lineTo(0.3, 0); hs.lineTo(0.2, -r * 0.2); hs.lineTo(-0.2, -r * 0.2); hs.lineTo(-0.3, 0); hs.closePath();
      add(hand, extrudeC(hs, 0.15, 0.05, 2), metal(n === 1 ? c[3] : (dark ? '#E9E9E9' : '#2A2A2A'), 'polished'));
      add(hand, lathe([[0, 0], [0.6, 0], [0.6, 0.3], [0, 0.3]], 0.1, 24), metal(n === 1 ? c[3] : idxCol, 'polished'), 0, 0, 0.05);
      if (n === 0) M.tick.push(() => { hand.rotation.z = -(new Date().getSeconds() / 60) * TAU; }); else hand.rotation.z = -(n === 1 ? 0.7 : 2.2);
    });
  }
  /* Ventanas de fecha y día */
  function dateWindow(x, y, w, txt, rot) {
    const g = new THREE.Group(); g.position.set(x, y, zd + 0.05); g.rotation.z = rot || 0; pd.g.add(g);
    const h = Math.max(2.2, Rd * 0.17);
    const fr = roundRect(new THREE.Shape(), w + 0.9, h + 0.9, 0.5); fr.holes.push(roundRect(new THREE.Path(), w, h, 0.3));
    add(g, extrudeC(fr, 0.5, 0.15, 3), idxM, 0, 0, 0.25);
    const tx = tex(canvas(256, 128, (x2, Wc, Hc) => { x2.fillStyle = '#F7F7F2'; x2.fillRect(0, 0, Wc, Hc); x2.fillStyle = '#111'; x2.font = `600 ${Hc * 0.62}px Montserrat, Arial, sans-serif`; x2.textAlign = 'center'; x2.textBaseline = 'middle'; x2.fillText(txt, Wc / 2, Hc / 2 + 4); }));
    add(g, new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.6 }), 0, 0, 0.06);
  }
  if (spec.date && spec.dial !== 'digital') {
    const r = Rd * 0.7;
    if (spec.day) { dateWindow(r - Rd * 0.3, 0, Rd * 0.3, DIAS[now.getDay()]); dateWindow(r, 0, Rd * 0.17, String(now.getDate())); }
    else if (spec.date === 3) dateWindow(r, 0, Rd * 0.18, String(now.getDate()));
    else dateWindow(Math.sin(TAU * 4.5 / 12) * r, Math.cos(TAU * 4.5 / 12) * r, Rd * 0.18, String(now.getDate()), Math.PI / 4);
  }
  /* Pantallas LCD */
  const screens = [], acc = c[3];
  function lcd(w, h, x, y, draw) {
    const cv = canvas(512, Math.round(512 * h / w)), t = tex(cv);
    const m = new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: '#FFFFFF', emissiveIntensity: 0.35, roughness: 0.25 });
    const fr = roundRect(new THREE.Shape(), w + 1.2, h + 1.2, 0.8); fr.holes.push(roundRect(new THREE.Path(), w, h, 0.5));
    add(pd.g, extrudeC(fr, 0.6, 0.15, 3), metal(dark ? '#3A3A3A' : '#8A8A8A', 'brushed'), x, y, zd + 0.3);
    add(pd.g, new THREE.PlaneGeometry(w, h), m, x, y, zd + 0.05);
    screens.push({ cv, t, draw });
  }
  const lcdDraw = fmt => (x, Wc, Hc) => { const n = new Date(); x.fillStyle = '#0C0E0C'; x.fillRect(0, 0, Wc, Hc); x.fillStyle = acc; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `700 ${Hc * 0.62}px "Courier New", monospace`; x.fillText(fmt(n), Wc / 2, Hc / 2 + 2); };
  if (spec.dial === 'anadigi') {
    lcd(Rd * 0.7, Rd * 0.22, 0, -Rd * 0.48, lcdDraw(n => pad2(n.getHours()) + ':' + pad2(n.getMinutes()) + ':' + pad2(n.getSeconds())));
    if (spec.numerals === 'arabic') lcd(Rd * 0.36, Rd * 0.15, -Rd * 0.36, Rd * 0.2, lcdDraw(n => DIAS[n.getDay()] + ' ' + pad2(n.getDate())));
    else lcd(Rd * 0.42, Rd * 0.17, 0, Rd * 0.42, lcdDraw(n => DIAS[n.getDay()] + ' ' + pad2(n.getDate())));
  }
  if (spec.dial === 'digital') {
    lcd(Rd * 1.45, Rd * 1.05, 0, 0, (x, Wc, Hc) => {
      const n = new Date(); x.fillStyle = '#0C0E10'; x.fillRect(0, 0, Wc, Hc); x.fillStyle = acc; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = `700 ${Hc * 0.13}px Montserrat, Arial, sans-serif`; x.fillText(DIAS[n.getDay()] + '  ' + pad2(n.getDate()) + '-' + pad2(n.getMonth() + 1), Wc / 2, Hc * 0.17);
      x.font = `700 ${Hc * 0.36}px "Courier New", monospace`; x.fillText(pad2(n.getHours()) + ':' + pad2(n.getMinutes()), Wc * 0.42, Hc * 0.54);
      x.font = `700 ${Hc * 0.17}px "Courier New", monospace`; x.fillText(pad2(n.getSeconds()), Wc * 0.86, Hc * 0.6);
      x.fillStyle = '#7C8288'; x.font = `600 ${Hc * 0.08}px Montserrat, Arial, sans-serif`; x.fillText('ALARMA    CRONO    LUZ', Wc / 2, Hc * 0.88);
    });
  }
  let lastS = -1;
  M.tick.push(() => { const s = new Date().getSeconds(); if (s === lastS) return; lastS = s; screens.forEach(sc => { sc.draw(sc.cv.getContext('2d'), sc.cv.width, sc.cv.height); sc.t.needsUpdate = true; }); });

  /* Calavera esculpida */
  if (spec.dial === 'skull') {
    const pr = M.part('relieve', ...T.relieve, { anchor: V(Rd * 0.3, Rd * 0.25, zd + 4), off: V(0, 0, 11) });
    const sk = new THREE.SphereGeometry(1, 128, 96), p = sk.attributes.position, eyes = [[-0.36, 0.02], [0.36, 0.02]];
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      x *= 0.86; z *= 0.5;
      if (y < -0.25) { const k = 1 - Math.min(1, (-0.25 - y) * 0.9); x *= 0.62 + 0.38 * k; y = -0.25 + (y + 0.25) * 1.25; }
      if (z > 0) {
        eyes.forEach(([ex, ey]) => { const d = Math.hypot((x - ex) / 0.25, (y - ey) / 0.22); if (d < 1) z -= 0.34 * (1 - d * d); });
        const dn = Math.hypot(x / 0.11, (y + 0.3) / 0.13); if (dn < 1) z -= 0.22 * (1 - dn * dn);
        if (y < -0.52 && y > -0.78) z -= 0.05 * (0.5 + 0.5 * Math.cos(x * 48));
        if (Math.abs(x) > 0.42 && y < -0.12 && y > -0.42) z += 0.05;
      }
      p.setXYZ(i, x, y, z);
    }
    sk.computeVertexNormals(); sk.scale(Rd * 0.42, Rd * 0.42, Rd * 0.42);
    add(pr.g, sk, metal(c[1] === '#D4AF37' ? '#D4AF37' : '#D2D5D9', 'polished'), 0, Rd * 0.06, zd + 1.2);
    const holeM = new THREE.MeshStandardMaterial({ color: '#0A0A0A', roughness: 0.6 });
    eyes.forEach(([ex, ey]) => { const e = add(pr.g, new THREE.SphereGeometry(Rd * 0.08, 32, 16), holeM, ex * Rd * 0.42 * 0.86, ey * Rd * 0.42 + Rd * 0.06, zd + 1.8); e.scale.z = 0.4; });
  }
  /* Rodillos de fecha (esqueleto) */
  if (spec.dial === 'skeleton') {
    const pr = M.part('rodillos', ...T.rodillos, { anchor: V(Rd * 0.25, -Rd * 0.42, zd + 1), off: V(0, 0, 9) });
    [DIAS[now.getDay()].slice(0, 2), pad2(now.getDate()), pad2(now.getMonth() + 1)].forEach((txt, i) => {
      const t = tex(canvas(1024, 256, (x, Wc, Hc) => { x.fillStyle = '#E4E6E8'; x.fillRect(0, 0, Wc, Hc); x.fillStyle = '#111'; x.font = `700 ${Hc * 0.5}px Montserrat, Arial, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; for (let k = 0; k < 4; k++) { x.save(); x.translate(Wc * (k + 0.5) / 4, Hc / 2); x.rotate(-Math.PI / 2); x.fillText(txt, 0, 0); x.restore(); } }));
      const r = add(pr.g, new THREE.CylinderGeometry(Rd * 0.11, Rd * 0.11, Rd * 0.26, 64), new THREE.MeshPhysicalMaterial({ map: t, roughness: 0.35, clearcoat: 0.5 }), (i - 1) * Rd * 0.3, -Rd * 0.36, zd - 0.4);
      r.rotation.z = Math.PI / 2;
      const fr = roundRect(new THREE.Shape(), Rd * 0.3, Rd * 0.3, 1); fr.holes.push(roundRect(new THREE.Path(), Rd * 0.22, Rd * 0.16, 0.4));
      add(pr.g, extrudeC(fr, 0.6, 0.2, 3), metal('#C8CBCF', 'polished'), (i - 1) * Rd * 0.3, -Rd * 0.36, zd + 0.9);
    });
  }

  /* Agujas */
  if (spec.dial !== 'digital') {
    const ph = M.part('agujas', ...T.agujas, { anchor: V(-Rd * 0.12, Rd * 0.62, zd + 2), off: V(0, 0, 12) });
    const hc = c[0] === '#D4AF37' || c[0] === '#C48A72' ? c[0] : (spec.handsAccent ? c[3] : (dark || spec.dial === 'skeleton' ? '#E3E6EA' : '#2B2B2B'));
    const hm = metal(hc, 'polished');
    const mk = (type, len, w, z) => {
      const g = new THREE.Group(); g.position.z = z; ph.g.add(g);
      add(g, extrudeC(handShape(type, len, w), 0.22, 0.12, 3), hm);
      if (type === 'sword') { const s = new THREE.Shape(); s.moveTo(0, len * 0.9); s.lineTo(w * 0.28, len * 0.7); s.lineTo(w * 0.22, len * 0.12); s.lineTo(-w * 0.22, len * 0.12); s.lineTo(-w * 0.28, len * 0.7); s.closePath(); add(g, new THREE.ShapeGeometry(s), lume(), 0, 0, 0.36); }
      return g;
    };
    const Hh = mk(spec.hands, Rd * 0.55, Math.max(1.4, Rd * 0.11), zd + 1.0), Mh = mk(spec.hands, Rd * 0.86, Math.max(1.1, Rd * 0.085), zd + 1.45);
    const S = new THREE.Group(); S.position.z = zd + 1.9; ph.g.add(S);
    const sm = metal(spec.dial === 'skeleton' || spec.dial === 'skull' || spec.hands === 'sword' ? c[3] : hc, 'polished');
    add(S, new THREE.BoxGeometry(0.28, Rd * 1.15, 0.12), sm, 0, Rd * 0.33, 0);
    add(S, lathe([[0, 0], [Math.max(0.9, Rd * 0.06), 0], [Math.max(0.9, Rd * 0.06), 0.2], [0, 0.2]], 0.05, 40), sm, 0, -Rd * 0.2, -0.1);
    add(S, lathe([[0, 0], [0.75, 0], [0.75, 0.6], [0.35, 0.8], [0, 0.8]], 0.15, 40), sm, 0, 0, -0.2);
    M.tick.push(() => { const n = new Date(), s = n.getSeconds() + n.getMilliseconds() / 1000, mi = n.getMinutes() + s / 60, h = (n.getHours() % 12) + mi / 60; S.rotation.z = -s / 60 * TAU; Mh.rotation.z = -mi / 60 * TAU; Hh.rotation.z = -h / 12 * TAU; });
  }

  /* Bisel */
  const pb = M.part('bisel', ...T.bisel, { anchor: V(-R * 0.68, RH * 0.68, zt + bezH + 0.6), off: V(0, 0, 17) });
  const bezCol = spec.bezelColor ? spec.bezelColor[ci] || caseCol : caseCol;
  const top = zt + bezH;
  if (round) {
    if (spec.bezel === 'diver') {
      const g = lathe([[Rin - 0.2, zt], [R + 0.2, zt], [R + 0.35, zt + 0.5], [R + 0.35, top - 0.4], [R, top], [Rin + 0.4, top], [Rin - 0.2, top - 0.6]], 0.3, 600);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); if (Math.hypot(x, y) > R + 0.1) { const a = Math.atan2(y, x), k = 1 - 0.012 * (0.5 + 0.5 * Math.sign(Math.cos(a * 120))); p.setXY(i, x * k, y * k); } }
      g.computeVertexNormals(); add(pb.g, g, metal(bezCol, 'brushed'));
      const insM = ceramic('#FFFFFF'); insM.map = ringPrint('diver', Rin + 0.5, R - 0.5, '#EDEDED', c[3], spec.bezel2 && spec.bezel2[ci]);
      add(pb.g, planarUV(lathe([[Rin + 0.5, top + 0.05], [R - 0.5, top - 0.15], [R - 0.5, top + 0.05], [Rin + 0.5, top + 0.25]], 0.1, 240), R - 0.5), insM);
    } else if (spec.bezel === 'gems') {
      const rows = spec.rows || 1;
      add(pb.g, lathe([[Rin - 0.2, zt], [R + 0.1, zt], [R + 0.25, zt + 0.6], [R, top], [Rin + 0.3, top], [Rin - 0.2, top - 0.4]], 0.3, 220), metal(bezCol, 'polished'));
      for (let r = 0; r < rows; r++) {
        const rr = rows === 1 ? (Rin + R) / 2 + 0.1 : Rin + 0.9 + r * (R - Rin - 1.6), d = rows === 1 ? Math.min(R - Rin - 0.6, 2.4) : (R - Rin) * 0.42;
        const n = Math.floor(TAU * rr / (d * 1.08)), im = new THREE.InstancedMesh(gemGeo(d), gemMat(), n), o = new THREE.Object3D();
        for (let i = 0; i < n; i++) { const a = (i + r * 0.5) / n * TAU; o.position.set(Math.cos(a) * rr, Math.sin(a) * rr, top + d * 0.12); o.rotation.set(0, 0, a); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }
        pb.g.add(im);
      }
    } else {
      add(pb.g, lathe([[Rin - 0.2, zt], [R + 0.1, zt], [R + 0.2, zt + 0.5], [R - 0.3, top], [Rin + 0.8, top + 0.15], [Rin - 0.2, top - 0.5]], 0.35, 220), isResin ? resin(caseCol) : metal(bezCol, spec.bezel === 'print' ? 'brushed' : 'polished'));
      if (spec.bezel === 'print') {
        add(pb.g, planarUV(new THREE.RingGeometry(Rin + 0.8, R - 0.6, 240, 1), R - 0.6), new THREE.MeshStandardMaterial({ map: ringPrint(spec.ring, Rin + 0.8, R - 0.6, hexLum(bezCol) < 0.4 ? '#E6E6E6' : '#2A2A2A'), transparent: true, depthWrite: false, roughness: 0.5 }), 0, 0, top + 0.12);
      }
      if (spec.bezel === 'screws') {
        for (let i = 0; i < spec.screws; i++) {
          const a = (i + 0.5) / spec.screws * TAU, rr = (Rin + R) / 2 + 0.2;
          const sc = add(pb.g, lathe([[0, 0], [1.1, 0], [1.1, 0.35], [0.8, 0.6], [0, 0.6]], 0.15, 6), metal(c[3] === '#C48A72' ? '#C48A72' : '#C8CBCF', 'polished'), Math.cos(a) * rr, Math.sin(a) * rr, top - 0.1);
          sc.rotation.z = a;
        }
      }
    }
  } else {
    const ring = outline(K, W * 0.98, H * 0.98); ring.holes.push(outline(K, W * 0.8, H * 0.8, true));
    add(pb.g, extrudeC(ring, 1.2, 0.6, 5), metal(bezCol, 'polished'), 0, 0, zt + 0.9);
    if (spec.bezel === 'screws') {
      const pts = outline(K, W * 0.89, H * 0.89, true).getSpacedPoints(spec.screws);
      for (let i = 0; i < spec.screws; i++) {
        const sc = add(pb.g, lathe([[0, 0], [1.2, 0], [1.2, 0.35], [0.9, 0.6], [0, 0.6]], 0.15, 6), metal(c[3] === '#C48A72' || c[3] === '#D4AF37' ? c[3] : '#C8CBCF', 'polished'), pts[i].x, pts[i].y, zt + 2.0);
        sc.rotation.z = i;
      }
    }
  }
  /* Cristal de zafiro */
  const pcr = M.part('cristal', ...T.cristal, { anchor: V(Rd * 0.62, Rd * 0.6, top + 0.8), off: V(0, 0, 23) });
  if (round) add(pcr.g, lathe([[0, top + 0.35], [Rin * 0.7, top + 0.3], [Rin + 0.35, top + 0.05], [Rin + 0.35, zt + 0.1], [0, zt + 0.1]], 0.2, 160), sapphire());
  else add(pcr.g, extrudeC(outline(K, W * 0.82, H * 0.82), 1.1, 0.3, 4), sapphire(), 0, 0, zt + 1.6);

  /* Corona y pulsadores */
  const pk = M.part('corona', ...T.corona, { anchor: V(R + 4.5, 0, 0), normal: V(1, 0, 0), off: V(10, 0, 0) });
  add(pk.g, crownGeo(Math.max(2.2, W * 0.065), 3.6, 24), casePol(), R - 0.6, 0, -0.4);
  if (spec.pushers) {
    const pm2 = spec.pusherAccent ? metal(c[3], 'polished') : casePol();
    (spec.pushers === 4 ? [-0.75, 0.75, Math.PI - 0.75, Math.PI + 0.75] : [-0.62, 0.62]).forEach(a => {
      const g = lathe([[0, 0], [1.3, 0], [1.3, 2.6], [1.1, 3.0], [0, 3.0]], 0.3, 48); g.rotateY(Math.PI / 2);
      const m = add(pk.g, g, pm2, Math.cos(a) * (R - 0.8), Math.sin(a) * (RH - 0.8), -0.4); m.rotation.z = a;
    });
  }

  /* Tapa trasera (se abre como bisagra) */
  const pt = M.part('tapa', ...T.tapa, { anchor: V(R * 0.4, 0, -Th / 2 - 0.8), normal: V(0, 0, -1), off: V(0, 0, -24), rot: V(0, -0.85, 0), opens: true });
  const eng = tex(canvas(1024, 1024, (x, S) => { x.fillStyle = '#808080'; x.fillRect(0, 0, S, S); x.translate(S / 2, S / 2); x.strokeStyle = '#5a5a5a'; x.lineWidth = 2; for (let i = 0; i < 180; i++) { x.rotate(TAU / 180); x.beginPath(); x.moveTo(0, S * 0.16); x.lineTo(0, S * 0.33); x.stroke(); } [0.34, 0.15].forEach(r => { x.lineWidth = 5; x.beginPath(); x.arc(0, 0, S * r, 0, TAU); x.stroke(); }); }), false);
  const backM = metal('#C8CBCF', 'brushed'); backM.bumpMap = eng; backM.bumpScale = 0.5;
  if (round) {
    const z0 = -Th / 2;
    add(pt.g, planarUV(lathe([[0, z0 - 0.3], [Rin * 0.62, z0 - 0.3], [Rin * 0.66, z0 - 0.1], [R - 1.4, z0], [R - 0.8, z0 + 0.4], [R - 0.8, z0 + 1.2], [0, z0 + 1.2]], 0.3, 200), R), backM);
    for (let i = 0; i < 4; i++) { const a = i * TAU / 4 + Math.PI / 4, rr = R - 3.2; const sc = add(pt.g, lathe([[0, 0], [0.9, 0], [0.9, 0.4], [0, 0.4]], 0.1, 24), metal('#9AA0A6', 'polished'), Math.cos(a) * rr, Math.sin(a) * rr, z0 - 0.15); sc.rotation.x = Math.PI; }
  } else add(pt.g, planarUV(extrudeC(outline(K, W * 0.86, H * 0.86), 1.2, 0.5, 4), W * 0.43, H * 0.43), backM, 0, 0, -Th / 2 + 0.6);

  /* Brazalete / correa (sigue el contorno de una muñeca) */
  const yA = lugEnd.y, zA = lugEnd.z, ry = Math.max(yA + 5, 31), rz = 24, thA = Math.asin(Math.min(0.98, yA / ry)), zc = zA - rz * Math.cos(thA);
  const pS = M.part('correa', ...T.correa, { anchor: V(0, ry * 0.92, zc + rz * 0.55), normal: V(0, 1, 0.4).normalize() });
  const isBr = !(strapType === 'rubber' || strapType === 'leather');
  const ctr = V(0, 0, zc), X = V(1, 0, 0);
  [1, -1].forEach((sy, hi) => {
    const pts = [V(0, sy * (yA - 1.5), zA + 0.6)];
    for (let k = 0; k <= 14; k++) { const th = thA + (Math.PI - 0.16 - thA) * k / 14; pts.push(V(0, sy * ry * Math.sin(th), zc + rz * Math.cos(th))); }
    const cv = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    const g = new THREE.Group(); g.userData.sy = sy; pS.g.add(g);
    const wFn = t => LW * (1 - 0.18 * t);
    const frame = t => { const p = cv.getPointAt(t), Tg = cv.getTangentAt(t); let N = new THREE.Vector3().crossVectors(X, Tg).normalize(), Xb = X.clone(); if (N.dot(p.clone().sub(ctr)) < 0) { N.negate(); Xb.negate(); } return { p, Tg, N, Xb }; };
    if (isBr) {
      const L = cv.getLength(), pitch = strapType === 'jubilee' ? LW * 0.32 : strapType === 'hlink' ? LW * 0.3 : LW * 0.36, n = Math.round(L / pitch), h = Math.max(2.4, LW * 0.15);
      const side = metal(c[2], 'brushed'), mid = metal(c[4] || c[2], 'polished'), mtx = new THREE.Matrix4();
      for (let k = 0; k < n; k++) {
        const t = (k + 0.5) / n, { p, Tg, N, Xb } = frame(t), w = wFn(t), l = L / n;
        const q = new THREE.Quaternion().setFromRotationMatrix(mtx.makeBasis(Xb, Tg, N));
        const piece = (geo, mat, x, dy) => { const m = new THREE.Mesh(geo, mat); m.quaternion.copy(q); m.position.copy(p).addScaledVector(Xb, x).addScaledVector(Tg, dy || 0); g.add(m); };
        if (strapType === 'jubilee') {
          piece(linkGeo(w * 0.3, l * 0.96, h), side, -w * 0.35); piece(linkGeo(w * 0.3, l * 0.96, h), side, w * 0.35);
          piece(linkGeo(w * 0.17, l * 0.46, h * 0.95, 0.5), mid, -w * 0.1, -l * 0.25); piece(linkGeo(w * 0.17, l * 0.46, h * 0.95, 0.5), mid, w * 0.1, -l * 0.25);
          piece(linkGeo(w * 0.17, l * 0.46, h * 0.95, 0.5), mid, 0, l * 0.25);
        } else if (strapType === 'hlink') {
          if (k % 2) piece(linkGeo(w * 0.98, l * 0.94, h, 0.8), side, 0);
          else { piece(linkGeo(w * 0.22, l * 0.94, h), side, -w * 0.38); piece(linkGeo(w * 0.22, l * 0.94, h), side, w * 0.38); piece(linkGeo(w * 0.5, l * 0.94, h * 0.92, 0.6), mid, 0); }
        } else {
          const cw = strapType === 'three' ? 0.34 : 0.3, sw = w * (1 - cw) / 2 - 0.15, sx = w * (0.5 - (1 - cw) / 4);
          piece(linkGeo(sw, l * 0.95, h), side, -sx); piece(linkGeo(sw, l * 0.95, h), side, sx); piece(linkGeo(w * cw, l * 0.95, h * 0.96), mid, 0);
        }
      }
    } else {
      const h = strapType === 'leather' ? 3.4 : 4.2, mat = strapType === 'leather' ? leather(c[2]) : rubber(c[2], spec.ribs);
      g.add(new THREE.Mesh(strapGeo(cv, wFn, h, 180, 28), mat));
      if (strapType === 'leather') {
        const n = 46, im = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.22, 1.2, 4, 8), new THREE.MeshStandardMaterial({ color: '#E8D9B8', roughness: 0.8 }), n * 2), o = new THREE.Object3D(); let q = 0;
        for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, { p, Tg, N } = frame(t); [-1, 1].forEach(sx => { o.position.copy(p).addScaledVector(X, sx * (wFn(t) / 2 - 1.4)).addScaledVector(N, h / 2 - 0.05); o.quaternion.setFromUnitVectors(V(0, 1, 0), Tg); o.updateMatrix(); im.setMatrixAt(q++, o.matrix); }); }
        g.add(im);
      }
      if (hi === 1) {
        const holeM = new THREE.MeshStandardMaterial({ color: '#050505', roughness: 0.9 });
        for (let i = 0; i < 7; i++) { const { p, N } = frame(0.5 + i * 0.065); const d = add(g, new THREE.CircleGeometry(1.1, 24), holeM); d.position.copy(p).addScaledVector(N, h / 2 + 0.03); d.lookAt(d.position.clone().add(N)); }
      } else {
        const t = 0.86, { p, Tg } = frame(t);
        const kp = new THREE.Mesh(new THREE.TorusGeometry(1, 0.5, 12, 32), mat); kp.position.copy(p); kp.quaternion.setFromUnitVectors(V(0, 0, 1), Tg); kp.scale.set((wFn(t) + 2) / 2, h / 2 + 0.9, 1.6); g.add(kp);
      }
    }
  });
  pS.split = true;
  const pq = M.part('cierre', ...T.cierre, { anchor: V(0, 0, zc - rz - 3), normal: V(0, 0, -1), off: V(0, 0, -10) });
  if (isBr) {
    const w = LW * 0.82 + 1.2, cl = new THREE.Group(); cl.position.set(0, 0, zc - rz - 0.2); pq.g.add(cl);
    add(cl, linkGeo(w, 30, 3.6, 2.5), metal(c[2], 'brushed'));
    add(cl, linkGeo(w * 0.86, 26, 0.9, 2), metal(c[4] || c[2], 'polished'), 0, 0, -1.9);
    [-1, 1].forEach(sx => { const b = add(cl, lathe([[0, 0], [1.1, 0], [1.1, 1.2], [0, 1.2]], 0.3, 32), metal('#C8CBCF', 'polished')); b.rotation.y = sx * Math.PI / 2; b.position.set(sx * (w / 2 + 0.4), 6, 0); });
  } else {
    const w = LW * 0.82 + 3, bk = new THREE.Group(); bk.position.set(0, 0, zc - rz - 1.2); pq.g.add(bk);
    const path = roundRect(new THREE.Path(), w, 9, 3).getSpacedPoints(80).map(p => V(p.x, p.y, 0));
    add(bk, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(path, true), 160, 0.9, 16, true), metal('#C8CBCF', 'polished'));
    add(bk, new THREE.CylinderGeometry(0.5, 0.5, 9.5, 16), metal('#C8CBCF', 'polished'), 0, 0.4, 0.4);
  }
  /* Estuche: el brazalete rodea el cojín y la caja se abre hacia el frente */
  if (spec.box) {
    const pe = M.part('estuche', ...T.estuche, { anchor: V(LW + 14, -ry * 0.6, zc + 18), normal: V(0, 0, 1), off: V(0, 0, -34) });
    const paper = new THREE.MeshPhysicalMaterial({ color: '#EFE6D6', roughness: 0.75, bumpMap: grainMap(), bumpScale: 0.3, sheen: 0.3 });
    const bw = LW * 2 + 34, bh = ry * 2 + 14, bd = rz * 2 + 6;
    const rim = roundRect(new THREE.Shape(), bw, bh, 4); rim.holes.push(roundRect(new THREE.Path(), bw - 4, bh - 4, 3));
    add(pe.g, extrudeC(rim, bd, 0.8, 4), paper, 0, 0, zc - 2);
    add(pe.g, extrudeC(roundRect(new THREE.Shape(), bw, bh, 4), 2, 0.8, 4), paper, 0, 0, zc - 2 - bd / 2);
    const cush = add(pe.g, new THREE.SphereGeometry(1, 96, 48), new THREE.MeshPhysicalMaterial({ color: '#E8DCC6', roughness: 0.9, sheen: 1, sheenColor: new THREE.Color('#FFF4E0') }), 0, 0, zc);
    cush.scale.set(LW * 0.95, ry - 2.6, rz - 2.6);
    add(pe.g, extrudeC(roundRect(new THREE.Shape(), bw - 4, bh - 4, 3), bd * 0.4, 0, 1), new THREE.MeshPhysicalMaterial({ color: '#E3D6BE', roughness: 0.95, sheen: 0.6 }), 0, 0, zc - bd * 0.28);
    const lid = new THREE.Group(); lid.position.set(0, bh / 2, zc - 2 + bd / 2); lid.rotation.x = -1.9; pe.g.add(lid);
    add(lid, extrudeC(roundRect(new THREE.Shape(), bw, bh, 4), 3, 0.8, 4), paper, 0, -bh / 2, 0);
    add(pe.g, new THREE.BoxGeometry(bw + 0.4, 1.2, 1.2), metal('#D4AF37', 'polished'), 0, -bh / 2 + 6, zc - 2 + bd / 2 + 0.6);
  }
  M.root.rotation.x = -0.12;
  return M;
}

/* ---------- Iluminación de estudio (entorno HDR generado) ---------- */
function studioEnv(renderer) {
  const s = new THREE.Scene();
  const grad = tex(canvas(16, 256, (x, W, H) => { const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5A5A5E'); g.addColorStop(0.45, '#2A2A2D'); g.addColorStop(0.55, '#1C1C1E'); g.addColorStop(1, '#0E0E10'); x.fillStyle = g; x.fillRect(0, 0, W, H); }));
  s.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), new THREE.MeshBasicMaterial({ map: grad, side: THREE.BackSide })));
  const box = (w, h, x, y, z, k, col) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: col || '#FFFFFF', side: THREE.DoubleSide })); m.material.color.multiplyScalar(k); m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m); };
  box(56, 34, 0, 34, 8, 4.5);
  box(12, 56, -32, 6, 14, 7);
  box(12, 56, 32, 4, 10, 5.5);
  box(52, 14, 0, -6, 38, 2.6, '#FFF5E6');
  box(56, 18, 0, 10, -38, 3.2, '#E9F0FF');
  box(70, 70, 0, -42, 0, 0.35);
  const pm = new THREE.PMREMGenerator(renderer), t = pm.fromScene(s, 0.02).texture; pm.dispose();
  return t;
}

/* ---------- Visor (interfaz) ---------- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function openViewer(product, colorIndex, onColor) {
  const spec = SPECS[product.id]; if (!spec) return;
  const lastFocus = document.activeElement;
  const el = document.createElement('div');
  el.className = 'v3d'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Vista 3D de ' + product.name);
  el.innerHTML =
    '<div class="v3d-stage"><div class="v3d-hot" aria-label="Piezas del reloj"></div><p class="v3d-load">Cargando modelo 3D…</p></div>' +
    '<div class="v3d-top"><div><div class="v3d-eyebrow">Explora en 3D</div><strong>' + product.name + '</strong></div><button class="v3d-x" aria-label="Cerrar vista 3D"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
    '<div class="v3d-bar">' +
      '<button class="v3d-btn v3d-open" aria-pressed="false">Abrir el reloj</button>' +
      '<button class="v3d-btn v3d-spin" aria-pressed="' + (!reduce) + '">Girar</button>' +
      '<button class="v3d-btn v3d-reset">Centrar</button>' +
      (product.colors.length > 1 ? '<div class="v3d-sw" role="group" aria-label="Color">' + product.colors.map((x, i) => '<button data-i="' + i + '" aria-label="' + x.name + '" style="background:' + x.hex + '"></button>').join('') + '</div>' : '') +
    '</div>' +
    '<aside class="v3d-info"><div class="v3d-detail" aria-live="polite"><div class="v3d-eyebrow">Diseño</div><h3>Toca una pieza</h3><p>Gira el reloj con el dedo o el ratón, acerca con dos dedos o la rueda, y toca los puntos dorados para conocer cada pieza. Usa «Abrir el reloj» para ver el mecanismo por dentro.</p></div>' +
    '<ol class="v3d-list"></ol><p class="v3d-note">Modelo 3D de referencia con medidas aproximadas. Las fotos muestran el producto real.</p></aside>';
  document.body.appendChild(el); document.body.style.overflow = 'hidden';
  const $ = s => el.querySelector(s), stage = $('.v3d-stage'), hotLayer = $('.v3d-hot');
  $('.v3d-x').focus();

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }); }
  catch (e) { $('.v3d-load').textContent = 'Tu dispositivo no permite ver modelos 3D. Puedes ver las fotos del producto.'; $('.v3d-x').onclick = () => { el.remove(); document.body.style.overflow = ''; }; return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  stage.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  scene.environment = studioEnv(renderer);
  const key = new THREE.DirectionalLight('#FFFFFF', 1.2); key.position.set(40, 80, 60); scene.add(key);
  const camera = new THREE.PerspectiveCamera(26, 1, 1, 2000);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.autoRotate = !reduce; controls.autoRotateSpeed = 0.9; controls.enablePan = false;
  controls.addEventListener('start', () => { controls.autoRotate = false; $('.v3d-spin').setAttribute('aria-pressed', 'false'); });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: tex(canvas(256, 256, (x, S) => { const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2); g.addColorStop(0, 'rgba(0,0,0,.6)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, S, S); })), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; scene.add(shadow);

  let M = null, ci = colorIndex || 0, explode = 0, exTarget = 0, sel = null, home = null, camAnim = null, glb = false;
  const clock = new THREE.Clock();
  function dispose(o) { o.traverse(n => { if (n.geometry) n.geometry.dispose(); if (n.material) [].concat(n.material).forEach(m => m.dispose()); }); }
  function frameModel(root) {
    const box = new THREE.Box3().setFromObject(root), size = box.getSize(V(0, 0, 0)), ctr = box.getCenter(V(0, 0, 0));
    shadow.position.set(ctr.x, box.min.y - 0.5, ctr.z); shadow.scale.set(size.x * 1.6, size.z * 1.6, 1);
    if (!home) {
      const r = size.length() * 0.5, dist = r / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * 0.92;
      home = { target: ctr.clone(), pos: ctr.clone().add(V(0.28, 0.22, 1).normalize().multiplyScalar(dist)), dist };
      controls.target.copy(home.target); camera.position.copy(home.pos);
      controls.minDistance = dist * 0.25; controls.maxDistance = dist * 2.4;
    }
  }
  const sw = () => Array.prototype.slice.call(el.querySelectorAll('.v3d-sw button'));
  function load(i) {
    ci = i;
    if (M) { scene.remove(M.root); dispose(M.root); }
    M = buildWatch(spec, i); scene.add(M.root);
    M.parts.forEach(p => { p.base = p.g.position.clone(); p.baseRot = p.g.rotation.clone(); });
    frameModel(M.root);
    hotLayer.innerHTML = ''; const list = $('.v3d-list'); list.innerHTML = '';
    let n = 0;
    M.parts.filter(p => p.hot).forEach(p => {
      n++; p.n = n;
      const b = document.createElement('button'); b.className = 'v3d-dot'; b.textContent = n; b.setAttribute('aria-label', n + '. ' + p.title);
      b.onclick = () => select(p); hotLayer.appendChild(b); p.dot = b;
      const li = document.createElement('li'), lb = document.createElement('button'); lb.innerHTML = '<span>' + n + '</span>' + p.title; lb.onclick = () => select(p); li.appendChild(lb); list.appendChild(li); p.item = lb;
    });
    sw().forEach((b, j) => b.setAttribute('aria-pressed', j === i ? 'true' : 'false'));
    if (sel) { const again = M.parts.find(p => p.key === sel.key); sel = null; if (again) select(again, true); }
    $('.v3d-load').hidden = true;
  }
  function highlight(p, on) { p.g.traverse(n => { if (n.material) [].concat(n.material).forEach(m => { if (m.emissive && !m.emissiveMap) m.emissive.set(on ? '#2E2306' : '#000000'); }); }); }
  function select(p, quiet) {
    if (sel) { highlight(sel, false); sel.dot && sel.dot.classList.remove('on'); sel.item && sel.item.removeAttribute('aria-current'); }
    sel = p; highlight(p, true); p.dot && p.dot.classList.add('on'); p.item && p.item.setAttribute('aria-current', 'true');
    $('.v3d-detail').innerHTML = '<div class="v3d-eyebrow">Pieza ' + (p.n || '') + '</div><h3>' + p.title + '</h3><p>' + p.text + '</p>';
    if (p.opens && exTarget === 0 && !quiet) setOpen(true);
  }
  const openPos = () => home.target.clone().add(V(1, 0.35, 0.6).normalize().multiplyScalar(home.dist * 1.3));
  function setOpen(on) {
    if (glb) return;
    exTarget = on ? 1 : 0; const b = $('.v3d-open'); b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.textContent = on ? 'Cerrar el reloj' : 'Abrir el reloj';
    camAnim = { from: camera.position.clone(), to: on ? openPos() : home.pos.clone(), t: 0 };
    if (reduce) { explode = exTarget; camera.position.copy(camAnim.to); camAnim = null; }
  }
  $('.v3d-open').onclick = () => setOpen(exTarget === 0);
  $('.v3d-spin').onclick = e => { controls.autoRotate = !controls.autoRotate; e.currentTarget.setAttribute('aria-pressed', String(controls.autoRotate)); };
  $('.v3d-reset').onclick = () => { controls.target.copy(home.target); camAnim = { from: camera.position.clone(), to: exTarget ? openPos() : home.pos.clone(), t: reduce ? 1 : 0 }; };
  sw().forEach(b => b.onclick = () => { const i = +b.getAttribute('data-i'); if (!glb) load(i); else sw().forEach((x, j) => x.setAttribute('aria-pressed', j === i ? 'true' : 'false')); onColor && onColor(i); });

  function resize() { const w = stage.clientWidth, h = stage.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  const ro = new ResizeObserver(resize); ro.observe(stage);

  const tmp = V(0, 0, 0), nrm = V(0, 0, 0), toCam = V(0, 0, 0);
  let raf, t = 0, lowQ = false; const perf = { n: 0, s: 0 };
  /* Dispositivos lentos: menos resolución y cristal sin refracción */
  function degrade() {
    lowQ = true; renderer.setPixelRatio(1); resize();
    scene.traverse(n => { if (n.material && n.material.transmission) { n.material.transmission = 0; n.material.opacity = 0.12; n.material.needsUpdate = true; } });
  }
  function frame() {
    raf = requestAnimationFrame(frame);
    const raw = clock.getDelta(), dt = Math.min(raw, 0.05); t += dt;
    if (!lowQ && M) { perf.n++; perf.s += raw; if (perf.n === 40) { if (perf.s / 40 > 0.05) degrade(); perf.n = 0; perf.s = 0; } }
    if (M && !glb) {
      explode += (exTarget - explode) * Math.min(1, dt * 4);
      const e = ease(Math.min(1, Math.max(0, explode)));
      M.parts.forEach(p => {
        p.g.position.copy(p.base).addScaledVector(p.off, e);
        p.g.rotation.set(p.baseRot.x + p.rot.x * e, p.baseRot.y + p.rot.y * e, p.baseRot.z + p.rot.z * e);
        if (p.split) p.g.children.forEach(h => { if (h.userData.sy) h.position.y = h.userData.sy * 12 * e; });
        if (p.key === 'tapa') p.g.position.x = p.base.x - 18 * e;
      });
      M.tick.forEach(f => f(dt, t));
    }
    if (camAnim) { camAnim.t = Math.min(1, camAnim.t + dt / 0.9); camera.position.lerpVectors(camAnim.from, camAnim.to, ease(camAnim.t)); if (camAnim.t >= 1) camAnim = null; }
    controls.update();
    renderer.render(scene, camera);
    if (!M || glb) return;
    const w = stage.clientWidth, h = stage.clientHeight;
    camera.getWorldPosition(toCam);
    M.parts.forEach(p => {
      if (!p.dot) return;
      p.anchorObj.getWorldPosition(tmp);
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
    dispose(scene); controls.dispose(); renderer.dispose();
    el.remove(); document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('.v3d-x').onclick = close;
  document.addEventListener('keydown', onKey);
  resize();
  /* Modelo profesional opcional: assets/models/<id>.glb */
  const glbUrl = new URL('../assets/models/' + product.id + '.glb', import.meta.url).href;
  (spec.glb ? import('./vendor/GLTFLoader.js').then(m => new Promise((ok, ko) => new m.GLTFLoader().load(glbUrl, ok, undefined, ko))) : Promise.reject(new Error('sin glb'))).then(gltf => {
    glb = true; M = { root: gltf.scene, parts: [], tick: [] };
    const size = new THREE.Box3().setFromObject(gltf.scene).getSize(V(0, 0, 0)).length();
    gltf.scene.scale.setScalar(60 / size); scene.add(gltf.scene); frameModel(gltf.scene);
    $('.v3d-open').hidden = true; $('.v3d-list').hidden = true; $('.v3d-load').hidden = true;
  }).catch(() => load(ci));
  frame();
}
