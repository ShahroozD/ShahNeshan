


<a id="نسخه-فارسی"></a>
# شه‌نشان

این یک تجزیه‌گر Markdown قابل تنظیم است که می‌تواند با افزونه‌ها و گزینه‌های پیکربندی اضافی گسترش یابد.

[Read the English version](#ShahNeshan)

---

## پیکربندی

شما می‌توانید این کتابخانه را با فراخوانی تابع `configure` با یک شی پیکربندی تنظیم کنید. گزینه‌های موجود به شرح زیر هستند:

- **`customStyles`**: اضافه کردن استایل سفارشی به خروجی.
- **`plugins`**: یک آرایه از افزونه‌ها که می‌توانند عملکرد تجزیه‌گر را گسترش دهند. هر افزونه می‌تواند قلاب‌های زیر را تعریف کند:
  - `beforeParse`: متن خام را قبل از تجزیه تغییر می‌دهد.
  - `nodeTransform`: اعمال تغییرات به هر گره تجزیه شده.
  - `afterParse`: خروجی نهایی را تغییر می‌دهد.

## مثال استفاده

```javascript
import { configure, markdownToOutput } from 'ShahNeshan';

// تنظیم تجزیه‌گر با تنظیمات و افزونه‌های سفارشی
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

const markdown = "# سلام دنیا! :khande:\n";
const output = markdownToOutput(markdown);
console.log(output);
```

## سیستم افزونه‌ها

این کتابخانه از یک سیستم افزونه پشتیبانی می‌کند که به شما اجازه می‌دهد قابلیت‌های اصلی آن را گسترش دهید. هر افزونه می‌تواند قلاب‌های زیر را تعریف کند:

- **`beforeParse`**: متن را به عنوان ورودی می‌پذیرد و متن تغییر یافته را برمی‌گرداند. از این قلاب برای تغییرات متن قبل از تجزیه استفاده کنید.
- **`nodeTransform`**: یک گره تجزیه شده را گرفته و گره تغییر یافته را برمی‌گرداند. ایده‌آل برای تغییرات درون‌خطی، مانند رسیدگی به هایلایت‌ها، ایموجی‌ها یا سایر سینتکس‌های سفارشی.
- **`afterParse`**: خروجی نهایی را می‌پذیرد و یک خروجی تغییر یافته را برمی‌گرداند. مناسب برای اعمال تغییرات کلی پس از رندر اولیه.

### مثال افزونه

```javascript
const emojiPlugin = {
  name: "moreEmoji",
  beforeParse: (text) => text.replace(/:heart:/g, "❤️")
};

// ثبت این افزونه در تجزیه‌گر
configure({
  plugins: [emojiPlugin]
});
```

## استایل پیشرفته

از `customStyles` در پیکربندی استفاده کنید تا سبک‌های CSS سفارشی را به خروجی HTML تزریق کنید.

```javascript
configure({
  customStyles: `
    h1 { font-size: 2em; color: darkgreen; }
    .highlight { background-color: yellow; }
  `
});
```

این امکان را فراهم می‌کند که بدون نیاز به فایل‌های CSS اضافی، ظاهر محتوای رندر شده را کنترل کنید.


</br>
</br>
</br>

<a id="ShahNeshan"></a>
# ShahNeshan

This is a customizable Markdown parser that can be extended with plugins and additional configuration options. 

[مطالعه نسخه فارسی](#نسخه-فارسی)

## Configuration

You can configure the library by calling the `configure` function with a configuration object. Here are the available options:

- **`customStyles`**: Adds custom CSS styles to the rendered HTML output.
- **`plugins`**: An array of plugins that can extend the functionality of the parser. Each plugin can define the following hooks:
  - `beforeParse`: Modify the raw markdown text before parsing.
  - `nodeTransform`: Apply transformations to each parsed node.
  - `afterParse`: Modify the final HTML output.

## Example Usage

```javascript
import { configure, markdownToOutput } from 'ShahNeshan';

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
