---
layout: default
title: Base de datos de Normas del Poder Legislativo y Ejecutivo (1820–2025)
---
<div id="loader">Cargando base de datos desde GitHub…</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const BASE_URL = 'https://raw.githubusercontent.com/actio1680/Cuerpos-legales-Peru/refs/heads/main/Normas-Legislativo-Ejecutivo/';
  const README_URL = `${BASE_URL}README.md`;

  function initializeApp() {
    if (typeof marked === 'undefined' || typeof DOMPurify === 'undefined') {
      return setTimeout(initializeApp, 50);
    }

    loadContent();
  }

  function loadContent() {
    fetch(README_URL)
      .then(response => response.ok ? response.text() : Promise.reject('Error cargando README'))
      .then(processMarkdown)
      .catch(handleError);
  }

  function processMarkdown(markdown) {
    const { cleanedMarkdown, footnotes } = extractFootnotes(markdown);
    const processedMarkdown = processLinksAndImages(cleanedMarkdown);
    const html = renderMarkdown(processedMarkdown, footnotes);
    
    displayContent(html);
  }

  function extractFootnotes(markdown) {
    const footnotes = {};
    
    // Extraer definiciones de footnotes
    const cleanedMarkdown = markdown.replace(/\[\^(\d+)\]:\s*(.+)/g, (match, number, content) => {
      footnotes[number] = content.trim();
      return ''; // Remover del markdown principal
    });

    return { cleanedMarkdown, footnotes };
  }

  function processLinksAndImages(markdown) {
    return markdown
      // Procesar imágenes
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
        if (/^https?:/.test(src)) return match;
        const normalizedSrc = src.trim().replace(/^\.?\//, '').replace(/\s+/g, '%20');
        return `![${alt}](${BASE_URL}${normalizedSrc})`;
      })
      // Procesar enlaces de descarga
      .replace(/\[([^\]]+)\]\(([^)]+\.(xlsx|html|pdf))\)/gi, (match, text, href) => {
        if (/^https?:/.test(href)) return match;
        const normalizedHref = href.trim().replace(/^\.?\//, '');
        return `<a href="${BASE_URL}${normalizedHref}" download>${text}</a>`;
      })
      // Procesar referencias a footnotes
      .replace(/\[\^(\d+)\]/g, (match, number) => {
        return `<sup><a href="#fn${number}" id="fnref${number}" class="footnote-ref">${number}</a></sup>`;
      });
  }

  function renderMarkdown(markdown, footnotes) {
    let html = marked.parse(markdown);
    
    if (Object.keys(footnotes).length > 0) {
      html += generateFootnotesSection(footnotes);
    }
    
    return html;
  }

  function generateFootnotesSection(footnotes) {
    const footnoteItems = Object.keys(footnotes)
      .sort((a, b) => a - b)
      .map(number => 
        `<li id="fn${number}">${footnotes[number]} <a href="#fnref${number}" class="footnote-backref">↩</a></li>`
      )
      .join('');

    return `
      <div class="footnotes">
        <hr>
        <ol>${footnoteItems}</ol>
      </div>
    `;
  }

  function displayContent(html) {
    loader.innerHTML = DOMPurify.sanitize(html, {
      ADD_TAGS: ['sup', 'div', 'ol', 'li', 'hr'],
      ADD_ATTR: ['class', 'id', 'download', 'align'], // ✅ align incluido aquí
      ALLOWED_TAGS: [
        'h1','h2','h3','h4','p','ul','ol','li','table','thead','tbody','tr','th','td',
        'a','br','strong','em','code','pre','img','div','sup','hr'
      ],
      ALLOWED_ATTR: [
        'href','src','alt','width','height','download','target','id','class','align' // ✅ y también aquí
      ]
    });

    ensureTopAnchor();
  }

  function ensureTopAnchor() {
    if (!document.getElementById('top')) {
      document.body.insertAdjacentHTML('afterbegin', '<span id="top"></span>');
    }
  }

  function handleError(error) {
    console.error('Error:', error);
    loader.innerHTML = `<p style="color:#c0392b;">⚠️ ${error}</p>`;
  }

  // Configurar marked antes de iniciar
  if (window.marked) {
    marked.setOptions({
      gfm: true,
      breaks: true,
      smartypants: true,
      mangle: false,
      headerIds: true
    });
  }

  initializeApp();
});
</script>

<style>
  #loader {
    line-height: 1.6;
  }

  #loader table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.2em 0;
  }

  #loader th,
  #loader td {
    border: 1px solid #ccc;
    padding: 0.5em;
    text-align: left;
  }

  #loader th {
    background: #f9f9f9;
  }

  #loader img {
    max-width: 200px;
    height: auto;
  }

  #loader a[download] {
    display: inline-block;
    background: #27ae60;
    color: white;
    padding: 0.3em 0.7em;
    text-decoration: none;
    border-radius: 3px;
    margin: 0.2em 0;
  }

  /* Footnotes styling */
  .footnote-ref {
    font-size: 0.75em;
    text-decoration: none;
    color: #2980b9;
    margin: 0 1px;
    padding: 1px 4px;
    background: #f8f9fa;
    border-radius: 2px;
  }

  .footnote-ref:hover {
    background: #e3f2fd;
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
  }

  .footnote-backref {
    text-decoration: none;
    margin-left: 0.5em;
    color: #95a5a6;
  }

  .footnote-backref:hover {
    color: #2980b9;
  }
</style>
