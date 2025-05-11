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

// src/node.js

class Node {
  constructor(type, content = '', attributes = {}, raw = '') {
    this.type = type;
    this.content = content;
    this.attributes = attributes;
    this.raw = raw;
  }
}
  
export default Node;
  