---
layout: default
title: Base de datos de las sentencias de la Corte Suprema de Justicia del Perú (1870-1972)
---
<div id="loader">Cargando base de datos desde GitHub…</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('loader');
  if (!el) return;

  const README = 'https://raw.githubusercontent.com/actio1680/Cuerpos-legales-Peru/refs/heads/main/Sentencias-supremas/README.md';
  const RAW    = 'https://raw.githubusercontent.com/actio1680/Cuerpos-legales-Peru/refs/heads/main/Sentencias-supremas/';

  function waitLibs() {
    if (typeof marked == 'undefined' || typeof DOMPurify == 'undefined') {
      return setTimeout(waitLibs, 50);
    }

    fetch(README)
      .then(r => r.ok ? r.text() : Promise.reject('README no encontrado'))
      .then(md => {
        // Limpiar cualquier definición de footnote del markdown
        md = md.replace(/\[\^(\d+)\]:\s*.+?\n/g, '');
        
        // Procesar imágenes
        md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, src) => {
          if (/^https?:/.test(src)) return m;
          const normalizedSrc = src.trim().replace(/^\.?\//, '').replace(/\s+/g, '%20');
          const fullUrl = `${RAW}${normalizedSrc}`;
          return `![${alt}](${fullUrl})`;
        });

        // Procesar enlaces de descarga
        md = md.replace(/\[([^\]]+)\]\(([^)]+\.(xlsx|html|pdf))\)/gi,
          (m, txt, href) => {
            if (/^https?:/.test(href)) return m;
            const fullHref = `${RAW}${href.trim().replace(/^\.?\//, '')}`;
            return `<a href="${fullHref}" download>${txt}</a>`;
          }
        );

        // Renderizar markdown
        const html = marked.parse(md);

        // Sanitizar y mostrar
        el.innerHTML = DOMPurify.sanitize(html, {
          ADD_TAGS: ['div'],
          ADD_ATTR: ['download', 'align'],
          ALLOWED_TAGS: [
            'h1','h2','h3','h4','p','ul','ol','li','table','thead','tbody','tr','th','td',
            'a','br','strong','em','code','pre','img','div'
          ],
          ALLOWED_ATTR: [
            'href','src','alt','width','height','download','target','align'
          ]
        });

        // Soporte "Subir"
        if (!document.getElementById('top')) {
          document.body.insertAdjacentHTML('afterbegin', '<span id="top"></span>');
        }
      })
      .catch(e => {
        console.error('Error:', e);
        el.innerHTML = `<p style="color:#c0392b;">⚠️ ${e}</p>`;
      });
  }

  waitLibs();
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
</style>
