export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  grounded?: boolean;
  isStrictNegative?: boolean;
  sourceSection?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  sampleQuestions: string[];
}

export interface SystemStatus {
  status: string;
  mode: string;
  databaseLoaded: boolean;
  totalSections: number;
  hasGeminiKey: boolean;
}
