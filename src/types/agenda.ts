export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarBg: string;
  avatarText: string;
  initials: string;
  confirmed?: boolean;
}

export type TopicCategory = 'Opener' | 'Deep Dive' | 'Planning' | 'Decision' | 'Brainstorm' | 'Review' | 'Q&A' | 'Closing';

export interface ActionItem {
  id: string;
  text: string;
  assigneeId?: string;
  completed?: boolean;
}

export interface AgendaTopic {
  id: string;
  title: string;
  category: TopicCategory;
  durationMinutes: number;
  description: string;
  bulletPoints: string[];
  stakeholderId?: string;
  actionItems?: ActionItem[];
  startTime?: string; // computed based on meeting start time
  endTime?: string;
  notes?: string;
}

export interface DocumentUpload {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'TXT' | 'MD' | 'NOTES';
  size: string;
  uploadDate: string;
  status: 'processed' | 'processing' | 'archived';
  rawText?: string;
  summary?: string;
}

export interface MeetingAgenda {
  id: string;
  title: string;
  documentId?: string;
  documentName: string;
  date: string;
  startTime: string; // e.g. "09:00"
  targetTotalMinutes: number;
  locationOrLink?: string;
  objective: string;
  stakeholders: Stakeholder[];
  topics: AgendaTopic[];
  createdDate: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: 'apply_agenda' | 'add_topic' | 'adjust_time' | 'export';
    payload?: any;
  };
}
