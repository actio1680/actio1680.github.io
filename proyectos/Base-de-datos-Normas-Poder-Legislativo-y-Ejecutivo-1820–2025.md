---
layout: default
title: Base de datos de Normas del Poder Legislativo y Ejecutivo (1820–2025)
---
<div id="loader">Cargando base de datos desde GitHub…</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('loader');
  if (!el) return;

  const README = 'https://raw.githubusercontent.com/actio1680/Cuerpos-legales-Peru/refs/heads/main/Normas-Legislativo-Ejecutivo/README.md';
  const RAW    = 'https://raw.githubusercontent.com/actio1680/Cuerpos-legales-Peru/refs/heads/main/Normas-Legislativo-Ejecutivo/';

  function waitLibs() {
    if (typeof marked == 'undefined' || typeof DOMPurify == 'undefined') {
      return setTimeout(waitLibs, 50);
    }

    fetch(README)
      .then(r => r.ok ? r.text() : Promise.reject('README no encontrado'))
      .then(md => {
        console.log('Markdown original:', md); // DEBUG

        /* ---------- footnotes manuales ---------- */
        const footnotes = {};
        let fnCounter   = 0;
        md = md.replace(/\[\^(\d+)\]/g, (_, n) => {
          footnotes[n] = footnotes[n] || ++fnCounter;
          return `<sup><a href="#fn${n}" id="fnref${n}" class="footnote-ref">${n}</a></sup>`;
        });

        /* ---------- CORREGIDO: imágenes → raw ---------- */
        md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, src) => {
          console.log('Imagen encontrada:', {alt, src});
          if (/^https?:/.test(src)) return m;
          
          // Normalizar ruta
          src = src.trim()
                  .replace(/^\.?\//, '')
                  .replace(/\s+/g, '%20');
          
          const fullUrl = `${RAW}${src}`;
          console.log('URL final imagen:', fullUrl); // DEBUG
          return `![${alt}](${fullUrl})`;
        });

        /* ---------- enlaces de descarga → absolutos ---------- */
        md = md.replace(/\[([^\]]+)\]\(([^)]+\.(xlsx|html|pdf))\)/gi,
          (m, txt, href) => {
            if (/^https?:/.test(href)) return m;
            const fullHref = `${RAW}${href.trim().replace(/^\.?\//, '')}`;
            return `<a href="${fullHref}" download>${txt}</a>`;
          }
        );

        console.log('Markdown procesado:', md); // DEBUG

        /* ---------- renderizar ---------- */
        let html = marked.parse(md);

        /* ---------- bloque de notas al final ---------- */
        if (Object.keys(footnotes).length) {
          const items = Object.keys(footnotes)
            .sort((a, b) => a - b)
            .map(n => `<li id="fn${n}"><a href="#fnref${n}" class="footnote-backref">↩</a></li>`)
            .join('');
          html += `<div class="footnotes"><ol>${items}</ol></div>`;
        }

        /* ---------- sanitizar y pegar ---------- */
        el.innerHTML = DOMPurify.sanitize(html, {
          ADD_TAGS: ['sup', 'div', 'ol', 'li'],
          ADD_ATTR: ['class', 'id', 'download', 'align'],
          ALLOWED_TAGS: [
            'h1','h2','h3','h4','p','ul','ol','li','table','thead','tbody','tr','th','td',
            'a','br','strong','em','code','pre','img','div','sup','ol','li'
          ],
          ALLOWED_ATTR: [
            'href','src','alt','width','height','download','target','id','class','align'
          ]
        });

        /* ---------- soporte “Subir” ---------- */
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
  sup a.footnote-ref { font-size: 0.8em; }

</style>
