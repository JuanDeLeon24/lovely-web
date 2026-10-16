# Lovely · LV Accesorios — instrucciones para Claude

- Sitio estático (HTML/CSS/JS sin dependencias) publicado con GitHub Pages desde `main` / raíz.
- Catálogo y datos de contacto: `js/data.js`. Fotos: `assets/products/` (`nombre.webp` 900px y `nombre-sm.webp` 480px).
- Marca: negro carbón #111111, dorado #D4AF37 (nunca texto dorado sobre blanco), grafito #3A3A3A, blanco, gris claro #F5F5F5. Montserrat títulos, Poppins textos. Eslogan: "Pequeños detalles, grandes estilos."
- El manual de marca manda sobre las reglas de las skills de diseño (`.claude/skills/`) cuando se contradigan.
- No publicar productos con marcas registradas de terceros (Rolex, Diesel, Lacoste, Nike, etc.) salvo que el cliente confirme que son originales o autorizados.
- Mantener `noindex` y la barra "Vista previa" hasta el lanzamiento.
- Visor 3D solo para relojes: `js/visor3d.js` (Three.js r160 incluido en `js/vendor/`, sin CDN). Cada reloj nuevo necesita su entrada en `SPECS` (medidas en mm y colores por variante en el mismo orden que `colors` en `js/data.js`). Para usar un modelo profesional, guárdalo como `assets/models/<id>.glb` y agrega `glb: true` a su entrada en `SPECS`. Se abre desde la ficha con «Explorar en 3D» o con `producto.html?id=…&vista=3d`.
- Panel administrativo: `admin.html` + `js/admin.js` (no enlazado desde la tienda). Edita `js/data.js` y sube/borra fotos en `assets/products/` con la API de GitHub usando un token personal (Contents: Read and write) guardado solo en el navegador; publica todo en un commit. `js/data.js` lo regenera el panel: conserva su formato (`window.LV_CONFIG`, `LV_CATEGORIES`, `LV_PRODUCTS`, un producto por línea).
- Modo claro/oscuro: botón sol/luna en el header (`.theme-btn`), guardado en `localStorage` (`lv_theme`); sin elección previa sigue al sistema. Cada página aplica el tema en `<head>` antes de pintar. En CSS usa los tokens semánticos (`--ink` texto, `--bg` fondo, `--surface` paneles, `--inv-bg`/`--inv-fg` estados seleccionados); `--negro` queda para superficies que siempre son oscuras (hero, footer, badges). No escribas colores fijos en estilos inline.
