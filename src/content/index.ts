console.log('[Content Script] Loaded');

// Listen for messages from service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Content Script] Received message:', message);

  switch (message.type) {
    case 'ENABLE_DRAWING':
      enableDrawingMode();
      sendResponse({ success: true });
      break;

    default:
      console.warn('[Content Script] Unknown message type:', message.type);
  }

  return true;
});

function enableDrawingMode(): void {
  console.log('[Content Script] Drawing mode enabled');
  
  // Create overlay canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'tldraw-overlay';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '999999';
  canvas.style.pointerEvents = 'auto';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.body.appendChild(canvas);

  // Simple drawing implementation
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();

    lastX = e.clientX;
    lastY = e.clientY;
  });

  canvas.addEventListener('mouseup', () => {
    isDrawing = false;
  });

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      canvas.remove();
    }
  });
}

// Notify service worker that content script is ready
chrome.runtime.sendMessage({ 
  type: 'CONTENT_SCRIPT_READY',
  url: window.location.href 
});
