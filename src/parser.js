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

// src/parser.js
import Node from './node.js';
import {replaceEmojiShortcodes} from "./utils/emojis.js";

function applyInlineFormatting(line, footnotes) {
  // Detect inline styles and links
  let parsedLine = line
    .replace(/\\([#*`_{}\[\]()\\])/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[\^(\d+)\]/g, (match, ref) => {       // Detect footnote references like `[^1]` in the main text
      // If the footnote exists, link to it and add a superscript with the reference number
      return (!footnotes[ref])?`<sup id="footnote-ref-${ref}"><a href="#footnote-${ref}">[${ref}]</a></sup>`:match})
    .replace(/\^(.+?)\^/g, '<sup>$1</sup>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')          // strikethrough
    .replace(/~(.+?)~/g, '<sub>$1</sub>')            // 
    .replace(/==(.+?)==/g, '<mark>$1</mark>');        // Highlight

  // Handle explicit links `[text](url)`
  if (/\[(.*?)\]\((.*?)\)/g.test(parsedLine)){
    parsedLine = parsedLine.replace(/\[(.*?)\]\((.*?)\)/g, (match, text, url) => {
      return `<a href="${url}" target="_blank">${text}</a>`;
    });
  } else if(/(?<!`)(https?:\/\/[^\s`]+)(?!`)/g.test(parsedLine)){
    // Handle automatic URL linking for plain URLs outside code
    parsedLine = parsedLine.replace(/(?<!`)(https?:\/\/[^\s`]+)(?!`)/g, (url) => {
        return `<a href="${url}" target="_blank">${url}</a>`;
    });
  } else{
    // todooooo
    parsedLine = parsedLine.replace(/`([^`]+)`/g, '<code>$1</code>')
  }

  // Replace emoji shortcodes with actual emojis
  parsedLine = replaceEmojiShortcodes(parsedLine);

  return parsedLine;
}

export function parseMarkdownToNodes(markdown) {
    const lines = markdown.split('\n');
    const nodes = [];
    const footnotes = {}; 
    let listStack = [];
    let codeBlock = false;
    let codeLang = '';
    let persianBlock = false;
    let persianCode = '';
    let currentBlockquote = null;
    let currentIndentLevel = 0;
  
    for (let i = 0; i < lines.length; i++){
      let line = lines[i];
      const indentMatch = line.match(/^(\s*)/);
      const indentLevel = indentMatch ? indentMatch[1].length : 0;
      // Detect code blocks
      if (/^```/.test(line)) {
        if (!codeBlock) {
          codeBlock = true;
          codeLang = line.replace(/^```/, '').trim();
          nodes.push(new Node('codeBlock', [], { lang: codeLang }));
        } else {
          codeBlock = false;
          codeLang = '';
        }
        continue;
      }

      if (codeBlock) {
        nodes[nodes.length - 1].content.push(line);
        continue;
      }

      if (/^\.{3}/.test(line)) {
        const codeMap = {
          "شعر": "poet",
          "شعرنو": "poet",
          "توجه": "note",
          "نکته": "tip",
          "مهم": "important",
          "هشدار": "warning",
          "احتیاط": "caution"
        };
        if (!persianBlock) {
          persianBlock = true;
          
          persianCode = line.replace(/^\.{3}/, '').trim();
          
          if (codeMap[persianCode]) {
            persianCode = codeMap[persianCode]; // Use mapped value
            nodes.push(new Node('persianBlock', [], { code: persianCode }));
          } else {
            nodes.push(new Node('persianBlock', [new Node(persianCode, line)], { code: persianCode }));
          }
        } else {
          persianBlock = false;
        }
        continue;
      }
      
      if (persianBlock) {
        const lastNode = nodes[nodes.length - 1];
      
        if (persianCode === "poet") {
          const cells = line.split(' -- ').map(cell => cell.trim());
          lastNode.content.push(new Node('poetRow', cells.map(cell => cell && new Node('poetCell', cell))));
        } else if (["note", "tip", "important", "warning", "caution"].includes(persianCode)) {
          lastNode.content.push(new Node(persianCode, parseMarkdownToNodes(line)));
        } else {
          lastNode.content.push(new Node(persianCode, line));
        }
        continue;
      }
      
      // Detect blockquotes
      if (/^> /.test(line)) {
        const content = line.replace(/^> /, '').trim();
        if (!currentBlockquote) {
          currentBlockquote = new Node('blockquote', []);
          nodes.push(currentBlockquote);
        }
        currentBlockquote.content.push(...parseMarkdownToNodes(content));
        continue;
      } else {
        currentBlockquote = null;
      }
  
      // Detect headers
      let headerMatch = line.match(/^(#{1,6}) (.*)/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const content =applyInlineFormatting(headerMatch[2], footnotes);
        nodes.push(new Node('header', [new Node('paragraph', content)], { level }));
        continue;
      }
  
      // Detect horizontal rules
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
        nodes.push(new Node('hr'));
        continue;
      }

      // Detect footnote definitions like `[^1]: This is the footnote content`
      const footnoteDefMatch = line.match(/^\[\^(\d+)\]:\s+(.*)$/);
      
      if (footnoteDefMatch) {
          const ref = footnoteDefMatch[1];
          const content = footnoteDefMatch[2];
          footnotes[ref] = content; // Store footnote content
          continue;
      }

      let taskMatch = line.match(/^\s*[-+*] \[( |x)\] (.*)/);
      if (taskMatch) {
            const isChecked = taskMatch[1] === 'x';
            const content = taskMatch[2];
            const isRTL = /^\s*[-+*] \[(?: |x)\]\s*[\u0590-\u05FF\u0600-\u06FF]/u.test(line);           
            const taskNode = new Node('taskItem', parseMarkdownToNodes(content), { checked: isChecked, isRTL });
            if (listStack.length === 0 || listStack[listStack.length - 1].type !== 'ul') {
                const listNode = new Node('ul', [], {isRTL} );
                nodes.push(listNode);
                listStack.push(listNode);
            }
            listStack[listStack.length - 1].content.push(taskNode);
            continue;
      }

      // Detect images
      let imageMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
      if (imageMatch) {
        const alt = imageMatch[1];
        const src = imageMatch[2];
        nodes.push(new Node('image', '', { src, alt }));
        continue;
      }

      if (/^\s*<[^>]+>/.test(line)) {
        nodes.push(new Node('html', line));
        continue;
      }
  
      if (/^\|\s*(.+)\s*\|\s*$/.test(line)) {
        // 1) Collect all consecutive table‐style lines
        const rawRows = [];
        let j = i;
        while (j < lines.length && /^\|\s*(.+)\s*\|\s*$/.test(lines[j])) {
          rawRows.push(lines[j]);
          j++;
        }
      
        // 2) Check if the second row is actually an alignment spec
        let alignments = [];
        if (
          rawRows.length >= 2 &&
          /^\|\s*[:\-]+(?:\s*\|\s*[:\-]+)*\s*\|$/.test(rawRows[1].trim())
        ) {
          // Parse specs: "| :--- | ---: | :---: |"
          alignments = rawRows[1]
            .trim()
            .slice(1, -1)           // drop leading/trailing pipes
            .split('|')             // split into each column spec
            .map(s => s.trim())     // trim whitespace
            .map(spec => {
              const left  = spec.startsWith(':');
              const right = spec.endsWith(':');
              if (left && right) return 'center';
              if (left)           return 'left';
              if (right)          return 'right';
              return 'left';
            });
          rawRows.splice(1, 1);      // remove the spec‐row from the data rows
        }
      
        // 3) Build the table node
        const tableNode = new Node('table', []);
        rawRows.forEach((rowText, rowIdx) => {
          const isHeader = rowIdx === 0 && alignments.length > 0;
          // extract the inner cells string, split & trim
          const cells = rowText.match(/^\|\s*(.+)\s*\|\s*$/)[1]
            .split('|')
            .map(c => c.trim());
      
          const cellNodes = cells.map((text, colIdx) => {
            // parse any inline markdown inside the cell
            const parsedContent = parseMarkdownToNodes(text);
            // decide cell type
            const type = isHeader ? 'tableHeaderCell' : 'tableCell';
            // attach alignment if present
            const attrs = {};
            if (alignments[colIdx]) attrs.align = alignments[colIdx];
            return new Node(type, parsedContent, attrs);
          });
      
          tableNode.content.push(new Node('tableRow', cellNodes));
        });
      
        // 4) Push and advance
        nodes.push(tableNode);
        i = j;      // skip past the entire table block
        continue;
      }
  
      // Detect unordered lists
      if (/^\s*[-*]\s(.*)/.test(line)) {
        const content = line.replace(/^\s*[-*]\s(.*)/, '$1');
        const attributes = {isRTL: /^\s*[-*]\s*[\u0590-\u05FF\u0600-\u06FF]/u.test(line)} 
        const listItemNode = new Node('li', parseMarkdownToNodes(content), attributes);

        // Handle nesting for unordered list
        if (indentLevel > currentIndentLevel) {
            const listNode = new Node('ul', [], attributes);
            if (listStack.length > 0) {
                listStack[listStack.length - 1].content.push(listNode);
            } else {
                nodes.push(listNode);
            }
            listStack.push(listNode);
        } else if (indentLevel < currentIndentLevel) {
            while (listStack.length > 0 && indentLevel < currentIndentLevel) {
                listStack.pop();
                currentIndentLevel -= 4;
            }
        }

        // Add list item to the current list
        if (listStack.length === 0 || listStack[listStack.length - 1].type !== 'ul') {
            const listNode = new Node('ul', [], attributes);
            nodes.push(listNode);
            listStack.push(listNode);
        }
        listStack[listStack.length - 1].content.push(listItemNode);
        currentIndentLevel = indentLevel;
        continue; // Skip to the next line
      }
  
      // Detect ordered lists
      if (/^\s*[0-9\u06F0-\u06F9]+\.\s(.*)/.test(line)) {
        const content = line.replace(/^\s*[0-9\u06F0-\u06F9]+\.\s(.*)/, '$1');
        const attributes = {isRTL: /^\s*[0-9\u06F0-\u06F9]+\.\s*[\u0590-\u05FF\u0600-\u06FF]/u.test(line)} 
        const listItemNode = new Node('li', parseMarkdownToNodes(content), attributes);
        
        
        // Check if a new nested list should be created
        if (indentLevel > currentIndentLevel) {
            // Create new nested ordered list
            const listNode = new Node('ol', [], attributes);
            if (listStack.length > 0) {
                listStack[listStack.length - 1].content.push(listNode);
            } else {
                nodes.push(listNode);
            }
            listStack.push(listNode);
        } else if (indentLevel < currentIndentLevel) {
            // Pop out of nested lists until the right level is reached
            while (listStack.length > 0 && indentLevel < currentIndentLevel) {
                listStack.pop();
                currentIndentLevel -= 4; // Adjust based on indentation
            }
        }

        // Add list item to the current list
        if (listStack.length === 0 || listStack[listStack.length - 1].type !== 'ol') {
            const listNode = new Node('ol', [], attributes);
            nodes.push(listNode);
            listStack.push(listNode);
        }
        listStack[listStack.length - 1].content.push(listItemNode);
        currentIndentLevel = indentLevel;
        continue; // Skip to the next line
      }
  
      // Close any open lists at the end of a non-list line
      while (listStack.length) {
        listStack.pop();
      }

      // Detect inline styles and links
      let parsedLine = applyInlineFormatting(line, footnotes);

      // For paragraph or plain text
      if (line.trim()) {
        nodes.push(new Node('paragraph', parsedLine));
      }
    }
  
    // Close any remaining lists at the end of the document
    while (listStack.length) {
      listStack.pop();
    }

    // Reset indentation level if no list item is found
    currentIndentLevel = 0;
    listStack.length = 0; // Reset the list stack if the line is not a list item


    // Add footnotes as a final section if any footnotes were defined
    if (Object.keys(footnotes).length > 0) {
      const footnoteSection = new Node('footnotes', Object.keys(footnotes).map(ref => {
          return new Node('footnote', footnotes[ref], { ref });
      }));
      nodes.push(footnoteSection);
    }
  
    return nodes;
}
