export interface StorageSchema {
  knowledgeGraph: {
    nodes: Array<{
      id: string;
      label: string;
      text: string;
      url?: string;
      timestamp: number;
    }>;
    links: Array<{
      source: string;
      target: string;
      label?: string;
    }>;
  };
  diagrams: Array<{
    id: string;
    text: string;
    timestamp: number;
  }>;
  layouts: Array<{
    id: string;
    name: string;
    data: any;
    timestamp: number;
  }>;
  canvasData: {
    [key: string]: any;
  };
}

export async function initStorage(): Promise<void> {
  const defaults: Partial<StorageSchema> = {
    knowledgeGraph: { nodes: [], links: [] },
    diagrams: [],
    layouts: [],
    canvasData: {}
  };

  // Initialize with defaults if not exists
  const existing = await chrome.storage.local.get(Object.keys(defaults));
  const toSet: any = {};

  for (const [key, value] of Object.entries(defaults)) {
    if (!existing[key]) {
      toSet[key] = value;
    }
  }

  if (Object.keys(toSet).length > 0) {
    await chrome.storage.local.set(toSet);
    console.log('[SW] Storage initialized with defaults');
  }
}

export async function getStorage<K extends keyof StorageSchema>(
  key: K
): Promise<StorageSchema[K] | undefined> {
  const result = await chrome.storage.local.get(key);
  return result[key];
}

export async function setStorage<K extends keyof StorageSchema>(
  key: K,
  value: StorageSchema[K]
): Promise<void> {
  await chrome.storage.local.set({ [key]: value });
}
