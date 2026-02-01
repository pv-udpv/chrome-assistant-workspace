import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

export function TldrawCanvas() {
  return (
    <div className="h-full w-full">
      <Tldraw 
        onMount={(editor) => {
          console.log('tldraw mounted', editor);
        }}
      />
    </div>
  );
}
