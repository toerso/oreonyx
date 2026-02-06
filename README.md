# oreonyx

> A UI module bundler helper for React and vanilla JavaScript

**oreonyx** is a simplified module bundler and code compilation helper that streamlines JavaScript bundling for both client-side rendering (CSR) and server-side rendering (SSR) applications. It provides an abstraction layer over webpack, eliminating the need for manual configuration.

## Features

- ✨ Zero webpack configuration required
- ⚛️ React and vanilla JavaScript support
- 🔄 Client-side and server-side rendering
- 🚀 Built-in development server
- 📦 Automatic asset bundling
- 🎯 Simple API interface

## Installation

```bash
npm install @oreodusk/oreonyx --save-dev
```

or

```bash
yarn add @oreodusk/oreonyx -D
```

## Quick Start

### Prerequisites

Before using **oreonyx**, create the following files in your project root directory:

1. **`nyx.browser.js`** (required for CSR)
2. **`nyx.server.js`** (optional, only needed for SSR)
3. **`template.html`** (required)

### Basic Setup

#### Client-Side Rendering (CSR)

Create a `nyx.browser.js` file:

```javascript
const { BrowserApi } = require("@oreodusk/oreonyx");

module.exports = BrowserApi
    .entry("./view/js/browser.js")
    .setHost("http://localhost:5050")
    .setMode("development")
    .run();
```

#### Server-Side Rendering (SSR)

Create a `nyx.server.js` file:

```javascript
const { ServerApi } = require("@oreodusk/oreonyx");

module.exports = ServerApi
    .entry("./view/js/server.js")
    .setHost("http://localhost:5050")
    .setMode("development")
    .run();
```

## API Reference

### BrowserApi

The `BrowserApi` handles client-side bundling and provides options for controlling the output markup.

#### Basic Usage

```javascript
const { BrowserApi } = require("@oreodusk/oreonyx");

module.exports = BrowserApi
    .entry("./path/to/entry.js")
    .setHost("http://localhost:5050")
    .setMode("development")
    .run();
```

#### Advanced Configuration

You can customize the markup generation and enable the development server:

```javascript
const { BrowserApi } = require("@oreodusk/oreonyx");

const props = {
  markUpControl: {
    ext: "html", // Options: 'html' or 'php'
    dir: "dist", // Options: 'self' or 'dist'
  },
  devServer: true, // Enable development server
};

module.exports = BrowserApi
    .entry("./view/js/browser.js")
    .setHost("http://localhost:5050")
    .setMode("development")
    .run(props);
```

#### Configuration Options

| Property            | Type      | Default | Description                                                                |
| ------------------- | --------- | ------- | -------------------------------------------------------------------------- |
| `markUpControl.ext` | `string`  | `php`   | Output file extension (`html` or `php`)                                    |
| `markUpControl.dir` | `string`  | `self`  | Output directory (`self` for entry directory, `dist` for public directory) |
| `devServer`         | `boolean` | `false` | Enable development server                                                  |

**Note:** By default, oreonyx generates markup with a `.php` extension in the current/entry directory.

### ServerApi

The `ServerApi` handles server-side bundling for SSR applications.

```javascript
const { ServerApi } = require("@oreodusk/oreonyx");

module.exports = ServerApi
    .entry("./view/js/server.js")
    .setHost("http://localhost:5050")
    .setMode("development")
    .run();
```

## CLI Commands

**oreonyx** includes a command-line tool called `nyx` for convenient bundling operations.

### Setup

Add the following scripts to your app's `package.json`:

```json
{
  "scripts": {
    "build:dev": "nyx build dev",
    "build:ssr": "nyx ssr dev",
    "build:csr": "nyx csr dev",
    "serve": "nyx csr dev --serve",
    "build:ssr:watch": "nyx ssr dev --watch",
    "build:csr:watch": "nyx csr dev --watch",
    "build:prod": "nyx build prod"
  }
}
```

### Available Commands

| Command                   | Description                                      |
| ------------------------- | ------------------------------------------------ |
| `npm run build:dev`       | Bundle both CSR and SSR code in development mode |
| `npm run build:ssr`       | Bundle only SSR code in development mode         |
| `npm run build:csr`       | Bundle only CSR code in development mode         |
| `npm run serve`           | Bundle CSR code and start development server     |
| `npm run build:ssr:watch` | Bundle SSR code in watch mode (development)      |
| `npm run build:csr:watch` | Bundle CSR code in watch mode (development)      |
| `npm run build:prod`      | Bundle both CSR and SSR code in production mode  |

## Project Structure Example

```
your-project/
├── view/
│   └── js/
│       ├── browser.js
│       └── server.js
├── public/
├── nyx.browser.js
├── nyx.server.js
├── template.html
└── package.json
```

## Development Workflow

### For CSR Only

1. Create `nyx.browser.js` and `template.html`
2. Run `npm run serve` for development with hot reload
3. Run `npm run build:prod` for production build

### For SSR

1. Create both `nyx.browser.js` and `nyx.server.js`
2. Create `template.html`
3. Run `npm run build:dev` for development
4. Run `npm run build:prod` for production build

### Watch Mode

Use watch mode during development for automatic rebuilding:

```bash
# For CSR
npm run build:csr:watch

# For SSR
npm run build:ssr:watch
```

## Modes

**oreonyx** supports two bundling modes:

- **`development`**: Unminified code with source maps for debugging
- **`production`**: Minified and optimized code for deployment

## Contributing

We welcome contributions to **oreonyx**! Here's how you can help:

### Reporting Issues

- Check if the issue already exists in the [Issues](../../issues) section
- Provide a clear description of the problem
- Include steps to reproduce the issue
- Share your environment details (Node version, OS, etc.)

### Submitting Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add some feature'`)
6. Push to the branch (`git push origin feature/your-feature-name`)
7. Open a Pull Request

### Development Setup

```bash
# Create projects directory
mkdir ~/projects

# Go to projects directory
cd ~/projects

# Clone the repository
git clone https://github.com/toerso/oreonyx.git

# Go to projects/oreonyx library directory
cd ~/projects/oreonyx

# Install dependencies
npm install

#  Link oreonyx globally(Create a symlink)
npm link

# In your application project
cd ~/projects/my-app
npm link oreonyx

```

### Code Style

- Follow the existing code style
- Write clear, descriptive commit messages
- Add comments for complex logic
- Update documentation as needed

## Support

### Getting Help

- **Documentation**: Check this README for usage instructions
- **Issues**: Open an [issue](../../issues) for bugs or feature requests
- **Discussions**: Use [Discussions](../../discussions) for questions and ideas

### Frequently Asked Questions

**Q: Do I need both `nyx.browser.js` and `nyx.server.js`?**  
A: Only if you're using SSR. For CSR-only projects, you just need `nyx.browser.js`.

**Q: What Node.js version is required?**  
A: Node.js 12.x or higher is recommended.

**Q: Can I use this with TypeScript?**  
A: Currently, oreonyx is designed for JavaScript projects. TypeScript support may be added in future versions.

### Community

- Star ⭐ this repository if you find it helpful
- Share your projects built with oreonyx
- Spread the word!

## License

MIT © [oreodusk](https://github.com/oreodusk)

---

Made with ❤️ for the JavaScript community by [Topu/Toerso](https://www.linkedin.com/in/toputoerso/)
