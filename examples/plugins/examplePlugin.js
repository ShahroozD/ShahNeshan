const examplePlugin = {
    name: "examplePlugin",
    beforeParse: (text) => {
      // Modify raw Markdown text here
      return text;
    },
    nodeTransform: (node) => {
      // Modify specific nodes here
      return node;
    },
    afterParse: (html) => {
      // Modify final HTML output here
      return html;
    }
};

export default examplePlugin;

  