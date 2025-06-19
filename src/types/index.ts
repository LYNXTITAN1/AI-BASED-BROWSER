export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon: string;
  isActive: boolean;
  aiSummary?: string;
  securityStatus: 'secure' | 'warning' | 'danger' | 'checking';
  lastVisited?: Date;
}

export interface AIState {
  isActive: boolean;
  currentTask: string;
  confidence: number;
  suggestions: string[];
  isProcessing?: boolean;
  lastUpdate?: Date;
}

export interface SecurityStatus {
  level: 'secure' | 'warning' | 'danger';
  threats: string[];
  recommendations: string[];
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'query' | 'url' | 'ai-insight';
  confidence?: number;
}

export interface AIInsight {
  id: string;
  title: string;
  content: string;
  type: 'summary' | 'analysis' | 'suggestion' | 'warning';
  timestamp: Date;
  relevance: number;
}