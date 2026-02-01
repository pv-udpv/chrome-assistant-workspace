import { WebContainer } from '@webcontainer/api';
import { getWorkspaceFiles } from './workspace-files';

const statusEl = document.getElementById('status')!;
const loadingEl = document.getElementById('loading')!;
const errorEl = document.getElementById('error')!;
const errorMessageEl = document.getElementById('error-message')!;
const iframeEl = document.getElementById('workspace') as HTMLIFrameElement;

async function bootWorkspace() {
  try {
    updateStatus('Booting WebContainer...');
    const webcontainer = await WebContainer.boot();
    console.log('[Host] WebContainer booted');

    updateStatus('Mounting files...');
    const files = getWorkspaceFiles();
    await webcontainer.mount(files);
    console.log('[Host] Files mounted');

    updateStatus('Installing dependencies...');
    const installProcess = await webcontainer.spawn('npm', ['install']);
    const installExitCode = await installProcess.exit;
    
    if (installExitCode !== 0) {
      throw new Error('npm install failed');
    }
    console.log('[Host] Dependencies installed');

    updateStatus('Starting dev server...');
    const devProcess = await webcontainer.spawn('npm', ['run', 'dev']);

    // Stream output
    devProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log('[Vite]', data);
        }
      })
    );

    // Wait for server-ready event
    webcontainer.on('server-ready', (port, url) => {
      console.log('[Host] Server ready at:', url);
      updateStatus('Loading workspace...');
      
      iframeEl.src = url;
      iframeEl.style.display = 'block';
      loadingEl.style.display = 'none';
    });

    // Handle server errors
    webcontainer.on('error', (error) => {
      console.error('[Host] WebContainer error:', error);
      showError(error);
    });

  } catch (error) {
    console.error('[Host] Boot failed:', error);
    showError(error);
  }
}

function updateStatus(message: string) {
  statusEl.textContent = message;
  console.log('[Host]', message);
}

function showError(error: any) {
  loadingEl.style.display = 'none';
  errorEl.style.display = 'block';
  errorMessageEl.textContent = error instanceof Error ? error.stack : String(error);
}

// Start booting
bootWorkspace();

// Communicate with service worker
window.addEventListener('message', (event) => {
  if (event.data.type === 'FROM_WORKSPACE') {
    chrome.runtime.sendMessage(event.data);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TO_WORKSPACE') {
    iframeEl.contentWindow?.postMessage(message, '*');
  }
});
