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

        /* ---------- FORMATO [^1] PARA FOOTNOTES ---------- */
        const footnotes = {};
        
        // Primero: extraer las definiciones de footnotes [^1]: contenido
        const footnoteRegex = /\[\^(\d+)\]:\s*(.+)/g;
        let match;
        while ((match = footnoteRegex.exec(md)) !== null) {
          const [, number, content] = match;
          footnotes[number] = content.trim();
        }

        // Segundo: limpiar las definiciones del markdown para que marked no las procese
        md = md.replace(/\[\^(\d+)\]:\s*.+?\n/g, '');

        // Tercero: procesar referencias [^1] en el texto
        md = md.replace(/\[\^(\d+)\]/g, (match, number) => {
          if (footnotes[number]) {
            return `<sup><a href="#fn${number}" id="fnref${number}" class="footnote-ref">${number}</a></sup>`;
          }
          return match; // Si no hay definición, dejar como está
        });

        /* ---------- CORREGIDO: imágenes → raw ---------- */
        md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, src) => {
          console.log('Imagen encontrada:', {alt, src});
          if (/^https?:/.test(src)) return m;
          
          src = src.trim()
                  .replace(/^\.?\//, '')
                  .replace(/\s+/g, '%20');
          
          const fullUrl = `${RAW}${src}`;
          console.log('URL final imagen:', fullUrl);
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

        console.log('Markdown procesado:', md);

        /* ---------- renderizar ---------- */
        let html = marked.parse(md);

        /* ---------- BLOQUE DE FOOTNOTES CORREGIDO ---------- */
        if (Object.keys(footnotes).length > 0) {
          const footnoteNumbers = Object.keys(footnotes).sort((a, b) => a - b);
          const items = footnoteNumbers.map(number => 
            `<li id="fn${number}">[${number}] ↩ ${footnotes[number]}</li>`
          ).join('');
          
          html += `
            <div class="footnotes">
              <hr>
              <ol>${items}</ol>
            </div>
          `;
        }

        /* ---------- sanitizar y pegar ---------- */
        el.innerHTML = DOMPurify.sanitize(html, {
          ADD_TAGS: ['sup', 'div', 'ol', 'li', 'hr'],
          ADD_ATTR: ['class', 'id', 'download', 'align'],
          ALLOWED_TAGS: [
            'h1','h2','h3','h4','p','ul','ol','li','table','thead','tbody','tr','th','td',
            'a','br','strong','em','code','pre','img','div','sup','ol','li','hr'
          ],
          ALLOWED_ATTR: [
            'href','src','alt','width','height','download','target','id','class','align'
          ]
        });

        /* ---------- soporte "Subir" ---------- */
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
  
  /* Estilos para footnotes */
  sup a.footnote-ref { 
    font-size: 0.75em;
    text-decoration: none;
    color: #2980b9;
    margin: 0 1px;
    padding: 1px 4px;
    background: #f8f9fa;
    border-radius: 2px;
  }
  
  sup a.footnote-ref:hover {
    background: #e3f2fd;
    color: #1565c0;
  }
  
  .footnotes {
    margin-top: 2em;
    padding-top: 1em;
    border-top: 1px solid #e0e0e0;
    font-size: 0.85em;
    color: #666;
  }
  
  .footnotes ol {
    padding-left: 1.5em;
  }
  
  .footnotes li {
    margin-bottom: 0.8em;
    line-height: 1.5;
    position: relative;
  }
  
  .footnote-backref {
    text-decoration: none;
    margin-left: 0.5em;
    color: #95a5a6;
    font-size: 0.9em;
  }
  
  .footnote-backref:hover {
    color: #2980b9;
  }
</style>
