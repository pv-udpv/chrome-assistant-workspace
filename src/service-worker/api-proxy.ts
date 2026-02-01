export function setupApiProxy(): void {
  // Intercept requests to Kroki API
  chrome.webRequest?.onBeforeRequest.addListener(
    (details) => {
      console.log('[SW] Proxying request to:', details.url);
      return { cancel: false };
    },
    { urls: ['https://kroki.io/*'] },
    []
  );
}

export async function proxyRequest(url: string, options?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        'User-Agent': 'Chrome-Assistant-Workspace/0.1.0'
      }
    });
  } catch (error) {
    console.error('[SW] Proxy request failed:', error);
    throw error;
  }
}
