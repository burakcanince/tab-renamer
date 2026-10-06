<img src="preview.png"></a>

# Tab Renamer

A Chrome extension that lets you give any tab a custom title, so you can find the tab you need at a glance.

## Features

- Open the popup from the toolbar, type a new title and press Enter or click "Rename tab".
- Click "Reset" in the popup to bring back the tab's original title.
- The new title is re-applied when the page reloads, until the tab is closed.
- No account or setup needed. Titles are kept in Chrome's session storage and are cleared when the tab closes.

## Tech stack

React 19, TypeScript, Tailwind CSS 4 and Vite 7, built for Manifest V3.

## Development

```bash
pnpm install
pnpm build
```

## Project structure

```
manifest.json      Extension manifest
src/App.tsx        Popup UI
src/background.js  Service worker that re-applies saved titles after reloads
public/            Extension icons

```
## License

MIT
