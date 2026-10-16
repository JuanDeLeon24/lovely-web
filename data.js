/* Catálogo de muestra — reemplazar nombres, precios y fotos por los reales.
   price: número en COP (0 = pendiente, se muestra "$ [PRECIO]") */
window.LV_CONFIG = {
  whatsapp: '57XXXXXXXXXX',        // número con indicativo, sin + ni espacios
  instagram: 'https://instagram.com/',
  tiktok: 'https://tiktok.com/',
  facebook: 'https://facebook.com/'
};

window.LV_CATEGORIES = [
  { slug: 'gorras', name: 'Gorras', icon: 'gorra' },
  { slug: 'gafas', name: 'Gafas', icon: 'gafas' },
  { slug: 'relojes', name: 'Relojes', icon: 'reloj' },
  { slug: 'pulseras', name: 'Pulseras', icon: 'pulsera' },
  { slug: 'cadenas', name: 'Cadenas', icon: 'cadena' },
  { slug: 'accesorios', name: 'Accesorios', icon: 'accesorio' }
];

window.LV_PRODUCTS = [
  { id: 'gorra-classic-black', name: 'Gorra Classic Black', cat: 'gorras', badge: 'Más vendido', top: true, nuevo: false, stock: 12, price: 0, colors: ['Negro carbón', 'Grafito'], desc: 'La gorra que combina con todo. Silueta estructurada, visera curva y acabado mate para un look urbano limpio.' },
  { id: 'gafas-aviator-gold', name: 'Gafas Aviator Gold', cat: 'gafas', badge: 'Más vendido', top: true, nuevo: false, stock: 4, price: 0, colors: ['Dorado', 'Negro carbón', 'Grafito'], desc: 'Un clásico reinterpretado. Montura metálica ligera con acabado dorado que eleva cualquier outfit, del día a la noche.' },
  { id: 'reloj-minimal-carbon', name: 'Reloj Minimal Carbón', cat: 'relojes', badge: 'Top', top: true, nuevo: false, stock: 8, price: 0, colors: ['Negro carbón'], desc: 'Esfera limpia, presencia total. Un reloj pensado para quienes dicen mucho sin decir nada.' },
  { id: 'cadena-cubana-dorada', name: 'Cadena Cubana Dorada', cat: 'cadenas', badge: 'Top', top: true, nuevo: false, stock: 6, price: 0, colors: ['Dorado'], desc: 'Eslabón cubano con brillo sutil. El detalle que completa tu estilo.' },
  { id: 'pulsera-eslabon-onyx', name: 'Pulsera Eslabón Onyx', cat: 'pulseras', badge: 'Nuevo', top: false, nuevo: true, stock: 10, price: 0, colors: ['Negro carbón', 'Dorado'], desc: 'Contraste negro y dorado para la muñeca. Ligera, cómoda y con carácter.' },
  { id: 'gorra-urban-sand', name: 'Gorra Urban Sand', cat: 'gorras', badge: 'Nuevo', top: false, nuevo: true, stock: 9, price: 0, colors: ['Arena'], desc: 'Tono neutro para looks relajados. Ajuste trasero y tela respirable.' },
  { id: 'gafas-square-noir', name: 'Gafas Square Noir', cat: 'gafas', badge: 'Nuevo', top: false, nuevo: true, stock: 7, price: 0, colors: ['Negro carbón'], desc: 'Montura cuadrada y lentes oscuros. Actitud desde el primer vistazo.' },
  { id: 'reloj-steel-gold', name: 'Reloj Steel Gold', cat: 'relojes', badge: 'Edición limitada', top: false, nuevo: true, stock: 3, price: 0, colors: ['Dorado', 'Plateado'], desc: 'Acero con detalles dorados. Una pieza para ocasiones que merecen recordarse.' },
  { id: 'estuche-premium-lv', name: 'Estuche Premium LV', cat: 'accesorios', badge: 'Ideal para regalo', top: false, nuevo: false, stock: 20, price: 0, colors: ['Negro carbón'], desc: 'Presenta tu regalo como se merece. Estuche rígido con monograma LV.' },
  { id: 'gorra-trucker-graphite', name: 'Gorra Trucker Graphite', cat: 'gorras', badge: 'Top', top: true, nuevo: false, stock: 5, price: 0, colors: ['Grafito'], desc: 'Malla trasera y frente estructurado. Clásico urbano en gris grafito.' },
  { id: 'gafas-round-vintage', name: 'Gafas Round Vintage', cat: 'gafas', badge: 'Nuevo', top: false, nuevo: true, stock: 0, price: 0, colors: ['Dorado'], desc: 'Lentes redondos con aire retro. Para un estilo que no pasa de moda.' },
  { id: 'cadena-rope-silver', name: 'Cadena Rope Silver', cat: 'cadenas', badge: 'Nuevo', top: false, nuevo: true, stock: 11, price: 0, colors: ['Plateado'], desc: 'Trenzado tipo cuerda con brillo plateado. Discreta y con presencia.' }
];
