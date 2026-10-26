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
  var findProduct = function (id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; };
  var money = function (n) { return n ? '$ ' + n.toLocaleString('es-CO') : 'Precio por confirmar'; };
  var photo = function (n, sm) { return 'assets/products/' + n + (sm ? '-sm' : '') + '.webp'; };
  var colorImg = function (p, colorName) { var c = p.colors.filter(function (x) { return x.name === colorName; })[0] || p.colors[0]; return c.img; };
  var ASSET_V = '20261026g';
  /* Logos SVG: si el servidor los envía con un tipo incorrecto, se vuelven a pedir y se muestran igual */
  function fixSvg(img) {
    if (img._fx) return; img._fx = 1;
    var src = img.getAttribute('src');
    fetch(src).then(function (r) { if (!r.ok) throw new Error(); return r.text(); }).then(function (t) {
      if (t.indexOf('<svg') < 0) return;
      img.setAttribute('data-src', src); img.src = URL.createObjectURL(new Blob([t], { type: 'image/svg+xml' }));
    }).catch(function () {});
  }
  function watchSvgs() {
    $$('img[src$=".svg"]').forEach(function (img) {
      if (img.complete && img.naturalWidth === 0) fixSvg(img);
      else img.addEventListener('error', function () { fixSvg(img); });
    });
  }
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); };
  var waLink = function (msg) { return 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(msg || 'Hola Lovely, quiero más información.'); };
  /* WhatsApp: en celulares abre la app directamente (whatsapp://send), sin la página intermedia de wa.me
     que pide «abrir aplicación» o descargar la APK. Si la app no está instalada, a los 2 s usa wa.me.
     En computador se mantiene wa.me en una pestaña nueva (WhatsApp Web o de escritorio). */
  var IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform));
  window.lvNavigate = window.lvNavigate || function (u) { location.href = u; };
  function openWhatsApp(url) {
    if (!IS_MOBILE) { window.open(url, '_blank', 'noopener'); return; }
    var u = new URL(url), text = u.searchParams.get('text');
    var deep = 'whatsapp://send?phone=' + u.pathname.replace(/\D/g, '') + (text ? '&text=' + encodeURIComponent(text) : '');
    var left = false, mark = function () { left = true; };
    var onVis = function () { if (document.hidden) { mark(); document.removeEventListener('visibilitychange', onVis); } };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pagehide', mark, { once: true });
    window.addEventListener('blur', mark, { once: true });
    window.lvNavigate(deep);
    setTimeout(function () { document.removeEventListener('visibilitychange', onVis); if (!left) window.lvNavigate(url); }, 2000);
  }
  /* ---------- Redes sociales (panel → Configuración) ----------
     En celulares cada enlace abre la app de la red, no su página web (que pide «abrir en la app» o descargarla).
     Android: enlace intent:// con el paquete de la app; si no está instalada, Chrome abre la web solo.
     iPhone: esquema propio de la app (instagram://, fb://…) y, si no abre en 2 s, la web. */
  var IS_ANDROID = /Android/i.test(navigator.userAgent);
  var REDES = {
    instagram: { n: 'Instagram', pkg: 'com.instagram.android', ios: function (u, h) { return h ? 'instagram://user?username=' + h : ''; }, path: function (u, h) { return h ? 'instagram.com/_u/' + h : ''; } },
    /* Con el número del perfil (…/people/Nombre/ID/, profile.php?id=ID) la app abre el perfil exacto; si no, la página dentro de la app */
    facebook: { n: 'Facebook', pkg: 'com.facebook.katana', ios: function (u) { var id = fbId(u); return id ? 'fb://profile/' + id : 'fb://facewebmodal/f?href=' + encodeURIComponent(u); }, android: function (u) { var id = fbId(u); return id ? 'fb://profile/' + id : 'fb://facewebmodal/f?href=' + encodeURIComponent(u); } },
    tiktok: { n: 'TikTok', pkg: 'com.zhiliaoapp.musically', ios: function () { return ''; } },
    youtube: { n: 'YouTube', pkg: 'com.google.android.youtube', ios: function (u) { return u.replace(/^https?:\/\//, 'youtube://'); } },
    x: { n: 'X (Twitter)', pkg: 'com.twitter.android', ios: function (u, h) { return h ? 'twitter://user?screen_name=' + h : ''; } },
    pinterest: { n: 'Pinterest', pkg: 'com.pinterest', ios: function (u) { return u.replace(/^https?:\/\/(www\.)?/, 'pinterest://'); } },
    threads: { n: 'Threads', pkg: 'com.instagram.barcelona', ios: function (u, h) { return h ? 'barcelona://user?username=' + h : ''; } }
  };
  var fbId = function (u) { var m = String(u).match(/facebook\.com\/(?:people\/[^/]+\/(\d{6,})|profile\.php\?(?:[^#]*&)?id=(\d{6,})|(\d{6,})(?:[/?#]|$))/); return m ? m[1] || m[2] || m[3] : ''; };
  var handleOf = function (u) { var m = String(u).match(/^https?:\/\/[^/]+\/@?([A-Za-z0-9._-]+)/); return m && !/^(share|profile\.php|channel|watch|p|reel)$/.test(m[1]) ? m[1] : ''; };
  function socialList() {
    if (Array.isArray(C.redes)) return C.redes.filter(function (r) { return r && r.url; });
    return ['instagram', 'tiktok', 'facebook'].filter(function (k) { return C[k] && !/^https?:\/\/(www\.)?[^/]+\/?$/.test(C[k]); }).map(function (k) { return { red: k, url: C[k] }; });
  }
  function openSocial(red, url) {
    var R = REDES[red], h = handleOf(url);
    if (!R || !IS_MOBILE) { window.open(url, '_blank', 'noopener'); return; }
    if (IS_ANDROID) {
      var deep = R.android ? R.android(url) : 'https://' + (R.path && R.path(url, h) || url.replace(/^https?:\/\//, ''));
      var m = deep.match(/^(\w+):\/\/(.*)$/);
      window.lvNavigate('intent://' + m[2] + '#Intent;scheme=' + m[1] + ';package=' + R.pkg + ';S.browser_fallback_url=' + encodeURIComponent(url) + ';end');
      return;
    }
    var ios = R.ios(url, h); if (!ios) { window.lvNavigate(url); return; }
    var left = false, mark = function () { left = true; };
    document.addEventListener('visibilitychange', mark, { once: true }); window.addEventListener('pagehide', mark, { once: true }); window.addEventListener('blur', mark, { once: true });
    window.lvNavigate(ios);
    setTimeout(function () { if (!left) window.lvNavigate(url); }, 2000);
  }
  function renderSocial() {
    var list = socialList(), html = list.map(function (r) {
      var R = REDES[r.red]; return '<a href="' + esc(r.url) + '" target="_blank" rel="noopener" data-red="' + esc(r.red) + '">' + esc(R ? R.n : (r.nombre || 'Red social')) + '</a>';
    }).join('');
    $$('.social-links').forEach(function (box) { box.innerHTML = html; box.hidden = !list.length; });
  }
  document.addEventListener('click', function (e) {
    var s = e.target.closest && e.target.closest('a[data-red]');
    if (s && !e.defaultPrevented && !e.button && !e.metaKey && !e.ctrlKey) { e.preventDefault(); openSocial(s.getAttribute('data-red'), s.href); return; }
    var a = e.target.closest && e.target.closest('a[href^="https://wa.me/"]');
    if (!a || !IS_MOBILE || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey) return;
    e.preventDefault(); openWhatsApp(a.href);
  });

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
    /* Combo: una línea con los productos y colores elegidos; el precio con descuento se calcula al mostrarlo */
    addCombo: function (id, colors, qty) {
      var it = Cart.items(), key = colors.join('|'), f = it.filter(function (x) { return x.combo === id && (x.colors || []).join('|') === key; })[0];
      if (f) f.qty += qty; else it.push({ combo: id, colors: colors, qty: qty });
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
    var lc = liveCombos();
    return '<a href="tienda.html?filtro=nuevos">Novedades</a>' + CATS.map(function (c) {
      return '<a href="tienda.html?cat=' + c.slug + '">' + c.name + '</a>';
    }).join('') + (lc.length ? '<a class="nav-hot" href="combo.html">Combos <span>−' + Math.max.apply(null, lc.map(function (x) { return +x.c.descuento || 0; })) + '%</span></a>' : '');
  }
  /* Textos editables desde el panel (Páginas): cualquier elemento con data-cfg="clave" toma el texto de LV_CONFIG */
  function applyTexts() {
    $$('[data-cfg]').forEach(function (el) { var v = C[el.getAttribute('data-cfg')]; if (v) el.textContent = v; });
  }
  /* Promociones activas (panel → Promociones) */
  var promos = function (tipo) { return (C.promociones || []).filter(function (x) { return x.activo && (!tipo || x.tipo === tipo) && (!x.hasta || new Date(x.hasta + 'T23:59:59') > new Date()); }); };
  function announceMsgs() {
    var m = [{ t: C.anuncioTitulo || 'ENVÍOS A TODA COLOMBIA', x: C.anuncioTexto }];
    promos().forEach(function (pr) { if (pr.tipo === 'banner' || pr.tipo === 'envio') m.unshift({ t: pr.titulo, x: pr.texto, href: pr.enlace }); });
    return m;
  }
  function announceHtml(a) { return '<b>' + esc(a.t) + '</b>' + (a.x ? ' · ' + esc(a.x) : '') + (a.href ? ' <u>Ver más</u>' : ''); }
  function rotateAnnounce() {
    var bar = $('.announce'), m = announceMsgs(); if (!bar || m.length < 2) return;
    var i = 0;
    setInterval(function () {
      if (document.hidden) return;
      i = (i + 1) % m.length; bar.classList.add('swap');
      setTimeout(function () { bar.innerHTML = '<span>' + announceHtml(m[i]) + '</span>'; bar.classList.remove('swap'); setHref(m[i]); }, REDUCE ? 0 : 280);
    }, 4500);
    function setHref(a) { bar.onclick = a.href ? function () { location.href = a.href; } : null; bar.classList.toggle('link', !!a.href); }
    setHref(m[0]);
  }
  /* Ventana emergente: se muestra una sola vez por visitante y por promoción */
  function promoPopup() {
    var pr = promos('popup')[0]; if (!pr || page === 'checkout') return;
    var key = 'lv_popup_' + (pr.id || 'x'); try { if (localStorage.getItem(key)) return; } catch (e) { return; }
    setTimeout(function () {
      var d = document.createElement('div'); d.className = 'promo-pop'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-label', pr.titulo);
      d.innerHTML = '<div class="pp-card"><button class="icon-btn pp-x" aria-label="Cerrar">' + I.close + '</button>' +
        '<img src="assets/img/monograma-dorado.svg" alt="" class="pp-logo"><div class="eyebrow gold">Solo para ti</div><h2>' + esc(pr.titulo) + '</h2><p>' + esc(pr.texto) + '</p>' +
        (pr.codigo ? '<button class="pp-code" type="button" title="Copiar código"><span>' + esc(pr.codigo) + '</span><small>Toca para copiar</small></button>' : '') +
        '<a class="btn btn-gold btn-block" href="' + esc(pr.enlace || 'tienda.html') + '">' + esc(pr.boton || 'Ver la tienda') + '</a></div>';
      document.body.appendChild(d);
      try { localStorage.setItem(key, '1'); } catch (e) {}
      requestAnimationFrame(function () { d.classList.add('open'); });
      var close = function () { d.classList.remove('open'); setTimeout(function () { d.remove(); }, 300); };
      $('.pp-x', d).addEventListener('click', close);
      d.addEventListener('click', function (e) { if (e.target === d) close(); });
      document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
      var cb = $('.pp-code', d);
      if (cb) cb.addEventListener('click', function () {
        try { navigator.clipboard.writeText(pr.codigo).catch(function () {}); } catch (e) {}
        try { sessionStorage.setItem('lv_code', String(pr.codigo).toUpperCase()); } catch (e) {}
        $('small', cb).textContent = '¡Copiado! Se aplica solo al pagar';
      });
    }, 3500);
  }
  function renderChrome() {
    var h = $('#site-header');
    if (h) {
      h.outerHTML =
        '<div class="announce" aria-live="polite"><span>' + announceHtml(announceMsgs()[0]) + '</span></div>' +
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
        '<div class="news"><div><h3>Sé el primero en conocer los lanzamientos</h3><p>Novedades, combos y ofertas por WhatsApp o correo, solo cuando haya algo nuevo. Te das de baja cuando quieras.</p></div>' +
        '<form class="js-news"><label class="sr-only" for="nl-n">Tu nombre</label><input id="nl-n" name="nombre" required placeholder="Tu nombre" autocomplete="given-name">' +
        '<label class="sr-only" for="nl">Correo electrónico</label><input id="nl" name="email" type="email" placeholder="Tu correo (opcional)" autocomplete="email"><button type="submit">SUSCRIBIRME</button></form></div>' +
        '<div class="foot-cols"><div class="foot-brand"><img src="assets/img/logo-blanco.svg" alt="LV Accesorios" width="292" height="71" style="width:auto"><p>Pequeños detalles, grandes estilos.</p><div class="social-links foot-social"></div></div>' +
        '<div><h4>TIENDA</h4>' + CATS.slice(0, 4).map(function (c) { return '<a href="tienda.html?cat=' + c.slug + '">' + c.name + '</a>'; }).join('') + '</div>' +
        '<div><h4>AYUDA</h4><a href="ayuda.html">Preguntas frecuentes</a><a href="ayuda.html#envios">Envíos y entregas</a><a href="ayuda.html#garantias">Cambios y garantías</a><a href="ayuda.html#contacto">Contacto</a></div>' +
        '<div><h4>LOVELY</h4><a href="nosotros.html">Quiénes somos</a><a href="ayuda.html#terminos">Términos y condiciones</a><a href="ayuda.html#datos">Política de datos (Habeas Data)</a></div></div>' +
        '<div class="foot-bottom"><span>© ' + new Date().getFullYear() + ' Lovely · LV Accesorios · Colombia</span><span>Compra fácil por WhatsApp</span></div>' +
        '</div></footer>' +
        '<a class="wa-fab" href="' + waLink() + '" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp" style="color:#D4AF37">' + I.wa + '</a>';
    }
    $$('.js-news').forEach(function (form) {
      /* La suscripción llega como mensaje de WhatsApp a la tienda; desde el panel (Marketing) se pega y queda registrada */
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var n = form.elements.nombre.value.trim(), m = form.elements.email.value.trim();
        if (!n) { form.elements.nombre.focus(); return; }
        openWhatsApp(waLink('*SUSCRIPCIÓN A NOVEDADES*\nNombre: ' + n + (m ? '\nCorreo: ' + m : '') + '\nQuiero recibir novedades y ofertas de Lovely por WhatsApp' + (m ? ' y correo' : '') + '.'));
        form.reset(); toast('¡Gracias! Envía el mensaje en WhatsApp para quedar suscrito.');
      });
    });
    renderSocial();
    $$('[data-wa]').forEach(function (a) { a.href = waLink(a.getAttribute('data-wa')); a.target = '_blank'; a.rel = 'noopener'; });
    if (page === 'combo') $$('.nav-hot').forEach(function (a) { a.setAttribute('aria-current', 'page'); });
    Cart.badge(); rotateAnnounce(); promoPopup();
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

  /* ---------- Combos «Arma tu look» (panel → Combos) ----------
     Cada combo une productos que hacen juego con un descuento (12 % por defecto) hasta una fecha.
     Vencido, desactivado o con algún producto agotado deja de mostrarse; en el carrito se cobra sin descuento. */
  var COMBOS = window.LV_COMBOS || [];
  function comboById(id) { return COMBOS.filter(function (c) { return c.id === id; })[0]; }
  function comboInfo(c, colors) {
    if (!c || !c.productos || !c.productos.length) return null;
    var items = c.productos.map(function (x, i) {
      var p = findProduct(x.id); if (!p) return null;
      var col = (colors && colors[i]) || x.color;
      if (!p.colors.some(function (k) { return k.name === col; })) col = p.colors[0].name;
      return { p: p, color: col };
    });
    if (items.some(function (x) { return !x; })) return null;
    var sum = items.reduce(function (a, x) { return a + (x.p.price || 0); }, 0), d = +c.descuento || 0;
    var final = Math.round(sum * (100 - d) / 10000) * 100;
    var end = c.hasta ? new Date(c.hasta + 'T23:59:59') : null;
    var live = c.activo !== false && sum > 0 && (!end || end > new Date()) && items.every(function (x) { return x.p.stock !== 0; });
    return { c: c, items: items, sum: sum, final: final, save: sum - final, end: end, live: live };
  }
  function liveCombos() { return COMBOS.map(function (c) { return comboInfo(c); }).filter(function (x) { return x && x.live; }); }
  var catShort = function (p) { return { relojes: 'Reloj', gorras: 'Gorra', gafas: 'Gafas' }[p.cat] || catOf(p.cat).name; };
  function countdownHtml(end) {
    if (!end) return '';
    return '<div class="cd" data-end="' + end.getTime() + '" role="timer" aria-label="Tiempo restante de la oferta">' +
      ['días', 'horas', 'min', 'seg'].map(function (u) { return '<span><b>00</b><small>' + u + '</small></span>'; }).join('') + '</div>';
  }
  function tickCountdowns() {
    var now = Date.now();
    $$('.cd[data-end]').forEach(function (el) {
      var left = Math.max(0, +el.getAttribute('data-end') - now), s = Math.floor(left / 1000);
      var v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
      $$('b', el).forEach(function (b, i) { var t = pad2(v[i]); if (b.textContent !== t) b.textContent = t; });
      if (!left && !el.classList.contains('over')) { el.classList.add('over'); el.setAttribute('aria-label', 'Oferta finalizada'); }
    });
  }
  setInterval(tickCountdowns, 1000);
  function cuposHtml(c) { return c.cupos ? '<p class="cc-cupos"><span class="pulse" aria-hidden="true"></span>Solo ' + c.cupos + ' combos disponibles a este precio</p>' : ''; }
  function comboCard(ci) {
    var c = ci.c;
    return '<a class="combo-card reveal" href="combo.html?id=' + encodeURIComponent(c.id) + '">' +
      '<span class="cc-ribbon">−' + c.descuento + '%</span>' +
      '<div class="cc-photos n' + ci.items.length + '">' + ci.items.map(function (x, i) { return '<span class="ph photo"><img src="' + photo(colorImg(x.p, x.color), true) + '" alt="' + esc(x.p.name) + '" loading="lazy"></span>' + (i < ci.items.length - 1 ? '<i class="plus" aria-hidden="true">+</i>' : ''); }).join('') + '</div>' +
      '<div class="cc-body"><div class="cc-flag"><span class="pulse" aria-hidden="true"></span>Oferta por tiempo limitado</div>' +
      '<h3>' + esc(c.nombre) + '</h3>' + (c.lema ? '<p class="cc-lema">' + esc(c.lema) + '</p>' : '') +
      '<p class="cc-items">' + ci.items.map(function (x) { return catShort(x.p); }).join(' + ') + '</p>' +
      '<div class="cc-price"><s>' + money(ci.sum) + '</s><strong>' + money(ci.final) + '</strong></div>' +
      '<div class="cc-save">Ahorras ' + money(ci.save) + '</div>' +
      countdownHtml(ci.end) + cuposHtml(c) +
      '<span class="btn btn-gold btn-block">Ver combo</span></div></a>';
  }
  function renderComboGrid(el, list) { el.innerHTML = list.map(comboCard).join(''); tickCountdowns(); }

  function initCombo() {
    var id = new URLSearchParams(location.search).get('id'), all = liveCombos();
    var hero = $('#cb-hero'), moreSec = $('#cb-more'), moreGrid = $('#cb-more-grid');
    var c = id && comboById(id), ci = c && comboInfo(c);
    if (!ci) {
      hero.innerHTML = '<div class="wrap cb-intro"><div class="eyebrow gold">' + esc(C.combosEtiqueta || 'Arma tu look') + '</div><h1>' + esc(C.combosTitulo || 'Combos que hacen juego') + '</h1><p>' + esc(C.combosTexto || '') + '</p>' +
        (id ? '<p class="cb-ended">Esta oferta ya terminó, pero tenemos otras esperándote.</p>' : '') + '</div>';
      $('#cb-more-title').textContent = all.length ? 'Elige tu combo' : 'Muy pronto, nuevos combos';
      moreSec.hidden = false; renderComboGrid(moreGrid, all);
      if (!all.length) moreGrid.innerHTML = '<p class="empty">Ahora no hay combos activos. Mira la <a class="link-line" href="tienda.html">tienda</a>.</p>';
      return;
    }
    if (!ci.live) {
      hero.innerHTML = '<div class="wrap cb-intro"><div class="eyebrow gold">Oferta finalizada</div><h1>' + esc(c.nombre) + '</h1><p class="cb-ended">Esta oferta ya terminó, pero tenemos otras esperándote.</p></div>';
      moreSec.hidden = !all.length; renderComboGrid(moreGrid, all); return;
    }
    document.title = 'Combo ' + c.nombre + ' | Lovely Accesorios';
    var colors = ci.items.map(function (x) { return x.color; }), qty = 1;
    hero.innerHTML = '<div class="wrap cb-grid">' +
      '<div class="cb-media"><span class="cc-ribbon big">−' + c.descuento + '%</span><div class="cb-stack n' + ci.items.length + '">' + ci.items.map(function (x, i) { return '<a class="ph photo" href="producto.html?id=' + x.p.id + '" data-i="' + i + '"><img src="' + photo(colorImg(x.p, x.color)) + '" alt="' + esc(x.p.name) + '"></a>'; }).join('') + '</div></div>' +
      '<div class="cb-copy"><div class="cc-flag"><span class="pulse" aria-hidden="true"></span>Oferta por tiempo limitado</div>' +
      '<div class="eyebrow gold">Combo · ' + ci.items.map(function (x) { return catShort(x.p); }).join(' + ') + '</div>' +
      '<h1>' + esc(c.nombre) + '</h1>' + (c.lema ? '<p class="cb-lema">' + esc(c.lema) + '</p>' : '') +
      '<div class="cb-price"><s>' + money(ci.sum) + '</s><strong>' + money(ci.final) + '</strong><span class="cc-save">Ahorras ' + money(ci.save) + '</span></div>' +
      '<p class="cb-note">Precio por las ' + ci.items.length + ' piezas. Comprándolas por separado pagarías ' + money(ci.sum) + '.</p>' +
      '<div class="cb-timer"><span>La oferta termina en</span>' + countdownHtml(ci.end) + '</div>' + cuposHtml(c) +
      '<div class="qty-row"><span>Cantidad</span><div class="qty"><button type="button" id="cq-minus" aria-label="Quitar uno">−</button><output id="cq">1</output><button type="button" id="cq-plus" aria-label="Agregar uno">+</button></div></div>' +
      '<div class="cb-ctas"><button class="btn btn-gold btn-block" id="cb-buy">Comprar combo</button><button class="btn btn-outline-light btn-block" id="cb-add">Agregar al carrito</button>' +
      '<a class="cb-wa" id="cb-wa" href="#" target="_blank" rel="noopener">' + I.wa + 'Pedir este combo por WhatsApp</a></div></div></div>';
    var inc = $('#cb-includes'); inc.hidden = false;
    $('#cb-items').innerHTML = ci.items.map(function (x, i) {
      return '<article class="cb-item reveal" data-i="' + i + '"><a class="ph photo" href="producto.html?id=' + x.p.id + '"><img src="' + photo(colorImg(x.p, x.color), true) + '" alt="' + esc(x.p.name) + '" loading="lazy"></a>' +
        '<div class="cb-item-d"><small>' + esc(catOf(x.p.cat).name) + '</small><h3>' + esc(x.p.name) + '</h3><p class="cb-item-p"><s>' + money(x.p.price) + '</s></p>' +
        '<p class="cb-color">Color: <b>' + esc(x.color) + '</b></p>' +
        (x.p.colors.length > 1 ? '<div class="swatches">' + x.p.colors.map(function (k) { return '<button type="button" class="swatch" data-c="' + esc(k.name) + '" aria-label="' + esc(k.name) + '" aria-pressed="' + (k.name === x.color) + '" style="background:' + k.hex + '"></button>'; }).join('') + '</div>' : '') +
        '<a class="link-line" href="producto.html?id=' + x.p.id + '">Ver detalles</a></div></article>';
    }).join('');
    function waMsg() {
      return 'Hola Lovely, quiero el *Combo ' + c.nombre + '* (−' + c.descuento + '%) x' + qty + ':\n' + ci.items.map(function (x, i) { return '• ' + x.p.name + ' (' + colors[i] + ')'; }).join('\n') + '\nPrecio combo: ' + money(ci.final * qty);
    }
    function sync() { $('#cb-wa').href = waLink(waMsg()); }
    $('#cb-items').addEventListener('click', function (e) {
      var b = e.target.closest('.swatch'); if (!b) return;
      var art = b.closest('.cb-item'), i = +art.getAttribute('data-i'), x = ci.items[i];
      colors[i] = b.getAttribute('data-c');
      $$('.swatch', art).forEach(function (s) { s.setAttribute('aria-pressed', s === b ? 'true' : 'false'); });
      $('.cb-color b', art).textContent = colors[i];
      $('img', art).src = photo(colorImg(x.p, colors[i]), true);
      $('.cb-stack [data-i="' + i + '"] img').src = photo(colorImg(x.p, colors[i]));
      sync();
    });
    $('#cq-minus').addEventListener('click', function () { qty = Math.max(1, qty - 1); $('#cq').textContent = qty; sync(); });
    $('#cq-plus').addEventListener('click', function () { qty = Math.min(9, qty + 1); $('#cq').textContent = qty; sync(); });
    function add() { Cart.addCombo(c.id, colors.slice(), qty); toast('Combo agregado: ahorras ' + money(ci.save * qty)); }
    $('#cb-add').addEventListener('click', add);
    $('#cb-buy').addEventListener('click', function () { add(); location.href = 'checkout.html'; });
    sync(); tickCountdowns();
    var others = all.filter(function (x) { return x.c.id !== c.id; });
    moreSec.hidden = !others.length; renderComboGrid(moreGrid, others);
  }
  /* En la ficha de producto: invita a llevarlo en combo */
  function productCombos(p) {
    var list = liveCombos().filter(function (ci) { return ci.items.some(function (x) { return x.p.id === p.id; }); });
    if (!list.length) return '';
    var ci = list[0];
    return '<a class="pd-combo" href="combo.html?id=' + encodeURIComponent(ci.c.id) + '"><span class="cc-ribbon">−' + ci.c.descuento + '%</span>' +
      '<span class="pd-combo-ph">' + ci.items.map(function (x) { return '<img src="' + photo(colorImg(x.p, x.color), true) + '" alt="">'; }).join('') + '</span>' +
      '<span class="pd-combo-t"><small>Combo · oferta limitada</small><b>Llévalo en el combo ' + esc(ci.c.nombre) + '</b><span>' + money(ci.final) + ' <s>' + money(ci.sum) + '</s></span></span></a>';
  }

  /* ---------- Efectos de scroll ---------- */
  var REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Las animaciones de entrada solo ocultan contenido si este script arrancó (clase fx) */
  if (!REDUCE && 'IntersectionObserver' in window) document.documentElement.classList.add('fx');
  /* Red de seguridad: nada visible en pantalla se queda oculto */
  function revealSafety() {
    $$('.reveal:not(.in)').forEach(function (e) { var r = e.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) e.classList.add('in'); });
  }
  setTimeout(revealSafety, 2500);
  window.addEventListener('scroll', function () { clearTimeout(revealSafety._t); revealSafety._t = setTimeout(revealSafety, 900); }, { passive: true });
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };

  /* Revelado: los elementos que entran juntos lo hacen en cascada */
  var revealIO = null;
  function reveal() {
    $$('.section-head h2, .story h2, .promo h2, .page-hero h1, .prose h2, .pd-info h1, #shop-title, .cb-includes h2').forEach(split);
    var els = $$('.reveal:not(.in)');
    if (REDUCE || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    revealIO = revealIO || new IntersectionObserver(function (en) {
      en.filter(function (x) { return x.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left; })
        .forEach(function (x, k) { x.target.style.setProperty('--d', Math.min(k, 7) * 85 + 'ms'); x.target.classList.add('in'); revealIO.unobserve(x.target); });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e) { revealIO.observe(e); });
  }
  /* Títulos: cada palabra sube desde una máscara */
  function split(el) {
    if (!el || REDUCE) return;
    var txt = el.textContent.trim(); if (el.getAttribute('data-split') === txt) return;
    var html = el.innerHTML.split(/<br\s*\/?>/i).map(function (line) {
      var tmp = document.createElement('div'); tmp.innerHTML = line;
      return tmp.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w"><span>' + esc(w) + '</span></span>'; }).join(' ');
    }).join('<br>');
    el.innerHTML = html; el.setAttribute('data-split', el.textContent.trim()); el.setAttribute('aria-label', txt);
    $$('.w > span', el).forEach(function (s, i) { s.style.setProperty('--i', i); s.setAttribute('aria-hidden', 'true'); });
    el.classList.add('split', 'reveal'); el.classList.remove('in');
  }

  /* Paralaje y escaparate: un solo bucle de animación ligado al scroll */
  var PX = [], SC = null, ticking = false;
  function parallax() {
    if (REDUCE) return;
    [['.hero-photo', 0.12], ['.promo-media img', 0.08], ['.cat-card .ph img', 0.06]].forEach(function (d) {
      $$(d[0]).forEach(function (el) { if (!el._px) { el._px = d[1]; el.classList.add('px'); PX.push(el); } });
    });
    onScroll();
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(scrollFrame); } }
  function scrollFrame() {
    ticking = false;
    var vh = window.innerHeight;
    PX.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect(); if (r.bottom < -50 || r.top > vh + 50) return;
      var prog = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = 'translate3d(0,' + (prog * el._px * -100).toFixed(2) + 'px,0) scale(1.14)';
    });
    /* El escaparate sigue al scroll con inercia: mientras no alcance la posición, pide otro cuadro */
    if (SC && scShowcase(vh)) { ticking = true; requestAnimationFrame(scrollFrame); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* Escaparate de categoría: sección fijada que recorre los destacados */
  function showcase(cat) {
    var host = $('#showcase');
    var items = cat === 'todo' ? [] : PRODUCTS.filter(function (p) { return p.cat === cat; })
      .sort(function (a, b) { return (b.top - a.top) || (b.nuevo - a.nuevo); }).slice(0, 5);
    if (items.length < 2) { if (host) { host.hidden = true; host.innerHTML = ''; } SC = null; document.body.classList.remove('sc-active'); return; }
    if (!host) { host = document.createElement('section'); host.id = 'showcase'; host.className = 'showcase'; var m = $('main'); m.parentNode.insertBefore(host, m); }
    var c = catOf(cat);
    host.hidden = false; host.style.setProperty('--n', items.length); host.setAttribute('aria-label', 'Destacados de ' + c.name);
    host.innerHTML = '<div class="sc-sticky">' +
      '<div class="sc-word" aria-hidden="true">' + esc(c.name) + '</div>' +
      '<div class="sc-media">' + items.map(function (p, i) {
        return '<a class="sc-slide" href="producto.html?id=' + p.id + '" tabindex="-1" aria-hidden="true"><img src="' + photo(p.colors[0].img) + '" alt="" decoding="async"></a>';
      }).join('') + '<div class="sc-frame" aria-hidden="true"></div></div>' +
      '<div class="sc-copy">' + items.map(function (p, i) {
        var sw = p.colors.length > 1 ? '<span class="sc-sw">' + p.colors.slice(0, 6).map(function (x) { return '<i style="background:' + x.hex + '"></i>'; }).join('') + '</span>' : '';
        return '<article class="sc-text" data-i="' + i + '">' +
          '<div class="sc-num"><span><b>' + pad2(i + 1) + '</b></span><small>/ ' + pad2(items.length) + '</small></div>' +
          '<p class="sc-line sc-eyebrow"><span>' + esc(c.name) + (p.badge ? ' · ' + esc(p.badge) : '') + '</span></p>' +
          '<h2 class="sc-line sc-name"><span>' + esc(p.name) + '</span></h2>' +
          '<p class="sc-line sc-desc"><span>' + esc(p.desc) + '</span></p>' +
          '<div class="sc-meta"><strong>' + money(p.price) + '</strong>' + sw + '</div>' +
          '<div class="sc-ctas"><a class="btn btn-gold" href="producto.html?id=' + p.id + '">Ver producto</a>' +
          (p.modelo3d ? '<a class="btn btn-outline-light" href="producto.html?id=' + p.id + '&amp;vista=3d">Explorar en 3D</a>' : '') + '</div></article>';
      }).join('') + '</div>' +
      '<ol class="sc-dots">' + items.map(function (p, i) { return '<li><button type="button" data-i="' + i + '" aria-label="Ver ' + esc(p.name) + '"></button></li>'; }).join('') + '</ol>' +
      '<div class="sc-bar" aria-hidden="true"><span></span></div>' +
      '<div class="sc-hint" aria-hidden="true">Desliza para descubrir<i></i></div></div>';
    SC = { host: host, n: items.length, idx: -1, cur: null, sticky: $('.sc-sticky', host), slides: $$('.sc-slide', host).map(function (s) { s._img = $('img', s); return s; }), texts: $$('.sc-text', host), dots: $$('.sc-dots button', host) };
    $('.sc-dots', host).addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var i = +b.getAttribute('data-i'), top = host.getBoundingClientRect().top + window.scrollY, run = host.offsetHeight - $('.sc-sticky', host).offsetHeight;
      window.scrollTo({ top: top + run * (i + 0.5) / SC.n, behavior: REDUCE ? 'auto' : 'smooth' });
    });
    if (REDUCE) { SC.texts.forEach(function (t) { t.classList.add('on'); }); SC.slides.forEach(function (s) { s.classList.add('on'); }); SC = null; return; }
    onScroll();
  }
  /* Escaparate continuo: cada foto entra con una cortina que sigue el scroll cuadro a cuadro (solo transform),
     la anterior se hunde y se oscurece. La posición se suaviza para que la rueda del mouse no dé saltos. */
  var SC_W = 0.7, smooth = function (t) { return t * t * (3 - 2 * t); };
  function scShowcase(vh) {
    var r = SC.host.getBoundingClientRect(), run = SC.host.offsetHeight - SC.sticky.offsetHeight;
    if (r.bottom < -vh || r.top > vh * 2) { SC.cur = null; return false; }
    var target = clamp(-r.top / run, 0, 1), cur = SC.cur == null ? target : SC.cur + (target - SC.cur) * 0.14;
    if (Math.abs(target - cur) < 0.0005) cur = target;
    SC.cur = cur;
    var f = cur * SC.n, idx = Math.min(SC.n - 1, Math.floor(f));
    SC.host.style.setProperty('--p', cur.toFixed(4));
    SC.slides.forEach(function (s, k) {
      var e = k ? smooth(clamp((f - k + SC_W / 2) / SC_W, 0, 1)) : 1;
      var x = k < SC.n - 1 ? smooth(clamp((f - k - 1 + SC_W / 2) / SC_W, 0, 1)) : 0;
      if (s._f === f) return;
      s._f = f;
      var drift = (0.5 - clamp(f - k, -0.5, 1.5)) * 2.5;
      s.style.transform = 'translate3d(0,' + ((1 - e) * 100).toFixed(3) + '%,0)';
      s._img.style.transform = 'translate3d(0,' + (-(1 - e) * 82 - x * 18 + drift).toFixed(3) + '%,0) scale(' + (1.04 + (1 - e) * 0.12 + x * 0.04).toFixed(4) + ')';
      s._img.style.opacity = (1 - x * 0.55).toFixed(3);
    });
    SC.host.classList.toggle('started', cur > 0.01);
    document.body.classList.toggle('sc-active', r.top <= 0 && r.bottom > vh * 0.6);
    if (idx !== SC.idx) {
      SC.idx = idx;
      SC.slides.forEach(function (s, i) { s.classList.toggle('on', i === idx); s.setAttribute('tabindex', i === idx ? '0' : '-1'); });
      SC.texts.forEach(function (t, i) { t.classList.toggle('on', i === idx); t.classList.toggle('past', i < idx); t.setAttribute('aria-hidden', i === idx ? 'false' : 'true'); $$('a', t).forEach(function (a) { a.tabIndex = i === idx ? 0 : -1; }); });
      SC.dots.forEach(function (d, i) { d.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
    }
    return cur !== target;
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
    var cg2 = $('#combo-grid'), lc = liveCombos();
    if (cg2 && lc.length) { $('#combos-home').hidden = false; renderComboGrid(cg2, lc.slice(0, 3)); }
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
      var st = $('#shop-title'); if (st.getAttribute('data-split') !== title) { st.removeAttribute('data-split'); st.textContent = title; }
      $('#crumb-current').textContent = title;
      if (state.cat !== state._sc) { state._sc = state.cat; showcase(state.cat); }
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
    var ps = $('#p-specs'); if (ps) ps.textContent = 'Categoría: ' + c.name + ' · Colores: ' + p.colors.map(function (x) { return x.name; }).join(', ') + ' · Referencia: ' + p.id.toUpperCase();
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
    /* Paquete clásico (no módulo): carga con cualquier servidor, aunque envíe .js como texto */
    function loadVisor() {
      if (window.LVVisor3D) return Promise.resolve(window.LVVisor3D);
      return loadVisor._p || (loadVisor._p = new Promise(function (ok, ko) {
        var sc = document.createElement('script'); sc.src = 'js/visor3d.bundle.js?v=' + ASSET_V; sc.async = true;
        sc.onload = function () { window.LVVisor3D ? ok(window.LVVisor3D) : ko(new Error('visor')); };
        sc.onerror = function () { loadVisor._p = null; ko(new Error('visor')); };
        document.head.appendChild(sc);
      }));
    }
    function open3D() {
      toast('Cargando vista 3D…');
      loadVisor()
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
    var pc = productCombos(p), buy = $('.pd-info .js-buy');
    if (pc && buy) buy.insertAdjacentHTML('afterend', pc);
    var rel = PRODUCTS.filter(function (x) { return x.id !== p.id && x.cat !== p.cat; }).slice(0, 3)
      .concat(PRODUCTS.filter(function (x) { return x.id !== p.id && x.cat === p.cat; }).slice(0, 1));
    $('#related').innerHTML = rel.map(card).join('');
    reveal();
  }

  /* ---------- Checkout ---------- */
  /* ---------- Checkout por WhatsApp ----------
     El pedido solo cuenta como enviado cuando el cliente confirma que pulsó «Enviar» en WhatsApp:
     la página no puede saberlo por sí sola. Mientras tanto queda pendiente y el carrito se conserva. */
  var SHIPPING = {
    estandar: { label: 'Envío estándar', detalle: '3–5 días hábiles', costo: 12000 },
    express: { label: 'Envío express', detalle: '1–2 días hábiles', costo: 18000 },
    contraentrega: { label: 'Contra entrega', detalle: 'pago al recibir', costo: 15000 }
  };
  /* Envío estándar gratis: promoción activa de tipo «envio» con su mínimo de compra (panel → Promociones) */
  function freeShippingMin() {
    var pr = (C.promociones || []).filter(function (x) { return x.tipo === 'envio' && x.activo; })[0];
    return pr ? +pr.minimo || 0 : 0;
  }
  /* Códigos de descuento (panel → Descuentos) */
  function checkCode(code, sub) {
    code = String(code || '').trim().toUpperCase(); if (!code) return null;
    var c = (window.LV_CODES || []).filter(function (x) { return String(x.codigo).toUpperCase() === code; })[0];
    if (!c || !c.activo) return { ok: false, msg: 'Ese código no existe o no está activo.' };
    if (c.vence && new Date(c.vence + 'T23:59:59') < new Date()) return { ok: false, msg: 'Ese código ya venció.' };
    if (c.minimo && sub < c.minimo) return { ok: false, msg: 'Este código aplica en compras desde ' + money(c.minimo) + '.' };
    var d = c.tipo === 'valor' ? Math.min(+c.valor || 0, sub) : Math.round(sub * (+c.valor || 0) / 100);
    return { ok: true, code: c.codigo, desc: d, label: c.tipo === 'valor' ? 'Código ' + c.codigo : 'Código ' + c.codigo + ' (−' + c.valor + '%)' };
  }
  function cartTotals(metodo, code) {
    var it = Cart.items(), sub = 0, comboSave = 0;
    it.forEach(function (x) {
      if (x.combo) { var ci = comboInfo(comboById(x.combo), x.colors); if (ci) { var unit = ci.live ? ci.final : ci.sum; sub += unit * x.qty; comboSave += (ci.sum - unit) * x.qty; } }
      else { var p = findProduct(x.id); if (p) sub += p.price * x.qty; }
    });
    var cd = checkCode(code, sub), disc = cd && cd.ok ? cd.desc : 0;
    var opt = SHIPPING[metodo], min = freeShippingMin();
    var ship = opt ? (metodo === 'estandar' && min && sub - disc > min ? 0 : opt.costo) : null;
    return { items: it, sub: sub, comboSave: comboSave, code: cd, disc: disc, ship: ship, total: sub - disc + (ship || 0) };
  }

  function initCheckout() {
    var step = 1, cliente = null, PENDING = 'lv_pending_order';
    var envioSel = function () { var r = $('input[name="envio"]:checked'); return r ? r.value : ''; };
    var readPending = function () { try { return JSON.parse(sessionStorage.getItem(PENDING) || 'null'); } catch (e) { return null; } };
    var writePending = function (o) { try { o ? sessionStorage.setItem(PENDING, JSON.stringify(o)) : sessionStorage.removeItem(PENDING); } catch (e) {} };

    /* Precios de envío en las opciones, desde una sola tabla */
    function renderShipOptions() {
      var t = cartTotals('estandar'), min = freeShippingMin();
      Object.keys(SHIPPING).forEach(function (k) {
        var el = $('#ship-' + k); if (!el) return;
        el.textContent = k === 'estandar' && min && t.sub > min ? 'Gratis' : money(SHIPPING[k].costo);
      });
      var note = $('#ship-free'); if (note) { note.hidden = !min; note.textContent = min ? (t.sub > min ? 'Tu pedido tiene envío estándar gratis.' : 'Envío estándar gratis en pedidos superiores a ' + money(min) + '.') : ''; }
    }

    var codeVal = ''; try { codeVal = sessionStorage.getItem('lv_code') || ''; } catch (e) {}
    function renderSummary() {
      var t = cartTotals(step >= 2 ? envioSel() : '', codeVal), box = $('#lines');
      box.innerHTML = t.items.length ? t.items.map(function (x, i) {
        if (x.combo) {
          var ci = comboInfo(comboById(x.combo), x.colors); if (!ci) return '';
          return '<div class="line-item combo-line"><div class="th"><img src="' + photo(colorImg(ci.items[0].p, ci.items[0].color), true) + '" alt=""><span class="th-tag">−' + ci.c.descuento + '%</span></div><div class="d"><strong>Combo ' + esc(ci.c.nombre) + '</strong><small>' +
            ci.items.map(function (y) { return esc(y.p.name) + ' · ' + esc(y.color); }).join('<br>') + ' · Cant. ' + x.qty + '</small>' +
            (step < 3 ? '<button class="rm" data-i="' + i + '">Quitar</button>' : '') + '</div><strong>' + money((ci.live ? ci.final : ci.sum) * x.qty) + '</strong></div>';
        }
        var p = findProduct(x.id); if (!p) return '';
        return '<div class="line-item"><div class="th"><img src="' + photo(colorImg(p, x.color), true) + '" alt=""></div><div class="d"><strong>' + esc(p.name) + '</strong><small>' + esc(x.color) + ' · Cant. ' + x.qty + '</small>' +
          (step < 3 ? '<button class="rm" data-i="' + i + '">Quitar</button>' : '') + '</div><strong>' + money(p.price * x.qty) + '</strong></div>';
      }).join('') : '<p class="note">Tu carrito está vacío. <a class="link-line" href="tienda.html">Ir a la tienda</a></p>';
      $('#t-sub').textContent = t.items.length ? money(t.sub) : '—';
      $('#row-combo').hidden = !t.comboSave; $('#t-combo').textContent = '−' + money(t.comboSave);
      $('#row-code').hidden = !t.disc; $('#t-code').textContent = '−' + money(t.disc); if (t.code && t.code.ok) $('#t-code-label').textContent = t.code.label;
      var cm = $('#code-msg');
      if (codeVal && t.items.length) { cm.hidden = false; cm.textContent = t.code.ok ? 'Código aplicado: ahorras ' + money(t.disc) + '.' : t.code.msg; cm.classList.toggle('ok', !!t.code.ok); } else cm.hidden = true;
      $('#t-ship').textContent = step < 2 ? 'Se calcula en el paso 2' : t.ship === null ? 'Elige un envío' : t.ship === 0 ? 'Gratis' : money(t.ship);
      $('#t-total').textContent = t.items.length ? money(t.total) : '—';
      $('#confirm-order').disabled = !t.items.length;
      renderShipOptions();
    }

    function go(n) {
      step = n;
      $$('.co-step').forEach(function (s) { s.hidden = +s.getAttribute('data-step') !== n; });
      $$('.steps li').forEach(function (li, i) { li.className = n === 4 || i + 1 < Math.min(n, 2) ? 'done' : (i + 1 === Math.min(n, 2) ? 'on' : ''); });
      if (n >= 2 && cliente) $('#city-label').textContent = cliente.ciudad + ', ' + cliente.departamento;
      renderSummary(); window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    $('#lines').addEventListener('click', function (e) { var b = e.target.closest('.rm'); if (b) { Cart.remove(+b.getAttribute('data-i')); renderSummary(); } });
    $$('input[name="envio"]').forEach(function (r) { r.addEventListener('change', renderSummary); });
    $('#code').value = codeVal;
    $('#code-form').addEventListener('submit', function (e) {
      e.preventDefault(); codeVal = $('#code').value.trim().toUpperCase(); $('#code').value = codeVal;
      try { codeVal ? sessionStorage.setItem('lv_code', codeVal) : sessionStorage.removeItem('lv_code'); } catch (x) {}
      renderSummary();
    });

    /* Paso 1: datos */
    $('#form-datos').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(e.target), get = function (k) { return String(f.get(k) || '').trim(); };
      var falta = ['nombre', 'documento', 'email', 'celular', 'departamento', 'ciudad', 'direccion'].filter(function (k) { return !get(k); });
      if (falta.length) { toast('Completa todos los campos para continuar.'); var el = e.target.elements[falta[0]]; if (el) el.focus(); return; }
      if (!f.get('habeas_tratamiento')) { toast('Debes aceptar el tratamiento de datos para continuar.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get('email'))) { toast('Revisa tu correo electrónico.'); e.target.elements.email.focus(); return; }
      var cel = get('celular').replace(/\D/g, '').replace(/^57(?=3\d{9}$)/, '');
      if (!/^3\d{9}$/.test(cel)) { toast('Celular inválido: usa 10 dígitos, por ejemplo 3001234567.'); e.target.elements.celular.focus(); return; }
      cliente = { nombre: get('nombre'), tipoDoc: get('tipoDoc'), documento: get('documento'), email: get('email').toLowerCase(), celular: cel,
        departamento: get('departamento'), ciudad: get('ciudad'), direccion: get('direccion'), habeasTratamiento: true, marketingOptin: f.get('marketing_optin') === 'on' };
      go(2);
    });
    $('#back-1').addEventListener('click', function () { go(1); });

    /* Paso 2 → 3: abre WhatsApp y deja el pedido pendiente (no se registra todavía) */
    function buildOrder() {
      var metodo = envioSel(), t = cartTotals(metodo, codeVal), prev = readPending();
      var sig = JSON.stringify([t.items, metodo, cliente]);
      return {
        numero: prev && prev.sig === sig ? prev.numero : 'LV-' + String(Date.now()).slice(-6), sig: sig,
        fecha: new Date().toISOString(), estado: 'pendiente_confirmacion', cliente: cliente,
        envio: { metodo: metodo, costo: t.ship },
        pago: { subtotal: t.sub, descuento: t.disc, codigo: t.code && t.code.ok ? t.code.code : '', envio: t.ship, total: t.total, items: t.items.map(function (x) {
          if (x.combo) { var ci = comboInfo(comboById(x.combo), x.colors), unit = ci.live ? ci.final : ci.sum; return { combo: ci.c.id, nombre: 'Combo ' + ci.c.nombre, color: ci.items.map(function (y) { return y.p.name + ' (' + y.color + ')'; }).join(' + '), cantidad: x.qty, precioUnitario: unit, subtotal: unit * x.qty }; }
          var p = findProduct(x.id); return { id: p.id, nombre: p.name, color: x.color, cantidad: x.qty, precioUnitario: p.price, subtotal: p.price * x.qty }; }) }
      };
    }
    function waOrderUrl(o) {
      var opt = SHIPPING[o.envio.metodo];
      var msg = '*PEDIDO ' + o.numero + '*\n\n' +
        '*Cliente:* ' + o.cliente.nombre + '\n*WhatsApp:* +57' + o.cliente.celular + '\n*Correo:* ' + o.cliente.email + '\n' +
        '*Documento:* ' + o.cliente.tipoDoc + ' ' + o.cliente.documento + '\n' +
        '*Envío a:* ' + o.cliente.direccion + ', ' + o.cliente.ciudad + ', ' + o.cliente.departamento + '\n' +
        '*Método:* ' + opt.label + ' (' + opt.detalle + ')\n\n*Detalle:*\n' +
        o.pago.items.map(function (i) { return '• ' + i.nombre + ' (' + i.color + ') x' + i.cantidad + ' = ' + money(i.subtotal); }).join('\n') + '\n\n' +
        '*Subtotal:* ' + money(o.pago.subtotal) + '\n' + (o.pago.descuento ? '*Descuento (' + o.pago.codigo + '):* −' + money(o.pago.descuento) + '\n' : '') + '*Envío:* ' + (o.pago.envio ? money(o.pago.envio) : 'Gratis') + '\n*TOTAL:* ' + money(o.pago.total) + '\n\n' +
        (o.cliente.marketingOptin ? 'Acepta recibir promociones.' : 'No desea recibir promociones.');
      return 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(msg);
    }
    function showPending(o) {
      $('#pending-n').textContent = o.numero;
      $('#wa-retry').href = waOrderUrl(o);
      go(3);
    }
    $('#confirm-order').addEventListener('click', function () {
      if (!Cart.items().length) { toast('Tu carrito está vacío.'); return; }
      if (!envioSel()) { toast('Elige un método de envío.'); return; }
      var o = buildOrder(); writePending(o);
      showPending(o);
      openWhatsApp(waOrderUrl(o));
    });

    /* Paso 3 → 4: solo aquí el pedido queda registrado y se vacía el carrito */
    $('#sent-yes').addEventListener('click', function () {
      var o = readPending(); if (!o) { go(2); return; }
      delete o.sig; o.estado = 'pendiente'; o.fecha = new Date().toISOString();
      try {
        var all = JSON.parse(localStorage.getItem('lv_admin_orders') || '[]');
        if (!all.some(function (x) { return x.numero === o.numero; })) { all.unshift(o); localStorage.setItem('lv_admin_orders', JSON.stringify(all.slice(0, 200))); }
        if (o.cliente.marketingOptin) {
          var lista = JSON.parse(localStorage.getItem('lv_marketing') || '[]');
          if (!lista.some(function (c) { return c.email === o.cliente.email; })) { lista.push({ email: o.cliente.email, nombre: o.cliente.nombre, celular: o.cliente.celular, fechaRegistro: o.fecha, fuente: 'checkout:' + o.numero, activo: true }); localStorage.setItem('lv_marketing', JSON.stringify(lista)); }
        }
      } catch (e) {}
      writePending(null); Cart.set([]);
      $('#order-n').textContent = o.numero;
      $('#wa-confirm').href = waLink('Hola Lovely, quiero saber el estado de mi pedido ' + o.numero + '.');
      go(4);
    });
    $('#sent-edit').addEventListener('click', function () { writePending(null); go(2); });

    /* Si vuelve de WhatsApp o recarga la página con un pedido pendiente, se le pregunta de nuevo */
    var pend = readPending();
    if (pend && Cart.items().length) { cliente = pend.cliente; if (pend.envio && $('input[name="envio"][value="' + pend.envio.metodo + '"]')) $('input[name="envio"][value="' + pend.envio.metodo + '"]').checked = true; showPending(pend); }
    else { writePending(null); go(1); }
  }

  /* ---------- Ayuda ---------- */
  function initHelp() {
    renderFaqs();
    $$('.js-contact').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); f.reset(); toast('¡Mensaje enviado! Te responderemos pronto.'); }); });
    var h = location.hash.replace('#', '');
    if (h) {
      var d = $('#' + h);
      if (d && d.tagName === 'DETAILS') d.open = true;
      else if (d) { var first = $('details', d); if (first) first.open = true; }
    }
  }

  /* Preguntas frecuentes editables desde el panel (LV_FAQS) */
  function renderFaqs() {
    var faqs = window.LV_FAQS || [];
    if (!faqs.length) return;
    $$('[data-faq]').forEach(function (box) {
      var cat = box.getAttribute('data-faq');
      var items = faqs.filter(function (f) { return f.categoria === cat; })
        .sort(function (a, b) { return (a.orden || 0) - (b.orden || 0); });
      if (!items.length) return;
      box.innerHTML = items.map(function (f, i) {
        return '<details' + (i === 0 ? ' open' : '') + '><summary>' + esc(f.pregunta) + '</summary><p>' + f.respuesta + '</p></details>';
      }).join('');
    });
  }

  applyTexts();
  renderChrome();
  watchSvgs(); setTimeout(watchSvgs, 1500);
  setTimeout(parallax, 0);
  if (page === 'home') initHome();
  if (page === 'tienda') initShop();
  if (page === 'producto') initProduct();
  if (page === 'checkout') initCheckout();
  if (page === 'ayuda') initHelp();
  if (page === 'combo') initCombo();
  reveal();
})();
