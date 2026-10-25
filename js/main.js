/* Lovely · LV Accesorios — interacciones del sitio (sin dependencias) */
(function () {
  'use strict';
  var C = window.LV_CONFIG, CATS = window.LV_CATEGORIES, PRODUCTS = window.LV_PRODUCTS;
  var page = document.body.getAttribute('data-page') || '';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Iconos ---------- */
  var I = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 20l1.3-4A8 8 0 1 1 8 19z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    moon: '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
    sun: '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>'
  };
  var icon = function (name, tone) { return 'assets/icons/' + name + '-' + (tone || 'gris') + '.svg'; };
  var catOf = function (slug) { return CATS.filter(function (c) { return c.slug === slug; })[0] || CATS[0]; };
  var money = function (n) { return n ? '$ ' + n.toLocaleString('es-CO') : 'Precio por confirmar'; };
  var photo = function (n, sm) { return 'assets/products/' + n + (sm ? '-sm' : '') + '.webp'; };
  var colorImg = function (p, colorName) { var c = p.colors.filter(function (x) { return x.name === colorName; })[0] || p.colors[0]; return c.img; };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); };
  var waLink = function (msg) { return 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(msg || 'Hola Lovely, quiero más información.'); };

  /* ---------- Almacenamiento seguro ---------- */
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ---------- Carrito ---------- */
  var Cart = {
    items: function () { return load('lv_cart', []); },
    set: function (it) { save('lv_cart', it); Cart.badge(); },
    add: function (id, color, qty) {
      var it = Cart.items(), f = it.filter(function (x) { return x.id === id && x.color === color; })[0];
      if (f) f.qty += qty; else it.push({ id: id, color: color, qty: qty });
      Cart.set(it);
    },
    remove: function (i) { var it = Cart.items(); it.splice(i, 1); Cart.set(it); },
    count: function () { return Cart.items().reduce(function (a, x) { return a + x.qty; }, 0); },
    badge: function () { $$('.cart-count').forEach(function (b) { var n = Cart.count(); b.textContent = n; b.setAttribute('data-n', n); }); }
  };

  function toast(msg) {
    var t = $('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* ---------- Header / footer compartidos ---------- */
  function navLinks() {
    return '<a href="tienda.html?filtro=nuevos">Novedades</a>' + CATS.map(function (c) {
      return '<a href="tienda.html?cat=' + c.slug + '">' + c.name + '</a>';
    }).join('');
  }
  function renderChrome() {
    var h = $('#site-header');
    if (h) {
      h.outerHTML =
        '<div class="announce"><b>' + esc(C.anuncioTitulo || 'ENVÍOS A TODA COLOMBIA') + '</b>' + (C.anuncioTexto ? ' · ' + esc(C.anuncioTexto) : '') + '</div>' +
        '<header class="header"><div class="wrap">' +
        '<button class="icon-btn menu-btn" aria-label="Abrir menú" aria-expanded="false">' + I.menu + '</button>' +
        '<a class="logo" href="index.html" aria-label="Lovely, ir al inicio"><img src="assets/img/logo-negro.svg" alt="LV Accesorios" width="292" height="71"></a>' +
        '<nav class="nav" aria-label="Principal">' + navLinks() + '</nav>' +
        '<div class="h-actions"><button class="icon-btn theme-btn" type="button">' + I.moon + I.sun + '</button>' +
        '<a class="icon-btn" href="tienda.html#buscar" aria-label="Buscar">' + I.search + '</a>' +
        '<a class="icon-btn" href="checkout.html" aria-label="Carrito">' + I.bag + '<span class="cart-count" data-n="0">0</span></a></div>' +
        '</div></header>' +
        '<div class="menu-panel" role="dialog" aria-label="Menú"><button class="icon-btn close" aria-label="Cerrar menú">' + I.close + '</button>' +
        navLinks() + '<a href="nosotros.html">Quiénes somos</a><a href="ayuda.html">Ayuda</a></div>';
      var tb = $('.theme-btn');
      var syncTheme = function () { var d = document.documentElement.getAttribute('data-theme') === 'dark'; tb.setAttribute('aria-pressed', d ? 'true' : 'false'); tb.setAttribute('aria-label', d ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'); tb.title = tb.getAttribute('aria-label'); };
      tb.addEventListener('click', function () {
        var d = document.documentElement.getAttribute('data-theme') !== 'dark';
        document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light');
        try { localStorage.setItem('lv_theme', d ? 'dark' : 'light'); } catch (e) {}
        syncTheme();
      });
      syncTheme();
      var panel = $('.menu-panel'), mb = $('.menu-btn');
      mb.addEventListener('click', function () { panel.classList.add('open'); mb.setAttribute('aria-expanded', 'true'); });
      $('.menu-panel .close').addEventListener('click', function () { panel.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); });
    }
    var f = $('#site-footer');
    if (f) {
      f.outerHTML =
        '<footer class="footer"><div class="wrap">' +
        '<div class="news"><div><h3>Sé el primero en conocer los lanzamientos</h3><p>Novedades, colecciones y acceso anticipado. Sin spam.</p></div>' +
        '<form class="js-news"><label class="sr-only" for="nl">Correo electrónico</label><input id="nl" type="email" required placeholder="Tu correo electrónico"><button type="submit">SUSCRIBIRME</button></form></div>' +
        '<div class="foot-cols"><div class="foot-brand"><img src="assets/img/logo-blanco.svg" alt="LV Accesorios" width="292" height="71" style="width:auto"><p>Pequeños detalles, grandes estilos.</p></div>' +
        '<div><h4>TIENDA</h4>' + CATS.slice(0, 4).map(function (c) { return '<a href="tienda.html?cat=' + c.slug + '">' + c.name + '</a>'; }).join('') + '</div>' +
        '<div><h4>AYUDA</h4><a href="ayuda.html">Preguntas frecuentes</a><a href="ayuda.html#envios">Envíos y entregas</a><a href="ayuda.html#garantias">Cambios y garantías</a><a href="ayuda.html#contacto">Contacto</a></div>' +
        '<div><h4>LOVELY</h4><a href="nosotros.html">Quiénes somos</a><a href="ayuda.html#terminos">Términos y condiciones</a><a href="ayuda.html#datos">Política de datos (Habeas Data)</a></div></div>' +
        '<div class="foot-bottom"><span>© ' + new Date().getFullYear() + ' Lovely · LV Accesorios · Colombia</span><span>PSE · Nequi · Visa · Mastercard</span></div>' +
        '</div></footer>' +
        '<a class="wa-fab" href="' + waLink() + '" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp" style="color:#D4AF37">' + I.wa + '</a>';
    }
    $$('.js-news').forEach(function (form) {
      form.addEventListener('submit', function (e) { e.preventDefault(); form.reset(); toast('¡Gracias! Te avisaremos de los lanzamientos.'); });
    });
    $$('[data-social]').forEach(function (a) { a.href = C[a.getAttribute('data-social')]; a.target = '_blank'; a.rel = 'noopener'; });
    $$('[data-wa]').forEach(function (a) { a.href = waLink(a.getAttribute('data-wa')); a.target = '_blank'; a.rel = 'noopener'; });
    Cart.badge();
  }

  /* ---------- Tarjeta de producto ---------- */
  function card(p) {
    var c = catOf(p.cat);
    var sw = p.colors.length > 1 ? '<div class="mini-sw" aria-label="' + p.colors.length + ' colores">' + p.colors.slice(0, 5).map(function (x) { return '<span style="background:' + x.hex + '"></span>'; }).join('') + (p.colors.length > 5 ? '<small>+' + (p.colors.length - 5) + '</small>' : '') + '</div>' : '';
    return '<a class="card reveal" href="producto.html?id=' + p.id + '">' +
      '<div class="ph photo"><img src="' + photo(p.colors[0].img, true) + '" alt="' + p.name + '" loading="lazy" width="480" height="560">' + (p.badge ? '<span class="badge">' + p.badge + '</span>' : '') + (p.modelo3d ? '<span class="chip-3d" title="Disponible en 3D">3D</span>' : '') + '</div>' + sw +
      '<div class="stock"><span class="dot"></span>' + (p.stock === 0 ? 'Agotado' : p.stock <= 4 ? 'Últimas unidades' : 'Disponible') + '</div>' +
      '<div class="name">' + p.name + '</div><div class="cat">' + c.name + (p.colors.length > 1 ? ' · ' + p.colors.length + ' colores' : '') + '</div><div class="price">' + money(p.price) + '</div></a>';
  }

  /* ---------- Revelado al hacer scroll ---------- */
  function reveal() {
    var els = $$('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Home ---------- */
  function initHome() {
    var cs = $('#cat-scroll'), cg = $('#cat-grid');
    if (cs) cs.innerHTML = CATS.map(function (c) { return '<a class="cat-chip" href="tienda.html?cat=' + c.slug + '"><span class="c"><img src="' + photo(c.cover, true) + '" alt=""></span>' + c.name + '</a>'; }).join('');
    if (cg) cg.innerHTML = CATS.map(function (c) { return '<a class="cat-card reveal" href="tienda.html?cat=' + c.slug + '"><div class="ph photo"><img src="' + photo(c.cover) + '" alt="' + c.name + '" loading="lazy"></div><div class="row">' + c.name + '<span>Explorar →</span></div></a>'; }).join('');
    var grid = $('#featured'), tabs = $$('#featured-tabs .tab');
    function show(kind) {
      var list = PRODUCTS.filter(function (p) { return kind === 'nuevos' ? p.nuevo : p.top; }).slice(0, 4);
      grid.innerHTML = list.map(card).join(''); reveal();
      tabs.forEach(function (t) { t.setAttribute('aria-selected', t.getAttribute('data-kind') === kind ? 'true' : 'false'); });
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.getAttribute('data-kind')); }); });
    if (grid) show('top');
  }

  /* ---------- Tienda ---------- */
  function initShop() {
    var q = new URLSearchParams(location.search);
    var state = { cat: q.get('cat') || 'todo', filtro: q.get('filtro') || '', sort: 'destacados', text: '', stock: false, max: 0 };
    var pills = $('#pills'), grid = $('#shop-grid');
    pills.innerHTML = [{ slug: 'todo', name: 'Todo' }].concat(CATS).map(function (c) {
      return '<button class="pill" data-cat="' + c.slug + '">' + c.name + '</button>';
    }).join('');
    function render() {
      var list = PRODUCTS.filter(function (p) {
        if (state.cat !== 'todo' && p.cat !== state.cat) return false;
        if (state.filtro === 'nuevos' && !p.nuevo) return false;
        if (state.filtro === 'top' && !p.top) return false;
        if (state.stock && p.stock === 0) return false;
        if (state.text && (p.name + ' ' + p.cat).toLowerCase().indexOf(state.text) < 0) return false;
        return true;
      });
      if (state.sort === 'nuevos') list.sort(function (a, b) { return b.nuevo - a.nuevo; });
      if (state.sort === 'top') list.sort(function (a, b) { return b.top - a.top; });
      if (state.sort === 'precio-asc') list.sort(function (a, b) { return a.price - b.price; });
      if (state.sort === 'precio-desc') list.sort(function (a, b) { return b.price - a.price; });
      var title = state.cat === 'todo' ? (state.filtro === 'nuevos' ? 'Novedades' : 'Todos los accesorios') : catOf(state.cat).name;
      $('#shop-title').textContent = title; $('#crumb-current').textContent = title;
      document.title = title + ' | Lovely Accesorios';
      $('#shop-count').textContent = list.length + (list.length === 1 ? ' producto' : ' productos');
      grid.innerHTML = list.length ? list.map(card).join('') : '<p class="empty">No encontramos productos con esos filtros.</p>';
      $$('.pill', pills).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cat') === state.cat ? 'true' : 'false'); });
      reveal();
    }
    pills.addEventListener('click', function (e) {
      var b = e.target.closest('.pill'); if (!b) return;
      state.cat = b.getAttribute('data-cat'); state.filtro = '';
      history.replaceState(null, '', state.cat === 'todo' ? 'tienda.html' : 'tienda.html?cat=' + state.cat);
      render();
    });
    $('#sort').addEventListener('change', function (e) { state.sort = e.target.value; render(); });
    $('#buscar').addEventListener('input', function (e) { state.text = e.target.value.trim().toLowerCase(); render(); });
    $('#f-stock').addEventListener('change', function (e) { state.stock = e.target.checked; render(); });
    $$('input[name=f-dest]').forEach(function (i) { i.addEventListener('change', function () { state.filtro = i.checked ? i.value : ''; $$('input[name=f-dest]').forEach(function (o) { if (o !== i) o.checked = false; }); render(); }); });
    $('.filter-toggle').addEventListener('click', function () {
      var f = $('#filters'), open = f.classList.toggle('open'); this.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    if (location.hash === '#buscar') setTimeout(function () { $('#buscar').focus(); }, 50);
    render();
  }

  /* ---------- Producto ---------- */
  function initProduct() {
    var id = new URLSearchParams(location.search).get('id');
    var p = PRODUCTS.filter(function (x) { return x.id === id; })[0] || PRODUCTS[1];
    var c = catOf(p.cat), st = { view: 0, color: 0, qty: 1 };
    document.title = p.name + ' | Lovely Accesorios';
    var md = $('meta[name=description]'); if (md) md.setAttribute('content', p.desc);
    $('#p-cat').textContent = c.name; $('#p-cat').href = 'tienda.html?cat=' + c.slug;
    $('#p-crumb').textContent = p.name; $('#p-eyebrow').textContent = c.name;
    $('#p-name').textContent = p.name; $('#p-price').firstChild.textContent = money(p.price) + ' ';
    $('#p-desc').textContent = p.desc; $('#p-badge').textContent = p.badge; $('#p-badge').hidden = !p.badge;
    if (!p.price) $('#p-price small').hidden = true;
    $('#p-stock').innerHTML = '<span class="dot"></span>' + (p.stock === 0 ? 'Agotado · avísame cuando llegue' : 'En stock' + (p.stock <= 5 ? ' · quedan ' + p.stock + ' unidades' : ''));
    if (C.garantiaDias) $('#p-garantia').textContent = 'Garantía ' + C.garantiaDias + ' días';
    if (C.entregaDias || C.cambiosDias) $('#p-envios').textContent = (C.entregaDias ? 'Entrega en ' + C.entregaDias + ' días hábiles según ciudad. ' : '') + (C.cambiosDias ? 'Cambios dentro de ' + C.cambiosDias + ' días.' : '');
    var views = p.colors.map(function (x) { return { l: x.name, img: x.img }; }).concat(p.extra.map(function (x, i) { return { l: 'detalle ' + (i + 1), img: x }; }));
    var main = $('#main-img'), thumbs = $('#thumbs');
    thumbs.innerHTML = views.map(function (v, i) { return '<button aria-label="Ver foto ' + v.l + '" data-i="' + i + '"><img src="' + photo(v.img, true) + '" alt="" loading="lazy"></button>'; }).join('');
    function setView(i) {
      st.view = i; var v = views[i], im = main.querySelector('img');
      im.src = photo(v.img); im.alt = p.name + ', ' + v.l.toLowerCase();
      $$('button', thumbs).forEach(function (b, j) { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
      if (i < p.colors.length && st.color !== i) setColor(i, true);
    }
    thumbs.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setView(+b.getAttribute('data-i')); });
    main.addEventListener('click', function () { main.classList.toggle('zoom'); });
    main.addEventListener('mousemove', function (e) {
      var r = main.getBoundingClientRect(); main.querySelector('img').style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
    });
    main.addEventListener('mouseleave', function () { main.classList.remove('zoom'); });
    /* Visor 3D: se carga solo cuando se pide (js/visor3d.js + Three.js en js/vendor) */
    var dynImport; try { dynImport = new Function('u', 'return import(u)'); } catch (e) {}
    function open3D() {
      if (!dynImport) { toast('Tu navegador no permite la vista 3D.'); return; }
      dynImport(new URL('js/visor3d.js', location.href).href)
        .then(function (m) { m.openViewer(p, st.color, function (i) { setColor(i); }); })
        .catch(function () { toast('No pudimos cargar la vista 3D. Intenta de nuevo.'); });
    }
    if (p.modelo3d) {
    var b3 = document.createElement('button');
    b3.type = 'button'; b3.className = 'btn-3d';
    b3.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/></svg>Explorar en 3D';
    b3.addEventListener('click', function (e) { e.stopPropagation(); open3D(); });
    main.appendChild(b3);
    var t3 = document.createElement('button');
    t3.type = 'button'; t3.className = 'thumb-3d'; t3.setAttribute('aria-label', 'Explorar en 3D'); t3.textContent = '3D';
    t3.addEventListener('click', function (e) { e.stopPropagation(); open3D(); });
    thumbs.appendChild(t3);
    if (new URLSearchParams(location.search).get('vista') === '3d') open3D();
    }
    var sw = $('#swatches');
    sw.innerHTML = p.colors.map(function (n, i) { return '<button class="swatch" data-i="' + i + '" aria-label="' + n.name + '" style="background:' + n.hex + '"></button>'; }).join('');
    function setColor(i, fromView) { st.color = i; $('#p-color').textContent = p.colors[i].name; $$('.swatch', sw).forEach(function (b, j) { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); }); if (!fromView) setView(i); }
    sw.addEventListener('click', function (e) { var b = e.target.closest('.swatch'); if (b) setColor(+b.getAttribute('data-i')); });
    setColor(0);
    var out = $('#qty');
    $('#qty-minus').addEventListener('click', function () { st.qty = Math.max(1, st.qty - 1); out.textContent = st.qty; });
    $('#qty-plus').addEventListener('click', function () { st.qty = Math.min(9, st.qty + 1); out.textContent = st.qty; });
    function add() {
      if (p.stock === 0) { toast('Este producto está agotado por ahora.'); return false; }
      Cart.add(p.id, p.colors[st.color].name, st.qty); toast('Agregado al carrito: ' + p.name); return true;
    }
    $$('.js-add').forEach(function (b) { b.addEventListener('click', add); });
    $$('.js-buy').forEach(function (b) { b.addEventListener('click', function () { if (add()) location.href = 'checkout.html'; }); });
    $$('.js-wa').forEach(function (a) { a.href = waLink('Hola Lovely, quiero información sobre ' + p.name + '.'); a.target = '_blank'; a.rel = 'noopener'; });
    var rel = PRODUCTS.filter(function (x) { return x.id !== p.id && x.cat !== p.cat; }).slice(0, 3)
      .concat(PRODUCTS.filter(function (x) { return x.id !== p.id && x.cat === p.cat; }).slice(0, 1));
    $('#related').innerHTML = rel.map(card).join('');
    reveal();
  }

  /* ---------- Checkout ---------- */
  function initCheckout() {
    var step = 1;
    var orderData = {}; // Almacena todos los datos del pedido

    function renderSummary() {
      var it = Cart.items(), box = $('#lines');
      if (!it.length) {
        box.innerHTML = '<p class="note">Tu carrito está vacío. <a class="link-line" href="tienda.html">Ir a la tienda</a></p>';
      } else {
        box.innerHTML = it.map(function (x, i) {
          var p = PRODUCTS.filter(function (q) { return q.id === x.id; })[0]; if (!p) return '';
          return '<div class="line-item"><div class="th"><img src="' + photo(colorImg(p, x.color), true) + '" alt=""></div><div class="d"><strong>' + p.name + '</strong><small>' + x.color + ' · Cant. ' + x.qty + '</small><button class="rm" data-i="' + i + '">Quitar</button></div><strong>' + money(p.price * x.qty) + '</strong></div>';
        }).join('');
      }
      var sub = it.reduce(function (a, x) { var p = PRODUCTS.filter(function (q) { return q.id === x.id; })[0]; return a + (p ? p.price * x.qty : 0); }, 0);
      var ship = 0;
      if (step >= 2) {
        var envioSel = $('input[name="envio"]:checked');
        if (envioSel) {
          if (envioSel.value === 'estandar') ship = 12000;
          else if (envioSel.value === 'express') ship = 18000;
          else if (envioSel.value === 'contraentrega') ship = 15000;
        }
      }
      $('#t-sub').textContent = sub ? money(sub) : 'Por confirmar';
      $('#t-ship').textContent = ship ? money(ship) : (step >= 2 ? 'Seleccione envío' : 'Se calcula en el paso 2');
      $('#t-total').textContent = (sub + ship) ? money(sub + ship) : 'Por confirmar';
      $('#co-empty').hidden = it.length > 0;

      // Actualizar resumen de pedido en paso 2
      if (step === 2) {
        var summaryBox = $('#order-summary');
        if (summaryBox) {
          var envioSel = $('input[name="envio"]:checked');
          var envioLabel = envioSel ? (envioSel.value === 'estandar' ? 'Envío estándar' : envioSel.value === 'express' ? 'Envío express' : 'Contra entrega') : '—';
          var itemsHtml = it.map(function(x) {
            var p = PRODUCTS.filter(function(q) { return q.id === x.id; })[0];
            return '• ' + (p ? p.name : x.id) + ' (' + x.color + ') x' + x.qty + ' = ' + money(p ? p.price * x.qty : 0);
          }).join('<br>');
          summaryBox.innerHTML = 
            '<strong>Productos:</strong><br>' + itemsHtml + '<br><br>' +
            '<strong>Subtotal:</strong> ' + money(sub) + '<br>' +
            '<strong>Envío (' + envioLabel + '):</strong> ' + money(ship) + '<br>' +
            '<strong style="font-size:15px">Total: ' + money(sub + ship) + '</strong>';
        }
      }
    }

    $('#lines').addEventListener('click', function (e) { var b = e.target.closest('.rm'); if (b) { Cart.remove(+b.getAttribute('data-i')); renderSummary(); } });

    function go(n) {
      step = n;
      $$('.co-step').forEach(function (s) { s.hidden = +s.getAttribute('data-step') !== n; });
      $$('.steps li').forEach(function (li, i) { li.className = (i + 1 < n || n === 3) ? 'done' : (i + 1 === n ? 'on' : ''); });
      if (n >= 2) $('#city-label').textContent = ($('#ciudad').value || 'tu ciudad') + ', ' + ($('#depto').value || '');
      renderSummary(); window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Paso 1: Validar formulario y capturar datos
    $('#form-datos').addEventListener('submit', function (e) {
      e.preventDefault();
      var form = e.target;
      var formData = new FormData(form);
      
      // Validar campos requeridos (quitamos habeas_pago que era para Wompi)
      var required = ['nombre', 'tipoDoc', 'documento', 'email', 'celular', 'departamento', 'ciudad', 'direccion', 'habeas_tratamiento'];
      for (var field of required) {
        if (!formData.get(field)) {
          toast('Por favor complete: ' + field);
          return;
        }
      }
      
      // Validar email
      var email = formData.get('email');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast('Correo electrónico inválido');
        return;
      }
      
      // Validar celular colombiano (10 dígitos)
      var celular = formData.get('celular').replace(/\D/g, '');
      if (celular.length !== 10 || !/^3\d{9}$/.test(celular)) {
        toast('Celular inválido. Use formato 3001234567');
        return;
      }
      
      // Guardar datos del paso 1
      orderData.cliente = {
        nombre: formData.get('nombre').trim(),
        tipoDoc: formData.get('tipoDoc'),
        documento: formData.get('documento').trim(),
        email: email.toLowerCase(),
        celular: celular,
        departamento: formData.get('departamento'),
        ciudad: formData.get('ciudad').trim(),
        direccion: formData.get('direccion').trim(),
        habeasTratamiento: true,
        marketingOptin: formData.get('marketing_optin') === 'on'
      };
      
      go(2);
    });

    // Paso 2: Seleccionar envío y confirmar por WhatsApp
    $('#confirm-order').addEventListener('click', function () {
      var envioSel = $('input[name="envio"]:checked');
      if (!envioSel) { toast('Seleccione un método de envío'); return; }
      orderData.envio = {
        metodo: envioSel.value,
        costo: envioSel.value === 'estandar' ? 12000 : envioSel.value === 'express' ? 18000 : 15000
      };
      
      // Generar número de pedido
      orderData.numero = 'LV-' + String(Date.now()).slice(-6);
      orderData.fecha = new Date().toISOString();
      orderData.estado = 'pendiente_confirmacion';
      
      // Calcular totales
      var it = Cart.items();
      var sub = it.reduce(function (a, x) { var p = PRODUCTS.filter(function (q) { return q.id === x.id; })[0]; return a + (p ? p.price * x.qty : 0); }, 0);
      orderData.pago = {
        subtotal: sub,
        envio: orderData.envio.costo,
        total: sub + orderData.envio.costo,
        items: it.map(function(x) {
          var p = PRODUCTS.filter(function(q) { return q.id === x.id; })[0];
          return {
            id: p.id,
            nombre: p.name,
            color: x.color,
            cantidad: x.qty,
            precioUnitario: p.price,
            subtotal: p.price * x.qty
          };
        })
      };
      
      // Enviar por WhatsApp
      enviarWhatsAppPedido(orderData);
      
      // Guardar en localStorage para admin
      guardarPedidoAdmin(orderData);
      
      // Guardar para marketing si optó
      if (orderData.cliente.marketingOptin) {
        guardarParaMarketing(orderData.cliente);
      }
      
      // Limpiar carrito y mostrar confirmación
      Cart.set([]);
      $('#order-n').textContent = orderData.numero;
      go(3);
    });

    $('#back-1').addEventListener('click', function () { go(1); });

    // Generar mensaje de WhatsApp y abrir
    function enviarWhatsAppPedido(orderData) {
      var itemsText = orderData.pago.items.map(function(i) {
        return '• ' + i.nombre + ' (' + i.color + ') x' + i.cantidad + ' = ' + money(i.subtotal);
      }).join('\n');
      
      var envioLabels = {
        'estandar': 'Envío estándar (3-5 días hábiles)',
        'express': 'Envío express (1-2 días hábiles)',
        'contraentrega': 'Contra entrega (pago al recibir)'
      };
      
      var msg = '🛍 *NUEVO PEDIDO ' + orderData.numero + '*\n\n' +
        '👤 *Cliente:* ' + orderData.cliente.nombre + '\n' +
        '📞 *WhatsApp:* +57' + orderData.cliente.celular + '\n' +
        '📧 *Email:* ' + orderData.cliente.email + '\n' +
        '🆔 *Doc:* ' + orderData.cliente.tipoDoc + ' ' + orderData.cliente.documento + '\n' +
        '📍 *Envío a:* ' + orderData.cliente.direccion + ', ' + orderData.cliente.ciudad + ', ' + orderData.cliente.departamento + '\n' +
        '🚚 *Método envío:* ' + (envioLabels[orderData.envio.metodo] || orderData.envio.metodo) + ' (' + money(orderData.envio.costo) + ')\n\n' +
        '*Detalle:*\n' + itemsText + '\n\n' +
        '*Subtotal:* ' + money(orderData.pago.subtotal) + '\n' +
        '*Envío:* ' + money(orderData.pago.envio) + '\n' +
        '*TOTAL:* ' + money(orderData.pago.total) + '\n\n' +
        '🕐 ' + new Date(orderData.fecha).toLocaleString('es-CO') + '\n' +
        (orderData.cliente.marketingOptin ? '✅ Acepta recibir promociones' : '❌ No quiere promociones') + '\n\n' +
        '—\nPedido generado desde lovely-web';
      
      var adminPhone = C.whatsapp || '57XXXXXXXXXX';
      var waUrl = 'https://wa.me/' + adminPhone + '?text=' + encodeURIComponent(msg);
      
      // Abrir WhatsApp en nueva pestaña
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      
      toast('Abriendo WhatsApp con tu pedido...');
    }

    function guardarPedidoAdmin(orderData) {
      var adminOrders = JSON.parse(localStorage.getItem('lv_admin_orders') || '[]');
      adminOrders.unshift(orderData);
      localStorage.setItem('lv_admin_orders', JSON.stringify(adminOrders.slice(0, 200)));
    }

    function guardarParaMarketing(cliente) {
      var lista = JSON.parse(localStorage.getItem('lv_marketing') || '[]');
      if (!lista.find(function(c) { return c.email === cliente.email; })) {
        lista.push({
          email: cliente.email,
          nombre: cliente.nombre,
          celular: cliente.celular,
          fechaRegistro: new Date().toISOString(),
          fuente: 'checkout:' + orderData.numero,
          activo: true
        });
        localStorage.setItem('lv_marketing', JSON.stringify(lista));
      }
    }

    go(1);
  }
      var sub = it.reduce(function (a, x) { var p = PRODUCTS.filter(function (q) { return q.id === x.id; })[0]; return a + (p ? p.price * x.qty : 0); }, 0);
      var ship = orderData.envio?.costo || 0;
      var total = sub + ship;
      
      // Mostrar métodos de pago disponibles
      container.innerHTML = '<p class="note" style="margin-bottom:12px"><strong>Total a pagar: ' + money(total) + '</strong></p>';
      
      // Configuración de Wompi - REEMPLAZAR CON TUS CREDENCIALES REALES
      var WOMPI_PUBLIC_KEY = 'pub_prod_XXXXXXXXXXXXXXXXXXXXXXXX'; // Tu llave pública de Wompi (producción)
      // Para sandbox: 'pub_test_XXXXXXXXXXXXXXXXXXXXXXXX'
      
      if (typeof window.WompiCheckout !== 'undefined') {
        // El widget se renderiza automáticamente via data-render="auto" en el script tag
        // Pero podemos inicializarlo programáticamente también
        console.log('Wompi SDK cargado');
      }
    }

    // Paso 3: Procesar pago
    $('#pay').addEventListener('click', async function () {
      var payBtn = $('#pay');
      var payError = $('#pay-error');
      var metodoPago = $('input[name="pago"]:checked')?.value;
      
      if (!metodoPago) { toast('Seleccione un método de pago'); return; }
      
      var it = Cart.items();
      var sub = it.reduce(function (a, x) { var p = PRODUCTS.filter(function (q) { return q.id === x.id; })[0]; return a + (p ? p.price * x.qty : 0); }, 0);
      var ship = orderData.envio?.costo || 0;
      var total = sub + ship;
      
      // Validar monto mínimo Wompi (100 COP = 1 peso, pero mínimo práctico ~1000)
      if (total < 1000) {
        payError.textContent = 'El monto mínimo es $1.000 COP';
        payError.style.display = 'block';
        return;
      }
      
      payBtn.disabled = true;
      payBtn.textContent = 'Procesando...';
      payError.style.display = 'none';
      
      orderData.pago = {
        metodo: metodoPago,
        total: total,
        subtotal: sub,
        envio: ship,
        items: it.map(function(x) {
          var p = PRODUCTS.filter(function(q) { return q.id === x.id; })[0];
          return {
            id: p.id,
            nombre: p.name,
            color: x.color,
            cantidad: x.qty,
            precioUnitario: p.price,
            subtotal: p.price * x.qty
          };
        })
      };
      
      orderData.fecha = new Date().toISOString();
      orderData.numero = 'LV-' + String(Date.now()).slice(-6);
      orderData.estado = metodoPago === 'CONTRAENTREGA' ? 'pendiente_pago' : 'pagado';
      
      try {
        if (metodoPago === 'CONTRAENTREGA' || false) {
          // Para contraentrega o si falla Wompi, crear pedido directo
          await procesarPedidoDirecto(orderData);
        } else {
          // Integración real con Wompi
          await procesarConWompi(orderData, metodoPago, total);
        }
      } catch (err) {
        console.error('Error en pago:', err);
        payError.textContent = 'Error: ' + (err.message || 'No se pudo procesar el pago. Intente de nuevo.');
        payError.style.display = 'block';
        payBtn.disabled = false;
        payBtn.textContent = metodoPago === 'CONTRAENTREGA' ? 'Confirmar pedido (pago contra entrega)' : 'Iniciar pago seguro';
      }
    });

    async function procesarConWompi(orderData, metodoPago, total) {
      // IMPORTANTE: Esto requiere un BACKEND para crear la transacción en Wompi
      // El frontend NUNCA debe exponer la llave privada (integrity_key)
      
      var WOMPI_PUBLIC_KEY = 'pub_prod_XXXXXXXXXXXXXXXXXXXXXXXX'; // TU LLAVE PÚBLICA
      
      // OPCIÓN A: Usar widget de Wompi (redirect)
      if (window.WompiCheckout) {
        window.WompiCheckout.open({
          publicKey: WOMPI_PUBLIC_KEY,
          currency: 'COP',
          amountInCents: total * 100, // Wompi usa centavos
          reference: orderData.numero,
          customerData: {
            email: orderData.cliente.email,
            fullName: orderData.cliente.nombre,
            phoneNumber: '+57' + orderData.cliente.celular,
            legalId: orderData.cliente.documento,
            legalIdType: orderData.cliente.tipoDoc === 'CC' ? 'CC' : orderData.cliente.tipoDoc === 'NIT' ? 'NIT' : 'CE'
          },
          shippingData: {
            address: orderData.cliente.direccion,
            city: orderData.cliente.ciudad,
            region: orderData.cliente.departamento,
            country: 'CO',
            phoneNumber: '+57' + orderData.cliente.celular
          },
          redirectUrl: window.location.origin + '/checkout.html?success=true&ref=' + orderData.numero,
          singleUse: true
        });
        // El widget maneja el redirect. Cuando vuelve, verificamos en URL.
        return;
      }
      
      // OPCIÓN B: Crear transacción via API (requiere backend)
      // Llamar a TU backend: POST /api/wompi/crear-transaccion
      /*
      var resp = await fetch('https://TU-BACKEND.com/api/wompi/crear-transaccion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountInCents: total * 100,
          currency: 'COP',
          customerEmail: orderData.cliente.email,
          reference: orderData.numero,
          paymentMethod: { installments: 1 },
          customerData: { ... },
          redirectUrl: window.location.origin + '/checkout.html?success=true&ref=' + orderData.numero
        })
      });
      var data = await resp.json();
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      */
      
      // FALLBACK DEMO: Simular pago exitoso para pruebas
      toast('Modo demo: simulando pago exitoso...');
      setTimeout(function() { procesarPedidoDirecto(orderData); }, 1500);
    }

    async function procesarPedidoDirecto(orderData) {
      // Guardar pedido en localStorage (historial local)
      var historial = JSON.parse(localStorage.getItem('lv_orders') || '[]');
      historial.unshift(orderData);
      localStorage.setItem('lv_orders', JSON.stringify(historial.slice(0, 50)));
      
      // ENVIAR A WHATSAPP DEL ADMIN (tú)
      enviarWhatsAppAdmin(orderData);
      
      // ENVIAR CONFIRMACIÓN AL CLIENTE (si dio consentimiento marketing)
      if (orderData.cliente.marketingOptin) {
        guardarParaMarketing(orderData.cliente);
      }
      
      // Limpiar carrito y mostrar confirmación
      Cart.set([]);
      $('#order-n').textContent = orderData.numero;
      go(4);
    }

    function enviarWhatsAppAdmin(orderData) {
      var itemsText = orderData.pago.items.map(function(i) {
        return '• ' + i.nombre + ' (' + i.color + ') x' + i.cantidad + ' = ' + money(i.subtotal);
      }).join('\n');
      
      var msg = '🛍 *NUEVO PEDIDO ' + orderData.numero + '*\n\n' +
        '👤 *Cliente:* ' + orderData.cliente.nombre + '\n' +
        '📞 *WhatsApp:* +57' + orderData.cliente.celular + '\n' +
        '📧 *Email:* ' + orderData.cliente.email + '\n' +
        '📍 *Envío a:* ' + orderData.cliente.direccion + ', ' + orderData.cliente.ciudad + ', ' + orderData.cliente.departamento + '\n' +
        '🚚 *Método envío:* ' + orderData.envio.metodo + ' (' + money(orderData.envio.costo) + ')\n' +
        '💳 *Pago:* ' + orderData.pago.metodo + (orderData.pago.metodo === 'CONTRAENTREGA' ? ' (paga al recibir)' : '') + '\n\n' +
        '*Detalle:*\n' + itemsText + '\n\n' +
        '*Subtotal:* ' + money(orderData.pago.subtotal) + '\n' +
        '*Envío:* ' + money(orderData.pago.envio) + '\n' +
        '*TOTAL:* ' + money(orderData.pago.total) + '\n\n' +
        '🕐 ' + new Date(orderData.fecha).toLocaleString('es-CO') + '\n' +
        (orderData.cliente.marketingOptin ? '✅ Acepta marketing' : '❌ No marketing');
      
      var adminPhone = C.whatsapp || '57XXXXXXXXXX'; // Tu número en LV_CONFIG
      var waUrl = 'https://wa.me/' + adminPhone + '?text=' + encodeURIComponent(msg);
      
      // Abrir en nueva pestaña para que el admin vea el pedido
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      
      // También guardar en localStorage para panel admin.html
      var adminOrders = JSON.parse(localStorage.getItem('lv_admin_orders') || '[]');
      adminOrders.unshift(orderData);
      localStorage.setItem('lv_admin_orders', JSON.stringify(adminOrders.slice(0, 200)));
    }

    function guardarParaMarketing(cliente) {
      var lista = JSON.parse(localStorage.getItem('lv_marketing') || '[]');
      // Evitar duplicados por email
      if (!lista.find(function(c) { return c.email === cliente.email; })) {
        lista.push({
          email: cliente.email,
          nombre: cliente.nombre,
          celular: cliente.celular,
          fechaRegistro: new Date().toISOString(),
          fuente: 'checkout',
          activo: true
        });
        localStorage.setItem('lv_marketing', JSON.stringify(lista));
      }
    }

    // Verificar si venimos de retorno de Wompi (success=true en URL)
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true' && urlParams.get('ref')) {
      // Aquí deberías verificar la transacción con tu backend
      // Por ahora simulamos éxito
      toast('¡Pago verificado! Procesando su pedido...');
      // orderData ya debería estar en sessionStorage o recuperarse via ref
      setTimeout(function() { 
        // En producción: verificar transacción con Wompi API via tu backend
        // fetch('https://TU-BACKEND.com/api/wompi/verificar/' + urlParams.get('ref'))
        // Si ok: procesarPedidoDirecto(orderData)
      }, 1000);
    }

    go(1);
  }

  /* ---------- Ayuda ---------- */
  function initHelp() {
    $$('.js-contact').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); f.reset(); toast('¡Mensaje enviado! Te responderemos pronto.'); }); });
    var h = location.hash.replace('#', '');
    if (h) { var d = $('#' + h); if (d && d.tagName === 'DETAILS') d.open = true; }
  }

  renderChrome();
  if (page === 'home') initHome();
  if (page === 'tienda') initShop();
  if (page === 'producto') initProduct();
  if (page === 'checkout') initCheckout();
  if (page === 'ayuda') initHelp();
  reveal();
})();
