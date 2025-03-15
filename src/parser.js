// src/parser.js
import Node from './node.js';
import {replaceEmojiShortcodes} from "./utils/emojis.js";

function applyInlineFormatting(line) {
  // Apply emoji shortcode replacements
  return replaceEmojiShortcodes(
    line
    .replace(/\\([#*`_{}\[\]()\\])/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[\^(\d+)\]/g, (match, ref) => `<sup id="footnote-ref-${ref}"><a href="#footnote-${ref}">[${ref}]</a></sup>`)
    .replace(/\^(.+?)\^/g, '<sup>$1</sup>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    .replace(/~(.+?)~/g, '<sub>$1</sub>')
    .replace(/==(.+?)==/g, '<mark>$1</mark>')
    .replace(/\[(.*?)\]\(([^()\s]+(?:\([^\s)]+\))*[^()\s]*)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/(?<!`)(https?:\/\/[^\s`]+)(?!`)/g, '<a href="$1" target="_blank">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
  );
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
    let footnoteIndex = 1; // Counter for footnotes
  
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
          if (!["note", "tip", "important", "warning", "caution"].includes(persianCode)) {
            nodes[nodes.length - 1].content.push(new Node(persianCode, line))
          };
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
        const content =applyInlineFormatting(headerMatch[2]);
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
            const taskNode = new Node('taskItem', parseMarkdownToNodes(content), { checked: isChecked });
            if (listStack.length === 0 || listStack[listStack.length - 1].type !== 'ul') {
                const listNode = new Node('ul', []);
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
  
      let tableRowMatch = line.match(/^\|(.+)\|$/);
      if (tableRowMatch) {
          const tableNode = new Node('table', []);
          let isFirstRow = true;

          while (tableRowMatch) {
              const cells = tableRowMatch[1].split('|').map(cell => cell.trim());

              // Check if this is the first row
              if (isFirstRow) {
                  tableNode.content.push(new Node('tableRow', cells.map(cell => new Node('tableCell', cell))));
              } else {
                  tableNode.content.push(new Node('tableRow', cells.map(cell => new Node('tableCell', cell))));
              }

              // Advance to the next line
              line = lines[++i] || '';
              
              // Check if the next line is a row of '--' or '==' (header underline)
              if(isFirstRow){
                isFirstRow = false;
                if (/^\|\s*[-=]+\s*\|(\s*[-=]+\s*\|)*$/.test(line.trim())) {
                  
                    // Convert the first row's cells to header cells if underline is detected
                    tableNode.content[0].content = tableNode.content[0].content.map(cell => {
                        cell.type = 'tableHeaderCell'; // Change cell type to indicate header
                        return cell;
                    });
                    line = lines[++i] || ''; // Skip the underline line
                }
              }
              
              tableRowMatch = line.match(/^\|(.+)\|$/);
          }

          nodes.push(tableNode);
          continue;
      }
  
      // Detect unordered lists
      if (/^\s*[-*]\s(.*)/.test(line)) {
        const content = line.replace(/^\s*[-*]\s(.*)/, '$1');
        const listItemNode = new Node('li', parseMarkdownToNodes(content));

        // Handle nesting for unordered list
        if (indentLevel > currentIndentLevel) {
            const listNode = new Node('ul', []);
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
            const listNode = new Node('ul', []);
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
        const listItemNode = new Node('li', parseMarkdownToNodes(content));
        
        
        // Check if a new nested list should be created
        if (indentLevel > currentIndentLevel) {
            // Create new nested ordered list
            const listNode = new Node('ol', []);
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
            const listNode = new Node('ol', []);
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
      let parsedLine = applyInlineFormatting(line);

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
