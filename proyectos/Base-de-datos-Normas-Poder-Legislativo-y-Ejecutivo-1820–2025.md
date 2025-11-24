---
layout: default
title: Base de datos de Normas del Poder Legislativo y Ejecutivo (1820–2025)
---
<div id="loader">Cargando base de datos desde GitHub…</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('loader');
  if (!el) return;

  const README = 'https://raw.githubusercontent.com/actio1680/Cuerpos-legales-Peru/main/Normas-Legislativo-Ejecutivo/README.md';
  const RAW    = 'https://raw.githubusercontent.com/actio1680/Cuerpos-legales-Peru/main/';

  function waitLibs() {
    if (typeof marked == 'undefined' || typeof DOMPurify == 'undefined') {
      return setTimeout(waitLibs, 50);
    }

    fetch(README)
      .then(r => r.ok ? r.text() : Promise.reject('README no encontrado'))
      .then(md => {
        /* ---------- footnotes manuales ---------- */
        const footnotes = {};
        let fnCounter   = 0;
        md = md.replace(/\[\^(\d+)\]/g, (_, n) => {
          footnotes[n] = footnotes[n] || ++fnCounter;
          return `<sup><a href="#fn${n}" id="fnref${n}" class="footnote-ref">${n}</a></sup>`;
        });

        /* ---------- imágenes → raw ---------- */
        md = md.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, src) => {
          if (/^https?:/.test(src)) return m;               // ya es absoluta
          src = src.replace(/^\.?\//, '').trim();           // ./img.png  /img.png → img.png
          return `![${alt}](https://raw.githubusercontent.com/actio1680/Cuerpos-legales-Peru/main/${encodeURIComponent(src)})`;
        });

        /* ---------- enlaces de descarga → absolutos ---------- */
        md = md.replace(/\[([^\]]+)\]\(([^)]+\.(xlsx|html|pdf))\)/gi,
          (m, txt, href) => /^https?:/.test(href)
            ? m
            : `<a href="${RAW}${encodeURIComponent(href)}" download>${txt}</a>`
        );

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
          ADD_ATTR: ['class', 'id', 'download'],
          ALLOWED_TAGS: [
            'h1','h2','h3','h4','p','ul','ol','li','table','thead','tbody','tr','th','td',
            'a','br','strong','em','code','pre','img','div','sup','ol','li'
          ],
          ALLOWED_ATTR: [
            'href','src','alt','width','height','download','target','id','class'
          ]
        });

        /* ---------- soporte “Subir” ---------- */
        if (!document.getElementById('top')) {
          document.body.insertAdjacentHTML('afterbegin', '<span id="top"></span>');
        }
      })
      .catch(e => el.innerHTML = `<p style="color:#c0392b;">⚠️ ${e}</p>`);
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
