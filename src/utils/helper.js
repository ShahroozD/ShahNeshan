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



// add this above all your .replace() calls:
export function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
}


export function stripInlineMarkdown(str) {
    return str
      // 1) Un-escape any escaped punctuation (`\*` → `*`), so we don’t leave backslashes behind
      .replace(/\\([\\`*_{}\[\]()#+\-.!>])/g, '$1')
  
      // 2) Remove images entirely: ![alt](url)
      .replace(/!\[.*?\]\(.*?\)/g, '')
  
      // 3) Convert links [text](url) → text
      .replace(/\[([^\]]+?)\]\(.*?\)/g, '$1')
  
      // 4) Strip bold: **text** and __text__ → text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
  
      // 5) Strip italics: *text* and _text_ → text
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/_(.+?)_/g, '$1')
  
      // 6) Strip strikethrough and highlight
      .replace(/~~(.+?)~~/g, '$1')
      .replace(/==(.+?)==/g, '$1')
  
      // 7) Strip inline code: `code` → code
      .replace(/`([^`]+?)`/g, '$1')
  
      // 8) Remove footnote markers [^1]
      .replace(/\[\^\d+\]/g, '')
  
      // 9) Remove ATX heading markers (“# Heading” → “Heading”)
      .replace(/^#{1,6}\s*(.+)$/gm, '$1')
  
      // 10) Remove blockquote markers (“> quote” → “quote”)
      .replace(/^\s*>+\s?/gm, '')
  
      // 11) Remove any leftover Markdown punctuation you don’t want
      //    (adjust the character class as needed)
      .replace(/[*_~`>#\[\]\(\)\-!]/g, '')
  
      // 12) Finally, collapse any duplicate spaces
      .replace(/\s{2,}/g, ' ')
      .trim();
}