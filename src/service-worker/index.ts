import { setupContextMenus } from './context-menus';
import { handleMessage } from './messaging';
import { initStorage } from './storage';
import { setupApiProxy } from './api-proxy';

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log('[SW] Extension installed');
  
  // Initialize storage
  await initStorage();
  
  // Setup context menus
  setupContextMenus();
  
  // Configure side panel behavior
  await chrome.sidePanel.setPanelBehavior({ 
    openPanelOnActionClick: true 
  }).catch(console.error);
});

// Handle messages from content scripts and side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender, sendResponse);
  return true; // Keep channel open for async response
});

// Setup API proxy for CORS-free requests
setupApiProxy();

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

console.log('[SW] Service worker initialized');
