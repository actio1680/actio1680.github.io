---
layout: default
title: Base de datos de Normas del Poder Legislativo y Ejecutivo (1820–2025)
---
<div id="loader">Cargando base de datos desde GitHub…</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const el = document.getElementById('loader');
    if (!el) return;

    const url = 'https://raw.githubusercontent.com/actio1680/Cuerpos-legales-Peru/main/Normas-Legislativo-Ejecutivo/README.md';
    const rawBase = 'https://raw.githubusercontent.com/actio1680/Cuerpos-legales-Peru/main/';

    function waitForLibs() {
      if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
        fetch(url)
          .then(r => r.ok ? r.text() : Promise.reject('README no encontrado'))
          .then(md => {
            // 1️⃣ Corregir rutas de imágenes y enlaces relativos
            let fixed = md
              .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, src) => 
                /^https?:/.test(src) ? m : `![${alt}](${rawBase}${encodeURIComponent(src)})`
              )
              .replace(/\[([^\]]+)\]\(([^)]+\.(xlsx|html))\)/g, (m, txt, href) =>
                /^https?:/.test(href) ? m : `<a href="${rawBase}${encodeURIComponent(href)}" download>${txt}</a>`
              );

            // 2️⃣ Renderizar con marked
            const dirty = marked.parse(fixed);

            // 3️⃣ Sanitizar permitiendo HTML personalizado (align, center, footnotes, etc.)
            const clean = DOMPurify.sanitize(dirty, {
              ADD_TAGS: ['center', 'div', 'sup', 'a'],
              ADD_ATTR: ['align', 'id', 'class'],
              ALLOWED_TAGS: [
                'h1','h2','h3','h4','p','ul','ol','li','table','thead','tbody','tr','th','td',
                'a','br','strong','em','code','pre','img','div','center','sup','hr'
              ],
              ALLOWED_ATTR: [
                'href','src','alt','width','height','download','target','id','class','align'
              ],
              // Permitir ids para footnotes y saltos (↑ Subir, [^1])
              KEEP_CONTENT: true
            });

            el.innerHTML = clean;

            // 4️⃣ Soporte manual para [Subir](#top) → asegurar que #top exista
            if (!document.getElementById('top')) {
              document.body.insertAdjacentHTML('afterbegin', '<span id="top"></span>');
            }
          })
          .catch(e => el.innerHTML = `<p style="color:#c0392b;">⚠️ ${e.message}</p>`);
      } else {
        setTimeout(waitForLibs, 50);
      }
    }

    waitForLibs();
  });
</script>

<style>
  #loader table { width: 100%; border-collapse: collapse; margin: 1.2em 0; }
  #loader th, #loader td { border: 1px solid #ccc; padding: 0.5em; text-align: left; }
  #loader th { background: #f9f9f9; }
  #loader img { max-width: 200px; height: auto; }
  #loader a[download] {
    display: inline-block;
    background: #27ae60;
    color: white !important;
    padding: 0.3em 0.7em;
    text-decoration: none;
    border-radius: 3px;
    margin: 0.2em 0;
  }
  sup a.footnote-ref { font-size: 0.8em; }
</style>
