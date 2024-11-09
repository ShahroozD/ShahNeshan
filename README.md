## Configuration

You can configure the library by calling the `configure` function with a configuration object. Available options:

- `headingLevel`: (default: `1`) Sets the default heading level.
- `outputFormat`: (default: `'html'`) Determines the output format, currently only `'html'` is supported.

### Example Usage

```javascript
import { configure, markdownToOutput } from 'markdown-parser';

configure({
  headingLevel: 2,
  outputFormat: 'html'
});

const markdown = "# Hello World!";
const output = markdownToOutput(markdown);
console.log(output);
```

