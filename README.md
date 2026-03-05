# homeRoughEditor v0.96s (SN0WM4N)

> See NOTES.MD for a full description of the development process.

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

Outputs a minified bundle to `dist/bundle.js`.

The build process:
1. Minifies and concatenates the dynamic scripts (`mousewheel.js`, `func.js`, `qSVG.js`, `editor.js`, `engine.js`)
2. Bundles `editor-element.js` with esbuild
3. Removes all comments

## Usage

Add the script to your HTML and use the `<editor-element>` tag:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script type="module" src="./dist/bundle.js"></script>
</head>
<body>
  <editor-element
    mode="edition"
    sketch-id="your-sketch-id"
    sketch-version="1.0"
  ></editor-element>
</body>
</html>
```