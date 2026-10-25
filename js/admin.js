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

  var S = { token: '', repo: '', branch: 'main', cfg: {}, cats: [], prods: [], dataSha: '', files: {}, del: {}, urls: {}, changed: {}, dirty: false };

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
    });
  }
  function serialize() {
    return '/* Catálogo Lovely — generado también por el panel administrativo (admin.html).\n' +
      '   price: número en COP (0 = "Precio por confirmar"). stock: unidades disponibles.\n' +
      '   Las fotos están en assets/products/ (nombre.webp grande y nombre-sm.webp miniatura).\n' +
      '   modelo3d: true si el reloj tiene vista 3D en js/visor3d.js. */\n' +
      'window.LV_CONFIG = ' + JSON.stringify(S.cfg, null, 2) + ';\n\n' +
      'window.LV_CATEGORIES = [\n' + S.cats.map(function (c) { return '  ' + JSON.stringify(c); }).join(',\n') + '\n];\n\n' +
      'window.LV_PRODUCTS = [\n' + S.prods.map(function (p) { return '  ' + JSON.stringify(p); }).join(',\n') + '\n];\n';
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
    S.changed[id] = true; closeEditor(); setDirty(true); renderList();
    toast('Guardado. Pulsa «Publicar cambios» para subirlo a la tienda.');
  });
  $('#ed-delete').addEventListener('click', function () {
    if (!confirm('¿Eliminar «' + E.name + '» de la tienda? Sus fotos también se borrarán al publicar.')) return;
    var p = S.prods.filter(function (x) { return x.id === E.id; })[0];
    if (p) { p.colors.forEach(function (c) { dropImage(c.img); }); (p.extra || []).forEach(dropImage); S.prods.splice(S.prods.indexOf(p), 1); }
    closeEditor(); setDirty(true); renderList(); toast('Producto eliminado. Publica para aplicarlo en la tienda.');
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

  /* ---------- Ventas y contacto ---------- */
  var cfgForm = $('#cfg');
  function renderCfg() { $$('input', cfgForm).forEach(function (i) { i.value = S.cfg[i.name] == null ? '' : S.cfg[i.name]; }); }
  cfgForm.addEventListener('input', function (e) { if (!e.target.name) return; S.cfg[e.target.name] = e.target.value.trim(); setDirty(true); });

  /* ---------- Respaldo ---------- */
  $('#backup').addEventListener('click', function () {
    var b = new Blob([JSON.stringify({ config: S.cfg, categorias: S.cats, productos: S.prods }, null, 2)], { type: 'application/json' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'lovely-catalogo-' + new Date().toISOString().slice(0, 10) + '.json'; document.body.appendChild(a); a.click(); a.remove();
  });
  $('#restore').addEventListener('change', function (e) {
    var f = e.target.files[0]; e.target.value = ''; if (!f) return;
    f.text().then(function (t) {
      var d = JSON.parse(t);
      if (!d || !Array.isArray(d.productos) || !Array.isArray(d.categorias)) throw new Error();
      if (!confirm('Esto reemplaza todos los datos actuales por la copia (' + d.productos.length + ' productos). ¿Continuar?')) return;
      S.cfg = d.config || {}; S.cats = d.categorias; S.prods = d.productos;
      setDirty(true); renderAll(); toast('Copia cargada. Revisa y pulsa «Publicar cambios».');
    }).catch(function () { toast('Ese archivo no es una copia válida del catálogo.'); });
  });

  /* ---------- Navegación ---------- */
  $$('.tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.tabs button').forEach(function (o) { o.setAttribute('aria-selected', o === b ? 'true' : 'false'); });
      $$('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== b.getAttribute('data-tab'); });
    });
  });
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

  function renderAll() { renderFilters(); renderList(); renderCats(); renderCfg(); }

  /* ---------- Inicio ---------- */
  function connect(a) {
    S.token = a.token; S.repo = a.repo.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, ''); S.branch = a.branch || 'main';
    return gh('').then(function (repo) {
      if (!repo.permissions || !repo.permissions.push) { var e = new Error(); e.status = 403; throw e; }
      return loadData();
    });
  }
  function showApp() { $('#login').hidden = true; $('#app').hidden = false; setDirty(false); renderAll(); }
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
