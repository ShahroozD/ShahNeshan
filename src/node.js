// src/node.js

class Node {
  constructor(type, content = '', attributes = {}) {
    this.type = type;
    this.content = content;
    this.attributes = attributes;
  }
}
  
export default Node;
  