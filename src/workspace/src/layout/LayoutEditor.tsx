import { useState } from 'react';
import { Upload, Download, Plus, Trash2 } from 'lucide-react';

export function LayoutEditor() {
  const [layouts, setLayouts] = useState<Array<{ id: string; name: string; data: any }>>([
    {
      id: '1',
      name: 'Default Layout',
      data: {
        type: 'container',
        children: [
          { type: 'header', text: 'Header' },
          { type: 'content', text: 'Content' },
          { type: 'footer', text: 'Footer' }
        ]
      }
    }
  ]);

  const [selectedLayout, setSelectedLayout] = useState(layouts[0]);
  const [jsonInput, setJsonInput] = useState(JSON.stringify(selectedLayout.data, null, 2));

  const updateLayout = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const updated = { ...selectedLayout, data: parsed };
      setSelectedLayout(updated);
      
      // Save to extension storage
      chrome.runtime.sendMessage({
        type: 'SET_STORAGE',
        data: {
          key: 'layouts',
          value: layouts.map(l => l.id === updated.id ? updated : l)
        }
      });
    } catch (error) {
      alert('Invalid JSON: ' + error);
    }
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-64 border-r p-4 space-y-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Layouts</h3>
          <button className="p-1 hover:bg-accent rounded">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {layouts.map(layout => (
          <div
            key={layout.id}
            onClick={() => {
              setSelectedLayout(layout);
              setJsonInput(JSON.stringify(layout.data, null, 2));
            }}
            className={`p-2 rounded cursor-pointer hover:bg-accent ${
              selectedLayout.id === layout.id ? 'bg-accent' : ''
            }`}
          >
            {layout.name}
          </div>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">{selectedLayout.name}</h2>
          
          <div className="flex gap-2">
            <button className="p-2 hover:bg-accent rounded" title="Import">
              <Upload className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-accent rounded" title="Export">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-accent rounded" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            onBlur={updateLayout}
            className="w-full h-full p-4 bg-background border rounded font-mono text-sm"
          />
        </div>

        <div className="p-4 border-t">
          <button
            onClick={updateLayout}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
          >
            Save Layout
          </button>
        </div>
      </div>
    </div>
  );
}
