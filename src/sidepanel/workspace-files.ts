import type { FileSystemTree } from '@webcontainer/api';

export function getWorkspaceFiles(): FileSystemTree {
  return {
    'package.json': {
      file: {
        contents: JSON.stringify({
          name: 'workspace',
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview'
          },
          dependencies: {
            'react': '^18.3.1',
            'react-dom': '^18.3.1',
            'tldraw': '^2.4.0',
            '@tldraw/assets': '^2.4.0',
            'lucide-react': '^0.462.0',
            'clsx': '^2.1.1',
            'tailwind-merge': '^2.5.5',
            'class-variance-authority': '^0.7.1',
            '@radix-ui/react-slot': '^1.1.1',
            '@radix-ui/react-tabs': '^1.1.1',
            '@radix-ui/react-dialog': '^1.1.2',
            '@radix-ui/react-select': '^2.1.2',
            'react-force-graph-2d': '^1.25.4',
            'd3-force': '^3.0.0'
          },
          devDependencies: {
            '@types/react': '^18.3.12',
            '@types/react-dom': '^18.3.1',
            '@vitejs/plugin-react': '^4.3.3',
            'typescript': '^5.7.2',
            'vite': '^6.0.3',
            'tailwindcss': '^3.4.17',
            'autoprefixer': '^10.4.20',
            'postcss': '^8.4.49'
          }
        }, null, 2)
      }
    },
    'vite.config.ts': {
      file: {
        contents: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
});
`
      }
    },
    'tailwind.config.js': {
      file: {
        contents: `export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        }
      }
    }
  },
  plugins: []
};
`
      }
    },
    'postcss.config.js': {
      file: {
        contents: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
`
      }
    },
    'tsconfig.json': {
      file: {
        contents: JSON.stringify({
          compilerOptions: {
            target: 'ES2020',
            useDefineForClassFields: true,
            lib: ['ES2020', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            skipLibCheck: true,
            moduleResolution: 'bundler',
            allowImportingTsExtensions: true,
            isolatedModules: true,
            moduleDetection: 'force',
            noEmit: true,
            jsx: 'react-jsx',
            strict: true
          },
          include: ['src']
        }, null, 2)
      }
    },
    'index.html': {
      file: {
        contents: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Assistant Workspace</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
`
      }
    },
    'src': {
      directory: {
        'main.tsx': {
          file: {
            contents: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
          }
        },
        'App.tsx': {
          file: {
            contents: `import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { TldrawCanvas } from './canvas/TldrawCanvas';
import { KnowledgeGraph } from './graph/KnowledgeGraph';
import { KrokiPreview } from './kroki/KrokiPreview';
import { LayoutEditor } from './layout/LayoutEditor';
import { Assistant } from './assistant/Assistant';

export default function App() {
  const [activeTab, setActiveTab] = useState('canvas');

  return (
    <div className="h-screen w-full bg-background text-foreground">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="w-full justify-start border-b rounded-none bg-background">
          <TabsTrigger value="canvas">Canvas</TabsTrigger>
          <TabsTrigger value="graph">Knowledge Graph</TabsTrigger>
          <TabsTrigger value="kroki">Diagrams</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="assistant">Assistant</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="canvas" className="h-full m-0">
            <TldrawCanvas />
          </TabsContent>

          <TabsContent value="graph" className="h-full m-0">
            <KnowledgeGraph />
          </TabsContent>

          <TabsContent value="kroki" className="h-full m-0">
            <KrokiPreview />
          </TabsContent>

          <TabsContent value="layout" className="h-full m-0">
            <LayoutEditor />
          </TabsContent>

          <TabsContent value="assistant" className="h-full m-0">
            <Assistant />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
`
          }
        },
        'index.css': {
          file: {
            contents: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --border: 217.2 32.6% 17.5%;
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
}
`
          }
        }
      }
    }
  };
}
