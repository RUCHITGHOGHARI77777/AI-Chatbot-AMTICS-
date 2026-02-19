
export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface Message {
  role: MessageRole;
  content: string;
  timestamp: Date;
  type?: 'text' | 'action' | 'image' | 'voice';
  metadata?: any;
}

export interface StrategyPoint {
  title: string;
  description: string;
  icon: string;
}

export interface Concept {
  id: string;
  name: string;
  tagline: string;
  description: string;
  justification: string;
  winProbability: number;
}
