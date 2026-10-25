/* Catálogo Lovely — generado también por el panel administrativo (admin.html).
   price: número en COP (0 = "Precio por confirmar"). stock: unidades disponibles.
   Las fotos están en assets/products/ (nombre.webp grande y nombre-sm.webp miniatura).
   modelo3d: true si el reloj tiene vista 3D en js/visor3d.js. */
window.LV_CONFIG = {
  "whatsapp": "573122207234",
  "instagram": "https://www.instagram.com/lovely_accesori0s?dlrf=YXQ0cWV1ZDgxNmdy",
  "tiktok": "https://tiktok.com/",
  "facebook": "https://www.facebook.com/share/19tQ1fWbon/?mibextid=wwXIfr",
  "anuncioTitulo": "ENVÍOS A TODA COLOMBIA",
  "anuncioTexto": "Compra fácil por WhatsApp",
  "entregaDias": "3-5",
  "cambiosDias": "30",
  "garantiaDias": "365",
  "email": "Lovelyaccesorios182@gmail.com",
  // SEO y metadatos globales
  "seoTitle": "Lovely | Gorras, gafas y relojes con estilo en Colombia",
  "seoDescription": "Accesorios de moda: relojes, gorras y gafas. Envíos a toda Colombia. Compra fácil por WhatsApp, con envío a todo el país. Garantía y cambios fáciles.",
  "seoKeywords": "relojes, gorras, gafas, accesorios, moda, Colombia, Lovely",
  // Hero principal (index.html)
  "heroTitulo": "Pequeños detalles, grandes estilos",
  "heroSubtitulo": "Seleccionamos cada accesorio pensando en personas que quieren destacar sin decir una palabra. Diseño, originalidad y confianza en cada detalle.",
  "heroBotonTexto": "Comprar ahora",
  "heroBotonLink": "tienda.html",
  "heroImagen": "assets/img/hero-main.webp",
  // Nosotros
  "nosotrosTitulo": "Nuestra historia",
  "nosotrosTexto": "Lovely nace en 2022 con una idea simple: los accesorios no son un complemento, son la firma de tu estilo. Cada reloj, gorra y gafa que seleccionamos pasa por un filtro de diseño, calidad y autenticidad. No vendemos catálogo, curamos piezas que enamoran.",
  "nosotrosImagen": "assets/img/nosotros.webp",
  // Promociones activas (banner superior, popups, etc.)
  "promociones": [
    {"id":"envio-gratis","tipo":"banner","activo":true,"titulo":"ENVÍO GRATIS","texto":"En pedidos superiores a $200.000 COP","color":"#111111","textoColor":"#D4AF37"},
    {"id":"primera-compra","tipo":"popup","activo":false,"titulo":"¡BIENVENIDO!","texto":"Suscríbete y obtén 10% OFF en tu primera compra","color":"#D4AF37","textoColor":"#111111","codigo":"WELCOME10"}
  ]
};

window.LV_CATEGORIES = [
  {"slug":"relojes","name":"Relojes","icon":"reloj","cover":"reloj-naviforce-7105-2"},
  {"slug":"gorras","name":"Gorras","icon":"gorra","cover":"gorra-caballo-1"},
  {"slug":"gafas","name":"Gafas","icon":"gafas","cover":"gafas-club-classic-2"}
];

// Preguntas frecuentes editables desde admin
window.LV_FAQS = [
  {"categoria":"pagos","orden":1,"pregunta":"¿Cómo puedo comprar?","respuesta":"Armas tu pedido en la web y lo confirmas por WhatsApp. Allí coordinamos el pago (Nequi, transferencia o contra entrega) y el envío."},
  {"categoria":"pagos","orden":2,"pregunta":"¿Es seguro comprar en la web?","respuesta":"Sí. No pedimos ni almacenamos datos de tarjeta. Solo usamos tus datos de contacto y envío para gestionar el pedido, con tu autorización (Ley 1581/2012)."},
  {"categoria":"pagos","orden":3,"pregunta":"¿Puedo pagar contra entrega?","respuesta":"Sí, disponible en ciudades principales con cobertura de Inter Rapidísimo. Tiene un costo adicional de $15.000 COP. Verifica en el checkout si tu ciudad aplica."},
  {"categoria":"envios","orden":1,"pregunta":"¿Hacen envíos a toda Colombia?","respuesta":"Sí, enviamos a todo el país a través de Inter Rapidísimo y Servientrega. Llegamos a más de 1.100 municipios."},
  {"categoria":"envios","orden":2,"pregunta":"¿Cuánto tarda mi pedido?","respuesta":"Ciudades principales: 2–3 días hábiles. Resto del país: 3–5 días hábiles. Zonas de difícil acceso: hasta 7 días hábiles."},
  {"categoria":"envios","orden":3,"pregunta":"¿Cuánto cuesta el envío?","respuesta":"Envío estándar: $12.000 COP. Express: $18.000 COP. Contra entrega: $15.000 COP. <strong>Envío gratis en pedidos mayores a $200.000 COP.</strong> El costo exacto se calcula en el checkout según tu ciudad."},
  {"categoria":"garantias","orden":1,"pregunta":"¿Mis productos tienen garantía?","respuesta":"Sí. Todos los productos tienen garantía legal de <strong>1 año (365 días)</strong> por defectos de fabricación (Ley 1480/2011). Relojes y gafas: 1 año. Gorras y textiles: 6 meses."},
  {"categoria":"garantias","orden":2,"pregunta":"¿Cómo hago efectiva la garantía?","respuesta":"Escríbenos por WhatsApp con tu número de pedido, fotos del producto y descripción del problema. Te respondemos en <24h y coordinamos el cambio o reparación sin costo si aplica garantía."},
  {"categoria":"cambios","orden":1,"pregunta":"¿Puedo cambiar un producto?","respuesta":"Sí, dentro de <strong>30 días</strong> después de recibirlo. El producto debe estar sin uso, con etiquetas, empaque original y en perfectas condiciones."},
  {"categoria":"cambios","orden":2,"pregunta":"¿Quién paga el envío del cambio?","respuesta":"Por cambio de talla/color/gusto: el cliente cubre el envío de ida ($12.000). Por defecto de fábrica o error nuestro: Lovely cubre ambos envíos."},
  {"categoria":"cambios","orden":3,"pregunta":"¿Cómo solicito un cambio?","respuesta":"Escríbenos por WhatsApp con tu número de pedido y el motivo. Te enviamos la guía de devolución y coordinamos el envío del nuevo producto."}
];

// Descuentos y códigos promocionales
window.LV_DISCOUNTS = [
  {"id":"welcome10","codigo":"WELCOME10","tipo":"porcentaje","valor":10,"descripcion":"10% descuento primera compra","activo":true,"usosMax":1,"usosActuales":0,"fechaInicio":"2026-01-01","fechaFin":"2027-12-31","minCompra":0,"aplicaA":"todo"},
  {"id":"envio-gratis-200k","codigo":null,"tipo":"envio_gratis","valor":0,"descripcion":"Envío gratis pedidos >$200k","activo":true,"usosMax":null,"usosActuales":0,"fechaInicio":"2026-01-01","fechaFin":"2027-12-31","minCompra":200000,"aplicaA":"todo"}
];

// Contenido de páginas editables
window.LV_PAGES = {
  "index": {
    "hero": {"titulo":"Pequeños detalles, grandes estilos","subtitulo":"Seleccionamos cada accesorio pensando en personas que quieren destacar sin decir una palabra. Diseño, originalidad y confianza en cada detalle.","btnTexto":"Comprar ahora","btnLink":"tienda.html","imagen":"assets/img/hero-main.webp"},
    "stats": [
      {"icon":"📦","numero":"1.000+","label":"Clientes felices"},
      {"icon":"🚚","numero":"100%","label":"Cobertura Colombia"},
      {"icon":"🔒","numero":"Seguro","label":"Pago protegido"},
      {"icon":"🔄","numero":"30 días","label":"Cambios fáciles"}
    ],
    "promo": {"titulo":"Colección Destacada","subtitulo":"Nuestros favoritos de la temporada","imagen":"assets/img/promo-main.webp","btnTexto":"Ver colección","btnLink":"tienda.html?cat=relojes"}
  },
  "nosotros": {
    "hero": {"titulo":"Nuestra historia","subtitulo":"Pequeños detalles, grandes estilos","imagen":"assets/img/nosotros.webp"},
    "historia": "Lovely nace en 2022 con una idea simple: los accesorios no son un complemento, son la firma de tu estilo. Cada reloj, gorra y gafa que seleccionamos pasa por un filtro de diseño, calidad y autenticidad. No vendemos catálogo, curamos piezas que enamoran.",
    "valores": [
      {"icon":"✨","titulo":"Curación real","texto":"Probamos y seleccionamos cada pieza. Si no nos gusta a nosotros, no la vendemos."},
      {"icon":"🤝","titulo":"Confianza total","texto":"Garantía real, cambios fáciles, atención por WhatsApp. Sin letra chica."},
      {"icon":"🇨🇴","titulo":"Hecho en Colombia","texto":"Operamos desde Medellín, enviamos a todo el país, generamos empleo local."}
    ],
    "equipo": [
      {"nombre":"Juan Pérez","rol":"Fundador & CEO","foto":"assets/img/team-1.webp"},
      {"nombre":"María Gómez","rol":"Directora de Producto","foto":"assets/img/team-2.webp"},
      {"nombre":"Carlos Ruiz","rol":"Experiencia del Cliente","foto":"assets/img/team-3.webp"}
    ]
  },
  "contacto": {
    "hero": {"titulo":"Hablemos","subtitulo":"Estamos para ayudarte. Respuesta por WhatsApp en minutos.","imagen":""},
    "horario": "Lunes a Viernes: 8:00 AM – 6:00 PM · Sábados: 9:00 AM – 1:00 PM",
    "direccion": "Medellín, Antioquia · Colombia",
    "email": "Lovelyaccesorios182@gmail.com"
  }
};

window.LV_PRODUCTS = [
  {"id":"reloj-t5-square","name":"Reloj T5 Square Chrono","brand":"T5","cat":"relojes","badge":"Más vendido","top":true,"nuevo":false,"stock":10,"price":90000,"desc":"Caja cuadrada, cronógrafo a la vista y correa de silicona. Un reloj con carácter deportivo que se nota desde lejos.","colors":[{"name":"Negro","hex":"#111111","img":"reloj-t5-square-1"},{"name":"Naranja","hex":"#E2632B","img":"reloj-t5-square-2"},{"name":"Rojo","hex":"#B3261E","img":"reloj-t5-square-3"},{"name":"Verde lima","hex":"#9BC53D","img":"reloj-t5-square-4"},{"name":"Azul petróleo","hex":"#1F4E5A","img":"reloj-t5-square-5"}],"extra":["reloj-t5-square-x1","reloj-t5-square-x2"],"modelo3d":false},
  {"id":"reloj-joefox-sport","name":"Reloj Joefox Sport Dual","brand":"Joefox","cat":"relojes","badge":"","top":false,"nuevo":true,"stock":10,"price":90000,"desc":"Analógico y digital en una sola esfera. Resistente, ligero y listo para el gimnasio o la calle.","colors":[{"name":"Negro y lima","hex":"#111111","img":"reloj-joefox-sport-1"},{"name":"Azul","hex":"#1F3A73","img":"reloj-joefox-sport-2"}],"extra":[],"modelo3d":false},
  {"id":"reloj-joefox-steel","name":"Reloj Joefox Steel Gold","brand":"Joefox","cat":"relojes","badge":"Nuevo","top":false,"nuevo":true,"stock":10,"price":90000,"desc":"Acero con detalles dorados y doble pantalla. Presencia de sobra para el día a día.","colors":[{"name":"Acero y dorado","hex":"#B8B8B8","img":"reloj-joefox-steel-1"}],"extra":[],"modelo3d":false},
  {"id":"reloj-curren-elegance","name":"Reloj Curren Elegance","brand":"Curren","cat":"relojes","badge":"","top":false,"nuevo":false,"stock":10,"price":90000,"desc":"Números romanos y brazalete metálico. Elegancia clásica para llevar todos los días.","colors":[{"name":"Dorado","hex":"#D4AF37","img":"reloj-curren-elegance-1"},{"name":"Plateado rosa","hex":"#C9C9C9","img":"reloj-curren-elegance-2"}],"extra":[],"modelo3d":false},
  {"id":"reloj-curren-crystal","name":"Reloj Curren Crystal","brand":"Curren","cat":"relojes","badge":"Ideal para regalo","top":true,"nuevo":false,"stock":10,"price":90000,"desc":"Bisel con brillos y esfera delicada. El detalle que completa un look femenino y sofisticado.","colors":[{"name":"Nácar bicolor","hex":"#E8DCCB","img":"reloj-curren-crystal-1"},{"name":"Oro rosa noche","hex":"#B76E79","img":"reloj-curren-crystal-2"},{"name":"Plateado brillo","hex":"#C9C9C9","img":"reloj-curren-crystal-3"},{"name":"Oro rosa azul","hex":"#B76E79","img":"reloj-curren-crystal-4"}],"extra":[],"modelo3d":false},
  {"id":"reloj-skmei-skull","name":"Reloj SKMEI Skull Diver","brand":"SKMEI","cat":"relojes","badge":"Edición limitada","top":false,"nuevo":true,"stock":4,"price":90000,"desc":"Estilo buzo con esfera de calavera en relieve. Para quienes prefieren no pasar desapercibidos.","colors":[{"name":"Rojo","hex":"#B3261E","img":"reloj-skmei-skull-1"},{"name":"Verde","hex":"#1E6B3A","img":"reloj-skmei-skull-2"},{"name":"Azul y rojo","hex":"#1F3A73","img":"reloj-skmei-skull-3"},{"name":"Azul","hex":"#1F4FA0","img":"reloj-skmei-skull-4"}],"extra":[],"modelo3d":false},
  {"id":"reloj-naviforce-dual","name":"Reloj Naviforce Dual Steel","brand":"Naviforce","cat":"relojes","badge":"Top","top":true,"nuevo":false,"stock":10,"price":90000,"desc":"Acero sólido, pantalla analógica y digital. Un reloj robusto con acabado premium.","colors":[{"name":"Negro y oro rosa","hex":"#111111","img":"reloj-naviforce-dual-1"},{"name":"Plateado azul","hex":"#1F3A73","img":"reloj-naviforce-dual-2"},{"name":"Plateado negro","hex":"#C9C9C9","img":"reloj-naviforce-dual-3"},{"name":"Negro total","hex":"#111111","img":"reloj-naviforce-dual-4"}],"extra":["reloj-naviforce-dual-x1","reloj-naviforce-dual-x2","reloj-naviforce-dual-x3"],"modelo3d":false},
  {"id":"reloj-naviforce-7105","name":"Reloj Naviforce 7105","brand":"Naviforce","cat":"relojes","badge":"Nuevo","top":false,"nuevo":true,"stock":10,"price":90000,"desc":"Caja tonneau y cronógrafo audaz. Diseño de alta gama con presencia en la muñeca.","colors":[{"name":"Negro oro rosa","hex":"#111111","img":"reloj-naviforce-7105-1"},{"name":"Dorado","hex":"#D4AF37","img":"reloj-naviforce-7105-2"},{"name":"Negro","hex":"#3A3A3A","img":"reloj-naviforce-7105-3"},{"name":"Negro dorado","hex":"#111111","img":"reloj-naviforce-7105-4"},{"name":"Azul","hex":"#1F3A73","img":"reloj-naviforce-7105-5"}],"extra":[],"modelo3d":false},
  {"id":"reloj-naviforce-sport","name":"Reloj Naviforce Sport","brand":"Naviforce","cat":"relojes","badge":"","top":false,"nuevo":false,"stock":10,"price":90000,"desc":"Esfera grande, correa cómoda y doble hora. Deportivo sin perder estilo.","colors":[{"name":"Café","hex":"#5A3A22","img":"reloj-naviforce-sport-1"},{"name":"Negro","hex":"#111111","img":"reloj-naviforce-sport-2"},{"name":"Azul","hex":"#1F3A73","img":"reloj-naviforce-sport-3"},{"name":"Negro oro rosa","hex":"#B76E79","img":"reloj-naviforce-sport-4"}],"extra":[],"modelo3d":false},
  {"id":"reloj-cason-classic","name":"Reloj Cason Classic","brand":"Cason","cat":"relojes","badge":"Nuevo","top":false,"nuevo":true,"stock":10,"price":90000,"desc":"Líneas limpias, esferas de color profundo y brazalete integrado. El clásico moderno que combina con todo.","colors":[{"name":"Negro","hex":"#111111","img":"reloj-cason-classic-1"},{"name":"Rojo","hex":"#8E1B1B","img":"reloj-cason-classic-2"},{"name":"Celeste","hex":"#9CC9E0","img":"reloj-cason-classic-3"},{"name":"Morado","hex":"#4B2C83","img":"reloj-cason-classic-4"},{"name":"Verde","hex":"#1E5B3A","img":"reloj-cason-classic-5"},{"name":"Champaña","hex":"#CFC4AE","img":"reloj-cason-classic-6"}],"extra":[],"modelo3d":false},
  {"id":"reloj-iced-crystal","name":"Reloj Iced Crystal","brand":"Mayamia","cat":"relojes","badge":"Ideal para regalo","top":true,"nuevo":false,"stock":4,"price":90000,"desc":"Esfera y bisel con brillos, correa de silicona. Brillo total para destacar en cualquier ocasión.","colors":[{"name":"Blanco","hex":"#F5F5F5","img":"reloj-iced-crystal-1"},{"name":"Negro","hex":"#111111","img":"reloj-iced-crystal-2"},{"name":"Dorado y negro","hex":"#D4AF37","img":"reloj-iced-crystal-3"},{"name":"Dorado y blanco","hex":"#E8D9A8","img":"reloj-iced-crystal-4"},{"name":"Oro rosa","hex":"#E2B9A8","img":"reloj-iced-crystal-5"}],"extra":[],"modelo3d":false},
  {"id":"reloj-bariu-estuche","name":"Reloj Bariu con Estuche","brand":"Bariu","cat":"relojes","badge":"Ideal para regalo","top":false,"nuevo":false,"stock":10,"price":90000,"desc":"Llega en su estuche, listo para regalar. Brazalete metálico y bisel con brillos.","colors":[{"name":"Plateado","hex":"#C9C9C9","img":"reloj-bariu-estuche-1"},{"name":"Dorado","hex":"#D4AF37","img":"reloj-bariu-estuche-2"}],"extra":[],"modelo3d":false},
  {"id":"reloj-skmei-chrono","name":"Reloj SKMEI Chrono","brand":"SKMEI","cat":"relojes","badge":"","top":false,"nuevo":false,"stock":10,"price":90000,"desc":"Cronógrafo de acero con subesferas. Estilo ejecutivo a un precio accesible.","colors":[{"name":"Azul y negro","hex":"#1F3A73","img":"reloj-skmei-chrono-1"},{"name":"Bicolor","hex":"#D4AF37","img":"reloj-skmei-chrono-2"},{"name":"Blanco y rojo","hex":"#F5F5F5","img":"reloj-skmei-chrono-3"},{"name":"Acero","hex":"#C9C9C9","img":"reloj-skmei-chrono-4"}],"extra":[],"modelo3d":false},
  {"id":"reloj-skmei-skeleton","name":"Reloj SKMEI Skeleton Date","brand":"SKMEI","cat":"relojes","badge":"Nuevo","top":false,"nuevo":true,"stock":10,"price":90000,"desc":"Maquinaria a la vista y fecha en rodillos. Acero plateado con un diseño mecánico que no pasa desapercibido.","colors":[{"name":"Plateado","hex":"#C9C9C9","img":"reloj-skmei-skeleton-1"}],"extra":[],"modelo3d":false},
  {"id":"reloj-diray-digital","name":"Reloj Diray Digital","brand":"Diray","cat":"relojes","badge":"","top":false,"nuevo":true,"stock":10,"price":90000,"desc":"Digital, ligero y resistente. Perfecto para entrenar o para un look urbano relajado.","colors":[{"name":"Azul","hex":"#1F3A73","img":"reloj-diray-digital-1"},{"name":"Dorado","hex":"#D4AF37","img":"reloj-diray-digital-2"},{"name":"Rojo","hex":"#B3261E","img":"reloj-diray-digital-3"},{"name":"Negro","hex":"#111111","img":"reloj-diray-digital-4"},{"name":"Oro rosa","hex":"#E2B9A8","img":"reloj-diray-digital-5"}],"extra":[],"modelo3d":false},
  {"id":"gorra-mtn-brahman","name":"Gorra MTN Brahman","brand":"MTN","cat":"gorras","badge":"Más vendido","top":true,"nuevo":false,"stock":10,"price":50000,"desc":"Placa metálica frontal y bordado en la visera. Estilo campestre con acabado premium.","colors":[{"name":"Gris","hex":"#7A7A7A","img":"gorra-mtn-brahman-1"},{"name":"Negro","hex":"#111111","img":"gorra-mtn-brahman-2"},{"name":"Beige","hex":"#CDB38B","img":"gorra-mtn-brahman-3"},{"name":"Crema","hex":"#EDE6D6","img":"gorra-mtn-brahman-4"}],"extra":[]},
  {"id":"visera-sun","name":"Visera Sun","brand":"Lovely","cat":"gorras","badge":"Nuevo","top":false,"nuevo":true,"stock":10,"price":50000,"desc":"Ala ancha para el sol y ajuste cómodo. El accesorio infaltable para la playa o el piscinazo.","colors":[{"name":"Beige","hex":"#D9CBB0","img":"visera-sun-1"},{"name":"Gris","hex":"#BDBDBD","img":"visera-sun-2"}],"extra":[]},
  {"id":"gorra-heart-pin","name":"Gorra Heart Pin","brand":"Lovely","cat":"gorras","badge":"Ideal para regalo","top":true,"nuevo":false,"stock":10,"price":50000,"desc":"Textura acolchada y pin de corazón con brillo. Femenina, delicada y diferente.","colors":[{"name":"Oliva","hex":"#7A7343","img":"gorra-heart-pin-1"},{"name":"Negro","hex":"#111111","img":"gorra-heart-pin-2"},{"name":"Rosa","hex":"#E9C9C9","img":"gorra-heart-pin-3"}],"extra":[]},
  {"id":"gorra-u-gotica","name":"Gorra U Gótica","brand":"Lovely","cat":"gorras","badge":"","top":false,"nuevo":false,"stock":10,"price":50000,"desc":"Letra gótica bordada en relieve. Un clásico urbano con actitud.","colors":[{"name":"Azul noche","hex":"#1C2541","img":"gorra-u-gotica-1"},{"name":"Negro","hex":"#111111","img":"gorra-u-gotica-2"},{"name":"Café","hex":"#4A3326","img":"gorra-u-gotica-3"}],"extra":[]},
  {"id":"gorra-caballo","name":"Gorra Caballo Ventiquero","brand":"Lovely","cat":"gorras","badge":"Más vendido","top":true,"nuevo":true,"stock":10,"price":50000,"desc":"Bordado de caballo en relieve y visera bicolor. Una gorra con identidad propia.","colors":[{"name":"Café","hex":"#5A3A22","img":"gorra-caballo-1"},{"name":"Rosa","hex":"#E9B8C5","img":"gorra-caballo-2"},{"name":"Crema y rosa","hex":"#EDE6D6","img":"gorra-caballo-3"},{"name":"Negro y dorado","hex":"#111111","img":"gorra-caballo-4"},{"name":"Negro y blanco","hex":"#3A3A3A","img":"gorra-caballo-5"}],"extra":[]},
  {"id":"gorra-shield","name":"Gorra Shield","brand":"Lovely","cat":"gorras","badge":"","top":false,"nuevo":true,"stock":10,"price":50000,"desc":"Diseño limpio con escudo metálico. Minimalista y elegante.","colors":[{"name":"Negro","hex":"#111111","img":"gorra-shield-1"},{"name":"Blanco","hex":"#F5F5F5","img":"gorra-shield-2"},{"name":"Beige","hex":"#CDB38B","img":"gorra-shield-3"}],"extra":[]},
  {"id":"gorra-cruz","name":"Gorra Cruz","brand":"Lovely","cat":"gorras","badge":"","top":false,"nuevo":false,"stock":10,"price":50000,"desc":"Cruz bordada sobre negro. Sobria, fuerte y con significado.","colors":[{"name":"Blanco sobre negro","hex":"#111111","img":"gorra-cruz-1"},{"name":"Rojo sobre negro","hex":"#B3261E","img":"gorra-cruz-2"}],"extra":[]},
  {"id":"gafas-club-classic","name":"Gafas Club Classic","brand":"Lovely","cat":"gafas","badge":"Top","top":true,"nuevo":false,"stock":10,"price":30000,"desc":"Montura club atemporal. El toque que eleva cualquier outfit, de día o de noche.","colors":[{"name":"Negro","hex":"#111111","img":"gafas-club-classic-1"},{"name":"Negro y dorado","hex":"#D4AF37","img":"gafas-club-classic-2"},{"name":"Carey","hex":"#6B4226","img":"gafas-club-classic-3"}],"extra":[]},
  {"id":"gafas-sport-shield","name":"Gafas Sport Shield","brand":"Lovely","cat":"gafas","badge":"Nuevo","top":false,"nuevo":true,"stock":10,"price":30000,"desc":"Lente panorámico espejado. Para quienes viven en movimiento.","colors":[{"name":"Amarillo espejo","hex":"#E8C547","img":"gafas-sport-shield-1"},{"name":"Verde espejo","hex":"#3BAA6B","img":"gafas-sport-shield-2"},{"name":"Fuego espejo","hex":"#D9483B","img":"gafas-sport-shield-3"}],"extra":[]}
];
