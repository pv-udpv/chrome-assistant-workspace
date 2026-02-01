import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

type DiagramType = 'plantuml' | 'mermaid' | 'graphviz' | 'blockdiag';

export function KrokiPreview() {
  const [diagramType, setDiagramType] = useState<DiagramType>('plantuml');
  const [source, setSource] = useState(`@startuml
Alice -> Bob: Hello
Bob -> Alice: Hi!
@enduml`);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const generateDiagram = async () => {
    try {
      setError('');
      
      // Encode diagram source
      const encoded = btoa(unescape(encodeURIComponent(source)));
      const url = `https://kroki.io/${diagramType}/svg/${encoded}`;
      
      // Proxy through service worker to avoid CORS
      const response = await chrome.runtime.sendMessage({
        type: 'API_REQUEST',
        data: { url }
      });

      if (response.success) {
        // Create blob URL from SVG data
        const blob = new Blob([response.data], { type: 'image/svg+xml' });
        const blobUrl = URL.createObjectURL(blob);
        setImageUrl(blobUrl);
      } else {
        setError(response.error || 'Failed to generate diagram');
      }
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b space-y-4">
        <div className="flex gap-2">
          <select
            value={diagramType}
            onChange={(e) => setDiagramType(e.target.value as DiagramType)}
            className="px-3 py-2 bg-background border rounded"
          >
            <option value="plantuml">PlantUML</option>
            <option value="mermaid">Mermaid</option>
            <option value="graphviz">GraphViz</option>
            <option value="blockdiag">BlockDiag</option>
          </select>
          
          <button
            onClick={generateDiagram}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
          >
            Generate
          </button>
        </div>

        <textarea
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full h-32 p-3 bg-background border rounded font-mono text-sm"
          placeholder="Enter diagram source..."
        />
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-500">{error}</span>
        </div>
      )}

      <div className="flex-1 overflow-auto p-4">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Generated diagram" 
            className="max-w-full h-auto"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Enter diagram source and click Generate
          </div>
        )}
      </div>
    </div>
  );
}
