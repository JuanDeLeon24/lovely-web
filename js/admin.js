/* Lovely · Panel administrativo.
   Lee y escribe js/data.js y las fotos de assets/products/ directamente en el repositorio
   de GitHub (API REST) con un token personal guardado solo en este navegador.
   Al publicar se crea un único commit; GitHub Pages actualiza la tienda en 1 o 2 minutos. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { return n ? '$ ' + Number(n).toLocaleString('es-CO') : 'Precio por confirmar'; };
  var slug = function (t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60); };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  var ICONS = [['reloj', 'Reloj'], ['gorra', 'Gorra'], ['gafas', 'Gafas'], ['cadena', 'Cadena'], ['pulsera', 'Pulsera'], ['accesorio', 'Accesorio']];
  var AUTH = 'lv_admin';

  var S = { token: '', repo: '', branch: 'main', cfg: {}, cats: [], prods: [], combos: [], codes: [], faqs: [], dataSha: '', files: {}, del: {}, urls: {}, changed: {}, dirty: false };

  function toast(msg, ms) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, ms || 3200);
  }
  function setDirty(on) {
    S.dirty = on;
    var st = $('#status'); st.classList.toggle('dirty', on);
    st.textContent = on ? 'Cambios sin publicar' : 'Todo publicado';
    $('#publish').disabled = !on;
  }

  /* ---------- Sesión ---------- */
  function readAuth() { try { return JSON.parse(localStorage.getItem(AUTH) || sessionStorage.getItem(AUTH) || 'null'); } catch (e) { return null; } }
  function writeAuth(a, remember) { try { (remember ? localStorage : sessionStorage).setItem(AUTH, JSON.stringify(a)); } catch (e) {} }
  function clearAuth() { try { localStorage.removeItem(AUTH); sessionStorage.removeItem(AUTH); } catch (e) {} }

  /* ---------- GitHub ---------- */
  function gh(path, opt) {
    opt = opt || {};
    var headers = { Authorization: 'Bearer ' + S.token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
    if (opt.body) headers['Content-Type'] = 'application/json';
    return fetch('https://api.github.com/repos/' + S.repo + path, { method: opt.method || 'GET', headers: headers, body: opt.body ? JSON.stringify(opt.body) : undefined, cache: 'no-store' })
      .then(function (r) {
        if (r.ok) return r.status === 204 ? null : r.json();
        return r.json().catch(function () { return {}; }).then(function (j) { var e = new Error(j.message || ('Error ' + r.status)); e.status = r.status; throw e; });
      });
  }
  function b64utf8(b64) { var bin = atob(b64.replace(/\s/g, '')), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new TextDecoder().decode(u); }
  function blobB64(blob) { return new Promise(function (ok, ko) { var r = new FileReader(); r.onload = function () { ok(String(r.result).split(',')[1]); }; r.onerror = ko; r.readAsDataURL(blob); }); }

  function loadData() {
    return gh('/contents/js/data.js?ref=' + encodeURIComponent(S.branch)).then(function (f) {
      var w = {}; new Function('window', b64utf8(f.content))(w);
      S.cfg = w.LV_CONFIG || {}; S.cats = w.LV_CATEGORIES || []; S.prods = w.LV_PRODUCTS || []; S.dataSha = f.sha;
      S.combos = w.LV_COMBOS || []; S.codes = w.LV_CODES || []; S.faqs = w.LV_FAQS || [];
    });
  }
  function serialize() {
    return '/* Catálogo Lovely — generado también por el panel administrativo (admin.html).\n' +
      '   price: número en COP (0 = "Precio por confirmar"). stock: unidades disponibles.\n' +
      '   Las fotos están en assets/products/ (nombre.webp grande y nombre-sm.webp miniatura).\n' +
      '   modelo3d: true si el reloj tiene vista 3D en js/visor3d.js. */\n' +
      'window.LV_CONFIG = ' + JSON.stringify(S.cfg, null, 2) + ';\n\n' +
      'window.LV_CATEGORIES = [\n' + S.cats.map(function (c) { return '  ' + JSON.stringify(c); }).join(',\n') + '\n];\n\n' +
      'window.LV_PRODUCTS = [\n' + S.prods.map(function (p) { return '  ' + JSON.stringify(p); }).join(',\n') + '\n];\n\n' +
      '/* Combos «Arma tu look»: productos que hacen juego, descuento (%) y fecha de fin (hasta). */\n' +
      'window.LV_COMBOS = [\n' + S.combos.map(function (c) { return '  ' + JSON.stringify(c); }).join(',\n') + '\n];\n\n' +
      '/* Códigos de descuento que el cliente escribe en el carrito. */\n' +
      'window.LV_CODES = [\n' + S.codes.map(function (c) { return '  ' + JSON.stringify(c); }).join(',\n') + '\n];\n\n' +
      '/* Preguntas frecuentes de la página Ayuda. */\n' +
      'window.LV_FAQS = [\n' + S.faqs.map(function (c) { return '  ' + JSON.stringify(c); }).join(',\n') + '\n];\n';
  }

  /* ---------- Fotos ---------- */
  var P = function (name, big) { return 'assets/products/' + name + (big ? '' : '-sm') + '.webp'; };
  function imgSrc(name) { if (!name) return ''; return S.urls[name] || P(name); }
  function decode(file) {
    if (window.createImageBitmap) return createImageBitmap(file, { imageOrientation: 'from-image' }).catch(function () { return viaImg(file); });
    return viaImg(file);
  }
  function viaImg(file) { return new Promise(function (ok, ko) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = function () { ko(new Error('No se pudo leer la imagen.')); }; i.src = URL.createObjectURL(file); }); }
  function encode(img, maxW, q) {
    var w = img.width, h = img.height, k = Math.min(1, maxW / w), c = document.createElement('canvas');
    c.width = Math.round(w * k); c.height = Math.round(h * k);
    var x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, c.width, c.height);
    return new Promise(function (ok) { c.toBlob(ok, 'image/webp', q); });
  }
  /* Optimiza una foto: 900 px y miniatura de 480 px en WebP. Devuelve el nombre base. */
  function addImage(file, base) {
    if (!/^image\//.test(file.type)) return Promise.reject(new Error('El archivo «' + file.name + '» no es una imagen.'));
    return decode(file).then(function (img) {
      return Promise.all([encode(img, 900, 0.82), encode(img, 480, 0.8)]);
    }).then(function (r) {
      if (!r[0] || r[0].type !== 'image/webp') throw new Error('Este navegador no puede convertir fotos a WebP. Usa Chrome, Edge o Firefox.');
      var name = (slug(base) || 'producto') + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
      S.files[P(name, true)] = r[0]; S.files[P(name)] = r[1]; S.urls[name] = URL.createObjectURL(r[1]);
      return name;
    });
  }
  function dropImage(name) {
    if (!name) return;
    if (S.files[P(name, true)]) { delete S.files[P(name, true)]; delete S.files[P(name)]; }
    else S.del[name] = true;
  }
  function downloadImage(name) {
    var blob = S.files[P(name, true)];
    (blob ? Promise.resolve(blob) : fetch(P(name, true), { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(); return r.blob(); }))
      .then(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name + '.webp'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000); })
      .catch(function () { toast('La foto aún no está disponible para descargar. Si la acabas de publicar, espera un par de minutos.'); });
  }
  function referenced() {
    var r = {};
    S.prods.forEach(function (p) { p.colors.forEach(function (c) { if (c.img) r[c.img] = 1; }); (p.extra || []).forEach(function (x) { r[x] = 1; }); });
    S.cats.forEach(function (c) { if (c.cover) r[c.cover] = 1; });
    return r;
  }

  /* ---------- Publicar (un solo commit) ---------- */
  function publish() {
    if (!S.dirty) return;
    var btn = $('#publish'); btn.disabled = true;
    var st = $('#status'), refs = referenced(), uploads = Object.keys(S.files).filter(function (p) { return refs[p.replace(/^assets\/products\//, '').replace(/(-sm)?\.webp$/, '')]; });
    var head, tree = [];
    st.textContent = 'Comprobando…';
    gh('/contents/js/data.js?ref=' + encodeURIComponent(S.branch)).then(function (cur) {
      if (cur.sha !== S.dataSha) throw new Error('La tienda tiene cambios publicados desde otro lugar. Descarga un respaldo, recarga el panel y vuelve a aplicar tus cambios.');
      return gh('/git/ref/heads/' + encodeURIComponent(S.branch));
    }).then(function (ref) {
      head = ref.object.sha; return gh('/git/commits/' + head);
    }).then(function (commit) {
      var chain = Promise.resolve();
      uploads.forEach(function (path, i) {
        chain = chain.then(function () {
          st.textContent = 'Subiendo fotos ' + (i + 1) + ' de ' + uploads.length + '…';
          return blobB64(S.files[path]).then(function (b64) { return gh('/git/blobs', { method: 'POST', body: { content: b64, encoding: 'base64' } }); })
            .then(function (b) { tree.push({ path: path, mode: '100644', type: 'blob', sha: b.sha }); });
        });
      });
      return chain.then(function () {
        Object.keys(S.del).forEach(function (name) { if (!refs[name]) [P(name, true), P(name)].forEach(function (p) { tree.push({ path: p, mode: '100644', type: 'blob', sha: null }); }); });
        tree.push({ path: 'js/data.js', mode: '100644', type: 'blob', content: serialize() });
        st.textContent = 'Guardando…';
        return gh('/git/trees', { method: 'POST', body: { base_tree: commit.tree.sha, tree: tree } });
      });
    }).then(function (t) {
      return gh('/git/commits', { method: 'POST', body: { message: 'Actualizar catálogo desde el panel administrativo', tree: t.sha, parents: [head] } });
    }).then(function (c) {
      return gh('/git/refs/heads/' + encodeURIComponent(S.branch), { method: 'PATCH', body: { sha: c.sha } }).then(function () { return gh('/contents/js/data.js?ref=' + c.sha); });
    }).then(function (f) {
      S.dataSha = f.sha; S.files = {}; S.del = {}; S.changed = {};
      setDirty(false); renderList();
      toast('¡Publicado! La tienda se actualiza en 1 o 2 minutos.', 5000);
    }).catch(function (e) {
      setDirty(true); toast(errorText(e), 7000);
    });
  }
  function errorText(e) {
    if (e.status === 401) return 'El token no es válido o expiró. Sal y vuelve a entrar con un token nuevo.';
    if (e.status === 403) return 'El token no tiene permiso para escribir en el repositorio (Contents: Read and write).';
    if (e.status === 404) return 'No se encontró el repositorio o el token no tiene acceso a él.';
    if (e.status === 409 || e.status === 422) return 'GitHub rechazó el cambio (' + e.message + '). Recarga el panel e inténtalo de nuevo.';
    return e.message || 'Algo salió mal. Revisa tu conexión e inténtalo de nuevo.';
  }

  /* ---------- Productos ---------- */
  var catName = function (s) { var c = S.cats.filter(function (x) { return x.slug === s; })[0]; return c ? c.name : s; };
  function renderFilters() {
    $('#fcat').innerHTML = '<option value="">Todas las categorías</option>' + S.cats.map(function (c) { return '<option value="' + esc(c.slug) + '">' + esc(c.name) + '</option>'; }).join('');
  }
  function renderList() {
    var q = slug($('#q').value), cat = $('#fcat').value;
    var list = S.prods.filter(function (p) { return (!cat || p.cat === cat) && (!q || slug(p.name + ' ' + p.brand + ' ' + p.id).indexOf(q) > -1); });
    $('#count').textContent = list.length + (list.length === 1 ? ' producto' : ' productos') + (cat || q ? ' (de ' + S.prods.length + ')' : '');
    $('#list').innerHTML = list.map(function (p) {
      var tags = (p.stock === 0 ? '<span class="tag warn">Agotado</span>' : '') + (p.top ? '<span class="tag">Destacado</span>' : '') + (p.nuevo ? '<span class="tag">Novedad</span>' : '') +
        (p.badge ? '<span class="tag">' + esc(p.badge) + '</span>' : '') + (p.modelo3d ? '<span class="tag dark">3D</span>' : '') + (S.changed[p.id] ? '<span class="tag edit">Sin publicar</span>' : '');
      var im = p.colors[0] && p.colors[0].img;
      return '<button class="prow" data-id="' + esc(p.id) + '">' + (im ? '<img src="' + esc(imgSrc(im)) + '" alt="" loading="lazy">' : '<span class="thumb-empty"></span>') +
        '<span class="info"><span class="name">' + esc(p.name) + '</span><span class="meta">' + esc(catName(p.cat)) + ' · ' + money(p.price) + ' · ' + p.stock + ' uds. · ' + p.colors.length + (p.colors.length === 1 ? ' color' : ' colores') + '</span><span class="tags">' + tags + '</span></span></button>';
    }).join('') || '<p class="muted">No hay productos con ese filtro.</p>';
  }

  /* ---------- Editor ---------- */
  var E = null, isNew = false, idTouched = false;
  var ed = $('#editor'), form = $('#ed-form'), F = form.elements;
  function openEditor(id) {
    var p = id ? S.prods.filter(function (x) { return x.id === id; })[0] : null;
    isNew = !p; idTouched = false;
    E = p ? clone(p) : { id: '', name: '', brand: '', cat: ($('#fcat').value || (S.cats[0] && S.cats[0].slug) || ''), badge: 'Nuevo', top: false, nuevo: true, stock: 10, price: 0, desc: '', colors: [], extra: [] };
    $('#ed-title').textContent = isNew ? 'Nuevo producto' : 'Editar producto';
    F.cat.innerHTML = S.cats.map(function (c) { return '<option value="' + esc(c.slug) + '">' + esc(c.name) + '</option>'; }).join('');
    ['name', 'id', 'brand', 'cat', 'badge', 'price', 'stock', 'desc'].forEach(function (k) { F[k].value = E[k] == null ? '' : E[k]; });
    F.top.checked = !!E.top; F.nuevo.checked = !!E.nuevo;
    F.id.readOnly = !isNew;
    $('#ed-delete').hidden = isNew; $('#ed-error').hidden = true;
    renderColors(); renderExtra();
    if (ed.showModal) ed.showModal(); else ed.setAttribute('open', '');
    F.name.focus();
  }
  function closeEditor() { if (ed.close) ed.close(); else ed.removeAttribute('open'); E = null; }
  function baseName() { return F.id.value || slug(F.name.value) || 'producto'; }

  function renderColors() {
    var box = $('#ed-colors');
    box.innerHTML = E.colors.map(function (c, i) {
      return '<div class="crow" data-i="' + i + '">' +
        '<label class="ph" title="Cambiar foto">' + (c.img ? '<img src="' + esc(imgSrc(c.img)) + '" alt="">' : '<span>Subir foto</span>') + '<input type="file" accept="image/*" data-act="photo" aria-label="Foto del color ' + esc(c.name) + '"></label>' +
        '<div class="fields"><input type="text" value="' + esc(c.name) + '" data-act="name" placeholder="Nombre del color" aria-label="Nombre del color">' +
        '<input type="color" value="' + esc(/^#[0-9a-f]{6}$/i.test(c.hex) ? c.hex : '#111111') + '" data-act="hex" aria-label="Tono del color">' +
        '<span class="acts"><button type="button" class="icon-btn" data-act="up" aria-label="Subir"' + (i ? '' : ' disabled') + '>↑</button>' +
        '<button type="button" class="icon-btn" data-act="down" aria-label="Bajar"' + (i < E.colors.length - 1 ? '' : ' disabled') + '>↓</button>' +
        '<button type="button" class="icon-btn" data-act="dl" aria-label="Descargar foto"' + (c.img ? '' : ' disabled') + '>⤓</button>' +
        '<button type="button" class="icon-btn" data-act="rm" aria-label="Quitar color">✕</button></span></div></div>';
    }).join('') || '<p class="muted small">Aún no hay colores. Agrega al menos uno con su foto.</p>';
  }
  function renderExtra() {
    $('#ed-extra').innerHTML = (E.extra || []).map(function (x, i) {
      return '<div class="xitem" data-i="' + i + '"><img src="' + esc(imgSrc(x)) + '" alt="Foto de detalle ' + (i + 1) + '"><div class="acts">' +
        '<button type="button" class="icon-btn" data-act="dl" aria-label="Descargar foto">⤓</button><button type="button" class="icon-btn" data-act="rm" aria-label="Quitar foto">✕</button></div></div>';
    }).join('');
  }
  $('#ed-colors').addEventListener('input', function (e) {
    var row = e.target.closest('.crow'); if (!row) return; var c = E.colors[+row.getAttribute('data-i')], act = e.target.getAttribute('data-act');
    if (act === 'name') c.name = e.target.value;
    if (act === 'hex') c.hex = e.target.value.toUpperCase();
  });
  $('#ed-colors').addEventListener('change', function (e) {
    if (e.target.getAttribute('data-act') !== 'photo' || !e.target.files[0]) return;
    var i = +e.target.closest('.crow').getAttribute('data-i'), c = E.colors[i];
    toast('Optimizando foto…');
    addImage(e.target.files[0], baseName() + '-' + slug(c.name || 'color')).then(function (name) { dropImage(c.img); c.img = name; renderColors(); toast('Foto lista.'); }).catch(function (err) { toast(err.message, 5000); });
  });
  $('#ed-colors').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var i = +b.closest('.crow').getAttribute('data-i'), act = b.getAttribute('data-act'), cs = E.colors;
    if (act === 'up' && i > 0) cs.splice(i - 1, 0, cs.splice(i, 1)[0]);
    if (act === 'down' && i < cs.length - 1) cs.splice(i + 1, 0, cs.splice(i, 1)[0]);
    if (act === 'dl') return downloadImage(cs[i].img);
    if (act === 'rm') { if (!confirm('¿Quitar el color «' + (cs[i].name || 'sin nombre') + '» y su foto?')) return; dropImage(cs[i].img); cs.splice(i, 1); }
    renderColors();
  });
  $('#add-color').addEventListener('click', function () { E.colors.push({ name: '', hex: '#111111', img: '' }); renderColors(); var r = $$('#ed-colors .crow'); r[r.length - 1].querySelector('input[type=text]').focus(); });
  $('#add-extra').addEventListener('change', function (e) {
    var files = Array.prototype.slice.call(e.target.files); e.target.value = '';
    if (!files.length) return; toast('Optimizando ' + files.length + (files.length === 1 ? ' foto…' : ' fotos…'));
    files.reduce(function (ch, f) { return ch.then(function () { return addImage(f, baseName() + '-detalle').then(function (n) { (E.extra = E.extra || []).push(n); }); }); }, Promise.resolve())
      .then(function () { renderExtra(); toast('Fotos listas.'); }).catch(function (err) { renderExtra(); toast(err.message, 5000); });
  });
  $('#ed-extra').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var i = +b.closest('.xitem').getAttribute('data-i');
    if (b.getAttribute('data-act') === 'dl') return downloadImage(E.extra[i]);
    if (!confirm('¿Quitar esta foto de detalle?')) return;
    dropImage(E.extra[i]); E.extra.splice(i, 1); renderExtra();
  });
  F.name.addEventListener('input', function () { if (isNew && !idTouched) F.id.value = slug(F.name.value); });
  F.id.addEventListener('input', function () { idTouched = true; });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = function (m) { var x = $('#ed-error'); x.textContent = m; x.hidden = false; x.scrollIntoView({ block: 'nearest' }); };
    var id = F.id.value.trim(), name = F.name.value.trim(), price = Number(F.price.value || 0), stock = Number(F.stock.value || 0);
    if (!name) return err('Escribe el nombre del producto.');
    if (!/^[a-z0-9-]+$/.test(id)) return err('El identificador solo puede tener minúsculas, números y guiones.');
    if (isNew && S.prods.some(function (p) { return p.id === id; })) return err('Ya existe un producto con ese identificador.');
    if (!(price >= 0) || Math.round(price) !== price) return err('El precio debe ser un número entero, sin puntos ni comas.');
    if (!(stock >= 0) || Math.round(stock) !== stock) return err('Las unidades deben ser un número entero.');
    if (!E.colors.length) return err('Agrega al menos un color con su foto.');
    if (E.colors.some(function (c) { return !c.img; })) return err('Cada color necesita una foto.');
    if (E.colors.some(function (c) { return !c.name.trim(); })) return err('Escribe el nombre de cada color.');
    Object.assign(E, { id: id, name: name, brand: F.brand.value.trim(), cat: F.cat.value, badge: F.badge.value.trim(), top: F.top.checked, nuevo: F.nuevo.checked, price: price, stock: stock, desc: F.desc.value.trim() });
    E.colors.forEach(function (c) { c.name = c.name.trim(); });
    if (isNew) S.prods.unshift(E); else S.prods[S.prods.findIndex(function (p) { return p.id === id; })] = E;
    S.changed[id] = true; closeEditor(); setDirty(true); renderList(); renderCombos(); renderDash();
    toast('Guardado. Pulsa «Publicar cambios» para subirlo a la tienda.');
  });
  $('#ed-delete').addEventListener('click', function () {
    if (!confirm('¿Eliminar «' + E.name + '» de la tienda? Sus fotos también se borrarán al publicar.')) return;
    var p = S.prods.filter(function (x) { return x.id === E.id; })[0];
    if (p) { p.colors.forEach(function (c) { dropImage(c.img); }); (p.extra || []).forEach(dropImage); S.prods.splice(S.prods.indexOf(p), 1); }
    closeEditor(); setDirty(true); renderList(); renderCombos(); renderDash(); toast('Producto eliminado. Publica para aplicarlo en la tienda.');
  });
  $$('[data-close]', ed).forEach(function (b) { b.addEventListener('click', closeEditor); });
  ed.addEventListener('cancel', function () { E = null; });

  /* ---------- Categorías ---------- */
  function renderCats() {
    $('#cats').innerHTML = S.cats.map(function (c, i) {
      var used = S.prods.filter(function (p) { return p.cat === c.slug; });
      var opts = used.reduce(function (a, p) { return a.concat(p.colors.map(function (x) { return [x.img, p.name + ' · ' + x.name]; })); }, []);
      return '<div class="cat-card" data-i="' + i + '">' + (c.cover ? '<img src="' + esc(imgSrc(c.cover)) + '" alt="">' : '<span class="thumb-empty"></span>') +
        '<div class="fields"><label>Nombre<input data-k="name" value="' + esc(c.name) + '"></label>' +
        '<label>Ícono<select data-k="icon">' + ICONS.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === c.icon ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label>' +
        '<label>Foto de portada<select data-k="cover">' + (opts.length ? '' : '<option value="">Sin productos todavía</option>') + opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[0] === c.cover ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></label>' +
        '<div class="row"><span class="muted small" style="margin:0;flex:1">' + used.length + ' productos · /' + esc(c.slug) + '</span>' + (used.length ? '' : '<button type="button" class="btn btn-danger" data-act="rm">Eliminar</button>') + '</div></div></div>';
    }).join('');
  }
  $('#cats').addEventListener('change', function (e) {
    var card = e.target.closest('.cat-card'), k = e.target.getAttribute('data-k'); if (!card || !k) return;
    S.cats[+card.getAttribute('data-i')][k] = e.target.value; setDirty(true); renderFilters();
    if (k === 'cover') renderCats();
  });
  $('#cats').addEventListener('click', function (e) {
    var b = e.target.closest('[data-act=rm]'); if (!b) return; var i = +b.closest('.cat-card').getAttribute('data-i');
    if (!confirm('¿Eliminar la categoría «' + S.cats[i].name + '»?')) return;
    S.cats.splice(i, 1); setDirty(true); renderCats(); renderFilters();
  });
  $('#new-cat').addEventListener('click', function () {
    var name = (prompt('Nombre de la nueva categoría (ej.: Pulseras)') || '').trim(); if (!name) return;
    var s = slug(name); if (!s || S.cats.some(function (c) { return c.slug === s; })) return toast('Ya existe una categoría con ese nombre.');
    S.cats.push({ slug: s, name: name, icon: 'accesorio', cover: '' }); setDirty(true); renderCats(); renderFilters();
  });

  /* ---------- Utilidades de las secciones ---------- */
  var today = function () { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
  var plusDays = function (n) { var d = new Date(Date.now() + n * 864e5); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
  var fmtDate = function (iso) { if (!iso) return ''; var d = new Date(String(iso).length === 10 ? iso + 'T12:00:00' : iso); return isNaN(d) ? iso : d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }); };
  var prodById = function (id) { return S.prods.filter(function (p) { return p.id === id; })[0]; };
  var colorOf = function (p, name) { return p.colors.filter(function (c) { return c.name === name; })[0] || p.colors[0] || {}; };
  var changed = function () { setDirty(true); renderDash(); };
  function lget(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { toast('No se pudo guardar en este navegador (¿modo privado?).', 5000); } }
  /* Dirección pública de la tienda, para los enlaces de los mensajes */
  function siteBase() {
    if (S.cfg.sitioWeb) return S.cfg.sitioWeb.replace(/\/?$/, '/');
    if (/^https:/.test(location.protocol) && !/localhost|127\.0\.0\.1/.test(location.hostname)) return location.origin + location.pathname.replace(/[^/]*$/, '');
    var r = (S.repo || 'juandeleon24/lovely-web').split('/'); return 'https://' + r[0].toLowerCase() + '.github.io/' + r[1] + '/';
  }
  function downloadFile(name, text, type) {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type || 'application/json' })); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  }
  var csvCell = function (v) { v = String(v == null ? '' : v); return /[",;\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  var toCsv = function (rows) { return '\ufeff' + rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n'); };
  var waTo = function (cel, msg) { return 'https://wa.me/57' + cel + '?text=' + encodeURIComponent(msg); };
  var normCel = function (t) { var d = String(t || '').replace(/\D/g, '').replace(/^57(?=3\d{9}$)/, ''); return /^3\d{9}$/.test(d) ? d : ''; };
  var pill = function (kind, txt) { return '<span class="pill ' + kind + '">' + esc(txt) + '</span>'; };

  /* Formularios del editor general */
  function fld(label, input, hint, cls, attrs) { return '<label' + (cls ? ' class="' + cls + '"' : '') + (attrs || '') + '>' + label + input + (hint ? '<small>' + hint + '</small>' : '') + '</label>'; }
  function inp(name, val, attrs) { return '<input name="' + name + '" value="' + esc(val == null ? '' : val) + '"' + (attrs || '') + '>'; }
  function area(name, val, attrs) { return '<textarea name="' + name + '"' + (attrs || '') + '>' + esc(val == null ? '' : val) + '</textarea>'; }
  function sel(name, opts, val) { return '<select name="' + name + '">' + opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(val) ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select>'; }
  function chk(name, on, label, hint) { return '<label class="check span2"><input type="checkbox" name="' + name + '"' + (on ? ' checked' : '') + '> <span>' + label + (hint ? '<small>' + hint + '</small>' : '') + '</span></label>'; }

  /* ---------- Editor general (combos, códigos, promociones, preguntas, contactos) ---------- */
  var dlg = $('#dlg'), dform = $('#dlg-form'), dbody = $('#dlg-body'), D = null;
  function openDialog(o) {
    D = o; $('#dlg-title').textContent = o.title; dbody.innerHTML = o.html; $('#dlg-error').hidden = true;
    var del = $('#dlg-delete'); del.hidden = !o.del; del.textContent = o.delLabel || 'Eliminar';
    dbody.oninput = o.input || null; dbody.onchange = o.change || null; dbody.onclick = o.click || null;
    if (o.init) o.init(dform.elements);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    dbody.scrollTop = 0;
  }
  function closeDialog() { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); D = null; }
  dform.addEventListener('submit', function (e) {
    e.preventDefault(); if (!D) return;
    var err = D.save(dform.elements);
    if (err) { var x = $('#dlg-error'); x.textContent = err; x.hidden = false; return; }
    closeDialog();
  });
  $('#dlg-delete').addEventListener('click', function () { if (D && D.del && D.del() !== false) closeDialog(); });
  $$('[data-close]', dlg).forEach(function (b) { b.addEventListener('click', closeDialog); });
  dlg.addEventListener('cancel', function () { D = null; });

  /* ---------- Inicio ---------- */
  function renderDash() {
    var box = $('#dash'); if (!box) return;
    var cs = S.combos.filter(function (c) { return comboCalc(c).st[0] === 'on'; }).length;
    var cd = S.codes.filter(function (c) { return c.activo && !(c.vence && c.vence < today()); }).length;
    var pr = (S.cfg.promociones || []).filter(function (p) { return p.activo && !(p.hasta && p.hasta < today()); }).length;
    var ag = S.prods.filter(function (p) { return p.stock === 0; }).length;
    var cont = contacts().filter(function (c) { return !c.baja; }).length, pend = orders().filter(function (o) { return o.estado === 'nuevo'; }).length;
    var cards = [
      ['productos', 'Productos', S.prods.length + ' productos' + (ag ? ' · ' + ag + ' agotados' : ''), 'Precios, fotos, colores, unidades y descripciones.'],
      ['combos', 'Combos', cs + ' visibles en la tienda', 'Ofertas «Arma tu look» con descuento y cuenta regresiva.'],
      ['descuentos', 'Códigos de descuento', cd + ' activos', 'Códigos que el cliente escribe al pagar.'],
      ['promociones', 'Promociones', pr + ' activas', 'Barra superior, ventana emergente y envío gratis.'],
      ['marketing', 'Marketing', cont + ' clientes para novedades', 'Envía mensajes por WhatsApp y correo cuando quieras.'],
      ['pedidos', 'Pedidos', pend + ' por confirmar', 'Controla el estado de los pedidos que llegan por WhatsApp.'],
      ['paginas', 'Textos de la página', 'Portada, historia, misión…', 'Cambia los títulos y frases de la tienda.'],
      ['faqs', 'Preguntas frecuentes', S.faqs.length + ' preguntas', 'Lo que ven tus clientes en la página Ayuda.']
    ];
    box.innerHTML = cards.map(function (c) { return '<button class="dcard" data-go="' + c[0] + '"><b>' + c[1] + '</b><span class="dnum">' + esc(c[2]) + '</span><span class="muted small">' + c[3] + '</span></button>'; }).join('');
  }
  $('#dash').addEventListener('click', function (e) { var b = e.target.closest('[data-go]'); if (b) goTab(b.getAttribute('data-go')); });

  /* ---------- Combos ---------- */
  function comboCalc(c) {
    var items = (c.productos || []).map(function (x) { var p = prodById(x.id); return p ? { p: p, color: colorOf(p, x.color).name } : null; });
    var ok = items.filter(Boolean), sum = ok.reduce(function (a, x) { return a + (x.p.price || 0); }, 0);
    var final = Math.round(sum * (100 - (+c.descuento || 0)) / 10000) * 100;
    var st = c.activo === false ? ['off', 'Pausado'] : items.some(function (x) { return !x; }) ? ['warn', 'Falta un producto'] :
      ok.some(function (x) { return x.p.stock === 0; }) ? ['warn', 'Oculto: producto agotado'] : (c.hasta && c.hasta < today()) ? ['warn', 'Vencido'] :
      ok.length < 2 ? ['warn', 'Necesita 2 productos'] : ['on', 'Visible en la tienda'];
    return { items: items, sum: sum, final: final, save: sum - final, st: st };
  }
  function renderCombos() {
    $('#combos-list').innerHTML = S.combos.map(function (c, i) {
      var k = comboCalc(c);
      return '<div class="ccard"><div class="ccard-ph">' + k.items.map(function (x) { return x ? '<img src="' + esc(imgSrc(colorOf(x.p, x.color).img)) + '" alt="">' : '<span class="thumb-empty"></span>'; }).join('') + '</div>' +
        '<div class="ccard-b"><div class="row"><b class="grow">' + esc(c.nombre) + '</b>' + pill(k.st[0], k.st[1]) + '</div>' +
        '<div class="muted small">' + k.items.map(function (x) { return x ? esc(x.p.name) + ' (' + esc(x.color) + ')' : '(producto eliminado)'; }).join(' + ') + '</div>' +
        '<div class="cprice"><s>' + money(k.sum) + '</s> <b>' + money(k.final) + '</b> <span class="tag">−' + c.descuento + '% · ahorra ' + money(k.save) + '</span></div>' +
        '<div class="muted small">' + (c.hasta ? 'Termina el ' + fmtDate(c.hasta) : 'Sin fecha de fin') + (c.cupos ? ' · Muestra «Solo ' + c.cupos + ' combos disponibles»' : '') + '</div>' +
        '<div class="row"><button class="btn btn-outline btn-sm" data-edit="' + i + '">Editar</button><a class="btn btn-ghost-dark btn-sm" target="_blank" rel="noopener" href="combo.html?id=' + encodeURIComponent(c.id) + '" title="Muestra la versión publicada">Ver en la tienda</a></div></div></div>';
    }).join('') || '<p class="muted">Aún no hay combos. Pulsa «+ Nuevo combo».</p>';
  }
  function openCombo(i) {
    var isNew = i == null;
    var c = isNew ? { id: '', nombre: '', lema: '', productos: [{ id: '', color: '' }, { id: '', color: '' }, { id: '', color: '' }], descuento: 12, hasta: plusDays(30), cupos: 20, activo: true } : clone(S.combos[i]);
    function rows() {
      return c.productos.map(function (x, j) {
        var p = prodById(x.id);
        return '<div class="cb-row" data-j="' + j + '">' + (p ? '<img src="' + esc(imgSrc(colorOf(p, x.color).img)) + '" alt="">' : '<span class="thumb-empty"></span>') +
          '<select data-k="id" aria-label="Producto ' + (j + 1) + '"><option value="">Elige un producto…</option>' + S.cats.map(function (ct) {
            return '<optgroup label="' + esc(ct.name) + '">' + S.prods.filter(function (pp) { return pp.cat === ct.slug; }).map(function (pp) {
              return '<option value="' + esc(pp.id) + '"' + (pp.id === x.id ? ' selected' : '') + '>' + esc(pp.name) + ' · ' + money(pp.price) + (pp.stock === 0 ? ' (agotado)' : '') + '</option>';
            }).join('') + '</optgroup>';
          }).join('') + '</select>' +
          '<select data-k="color" aria-label="Color"' + (p ? '' : ' disabled') + '>' + (p ? p.colors.map(function (k) { return '<option' + (k.name === x.color ? ' selected' : '') + '>' + esc(k.name) + '</option>'; }).join('') : '<option>Color</option>') + '</select>' +
          '<button type="button" class="icon-btn" data-act="rm" aria-label="Quitar producto">✕</button></div>';
      }).join('');
    }
    function prev() {
      var k = comboCalc(c);
      return k.sum ? 'Por separado: <s>' + money(k.sum) + '</s> → <b>Precio del combo: ' + money(k.final) + '</b> · el cliente ahorra ' + money(k.save) : 'Elige los productos para ver el precio.';
    }
    function paint() { $('#cb-rows').innerHTML = rows(); $('#cb-prev').innerHTML = prev(); }
    openDialog({
      title: isNew ? 'Nuevo combo' : 'Editar combo',
      html: '<div class="form-grid">' +
        fld('Nombre del combo', inp('nombre', c.nombre, ' required placeholder="Ej.: Look Noche Urbana"'), 'Aparece grande en la tarjeta y en la página del combo.', 'span2') +
        fld('Frase corta', inp('lema', c.lema, ' placeholder="Ej.: Negro total, actitud total."'), 'Opcional. Una línea que provoque comprarlo.', 'span2') +
        fld('Descuento (%)', inp('descuento', c.descuento, ' type="number" min="1" max="90" step="1" inputmode="numeric"'), 'Se descuenta de la suma de los productos. Recomendado: 12.') +
        fld('La oferta termina el', inp('hasta', c.hasta, ' type="date"'), 'La tienda muestra una cuenta regresiva hasta ese día. Vacío = sin fecha.') +
        fld('Unidades a este precio', inp('cupos', c.cupos || '', ' type="number" min="0" step="1" inputmode="numeric"'), 'Muestra «Solo N combos disponibles». Vacío o 0 = no se muestra.') +
        chk('activo', c.activo !== false, 'Visible en la tienda', 'Desmárcalo para pausar el combo sin borrarlo.') + '</div>' +
        '<h3>Productos del combo</h3><p class="muted small">Elige de 2 a 4 productos que hagan juego y el color que se muestra primero. El cliente puede cambiar el color de cada pieza.</p>' +
        '<div id="cb-rows" class="cb-rows"></div><button type="button" class="btn btn-outline btn-sm" data-act="add">+ Agregar producto</button><p class="cb-prev" id="cb-prev"></p>',
      init: paint,
      input: function (e) { if (e.target.name === 'descuento') { c.descuento = +e.target.value || 0; $('#cb-prev').innerHTML = prev(); } },
      change: function (e) {
        var r = e.target.closest('.cb-row'); if (!r) return;
        var x = c.productos[+r.getAttribute('data-j')];
        if (e.target.getAttribute('data-k') === 'id') { x.id = e.target.value; var p = prodById(x.id); x.color = p ? p.colors[0].name : ''; } else x.color = e.target.value;
        paint();
      },
      click: function (e) {
        var b = e.target.closest('[data-act]'); if (!b) return;
        if (b.getAttribute('data-act') === 'add') { if (c.productos.length >= 4) return toast('Máximo 4 productos por combo.'); c.productos.push({ id: '', color: '' }); }
        if (b.getAttribute('data-act') === 'rm') c.productos.splice(+b.closest('.cb-row').getAttribute('data-j'), 1);
        paint();
      },
      save: function (F) {
        var nombre = F.nombre.value.trim(), d = +F.descuento.value, prods = c.productos.filter(function (x) { return x.id; });
        if (!nombre) return 'Escribe el nombre del combo.';
        if (prods.length < 2) return 'Un combo necesita al menos 2 productos.';
        if (!(d >= 1 && d <= 90)) return 'El descuento debe estar entre 1 y 90 %.';
        if (F.hasta.value && F.hasta.value < today()) return 'La fecha de fin ya pasó. Elige una fecha futura.';
        c.nombre = nombre; c.lema = F.lema.value.trim(); c.descuento = Math.round(d); c.hasta = F.hasta.value; c.cupos = Math.max(0, Math.round(+F.cupos.value || 0)); c.activo = F.activo.checked; c.productos = prods;
        if (isNew) { var base = slug(nombre) || 'combo', id = base, n = 2; while (S.combos.some(function (o) { return o.id === id; })) id = base + '-' + n++; c.id = id; S.combos.unshift(c); }
        else S.combos[i] = c;
        changed(); renderCombos(); toast('Combo guardado. Pulsa «Publicar cambios» para verlo en la tienda.');
      },
      del: isNew ? null : function () { if (!confirm('¿Eliminar el combo «' + c.nombre + '»?')) return false; S.combos.splice(i, 1); changed(); renderCombos(); toast('Combo eliminado. Publica para aplicarlo.'); }
    });
  }
  $('#combos-list').addEventListener('click', function (e) { var b = e.target.closest('[data-edit]'); if (b) openCombo(+b.getAttribute('data-edit')); });
  $('#new-combo').addEventListener('click', function () { openCombo(null); });

  /* ---------- Códigos de descuento ---------- */
  function codeStatus(c) { return !c.activo ? ['off', 'Inactivo'] : (c.vence && c.vence < today()) ? ['warn', 'Vencido'] : ['on', 'Funciona en la tienda']; }
  function codeText(c) { return (c.tipo === 'valor' ? money(c.valor) + ' de descuento' : c.valor + ' % de descuento') + (c.minimo ? ' · compra mínima ' + money(c.minimo) : '') + (c.vence ? ' · vence el ' + fmtDate(c.vence) : ' · sin vencimiento'); }
  function renderCodes() {
    var pops = (S.cfg.promociones || []).filter(function (p) { return p.tipo === 'popup' && p.codigo; });
    $('#codes-list').innerHTML = S.codes.map(function (c, i) {
      var st = codeStatus(c), inPop = pops.some(function (p) { return String(p.codigo).toUpperCase() === String(c.codigo).toUpperCase(); });
      return '<button class="lrow" data-i="' + i + '"><span class="code">' + esc(c.codigo) + '</span><span class="grow"><b>' + esc(c.descripcion || 'Sin descripción') + '</b><span class="muted small">' + esc(codeText(c)) + (inPop ? ' · se anuncia en la ventana emergente' : '') + '</span></span>' + pill(st[0], st[1]) + '</button>';
    }).join('') || '<p class="muted">Aún no hay códigos. Pulsa «+ Nuevo código».</p>';
  }
  function openCode(i) {
    var isNew = i == null, c = isNew ? { codigo: '', descripcion: '', tipo: 'porcentaje', valor: 10, minimo: 0, vence: '', activo: true } : clone(S.codes[i]);
    openDialog({
      title: isNew ? 'Nuevo código de descuento' : 'Editar código',
      html: '<div class="form-grid">' +
        fld('Código', inp('codigo', c.codigo, ' required placeholder="Ej.: LOVELY10" autocapitalize="characters"'), 'Lo que el cliente escribe al pagar. Solo letras y números, sin espacios.') +
        fld('Descripción (solo la ves tú)', inp('descripcion', c.descripcion, ' placeholder="Ej.: Campaña de Instagram"')) +
        fld('Tipo de descuento', sel('tipo', [['porcentaje', 'Porcentaje (%)'], ['valor', 'Valor fijo en pesos ($)']], c.tipo)) +
        fld('Valor', inp('valor', c.valor, ' type="number" min="1" step="1" inputmode="numeric"'), 'Ej.: 10 = 10 % o $10.000 según el tipo (escribe 10000).') +
        fld('Compra mínima (opcional)', inp('minimo', c.minimo || '', ' type="number" min="0" step="1000" inputmode="numeric"'), 'Vacío = sin mínimo.') +
        fld('Vence el (opcional)', inp('vence', c.vence, ' type="date"'), 'Después de ese día deja de funcionar.') +
        chk('activo', c.activo, 'Activo', 'Desmárcalo para que el código deje de funcionar sin borrarlo.') + '</div>',
      save: function (F) {
        var code = F.codigo.value.trim().toUpperCase().replace(/\s+/g, ''), v = Math.round(+F.valor.value);
        if (!/^[A-Z0-9]{3,20}$/.test(code)) return 'El código debe tener de 3 a 20 letras o números, sin espacios ni símbolos.';
        if (S.codes.some(function (o, j) { return j !== i && String(o.codigo).toUpperCase() === code; })) return 'Ya existe un código igual.';
        if (!(v > 0)) return 'Escribe el valor del descuento.';
        if (F.tipo.value === 'porcentaje' && v > 90) return 'El porcentaje no puede ser mayor a 90.';
        Object.assign(c, { codigo: code, descripcion: F.descripcion.value.trim(), tipo: F.tipo.value, valor: v, minimo: Math.max(0, Math.round(+F.minimo.value || 0)), vence: F.vence.value, activo: F.activo.checked });
        if (isNew) S.codes.unshift(c); else S.codes[i] = c;
        changed(); renderCodes(); renderPromos(); toast('Código guardado. Pulsa «Publicar cambios» para activarlo en la tienda.');
      },
      del: isNew ? null : function () { if (!confirm('¿Eliminar el código «' + c.codigo + '»?')) return false; S.codes.splice(i, 1); changed(); renderCodes(); renderPromos(); }
    });
  }
  $('#codes-list').addEventListener('click', function (e) { var b = e.target.closest('.lrow'); if (b) openCode(+b.getAttribute('data-i')); });
  $('#new-code').addEventListener('click', function () { openCode(null); });

  /* ---------- Promociones ---------- */
  var PROMO_T = { banner: 'Barra superior', popup: 'Ventana emergente', envio: 'Envío gratis' };
  function promoWarn(p, i) {
    var all = S.cfg.promociones || [];
    if (p.tipo === 'popup' && p.codigo) { var c = S.codes.filter(function (x) { return String(x.codigo).toUpperCase() === String(p.codigo).toUpperCase(); })[0]; if (!c || codeStatus(c)[0] !== 'on') return 'El código ' + p.codigo + ' no está activo en «Códigos de descuento»: actívalo o el cliente no podrá usarlo.'; }
    if (p.activo && p.tipo !== 'banner' && all.some(function (o, j) { return j < i && o.activo && o.tipo === p.tipo; })) return 'Ya hay otra promoción activa de este tipo más arriba: solo se usa la primera.';
    return '';
  }
  function renderPromos() {
    var all = S.cfg.promociones || [];
    $('#promos-list').innerHTML = all.map(function (p, i) {
      var st = !p.activo ? ['off', 'Pausada'] : (p.hasta && p.hasta < today()) ? ['warn', 'Terminó'] : ['on', 'Activa'], w = promoWarn(p, i);
      var det = p.tipo === 'envio' ? 'Envío estándar gratis en compras superiores a ' + money(p.minimo) : p.tipo === 'popup' ? (p.codigo ? 'Muestra el código ' + p.codigo : 'Sin código') + ' · una vez por visitante' : 'Se alterna en la franja negra de arriba';
      return '<button class="lrow" data-i="' + i + '"><span class="ptype">' + PROMO_T[p.tipo] + '</span><span class="grow"><b>' + esc(p.titulo) + '</b><span class="muted small">' + esc(p.texto || '') + '</span><span class="muted small">' + esc(det) + (p.hasta ? ' · hasta el ' + fmtDate(p.hasta) : '') + '</span>' + (w ? '<span class="warn-t">⚠ ' + esc(w) + '</span>' : '') + '</span>' + pill(st[0], st[1]) + '</button>';
    }).join('') || '<p class="muted">Aún no hay promociones. Pulsa «+ Nueva promoción».</p>';
  }
  function openPromo(i) {
    var all = S.cfg.promociones = S.cfg.promociones || [], isNew = i == null;
    var p = isNew ? { id: '', tipo: 'banner', activo: true, titulo: '', texto: '', enlace: '', boton: '', codigo: '', minimo: 200000, hasta: '' } : clone(all[i]);
    var codes = [['', 'Sin código']].concat(S.codes.map(function (c) { return [c.codigo, c.codigo + ' — ' + codeText(c) + (codeStatus(c)[0] === 'on' ? '' : ' (inactivo)')]; }));
    var only = function (t) { return ' data-for="' + t + '"'; };
    function toggle(t) { $$('[data-for]', dbody).forEach(function (el) { el.hidden = el.getAttribute('data-for').split(' ').indexOf(t) < 0; }); $('#pt-help').textContent = { banner: 'Mensaje corto en la franja negra superior de todas las páginas. Si hay varias, se alternan cada pocos segundos.', popup: 'Ventana que aparece a los 3 segundos, una sola vez por visitante. Ideal para un código de bienvenida. Cada vez que la guardes, vuelve a mostrarse una vez a todos.', envio: 'El envío estándar sale gratis cuando la compra (después de descuentos) supera el monto. El aviso se muestra en la barra superior y en el carrito.' }[t]; }
    openDialog({
      title: isNew ? 'Nueva promoción' : 'Editar promoción',
      html: '<div class="form-grid">' +
        fld('Tipo de promoción', sel('tipo', [['banner', 'Barra superior (anuncio)'], ['popup', 'Ventana emergente'], ['envio', 'Envío gratis desde un monto']], p.tipo), '<span id="pt-help"></span>', 'span2') +
        fld('Título', inp('titulo', p.titulo, ' required placeholder="Ej.: ENVÍO GRATIS"'), 'Corto y llamativo. En la barra se muestra en dorado.', 'span2') +
        fld('Texto', inp('texto', p.texto, ' placeholder="Ej.: En pedidos superiores a $200.000"'), '', 'span2') +
        fld('Compra mínima para envío gratis', inp('minimo', p.minimo, ' type="number" min="0" step="1000" inputmode="numeric"'), 'En pesos, sin puntos. Ej.: 200000', '', only('envio')) +
        fld('Código que se muestra', sel('codigo', codes, p.codigo), 'Créalo antes en «Códigos de descuento». El cliente lo copia con un toque y se aplica solo al pagar.', 'span2', only('popup')) +
        fld('Texto del botón', inp('boton', p.boton, ' placeholder="Ver la tienda"'), '', '', only('popup')) +
        fld('Enlace al pulsar (opcional)', inp('enlace', p.enlace, ' placeholder="combo.html o tienda.html?cat=relojes"'), 'Página a la que lleva. Ej.: combo.html, tienda.html?filtro=nuevos', '', only('banner popup')) +
        fld('Termina el (opcional)', inp('hasta', p.hasta, ' type="date"'), 'Se apaga sola después de ese día.') +
        chk('activo', p.activo, 'Activa', 'Desmárcala para pausarla sin borrarla.') + '</div>',
      init: function (F) { toggle(F.tipo.value); },
      change: function (e) { if (e.target.name === 'tipo') toggle(e.target.value); },
      save: function (F) {
        var t = F.tipo.value, titulo = F.titulo.value.trim();
        if (!titulo) return 'Escribe el título.';
        if (t === 'envio' && !(+F.minimo.value > 0)) return 'Escribe la compra mínima para el envío gratis.';
        Object.assign(p, { tipo: t, titulo: titulo, texto: F.texto.value.trim(), hasta: F.hasta.value, activo: F.activo.checked });
        ['enlace', 'boton', 'codigo', 'minimo'].forEach(function (k) { delete p[k]; });
        if (t === 'envio') p.minimo = Math.round(+F.minimo.value);
        if (t === 'popup') { p.codigo = F.codigo.value; p.boton = F.boton.value.trim(); }
        if (t !== 'envio' && F.enlace.value.trim()) p.enlace = F.enlace.value.trim();
        p.id = t === 'popup' ? 'popup-' + Date.now().toString(36) : (p.id || t + '-' + Date.now().toString(36));
        if (isNew) all.unshift(p); else all[i] = p;
        changed(); renderPromos(); renderCodes(); toast('Promoción guardada. Pulsa «Publicar cambios».');
      },
      del: isNew ? null : function () { if (!confirm('¿Eliminar la promoción «' + p.titulo + '»?')) return false; all.splice(i, 1); changed(); renderPromos(); }
    });
  }
  $('#promos-list').addEventListener('click', function (e) { var b = e.target.closest('.lrow'); if (b) openPromo(+b.getAttribute('data-i')); });
  $('#new-promo').addEventListener('click', function () { openPromo(null); });

  /* ---------- Textos de la página ---------- */
  var TEXTS = [
    { t: 'Barra superior (todas las páginas)', url: 'index.html', d: 'La franja negra de arriba del menú. Si hay promociones de barra o envío gratis activas, se alternan con este texto.', f: [['anuncioTitulo', 'Texto destacado (en dorado)', 'ENVÍOS A TODA COLOMBIA'], ['anuncioTexto', 'Texto que sigue', 'Compra fácil por WhatsApp']] },
    { t: 'Inicio · Portada', url: 'index.html', d: 'Lo primero que ve el cliente al entrar, sobre la foto grande.', f: [['heroEtiqueta', 'Etiqueta pequeña (dorada)', 'Nueva colección 2026'], ['heroTitulo', 'Título, primera línea', 'Pequeños detalles,'], ['heroTituloDorado', 'Título, segunda línea (dorada)', 'grandes estilos.'], ['heroSubtitulo', 'Texto bajo el título', 'Relojes, gorras y gafas seleccionados…', 1], ['heroBotonTexto', 'Texto del botón', 'Comprar ahora']] },
    { t: 'Inicio · Combos «Arma tu look»', url: 'index.html#combos-home', d: 'Encabezado de la sección negra de combos del inicio y de la página Combos. Los combos se crean en la pestaña «Combos».', f: [['combosEtiqueta', 'Etiqueta pequeña (dorada)', 'Arma tu look'], ['combosTitulo', 'Título', 'Combos que hacen juego'], ['combosTexto', 'Texto', 'Lleva el look completo y ahorra 12%…', 1]] },
    { t: 'Inicio · Nuestra esencia', url: 'index.html', d: 'Bloque centrado con el logo, antes de #EstiloLovely. El título también es el título principal de «Quiénes somos».', f: [['historiaTitulo', 'Título', 'Lovely: encantador, hermoso y especial.'], ['historiaTexto', 'Texto', 'Seleccionamos cada accesorio…', 1]] },
    { t: 'Quiénes somos', url: 'nosotros.html', d: 'La página de la historia de la marca.', f: [['nosotrosLema', 'Frase bajo el título', 'Creemos que los pequeños detalles…', 1], ['nosotrosTitulo', 'Subtítulo de la historia', 'Nacimos para quienes buscan algo diferente'], ['nosotrosTexto', 'Historia', 'Lovely nace en 2022…', 1], ['mision', 'Misión', '', 1], ['vision', 'Visión', '', 1]] },
    { t: 'Ayuda · Contacto', url: 'ayuda.html#contacto', d: 'Horario que se muestra junto a los datos de contacto.', f: [['horarioAtencion', 'Horario de atención', 'Lunes a sábado, 9:00 a. m. a 7:00 p. m.']] }
  ];
  function renderTexts() {
    $('#texts').innerHTML = TEXTS.map(function (g) {
      return '<div class="box tgroup"><div class="row"><h2 class="grow">' + g.t + '</h2><a class="btn btn-ghost-dark btn-sm" href="' + g.url + '" target="_blank" rel="noopener">Ver página ↗</a></div><p class="muted small"><b>Dónde aparece:</b> ' + g.d + '</p><div class="form-grid">' +
        g.f.map(function (f) {
          var v = S.cfg[f[0]] == null ? '' : S.cfg[f[0]];
          return '<label class="' + (f[3] ? 'span2' : '') + '">' + f[1] + (f[3] ? '<textarea data-cfg="' + f[0] + '" rows="3" placeholder="' + esc(f[2]) + '">' + esc(v) + '</textarea>' : '<input data-cfg="' + f[0] + '" value="' + esc(v) + '" placeholder="' + esc(f[2]) + '">') + '</label>';
        }).join('') + '</div></div>';
    }).join('');
  }
  $('#texts').addEventListener('input', function (e) {
    var k = e.target.getAttribute('data-cfg'); if (!k) return;
    var v = e.target.value.trim(); if (v) S.cfg[k] = v; else delete S.cfg[k];
    setDirty(true);
  });

  /* ---------- Preguntas frecuentes ---------- */
  var FAQ_CATS = [['pagos', 'Pagos'], ['envios', 'Envíos'], ['garantias', 'Garantías'], ['cambios', 'Cambios']];
  /* Las respuestas se guardan como HTML sencillo; aquí se editan como texto con **negrita** */
  function faqToText(h) { var d = document.createElement('div'); d.innerHTML = String(h || '').replace(/<\/?(strong|b)>/gi, '**'); return d.textContent; }
  function faqToHtml(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>'); }
  function faqsOf(cat) { return S.faqs.filter(function (f) { return f.categoria === cat; }).sort(function (a, b) { return (a.orden || 0) - (b.orden || 0); }); }
  function renderFaqs() {
    $('#faqs-list').innerHTML = FAQ_CATS.map(function (c) {
      var list = faqsOf(c[0]);
      return '<div class="box"><h2>' + c[1] + ' <span class="muted small">(' + list.length + ')</span></h2>' + (list.map(function (f, j) {
        var i = S.faqs.indexOf(f);
        return '<div class="frow"><button class="fq" data-i="' + i + '"><b>' + esc(f.pregunta) + '</b><span class="muted small">' + esc(faqToText(f.respuesta)).slice(0, 140) + '</span></button>' +
          '<span class="acts"><button class="icon-btn" data-mv="-1" data-i="' + i + '" aria-label="Subir"' + (j ? '' : ' disabled') + '>↑</button><button class="icon-btn" data-mv="1" data-i="' + i + '" aria-label="Bajar"' + (j < list.length - 1 ? '' : ' disabled') + '>↓</button></span></div>';
      }).join('') || '<p class="muted small">Sin preguntas en este grupo.</p>') + '</div>';
    }).join('');
  }
  function renumber(cat) { faqsOf(cat).forEach(function (f, k) { f.orden = k + 1; }); }
  $('#faqs-list').addEventListener('click', function (e) {
    var mv = e.target.closest('[data-mv]');
    if (mv) {
      var f = S.faqs[+mv.getAttribute('data-i')], list = faqsOf(f.categoria), k = list.indexOf(f), o = list[k + +mv.getAttribute('data-mv')];
      if (o) { renumber(f.categoria); var t = f.orden; f.orden = o.orden; o.orden = t; setDirty(true); renderFaqs(); }
      return;
    }
    var b = e.target.closest('.fq'); if (b) openFaq(+b.getAttribute('data-i'));
  });
  function openFaq(i) {
    var isNew = i == null, f = isNew ? { categoria: 'pagos', pregunta: '', respuesta: '', orden: 99 } : clone(S.faqs[i]);
    openDialog({
      title: isNew ? 'Nueva pregunta frecuente' : 'Editar pregunta',
      html: '<div class="form-grid">' + fld('Grupo', sel('categoria', FAQ_CATS, f.categoria), 'Sección de la página Ayuda donde aparece.') +
        fld('Pregunta', inp('pregunta', f.pregunta, ' required placeholder="Ej.: ¿Cuánto tarda mi pedido?"'), '', 'span2') +
        fld('Respuesta', area('respuesta', faqToText(f.respuesta), ' rows="6"'), 'Para negrita escribe entre dos asteriscos: **30 días**', 'span2') + '</div>',
      save: function (F) {
        var q = F.pregunta.value.trim(), r = F.respuesta.value.trim();
        if (!q || !r) return 'Escribe la pregunta y la respuesta.';
        var moved = f.categoria !== F.categoria.value;
        f.categoria = F.categoria.value; f.pregunta = q; f.respuesta = faqToHtml(r);
        if (isNew || moved) f.orden = faqsOf(f.categoria).length + 1;
        if (isNew) S.faqs.push(f); else S.faqs[i] = f;
        renumber(f.categoria); changed(); renderFaqs(); toast('Pregunta guardada. Pulsa «Publicar cambios».');
      },
      del: isNew ? null : function () { if (!confirm('¿Eliminar esta pregunta?')) return false; S.faqs.splice(i, 1); changed(); renderFaqs(); }
    });
  }
  $('#new-faq').addEventListener('click', function () { openFaq(null); });

  /* ---------- Mensajes de WhatsApp: pedidos y suscripciones ---------- */
  function parseMsg(t) {
    t = String(t || '').replace(/\*/g, '').replace(/\r/g, '');
    var g = function (re) { var m = t.match(re); return m ? m[1].trim() : ''; };
    if (/SUSCRIPCI[ÓO]N A NOVEDADES/i.test(t)) return { tipo: 'suscripcion', nombre: g(/Nombre:\s*(.+)/i), email: g(/Correo:\s*(\S+@\S+)/i).toLowerCase(), celular: '' };
    var num = g(/PEDIDO\s+(LV-\d+)/i); if (!num) return null;
    var items = (t.match(/^•.+$/gm) || []).map(function (l) { return l.replace(/^•\s*/, ''); });
    var money2 = function (s) { return +String(s || '').replace(/\D/g, '') || 0; };
    return {
      tipo: 'pedido', numero: num, nombre: g(/Cliente:\s*(.+)/i), celular: normCel(g(/WhatsApp:\s*(.+)/i)), email: g(/Correo:\s*(\S+)/i).toLowerCase(),
      documento: g(/Documento:\s*(.+)/i), direccion: g(/Env[ií]o a:\s*(.+)/i), metodo: g(/M[ée]todo:\s*(.+)/i), items: items,
      descuento: g(/Descuento[^:]*:\s*(.+)/i), total: money2(g(/TOTAL:\s*(.+)/i)), optin: /Acepta recibir promociones/i.test(t)
    };
  }

  /* ---------- Marketing (contactos solo en este navegador) ---------- */
  var KC = 'lv_panel_contactos', KH = 'lv_panel_envios', KR = 'lv_panel_campana';
  function contacts() { return lget(KC, []); }
  function addContact(c, quiet) {
    var all = contacts(), cel = normCel(c.celular), em = String(c.email || '').trim().toLowerCase();
    if (!cel && !em) return 0;
    var f = all.filter(function (x) { return (cel && x.celular === cel) || (em && x.email === em); })[0];
    if (f) { if (!f.nombre && c.nombre) f.nombre = c.nombre; if (!f.celular && cel) f.celular = cel; if (!f.email && em) f.email = em; if (c.reactivar) f.baja = false; lset(KC, all); return 0; }
    all.unshift({ nombre: String(c.nombre || '').trim(), celular: cel, email: em, origen: c.origen || 'Manual', fecha: new Date().toISOString(), baja: false });
    lset(KC, all); if (!quiet) renderMarketing(); return 1;
  }
  function renderMarketing() {
    var all = contacts(), act = all.filter(function (c) { return !c.baja; }), q = slug($('#mk-q').value);
    $('#mk-count').textContent = act.length + ' clientes reciben novedades · ' + act.filter(function (c) { return c.celular; }).length + ' con WhatsApp · ' + act.filter(function (c) { return c.email; }).length + ' con correo' + (all.length > act.length ? ' · ' + (all.length - act.length) + ' dados de baja' : '');
    var list = all.map(function (c, i) { return [c, i]; }).filter(function (x) { return !q || slug(x[0].nombre + ' ' + x[0].email + ' ' + x[0].celular).indexOf(q) > -1; });
    $('#mk-list').innerHTML = list.map(function (x) {
      var c = x[0];
      return '<div class="mrow' + (c.baja ? ' off' : '') + '"><span class="grow"><b>' + esc(c.nombre || 'Sin nombre') + '</b><span class="muted small">' + esc([c.celular ? '+57 ' + c.celular : '', c.email].filter(Boolean).join(' · ')) + '</span><span class="muted small">' + esc(c.origen) + ' · ' + fmtDate(c.fecha) + (c.baja ? ' · dado de baja' : '') + '</span></span>' +
        '<button class="btn btn-ghost-dark btn-sm" data-baja="' + x[1] + '">' + (c.baja ? 'Reactivar' : 'Dar de baja') + '</button><button class="icon-btn" data-del="' + x[1] + '" aria-label="Eliminar contacto">✕</button></div>';
    }).join('') || '<p class="muted small">' + (all.length ? 'Nadie coincide con la búsqueda.' : 'Aún no hay clientes. Pega un mensaje de pedido o suscripción, o agrégalos a mano.') + '</p>';
    renderHist(); renderTemplates();
  }
  $('#mk-q').addEventListener('input', renderMarketing);
  $('#mk-list').addEventListener('click', function (e) {
    var all = contacts(), b = e.target.closest('[data-baja]'), d = e.target.closest('[data-del]');
    if (b) { var c = all[+b.getAttribute('data-baja')]; c.baja = !c.baja; lset(KC, all); renderMarketing(); }
    if (d) { var i = +d.getAttribute('data-del'); if (!confirm('¿Eliminar a ' + (all[i].nombre || 'este contacto') + ' de la lista?')) return; all.splice(i, 1); lset(KC, all); renderMarketing(); }
  });
  $('#mk-paste-btn').addEventListener('click', function () {
    var m = parseMsg($('#mk-paste').value);
    if (!m) return toast('No reconocí el mensaje. Pega completo el mensaje de pedido o de suscripción que te llegó por WhatsApp.', 6000);
    if (m.tipo === 'pedido' && !m.optin) return toast('Este cliente NO aceptó recibir promociones en su pedido, así que no se agrega.', 6000);
    var n = addContact({ nombre: m.nombre, celular: m.celular, email: m.email, origen: m.tipo === 'pedido' ? 'Pedido ' + m.numero : 'Suscripción en la tienda', reactivar: true });
    if (m.tipo === 'pedido') saveOrder(m);
    $('#mk-paste').value = ''; renderMarketing();
    toast(n ? 'Cliente agregado: ' + (m.nombre || m.email) : 'Ese cliente ya estaba en la lista (datos actualizados).');
  });
  $('#mk-add').addEventListener('click', function () {
    openDialog({
      title: 'Agregar cliente a mano',
      html: '<div class="form-grid">' + fld('Nombre', inp('nombre', '', ' required')) + fld('Celular (WhatsApp)', inp('celular', '', ' inputmode="numeric" placeholder="3001234567"')) +
        fld('Correo', inp('email', '', ' type="email"'), '', 'span2') + chk('ok', false, 'Esta persona aceptó recibir novedades y promociones', 'Obligatorio por la ley de protección de datos: agrega solo a quien te dio su permiso.') + '</div>',
      save: function (F) {
        var cel = normCel(F.celular.value), em = F.email.value.trim();
        if (!F.nombre.value.trim()) return 'Escribe el nombre.';
        if (F.celular.value.trim() && !cel) return 'El celular debe tener 10 dígitos y empezar por 3.';
        if (!cel && !em) return 'Escribe el celular o el correo.';
        if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return 'Revisa el correo.';
        if (!F.ok.checked) return 'Confirma que esta persona aceptó recibir mensajes.';
        var n = addContact({ nombre: F.nombre.value.trim(), celular: cel, email: em, origen: 'Agregado a mano', reactivar: true });
        renderMarketing(); renderDash(); toast(n ? 'Cliente agregado.' : 'Ese cliente ya estaba en la lista.');
      }
    });
  });
  $('#mk-import').addEventListener('change', function (e) {
    var file = e.target.files[0]; e.target.value = ''; if (!file) return;
    file.text().then(function (t) {
      var lines = t.replace(/^\ufeff/, '').split(/\r?\n/).filter(function (l) { return l.trim(); });
      var sep = (lines[0] || '').split(';').length > (lines[0] || '').split(',').length ? ';' : ',';
      var cells = function (l) { return l.split(sep).map(function (x) { return x.replace(/^"|"$/g, '').trim(); }); };
      var head = cells(lines[0] || '').map(function (h) { return slug(h); });
      var col = function (names) { for (var k = 0; k < head.length; k++) if (names.some(function (n) { return head[k].indexOf(n) > -1; })) return k; return -1; };
      var iN = col(['nombre', 'name']), iC = col(['celular', 'telefono', 'whatsapp', 'movil', 'phone']), iE = col(['correo', 'email', 'mail']);
      if (iC < 0 && iE < 0) { iN = 0; iC = 1; iE = 2; } else lines.shift();
      if (!lines.length) return toast('El archivo está vacío.');
      if (!confirm('Se importarán ' + lines.length + ' filas. ¿Todas estas personas aceptaron recibir novedades de Lovely?')) return;
      var n = 0; lines.forEach(function (l) { var c = cells(l); n += addContact({ nombre: c[iN] || '', celular: c[iC] || '', email: iE > -1 ? c[iE] || '' : '', origen: 'Importado (' + file.name + ')' }, true); });
      renderMarketing(); renderDash(); toast(n + ' clientes nuevos importados.');
    }).catch(function () { toast('No se pudo leer el archivo.'); });
  });
  $('#mk-export').addEventListener('click', function () {
    var all = contacts(); if (!all.length) return toast('No hay clientes para exportar.');
    downloadFile('lovely-clientes-' + today() + '.csv', toCsv([['nombre', 'celular', 'correo', 'origen', 'fecha', 'estado']].concat(all.map(function (c) { return [c.nombre, c.celular, c.email, c.origen, c.fecha.slice(0, 10), c.baja ? 'baja' : 'activo']; }))), 'text/csv;charset=utf-8');
  });

  /* Plantillas con las ofertas actuales */
  function templates() {
    var base = siteBase(), out = [];
    var cb = S.combos.filter(function (c) { return comboCalc(c).st[0] === 'on'; })[0];
    if (cb) { var k = comboCalc(cb); out.push(['Nuevo combo', 'Combo ' + cb.nombre + ' con ' + cb.descuento + '% de descuento', '¡Hola {nombre}! 🔥 Llegó el combo *' + cb.nombre + '*: ' + k.items.map(function (x) { return x.p.name; }).join(' + ') + ' por ' + money(k.final) + ' (antes ' + money(k.sum) + ').\nAhorras ' + money(k.save) + (cb.hasta ? ', solo hasta el ' + fmtDate(cb.hasta) : '') + '. Cupos limitados.\nMíralo aquí: ' + base + 'combo.html?id=' + cb.id]); }
    var nv = S.prods.filter(function (p) { return p.nuevo && p.stock !== 0; }).slice(0, 3);
    if (nv.length) out.push(['Novedades', 'Llegaron novedades a Lovely', '¡Hola {nombre}! ✨ Llegaron novedades a Lovely: ' + nv.map(function (p) { return p.name; }).join(', ') + '.\nMíralas aquí: ' + base + 'tienda.html?filtro=nuevos']);
    var cd = S.codes.filter(function (c) { return codeStatus(c)[0] === 'on'; })[0];
    if (cd) out.push(['Código de descuento', 'Un regalo para ti: ' + (cd.tipo === 'valor' ? money(cd.valor) : cd.valor + '%') + ' de descuento', '¡Hola {nombre}! 🎁 Usa el código *' + cd.codigo + '* y obtén ' + (cd.tipo === 'valor' ? money(cd.valor) : cd.valor + '%') + ' de descuento en tu compra' + (cd.minimo ? ' desde ' + money(cd.minimo) : '') + (cd.vence ? '. Válido hasta el ' + fmtDate(cd.vence) : '') + '.\nCompra aquí: ' + base]);
    out.push(['En blanco', '', '¡Hola {nombre}! ']);
    return out;
  }
  function renderTemplates() {
    var t = templates();
    $('#mk-tpl').innerHTML = t.map(function (x, i) { return '<button class="btn btn-outline btn-sm" data-t="' + i + '">' + esc(x[0]) + '</button>'; }).join('');
    $('#mk-tpl').onclick = function (e) {
      var b = e.target.closest('[data-t]'); if (!b) return; var x = t[+b.getAttribute('data-t')];
      if ($('#mk-msg').value.trim() && !confirm('¿Reemplazar el mensaje que escribiste por la plantilla?')) return;
      $('#mk-subject').value = x[1]; $('#mk-msg').value = x[2]; $('#mk-msg').focus();
    };
  }
  var FOOT = '\n\nResponde BAJA si no deseas recibir más mensajes.';
  var personal = function (msg, nombre) { var n = String(nombre || '').trim().split(/\s+/)[0] || ''; return msg.replace(/\s*\{nombre\}/g, n ? ' ' + n : '').replace(/^ /, '') + FOOT; };
  function logSend(canal, n, msg) { var h = lget(KH, []); h.unshift({ fecha: new Date().toISOString(), canal: canal, n: n, resumen: msg.slice(0, 90) }); lset(KH, h.slice(0, 30)); renderHist(); }
  function renderHist() {
    var h = lget(KH, []);
    $('#mk-hist').innerHTML = h.length ? h.map(function (x) { return '<div>' + fmtDate(x.fecha) + ' · ' + esc(x.canal) + ' · ' + x.n + ' destinatarios · «' + esc(x.resumen) + '…»</div>'; }).join('') : 'Todavía no has enviado mensajes desde aquí.';
  }
  function needMsg() { var m = $('#mk-msg').value.trim(); if (!m || m === '¡Hola {nombre}!') { toast('Primero escribe el mensaje o elige una plantilla.'); $('#mk-msg').focus(); return ''; } return m; }
  /* WhatsApp: un chat por cliente con el mensaje listo (WhatsApp no permite envíos masivos automáticos desde un número personal) */
  function renderRun() {
    var run = lget(KR, null), box = $('#mk-run'); if (!run) { box.hidden = true; return; }
    var all = contacts().filter(function (c) { return !c.baja && c.celular; }), done = all.filter(function (c) { return run.sent[c.celular]; }).length;
    box.hidden = false;
    box.innerHTML = '<div class="row"><b class="grow">Envío por WhatsApp: ' + done + ' de ' + all.length + '</b><button class="btn btn-ghost-dark btn-sm" id="run-close">Terminar</button></div>' +
      '<div class="bar"><span style="width:' + (all.length ? Math.round(done / all.length * 100) : 0) + '%"></span></div>' +
      '<p class="muted small">Pulsa <b>«Abrir siguiente»</b>: se abre WhatsApp con el chat del cliente y el mensaje escrito; solo pulsa enviar allá y vuelve aquí. Queda marcado ✓ y puedes seguir otro día.</p>' +
      '<button class="btn btn-gold btn-block" id="run-next"' + (done === all.length ? ' disabled' : '') + '>' + (done === all.length ? '¡Listo! Todos enviados' : 'Abrir siguiente') + '</button>' +
      '<div class="run-list">' + all.map(function (c) { return '<div class="mrow"><span class="grow">' + (run.sent[c.celular] ? '✓ ' : '') + esc(c.nombre || '+57 ' + c.celular) + '</span><a class="btn btn-outline btn-sm" data-cel="' + c.celular + '" target="_blank" rel="noopener" href="' + esc(waTo(c.celular, personal(run.msg, c.nombre))) + '">' + (run.sent[c.celular] ? 'Reenviar' : 'Enviar') + '</a></div>'; }).join('') + '</div>';
    $('#run-close').onclick = function () { localStorage.removeItem(KR); renderRun(); };
    $('#run-next').onclick = function () { var c = all.filter(function (x) { return !run.sent[x.celular]; })[0]; if (c) { mark(c.celular); window.open(waTo(c.celular, personal(run.msg, c.nombre)), '_blank', 'noopener'); } };
    $$('[data-cel]', box).forEach(function (a) { a.addEventListener('click', function () { mark(a.getAttribute('data-cel')); }); });
    function mark(cel) { var r = lget(KR, null); if (!r) return; r.sent[cel] = 1; lset(KR, r); setTimeout(renderRun, 300); }
  }
  $('#mk-send-wa').addEventListener('click', function () {
    var msg = needMsg(); if (!msg) return;
    var all = contacts().filter(function (c) { return !c.baja && c.celular; });
    if (!all.length) return toast('No hay clientes con WhatsApp en la lista.');
    var run = lget(KR, null);
    if (run && run.msg !== msg && !confirm('Hay un envío por WhatsApp sin terminar. ¿Empezar uno nuevo con este mensaje?')) return renderRun();
    if (!run || run.msg !== msg) { lset(KR, { msg: msg, sent: {} }); logSend('WhatsApp', all.length, msg); }
    renderRun(); $('#mk-run').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  /* Correo: grupos de 40 en copia oculta (los proveedores bloquean envíos más grandes) */
  $('#mk-send-mail').addEventListener('click', function () {
    var msg = needMsg(); if (!msg) return;
    var mails = contacts().filter(function (c) { return !c.baja && c.email; }).map(function (c) { return c.email; });
    if (!mails.length) return toast('No hay clientes con correo en la lista.');
    var subject = $('#mk-subject').value.trim() || 'Novedades de Lovely', body = personal(msg, '').replace(/\*/g, ''), lots = [];
    for (var k = 0; k < mails.length; k += 40) lots.push(mails.slice(k, k + 40));
    var box = $('#mk-run'); box.hidden = false;
    box.innerHTML = '<div class="row"><b class="grow">Envío por correo: ' + mails.length + ' destinatarios en ' + lots.length + (lots.length === 1 ? ' grupo' : ' grupos') + '</b><button class="btn btn-ghost-dark btn-sm" id="run-close">Cerrar</button></div>' +
      '<p class="muted small">Cada botón abre tu correo con el mensaje listo y los destinatarios en <b>copia oculta (CCO)</b>, para que nadie vea los correos de los demás. Revisa y pulsa enviar. En correo, {nombre} se quita (queda «¡Hola!»).</p>' +
      lots.map(function (l, k) {
        var q = 'bcc=' + encodeURIComponent(l.join(',')) + '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        return '<div class="mrow"><span class="grow">Grupo ' + (k + 1) + ' · ' + l.length + ' correos</span><a class="btn btn-dark btn-sm" target="_blank" rel="noopener" href="https://mail.google.com/mail/?view=cm&fs=1&' + q + '">Abrir en Gmail</a>' +
          '<a class="btn btn-outline btn-sm" href="mailto:?' + q.replace('&su=', '&subject=') + '">Otra app de correo</a></div>';
      }).join('');
    $('#run-close').onclick = function () { box.hidden = true; renderRun(); };
    logSend('Correo', mails.length, msg);
  });

  /* ---------- Pedidos (solo en este navegador) ---------- */
  var KO = 'lv_panel_pedidos';
  var ESTADOS = [['nuevo', 'Por confirmar'], ['pagado', 'Pagado'], ['enviado', 'Enviado'], ['entregado', 'Entregado'], ['cancelado', 'Cancelado']];
  var AVISO = {
    nuevo: 'Hola {nombre}, recibimos tu pedido {numero}. En un momento te confirmamos disponibilidad y forma de pago por aquí. ¡Gracias por elegir Lovely!',
    pagado: 'Hola {nombre}, confirmamos el pago de tu pedido {numero}. Pronto lo despachamos y te enviamos el número de guía.',
    enviado: 'Hola {nombre}, ¡tu pedido {numero} ya va en camino! Número de guía: ',
    entregado: 'Hola {nombre}, ¿cómo te fue con tu pedido {numero}? Gracias por comprar en Lovely. Nos encantaría ver tu look: etiquétanos en Instagram.',
    cancelado: 'Hola {nombre}, tu pedido {numero} fue cancelado. Si tienes alguna duda, escríbenos por aquí.'
  };
  function orders() {
    var all = lget(KO, []), local = lget('lv_admin_orders', []), add = false;
    /* Pedidos hechos desde este mismo navegador en la tienda (por ejemplo, pruebas) */
    local.forEach(function (o) { if (o && o.numero && !all.some(function (x) { return x.numero === o.numero; })) { add = true; all.push({ numero: o.numero, fecha: o.fecha, estado: 'nuevo', nombre: o.cliente.nombre, celular: o.cliente.celular, email: o.cliente.email, direccion: o.cliente.direccion + ', ' + o.cliente.ciudad + ', ' + o.cliente.departamento, metodo: o.envio.metodo, items: o.pago.items.map(function (i) { return i.nombre + ' (' + i.color + ') x' + i.cantidad; }), total: o.pago.total, optin: o.cliente.marketingOptin }); } });
    if (add) lset(KO, all);
    return all;
  }
  function saveOrder(m) {
    var all = orders(); if (all.some(function (x) { return x.numero === m.numero; })) return false;
    all.unshift({ numero: m.numero, fecha: new Date().toISOString(), estado: 'nuevo', nombre: m.nombre, celular: m.celular, email: m.email, documento: m.documento, direccion: m.direccion, metodo: m.metodo, items: m.items, descuento: m.descuento, total: m.total, optin: m.optin });
    lset(KO, all); return true;
  }
  $('#ord-f').innerHTML = '<option value="">Todos los estados</option>' + ESTADOS.map(function (e) { return '<option value="' + e[0] + '">' + e[1] + '</option>'; }).join('');
  function renderOrders() {
    var all = orders(), q = slug($('#ord-q').value), f = $('#ord-f').value;
    var list = all.map(function (o, i) { return [o, i]; }).filter(function (x) { var o = x[0]; return (!f || o.estado === f) && (!q || slug(o.numero + ' ' + o.nombre + ' ' + o.celular + ' ' + o.email).indexOf(q) > -1); });
    $('#ord-count').textContent = all.length ? list.length + ' de ' + all.length + ' pedidos · ' + all.filter(function (o) { return o.estado === 'nuevo'; }).length + ' por confirmar' : '';
    $('#ord-list').innerHTML = list.map(function (x) {
      var o = x[0], i = x[1];
      return '<div class="orow st-' + o.estado + '"><div class="row"><b class="grow">' + esc(o.numero) + ' · ' + money(o.total) + '</b><span class="muted small">' + fmtDate(o.fecha) + '</span></div>' +
        '<div><b>' + esc(o.nombre) + '</b> <span class="muted small">' + esc([o.celular ? '+57 ' + o.celular : '', o.email].filter(Boolean).join(' · ')) + '</span></div>' +
        '<div class="muted small">' + esc((o.items || []).join(' · ')) + '</div>' +
        '<div class="muted small">' + esc([o.direccion, o.metodo, o.descuento ? 'Descuento ' + o.descuento : ''].filter(Boolean).join(' · ')) + '</div>' +
        '<div class="row wrap-row"><select data-st="' + i + '" aria-label="Estado del pedido">' + ESTADOS.map(function (e) { return '<option value="' + e[0] + '"' + (e[0] === o.estado ? ' selected' : '') + '>' + e[1] + '</option>'; }).join('') + '</select>' +
        (o.celular ? '<a class="btn btn-gold btn-sm" target="_blank" rel="noopener" href="' + esc(waTo(o.celular, AVISO[o.estado].replace('{nombre}', (o.nombre || '').split(' ')[0]).replace('{numero}', o.numero))) + '">Avisar al cliente</a>' : '') +
        '<button class="btn btn-ghost-dark btn-sm" data-odel="' + i + '">Eliminar</button></div></div>';
    }).join('') || '<p class="muted">' + (all.length ? 'Ningún pedido coincide.' : 'Aún no has registrado pedidos. Pega arriba el mensaje que te llegó por WhatsApp.') + '</p>';
  }
  $('#ord-add').addEventListener('click', function () {
    var m = parseMsg($('#ord-paste').value);
    if (!m || m.tipo !== 'pedido') return toast('No reconocí el pedido. Copia el mensaje completo, desde «PEDIDO LV-…» hasta el final.', 6000);
    if (!saveOrder(m)) return toast('El pedido ' + m.numero + ' ya estaba registrado.');
    var n = m.optin ? addContact({ nombre: m.nombre, celular: m.celular, email: m.email, origen: 'Pedido ' + m.numero }, true) : 0;
    $('#ord-paste').value = ''; renderOrders(); renderMarketing(); renderDash();
    toast('Pedido ' + m.numero + ' registrado.' + (n ? ' El cliente quedó en Marketing (aceptó promociones).' : ''), 5000);
  });
  $('#ord-list').addEventListener('change', function (e) {
    var s = e.target.closest('[data-st]'); if (!s) return; var all = orders(); all[+s.getAttribute('data-st')].estado = s.value; lset(KO, all); renderOrders(); renderDash();
  });
  $('#ord-list').addEventListener('click', function (e) {
    var d = e.target.closest('[data-odel]'); if (!d) return; var all = orders(), i = +d.getAttribute('data-odel');
    if (!confirm('¿Eliminar el pedido ' + all[i].numero + ' del registro?')) return;
    var num = all[i].numero; all.splice(i, 1); lset(KO, all);
    lset('lv_admin_orders', lget('lv_admin_orders', []).filter(function (o) { return o.numero !== num; }));
    renderOrders(); renderDash();
  });
  $('#ord-q').addEventListener('input', renderOrders);
  $('#ord-f').addEventListener('change', renderOrders);
  $('#ord-export').addEventListener('click', function () {
    var all = orders(); if (!all.length) return toast('No hay pedidos para exportar.');
    var lbl = function (s) { return (ESTADOS.filter(function (e) { return e[0] === s; })[0] || [s, s])[1]; };
    downloadFile('lovely-pedidos-' + today() + '.csv', toCsv([['numero', 'fecha', 'estado', 'cliente', 'celular', 'correo', 'direccion', 'envio', 'productos', 'total']].concat(all.map(function (o) { return [o.numero, (o.fecha || '').slice(0, 10), lbl(o.estado), o.nombre, o.celular, o.email, o.direccion, o.metodo, (o.items || []).join(' | '), o.total]; }))), 'text/csv;charset=utf-8');
  });

  /* ---------- Configuración ---------- */
  var cfgForm = $('#cfg');
  function renderCfg() { $$('input[name]', cfgForm).forEach(function (i) { i.value = S.cfg[i.name] == null ? '' : S.cfg[i.name]; }); renderRedes(); }

  /* Redes sociales: lista libre (se agregan o se quitan); reemplaza los antiguos campos instagram/tiktok/facebook */
  var REDES = [['instagram', 'Instagram', 'https://www.instagram.com/tu_usuario'], ['facebook', 'Facebook', 'https://www.facebook.com/tu_pagina'], ['tiktok', 'TikTok', 'https://www.tiktok.com/@tu_usuario'], ['youtube', 'YouTube', 'https://www.youtube.com/@tu_canal'], ['x', 'X (Twitter)', 'https://x.com/tu_usuario'], ['pinterest', 'Pinterest', 'https://www.pinterest.com/tu_usuario'], ['threads', 'Threads', 'https://www.threads.net/@tu_usuario']];
  function redes() {
    if (!Array.isArray(S.cfg.redes)) {
      S.cfg.redes = ['instagram', 'tiktok', 'facebook'].filter(function (k) { return S.cfg[k] && !/^https?:\/\/(www\.)?[^/]+\/?$/.test(S.cfg[k]); }).map(function (k) { return { red: k, url: S.cfg[k] }; });
    }
    return S.cfg.redes;
  }
  function renderRedes() {
    $('#redes').innerHTML = redes().map(function (r, i) {
      var d = REDES.filter(function (x) { return x[0] === r.red; })[0] || REDES[0];
      return '<div class="red-row" data-i="' + i + '"><select data-k="red" aria-label="Red social">' + REDES.map(function (x) { return '<option value="' + x[0] + '"' + (x[0] === r.red ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('') + '</select>' +
        '<input data-k="url" type="url" value="' + esc(r.url) + '" placeholder="' + d[2] + '" aria-label="Enlace del perfil"><button type="button" class="icon-btn" data-k="rm" aria-label="Quitar red">✕</button></div>';
    }).join('') || '<p class="muted small" style="margin:0">No hay redes sociales: la tienda no muestra botones de redes.</p>';
  }
  function redesChanged() { ['instagram', 'tiktok', 'facebook'].forEach(function (k) { delete S.cfg[k]; }); setDirty(true); }
  $('#redes').addEventListener('input', function (e) {
    var row = e.target.closest('.red-row'), k = e.target.getAttribute('data-k'); if (!row || k !== 'url') return;
    redes()[+row.getAttribute('data-i')].url = e.target.value.trim(); redesChanged();
  });
  $('#redes').addEventListener('change', function (e) {
    var row = e.target.closest('.red-row'); if (!row || e.target.getAttribute('data-k') !== 'red') return;
    redes()[+row.getAttribute('data-i')].red = e.target.value; redesChanged(); renderRedes();
  });
  $('#redes').addEventListener('click', function (e) {
    var b = e.target.closest('[data-k=rm]'); if (!b) return; var i = +b.closest('.red-row').getAttribute('data-i'), r = redes()[i];
    if (r.url && !confirm('¿Quitar ' + (REDES.filter(function (x) { return x[0] === r.red; })[0] || ['', 'esta red'])[1] + ' de la tienda?')) return;
    redes().splice(i, 1); redesChanged(); renderRedes();
  });
  $('#add-red').addEventListener('click', function () {
    var used = redes().map(function (r) { return r.red; }), next = REDES.filter(function (x) { return used.indexOf(x[0]) < 0; })[0] || REDES[0];
    redes().push({ red: next[0], url: '' }); redesChanged(); renderRedes();
    var ins = $$('#redes input'); ins[ins.length - 1].focus();
  });
  cfgForm.addEventListener('input', function (e) { if (!e.target.name) return; var v = e.target.value.trim(); if (v || S.cfg[e.target.name] != null) S.cfg[e.target.name] = v; setDirty(true); });

  /* ---------- Respaldo ---------- */
  $('#backup').addEventListener('click', function () {
    downloadFile('lovely-tienda-' + today() + '.json', JSON.stringify({ config: S.cfg, categorias: S.cats, productos: S.prods, combos: S.combos, codigos: S.codes, preguntas: S.faqs }, null, 2));
  });
  $('#restore').addEventListener('change', function (e) {
    var f = e.target.files[0]; e.target.value = ''; if (!f) return;
    f.text().then(function (t) {
      var d = JSON.parse(t);
      if (!d || !Array.isArray(d.productos) || !Array.isArray(d.categorias)) throw new Error();
      if (!confirm('Esto reemplaza todos los datos actuales por la copia (' + d.productos.length + ' productos). ¿Continuar?')) return;
      S.cfg = d.config || {}; S.cats = d.categorias; S.prods = d.productos;
      if (d.combos) S.combos = d.combos; if (d.codigos) S.codes = d.codigos; if (d.preguntas) S.faqs = d.preguntas;
      setDirty(true); renderAll(); toast('Copia cargada. Revisa y pulsa «Publicar cambios».');
    }).catch(function () { toast('Ese archivo no es una copia válida del catálogo.'); });
  });

  /* Clientes y pedidos: copia aparte (solo existen en este navegador) */
  $('#backup-local').addEventListener('click', function () {
    downloadFile('lovely-clientes-pedidos-' + today() + '.json', JSON.stringify({ tipo: 'lovely-local', contactos: contacts(), pedidos: orders(), envios: lget(KH, []) }, null, 2));
  });
  $('#restore-local').addEventListener('change', function (e) {
    var f = e.target.files[0]; e.target.value = ''; if (!f) return;
    f.text().then(function (t) {
      var d = JSON.parse(t); if (!d || d.tipo !== 'lovely-local') throw new Error();
      var nc = 0, no = 0, os = orders();
      (d.contactos || []).forEach(function (c) { nc += addContact(c, true); });
      (d.pedidos || []).forEach(function (o) { if (!os.some(function (x) { return x.numero === o.numero; })) { os.push(o); no++; } });
      lset(KO, os); renderMarketing(); renderOrders(); renderDash();
      toast('Recuperados ' + nc + ' clientes y ' + no + ' pedidos.');
    }).catch(function () { toast('Ese archivo no es una copia de clientes y pedidos.'); });
  });

  /* ---------- Navegación ---------- */
  function goTab(name) {
    $$('.tabs button').forEach(function (o) { o.setAttribute('aria-selected', o.getAttribute('data-tab') === name ? 'true' : 'false'); });
    $$('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== name; });
    try { sessionStorage.setItem('lv_admin_tab', name); } catch (e) {}
    window.scrollTo(0, 0);
  }
  $$('.tabs button').forEach(function (b) { b.addEventListener('click', function () { goTab(b.getAttribute('data-tab')); }); });
  $('#list').addEventListener('click', function (e) { var b = e.target.closest('.prow'); if (b) openEditor(b.getAttribute('data-id')); });
  $('#new-product').addEventListener('click', function () { openEditor(null); });
  $('#q').addEventListener('input', renderList);
  $('#fcat').addEventListener('change', renderList);
  $('#publish').addEventListener('click', function () { if (confirm('¿Publicar los cambios en la tienda?')) publish(); });
  $('#logout').addEventListener('click', function () {
    if (S.dirty && !confirm('Tienes cambios sin publicar. Si sales, se perderán. ¿Salir?')) return;
    S.dirty = false; clearAuth(); location.reload();
  });
  window.addEventListener('beforeunload', function (e) { if (S.dirty) { e.preventDefault(); e.returnValue = ''; } });

  function renderAll() { renderFilters(); renderList(); renderCats(); renderCfg(); renderCombos(); renderCodes(); renderPromos(); renderTexts(); renderFaqs(); renderOrders(); renderMarketing(); renderRun(); renderDash(); }

  /* ---------- Inicio ---------- */
  function connect(a) {
    S.token = a.token; S.repo = a.repo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, ''); S.branch = a.branch || 'main';
    return gh('').then(function (repo) {
      if (!repo.permissions || !repo.permissions.push) { var e = new Error(); e.status = 403; throw e; }
      return loadData();
    });
  }
  function showApp() {
    $('#login').hidden = true; $('#app').hidden = false; setDirty(false); renderAll();
    var t = ''; try { t = sessionStorage.getItem('lv_admin_tab') || ''; } catch (e) {}
    if (t && $('[data-panel="' + t + '"]')) goTab(t);
  }
  function showLogin(msg) {
    $('#app').hidden = true; $('#login').hidden = false;
    var x = $('#login-error'); x.hidden = !msg; x.textContent = msg || '';
  }
  $('#login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var a = { token: $('#f-token').value.trim(), repo: $('#f-repo').value.trim(), branch: $('#f-branch').value.trim() || 'main' };
    if (!a.token) return showLogin('Pega tu token de GitHub.');
    var btn = e.target.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Conectando…';
    connect(a).then(function () { writeAuth(a, $('#f-remember').checked); showApp(); })
      .catch(function (err) { showLogin(errorText(err)); })
      .then(function () { btn.disabled = false; btn.textContent = 'Entrar'; });
  });
  /* Logos SVG con tipo incorrecto del servidor: se vuelven a pedir y se muestran igual */
  $$('img[src$=".svg"]').forEach(function (img) {
    var fix = function () { if (img._fx) return; img._fx = 1; fetch(img.getAttribute('src')).then(function (r) { return r.text(); }).then(function (t) { if (t.indexOf('<svg') > -1) img.src = URL.createObjectURL(new Blob([t], { type: 'image/svg+xml' })); }).catch(function () {}); };
    if (img.complete && img.naturalWidth === 0) fix(); else img.addEventListener('error', fix);
  });
  var saved = readAuth();
  if (saved && saved.token) connect(saved).then(showApp).catch(function (err) { clearAuth(); showLogin(errorText(err)); });
  else showLogin();
})();
