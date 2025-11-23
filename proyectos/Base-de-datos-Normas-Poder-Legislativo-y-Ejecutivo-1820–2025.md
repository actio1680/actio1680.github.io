---
layout: default
title: Base de datos de Normas del Poder Legislativo y Ejecutivo (1820–2025)
---

<div id="content-loader">
  <p>Cargando base de datos desde GitHub…</p>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const el = document.getElementById('content-loader');
    if (!el) return;

    // ✅ URL raw del README.md (fuente de verdad)
    const url = 'https://raw.githubusercontent.com/actio1680/Cuerpos-legales-Peru/main/Normas-Legislativo-Ejecutivo/README.md';
    // ✅ Base para rutas relativas (donde están imágenes y XLSX)
    const rawBase = 'https://raw.githubusercontent.com/actio1680/Cuerpos-legales-Peru/main/';

    
    function render() {
      if (!window.marked || !window.DOMPurify) return setTimeout(render, 50);

      fetch(url)
        .then(r => r.ok ? r.text() : Promise.reject('README no encontrado'))
        .then(md => {
          // Corregir rutas relativas → raw
          const fixed = md.replace(
            /(!\[.*?\]\()([^)\s]+)(\))/g,
            (match, pre, src, post) => {
              if (!/^https?:/i.test(src)) {
                return `${pre}${rawBase}${encodeURIComponent(src)}${post}`;
              }
              return match;
            }
          ).replace(
            /\[([^\]]+)\]\(([^)]+\.(xlsx|html))\)/g,
            (match, text, href, ext) => {
              if (!/^https?:/i.test(href)) {
                const dl = `${rawBase}${encodeURIComponent(href)}`;
                return `<a href="${dl}" download>${text}</a>`;
              }
              return match;
            }
          );

          el.innerHTML = DOMPurify.sanitize(
            marked.parse(fixed),
            { ADD_ATTR: ['target'], ALLOWED_TAGS: ['h1','h2','h3','p','ul','ol','li','table','thead','tbody','tr','th','td','a','br','strong','em','img'], ALLOWED_ATTR: ['href','src','alt','download','target'] }
          );
        })
        .catch(e => el.innerHTML = `<p style="color:#c0392b">⚠️ Error: ${e.message}</p>`);
    }

    render();
  });
</script>

<style>
  #content-loader table { width: 100%; border-collapse: collapse; margin: 1.2em 0; }
  #content-loader th, #content-loader td { border: 1px solid #ccc; padding: 0.5em; text-align: left; }
  #content-loader th { background: #f8f9fa; }
  #content-loader img { max-width: 180px; height: auto; }
  #content-loader a[download] {
    display: inline-block;
    background: #27ae60;
    color: white !important;
    padding: 0.3em 0.7em;
    text-decoration: none;
    border-radius: 3px;
  }
</style>
