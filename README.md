# Chrome Assistant Workspace

> Chrome MV3 Extension: AI Assistant with React + Vite + WebContainer, tldraw canvas, knowledge graph, DevTools MCP, and kroki diagrams

## 🎯 Features

- **WebContainer Integration**: Full React + Vite dev environment inside Side Panel with HMR
- **tldraw Canvas**: Infinite canvas for visual thinking and diagrams
- **Knowledge Graph**: Visual representation of concepts and relationships
- **Layout Editor**: JSON/YAML visual editor for configurations
- **Kroki Preview**: Real-time diagram rendering (PlantUML, Mermaid, GraphViz, etc.)
- **DevTools MCP**: Model Context Protocol integration for AI tooling
- **AI Assistant**: Built-in conversational interface
- **Service Worker**: API proxy, storage management, messaging bridge
- **Context Menus**: Quick access to features from any webpage

## 🏗️ Architecture

```
chrome-assistant-workspace/
├── src/
│   ├── service-worker/       # Background service worker
│   │   ├── index.ts
│   │   ├── api-proxy.ts
│   │   ├── storage.ts
│   │   └── messaging.ts
│   ├── sidepanel/           # WebContainer host
│   │   ├── index.html
│   │   ├── host.ts          # WebContainer bootstrap
│   │   └── styles.css
│   ├── content/             # Content scripts
│   │   └── index.ts
│   └── workspace/           # Virtual FS for WebContainer
│       ├── package.json
│       ├── vite.config.ts
│       ├── tailwind.config.js
│       ├── index.html
│       └── src/
│           ├── main.tsx
│           ├── App.tsx
│           ├── components/  # shadcn/ui components
│           ├── canvas/      # tldraw integration
│           ├── graph/       # Knowledge graph viewer
│           ├── kroki/       # Kroki preview
│           ├── layout/      # Layout editor
│           ├── mcp/         # DevTools MCP client
│           └── lib/         # Utilities
├── manifest.json
├── vite.config.ts
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Chrome/Chromium 120+

### Installation

```bash
# Clone repository
git clone https://github.com/pv-udpv/chrome-assistant-workspace.git
cd chrome-assistant-workspace

# Install dependencies
npm install

# Build extension
npm run build

# Development mode (watch)
npm run dev
```

### Load Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder

### Usage

1. Click the extension icon in toolbar
2. Side panel opens with WebContainer workspace
3. Wait for Vite dev server to start
4. Enjoy instant HMR and full React development experience

## 📦 Technology Stack

### Extension Layer

- **Chrome MV3**: Latest manifest v3 with side panel support
- **TypeScript**: Type-safe development
- **Vite**: Fast build and bundling

### WebContainer Layer

- **@webcontainer/api**: In-browser Node.js runtime
- **React 18**: UI framework with concurrent features
- **Vite**: Dev server with HMR
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: High-quality React components

### Features

- **tldraw**: Infinite canvas library
- **react-force-graph**: Knowledge graph visualization
- **Kroki**: Universal diagram renderer
- **Lucide Icons**: Beautiful icon set

## 🔧 Configuration

### Service Worker

The service worker handles:

- API requests without CORS restrictions
- IndexedDB storage management
- Message passing between extension components
- Graph and layout persistence

### WebContainer Virtual FS

All React app files are mounted into WebContainer virtual filesystem at runtime, enabling:

- Full npm package installation
- Vite dev server with HMR
- TypeScript compilation
- Tailwind CSS processing

## 🎨 Components

### tldraw Canvas

Infinite whiteboard with:

- Drawing tools
- Shapes and arrows
- Text annotations
- Export to PNG/SVG

### Knowledge Graph

Visualize concepts and relationships:

- Force-directed layout
- Interactive nodes
- Zoom and pan
- Export to JSON

### Kroki Preview

Supports:

- PlantUML
- Mermaid
- GraphViz
- BPMN
- And 20+ more formats

### Layout Editor

Visual editor for:

- JSON schemas
- YAML configurations
- UI layouts

## 🔌 DevTools MCP

Model Context Protocol integration for AI-assisted development:

- Code generation
- Refactoring suggestions
- Documentation generation
- Test creation

## 📝 License

MIT License - see LICENSE file

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🐛 Known Issues

- WebContainer requires HTTPS in production
- Some npm packages may not work in browser environment
- File system is ephemeral (resets on extension reload)

## 🗺️ Roadmap

- [ ] Persistent file system (IndexedDB-backed)
- [ ] GitHub integration for saving projects
- [ ] Multi-tab workspace support
- [ ] Collaborative editing
- [ ] Plugin system for custom tools
- [ ] Export workspace as standalone web app

## 📚 Resources

- [Chrome Extension MV3 Docs](https://developer.chrome.com/docs/extensions/mv3/)
- [WebContainer API](https://webcontainers.io/)
- [tldraw Documentation](https://tldraw.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Kroki Documentation](https://kroki.io/)

---

**Made with ❤️ for developers who love building tools**
