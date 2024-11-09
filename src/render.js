// src/render.js

export function renderNodesToHtml(nodes) {
    return nodes.map(node => nodeToHtml(node)).join('');
}

function nodeToHtml(node) {
  switch (node.type) {
    case 'header':
      return `<h${node.attributes.level} id="${node.content.toLowerCase().replace(/\s+/g, '-')}">${node.content}</h${node.attributes.level}>`;
      
    case 'paragraph':
      return `<p>${node.content}</p>`;
      
    case 'blockquote':
      return `<blockquote>${renderNodesToHtml(node.content)}</blockquote>`;
      
    case 'ul':
      return `<ul>${renderNodesToHtml(node.content)}</ul>`;
      
    case 'ol':
      return `<ol>${renderNodesToHtml(node.content)}</ol>`;
      
    case 'li':
      return `<li>${renderNodesToHtml(node.content)}</li>`;
      
    case 'codeBlock':
      const code = node.content.join('\n');
      return `<pre><code class="${node.attributes.lang}">${code}</code></pre>`;
    
    case 'persianBlock':
      return `<div class="persian poet ${node.attributes.code}">${renderNodesToHtml(node.content)}</div>`;
    
    case 'poetRow':
        return `${renderNodesToHtml(node.content)}`;
    
    case 'poetCell':
        return `<div class="stanza">${node.content}</div>`;
      
    case 'hr':
      return `<hr />`;
    
    case 'taskItem':
        return `<li class="task"><input type="checkbox" ${node.attributes.checked ? 'checked' : ''} disabled> ${renderNodesToHtml(node.content)}</li>`;
    
    case 'table':
        return `<table>${renderNodesToHtml(node.content)}</table>`;
    
    case 'tableRow':
        return `<tr>${renderNodesToHtml(node.content)}</tr>`;      
    
    case 'tableHeaderCell':
        return `<th>${node.content}</th>`;
    
    case 'tableCell':
        return `<td>${node.content}</td>`;
    
    case 'image':
      return `<img src="${node.attributes.src}" alt="${node.attributes.alt}">`;

    case 'html':
        return node.content;

    case 'footnotes':
        return `<section class="footnotes"><h2>Footnotes</h2><ol>${renderNodesToHtml(node.content)}</ol></section>`;
      
    case 'footnote':
        return `<li id="footnote-${node.attributes.ref}">${node.content} <a href="#footnote-ref-${node.attributes.ref}">↩</a></li>`;


    default:
      return '';
  }
}