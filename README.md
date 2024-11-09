# ShahMark

This is a customizable Markdown parser that can be extended with plugins and additional configuration options. 

## Configuration

You can configure the library by calling the `configure` function with a configuration object. Here are the available options:

- **`customStyles`**: Adds custom CSS styles to the rendered HTML output.
- **`plugins`**: An array of plugins that can extend the functionality of the parser. Each plugin can define the following hooks:
  - `beforeParse`: Modify the raw markdown text before parsing.
  - `nodeTransform`: Apply transformations to each parsed node.
  - `afterParse`: Modify the final HTML output.

## Example Usage

```javascript
import { configure, markdownToOutput } from 'shahmark';

// Configure the parser with custom settings and plugins
configure({
  customStyles: `
    h1 { color: blue; }
    mark { background-color: yellow; }
  `,
  plugins: [
    {
      name: "moreEmoji",
      beforeParse: (text) => text.replace(/:khande:/g, "😊")
    }
  ]
});

const markdown = "# Hello World! :khande:\n";
const output = markdownToOutput(markdown);
console.log(output);
```

## Plugin System

This library supports a plugin system that lets you extend its core functionality. Each plugin can define the following hooks:

- **`beforeParse`**: Accepts the markdown text as input and returns modified text. Use this for text transformations before parsing.
- **`nodeTransform`**: Takes a parsed node and returns a transformed node. Ideal for inline transformations, like handling highlights, emojis, or other custom syntax.
- **`afterParse`**: Accepts the final HTML output and returns modified HTML. Useful for applying global transformations after the initial render.

### Example Plugin

```javascript
const emojiPlugin = {
  name: "moreEmoji",
  beforeParse: (text) => text.replace(/:heart:/g, "❤️")
};

// Register this plugin with the parser
configure({
  plugins: [emojiPlugin]
});
```

## Advanced Styling

Use `customStyles` in the configuration to inject custom CSS styles into the HTML output. 

```javascript
configure({
  customStyles: `
    h1 { font-size: 2em; color: darkgreen; }
    .highlight { background-color: yellow; }
  `
});
```

This makes it easy to control the appearance of the rendered content without additional CSS files.
