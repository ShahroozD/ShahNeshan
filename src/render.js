/* 
This file is part of Shahneshan.

Copyright (C) 2024 shahrooz saneidarani (github.com/shahroozD)

Shahneshan is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Shahneshan is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { escapeHtml } from "./utils/helper.js";

// src/render.js

export function renderNodesToHtml(nodes) {
    return nodes.map(node => nodeToHtml(node)).join('');
}

function nodeToHtml(node) {
  switch (node.type) {
    case 'header':
      return `<h${node.attributes.level} id="${node.raw.toLowerCase().replace(/\s+/g, '-')}">${renderNodesToHtml(node.content)}</h${node.attributes.level}>`;
      
    case 'paragraph':
      return `<p dir='auto' >${node.content}</p>`;
      
    case 'blockquote':
      return `<blockquote>${renderNodesToHtml(node.content)}</blockquote>`;
      
    case 'ul':
      return `<ul dir='${node.attributes.isRTL?'rtl':'ltr'}'>${renderNodesToHtml(node.content)}</ul>`;
      
    case 'ol':
      return `<ol dir='${node.attributes.isRTL?'rtl':'ltr'}'>${renderNodesToHtml(node.content)}</ol>`;
      
    case 'li':
      return `<li dir='${node.attributes.isRTL?'rtl':'ltr'}'>${renderNodesToHtml(node.content)}</li>`;
      
    case 'codeBlock':
      const code = node.content.join('\n');
      return `<pre><code class="${node.attributes.lang}">${escapeHtml(code)}</code></pre>`;
    
    case 'persianBlock':
      return `<div class="persian ${node.attributes.code}">${renderNodesToHtml(node.content)}</div>`;
    
    case 'poetRow':
        return `${renderNodesToHtml(node.content)}`;
    
    case 'poetCell':
        return `<div class="stanza">${node.content}</div>`;
  
    case 'note':
      return `<div class="alert note"><h1>توجه</h1><p>${renderNodesToHtml(node.content)}</p></div>`;
    
    case 'tip':
      return `<div class="alert tip"><h1>نکته</h1><p>${renderNodesToHtml(node.content)}</p></div>`;

    case 'important':
      return `<div class="alert important"><h1>مهم</h1><p>${renderNodesToHtml(node.content)}</p></div>`;
    
    case 'warning':
      return `<div class="alert warning"><h1>هشدار</h1><p>${renderNodesToHtml(node.content)}</p></div>`;
    
    case 'caution':
      return `<div class="alert caution"><h1>احتیاط</h1><p>${renderNodesToHtml(node.content)}</p></div>`;

    case 'hr':
      return `<hr />`;
    
    case 'taskItem':
        return `<li dir='${node.attributes.isRTL?'rtl':'ltr'}' class="task"><input type="checkbox" ${node.attributes.checked ? 'checked' : ''} disabled> ${renderNodesToHtml(node.content)}</li>`;
    
    case 'table':
        return `<table>${renderNodesToHtml(node.content)}</table>`;
    
    case 'tableRow':
        return `<tr>${renderNodesToHtml(node.content)}</tr>`;      
    
    case 'tableHeaderCell':
        return `<th align="${node.attributes.align}">${renderNodesToHtml(node.content)}</th>`;
    
    case 'tableCell':
        return `<td align="${node.attributes.align}">${renderNodesToHtml(node.content)}</td>`;
    
    case 'image':
      return `<img src="${node.attributes.src}" alt="${node.attributes.alt}">`;

    case 'html':
        return node.content;

    case 'footnotes':
        return `<section dir='auto' class="footnotes"><h2>Footnotes</h2><ol>${renderNodesToHtml(node.content)}</ol></section>`;
      
    case 'footnote':
        return `<li id="footnote-${node.attributes.ref}">${node.content} <a href="#footnote-ref-${node.attributes.ref}">↩</a></li>`;
    
    default:
      if(node.content) return `\n${node.content}\n` 
      else return ""; 
  }
}