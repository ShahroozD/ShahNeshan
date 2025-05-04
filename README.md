


<a id="نسخه-فارسی"></a>
# شه‌نشان (ShahNeshan)

این یک تجزیه‌گر Markdown قابل تنظیم است که می‌تواند با افزونه‌ها و گزینه‌های پیکربندی گسترش یابد.

[Read the English version](#ShahNeshan)

---

## استفاده در مرورگر (CDN)

برای استفاده مستقیم در مرورگر بدون نصب از طریق npm:

```html
<script src="https://cdn.example.com/shahneshan.umd.js"></script>
<script>
  const markdown = '# سلام دنیا!';
  const html = shahneshan.markdownToOutput(markdown);
  document.body.innerHTML = html;
</script>
````

---

## پیکربندی و استفاده

شما می‌توانید این کتابخانه را با فراخوانی تابع `configure` تنظیم و سفارشی‌سازی کنید. به عنوان مثال:

```javascript
shahneshan.configure({
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

const html = shahneshan.markdownToOutput('# سلام! :khande:');
```

---

## مجوز

از سال ۲۰۲۵ به بعد، این پروژه تحت مجوز GNU GPLv3 منتشر می‌شود.

</br>
</br>
</br>

<a id="ShahNeshan"></a>

# ShahNeshan

A customizable Markdown parser that supports plugins and configuration.

[مطالعه نسخه فارسی](#نسخه-فارسی)

---

## Usage via CDN

To use ShahNeshan directly in a browser via CDN (no build tools required):

```html
<script src="https://cdn.example.com/shahneshan.umd.js"></script>
<script>
  const markdown = '# Hello, world!';
  const html = shahneshan.markdownToOutput(markdown);
  document.body.innerHTML = html;
</script>
```

The library is exposed globally as `shahneshan`.

---

## Installation (npm)

```bash
npm install shahneshan
```

---

## Configuration

You can configure the parser using `configure()`:

```javascript
import { configure, markdownToOutput } from 'shahneshan';

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

const html = markdownToOutput('# Hello! :khande:');
```

---

## Plugin System

Each plugin can define the following hooks:

* `beforeParse(text)`
* `nodeTransform(node)`
* `afterParse(html)`

Example:

```javascript
const emojiPlugin = {
  name: "moreEmoji",
  beforeParse: (text) => text.replace(/:heart:/g, "❤️")
};

configure({ plugins: [emojiPlugin] });
```

---

## Custom Styles

Use `customStyles` in configuration:

```javascript
configure({
  customStyles: `
    h1 { font-size: 2em; color: darkgreen; }
    .highlight { background-color: yellow; }
  `
});
```

---

## License

Originally licensed under MIT, this project is now released under the [GNU GPLv3](LICENSE).
