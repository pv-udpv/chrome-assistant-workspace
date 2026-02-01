export interface Message {
  type: string;
  data?: any;
}

export function handleMessage(
  message: Message,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
): void {
  console.log('[SW] Received message:', message.type, sender);

  switch (message.type) {
    case 'GET_STORAGE':
      handleGetStorage(message.data, sendResponse);
      break;

    case 'SET_STORAGE':
      handleSetStorage(message.data, sendResponse);
      break;

    case 'API_REQUEST':
      handleApiRequest(message.data, sendResponse);
      break;

    case 'ADD_TO_GRAPH':
      handleAddToGraph(message.data, sendResponse);
      break;

    case 'CREATE_DIAGRAM':
      handleCreateDiagram(message.data, sendResponse);
      break;

    default:
      console.warn('[SW] Unknown message type:', message.type);
      sendResponse({ error: 'Unknown message type' });
  }
}

async function handleGetStorage(key: string, sendResponse: (response: any) => void) {
  try {
    const result = await chrome.storage.local.get(key);
    sendResponse({ success: true, data: result[key] });
  } catch (error) {
    sendResponse({ success: false, error: String(error) });
  }
}

async function handleSetStorage(
  { key, value }: { key: string; value: any },
  sendResponse: (response: any) => void
) {
  try {
    await chrome.storage.local.set({ [key]: value });
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ success: false, error: String(error) });
  }
}

async function handleApiRequest(
  { url, options }: { url: string; options?: RequestInit },
  sendResponse: (response: any) => void
) {
  try {
    const response = await fetch(url, options);
    const data = await response.text();
    sendResponse({ 
      success: true, 
      data,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    });
  } catch (error) {
    sendResponse({ success: false, error: String(error) });
  }
}

async function handleAddToGraph(
  { text, url }: { text: string; url?: string },
  sendResponse: (response: any) => void
) {
  try {
    // Get existing graph
    const result = await chrome.storage.local.get('knowledgeGraph');
    const graph = result.knowledgeGraph || { nodes: [], links: [] };

    // Add new node
    const nodeId = `node-${Date.now()}`;
    graph.nodes.push({
      id: nodeId,
      label: text.substring(0, 50),
      text,
      url,
      timestamp: Date.now()
    });

    // Save updated graph
    await chrome.storage.local.set({ knowledgeGraph: graph });
    sendResponse({ success: true, nodeId });
  } catch (error) {
    sendResponse({ success: false, error: String(error) });
  }
}

async function handleCreateDiagram(
  { text }: { text: string },
  sendResponse: (response: any) => void
) {
  try {
    // Store diagram request
    const result = await chrome.storage.local.get('diagrams');
    const diagrams = result.diagrams || [];
    
    const diagramId = `diagram-${Date.now()}`;
    diagrams.push({
      id: diagramId,
      text,
      timestamp: Date.now()
    });

    await chrome.storage.local.set({ diagrams });
    sendResponse({ success: true, diagramId });
  } catch (error) {
    sendResponse({ success: false, error: String(error) });
  }
}
