import { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

interface Node {
  id: string;
  label: string;
  text: string;
  url?: string;
}

interface Link {
  source: string;
  target: string;
  label?: string;
}

export function KnowledgeGraph() {
  const [graphData, setGraphData] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [
      { id: '1', label: 'Chrome Extension', text: 'MV3 Extension' },
      { id: '2', label: 'WebContainer', text: 'In-browser Node.js' },
      { id: '3', label: 'React', text: 'UI Framework' },
      { id: '4', label: 'tldraw', text: 'Canvas library' },
      { id: '5', label: 'Vite', text: 'Build tool' }
    ],
    links: [
      { source: '1', target: '2' },
      { source: '2', target: '3' },
      { source: '2', target: '5' },
      { source: '3', target: '4' }
    ]
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load graph data from extension storage
    const loadGraph = async () => {
      try {
        const response = await chrome.runtime.sendMessage({
          type: 'GET_STORAGE',
          data: 'knowledgeGraph'
        });

        if (response.success && response.data) {
          setGraphData(response.data);
        }
      } catch (error) {
        console.error('Failed to load graph:', error);
      }
    };

    loadGraph();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full bg-background">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="label"
        nodeAutoColorBy="id"
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        width={containerRef.current?.clientWidth || 800}
        height={containerRef.current?.clientHeight || 600}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.label;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            ...bckgDimensions
          );

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'white';
          ctx.fillText(label, node.x, node.y);
        }}
      />
    </div>
  );
}
