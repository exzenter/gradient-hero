# Hero Gradient

Beautiful animated gradient backgrounds for your WordPress blocks with full customization and nested content support.

## Features

- 🎨 Animated gradient backgrounds with customizable colors
- ⚡ Configurable animation speed and direction
- 📐 SVG grid overlay patterns
- 🧩 Full block editor integration
- 📦 Nested content support (add any blocks inside)
- 📱 Responsive design

## Installation

1. Download the latest release from [GitHub](https://github.com/exzenter/gradient-hero)
2. Upload the `hero-gradient` folder to `/wp-content/plugins/`
3. Activate the plugin in WordPress
4. Search for "Hero Gradient" in the block editor

## Plugin Structure

```
hero-gradient/                    ← WordPress plugin root (can be zipped/deployed)
├── hero-gradient.php             ← Main plugin file (registers everything)
├── readme.txt                    ← WordPress.org readme
├── package.json                  ← npm config & build scripts
├── src/                          ← SOURCE CODE (you edit this)
│   ├── hero-gradient/            ← Block source files
│   │   ├── block.json            ← Block metadata
│   │   ├── index.js              ← Block registration
│   │   ├── edit.js               ← Editor component
│   │   ├── save.js               ← Save output
│   │   ├── render.php            ← Server-side render
│   │   ├── view.js               ← Frontend JS
│   │   ├── editor.scss           ← Editor styles
│   │   └── style.scss            ← Frontend styles
│   └── extensions/               ← Block extensions
└── build/                        ← COMPILED OUTPUT (auto-generated)
    ├── blocks-manifest.php       ← Auto-generated block registry
    └── hero-gradient/            ← Compiled block assets
        ├── index.js              ← Bundled editor JS
        ├── view.js               ← Bundled frontend JS
        ├── index.css             ← Compiled editor CSS
        ├── style-index.css       ← Compiled frontend CSS
        └── render.php            ← Copied from src
```

## Build Commands

| Command | What it does |
|---------|-------------|
| `npm run start` | **Dev mode** – watches files and rebuilds on changes |
| `npm run build` | **Production build** – compiles and minifies everything |
| `npm run plugin-zip` | Creates `hero-gradient.zip` for distribution |

## How the Build Process Works

The plugin uses `@wordpress/scripts` for building:

1. **Reads `src/*/block.json`** – finds all blocks
2. **Compiles JS** – bundles React/JSX from `edit.js`, `save.js`, `index.js`
3. **Compiles SCSS → CSS** – converts `.scss` files to `.css`
4. **Copies PHP** – moves `render.php` to `build/`
5. **Generates manifest** – creates `build/blocks-manifest.php` for WordPress to load

## Development

```bash
# Install dependencies
npm install

# Start development mode (watches for changes)
npm run start

# Build for production
npm run build

# Create distributable zip
npm run plugin-zip
```

## Requirements

- WordPress 6.7+
- PHP 7.4+

## License

GPL-2.0-or-later

## Author

[Exzent.de](https://exzent.de)
