export function setupContextMenus(): void {
  // Remove existing menus
  chrome.contextMenus.removeAll();

  // Open side panel
  chrome.contextMenus.create({
    id: 'open-sidepanel',
    title: 'Open Assistant Workspace',
    contexts: ['page', 'selection']
  });

  // Add to knowledge graph
  chrome.contextMenus.create({
    id: 'add-to-graph',
    title: 'Add to Knowledge Graph',
    contexts: ['selection']
  });

  // Create diagram from selection
  chrome.contextMenus.create({
    id: 'create-diagram',
    title: 'Create Diagram',
    contexts: ['selection']
  });

  // Draw on page
  chrome.contextMenus.create({
    id: 'draw-on-page',
    title: 'Draw on Page (tldraw)',
    contexts: ['page']
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;

  switch (info.menuItemId) {
    case 'open-sidepanel':
      chrome.sidePanel.open({ windowId: tab.windowId });
      break;

    case 'add-to-graph':
      if (info.selectionText) {
        chrome.runtime.sendMessage({
          type: 'ADD_TO_GRAPH',
          data: { text: info.selectionText, url: info.pageUrl }
        });
      }
      break;

    case 'create-diagram':
      if (info.selectionText) {
        chrome.runtime.sendMessage({
          type: 'CREATE_DIAGRAM',
          data: { text: info.selectionText }
        });
      }
      break;

    case 'draw-on-page':
      chrome.tabs.sendMessage(tab.id, {
        type: 'ENABLE_DRAWING'
      });
      break;
  }
});
