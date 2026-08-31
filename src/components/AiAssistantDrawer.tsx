import React, { useState, useRef, useEffect } from 'react';
import { MeetingAgenda, ChatMessage, AgendaTopic, TopicCategory } from '../types/agenda';
import { chatWithAgendaCopilot } from '../lib/gemini';
import { computeTopicTimestamps } from '../lib/timeUtils';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Clock, 
  PlusCircle, 
  Mail, 
  CheckCircle2,
  RefreshCw,
  Zap
} from 'lucide-react';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  agenda: MeetingAgenda;
  onUpdateAgenda: (updated: MeetingAgenda) => void;
  onOpenExportModal: () => void;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  agenda,
  onUpdateAgenda,
  onOpenExportModal
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello! I'm your **AgendaAI Copilot** powered by Gemini. I've structured your meeting from **${agenda.documentName}** with ${agenda.topics.length} topics totaling ${agenda.topics.reduce((a, b) => a + b.durationMinutes, 0)} minutes.\n\nHow can I help refine this agenda?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatWithAgendaCopilot(newHistory, agenda);
      
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: response.action
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: 'I ran into a temporary issue connecting to Gemini. I can still assist with agenda duration adjustments and prompt templates.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteAction = (action: any) => {
    if (!action) return;

    if (action.type === 'adjust_duration') {
      const targetMins = action.targetMinutes || 45;
      const ratio = targetMins / (agenda.topics.reduce((a, b) => a + b.durationMinutes, 0) || 60);
      
      const updatedTopics = agenda.topics.map((t, idx) => ({
        ...t,
        durationMinutes: Math.max(5, Math.round(t.durationMinutes * ratio))
      }));

      const timed = computeTopicTimestamps(agenda.startTime, updatedTopics);
      onUpdateAgenda({
        ...agenda,
        targetTotalMinutes: targetMins,
        topics: timed
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'system',
          text: `Applied **${targetMins}-minute** compressed timeline across all topics.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }

    if (action.type === 'add_qa_topic') {
      const newTopic: AgendaTopic = {
        id: `topic-qa-${Date.now()}`,
        title: 'Open Q&A, Edge Cases & Risk Mitigation',
        category: 'Q&A',
        durationMinutes: 10,
        description: 'Open floor for stakeholders to raise potential blockers, risk dependencies, and cross-team questions.',
        stakeholderId: agenda.stakeholders[0]?.id,
        bulletPoints: [
          'Review questions from attendee backlog',
          'Address architectural and timeline constraints',
          'Clarify cross-team dependencies'
        ],
        actionItems: [
          { id: `act-qa-${Date.now()}`, text: 'Log unanswered questions in follow-up thread', assigneeId: agenda.stakeholders[0]?.id, completed: false }
        ]
      };

      const topicsCopy = [...agenda.topics];
      // insert before closing topic if exists
      const closingIdx = topicsCopy.findIndex(t => t.category === 'Closing');
      if (closingIdx !== -1) {
        topicsCopy.splice(closingIdx, 0, newTopic);
      } else {
        topicsCopy.push(newTopic);
      }

      const timed = computeTopicTimestamps(agenda.startTime, topicsCopy);
      onUpdateAgenda({
        ...agenda,
        topics: timed
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'system',
          text: `Added **"Open Q&A, Edge Cases & Risk Mitigation" (10 mins)** to the agenda timeline.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }

    if (action.type === 'open_email_export') {
      onOpenExportModal();
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5 font-display">
              <span>AgendaAI Copilot</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                Gemini
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">Contextual meeting intelligence</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Action Chips */}
      <div className="p-2.5 bg-slate-50/50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
        <button
          type="button"
          onClick={() => handleSendMessage('Shorten this agenda to 45 minutes')}
          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-full font-medium text-slate-600 whitespace-nowrap flex items-center gap-1 shadow-xs"
        >
          <Clock className="w-3 h-3 text-indigo-500" />
          <span>45m Timeline</span>
        </button>

        <button
          type="button"
          onClick={() => handleSendMessage('Add a 10 minute Q&A section')}
          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-full font-medium text-slate-600 whitespace-nowrap flex items-center gap-1 shadow-xs"
        >
          <PlusCircle className="w-3 h-3 text-emerald-500" />
          <span>+ Q&A Session</span>
        </button>

        <button
          type="button"
          onClick={() => handleSendMessage('Draft an email invite for this meeting')}
          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-full font-medium text-slate-600 whitespace-nowrap flex items-center gap-1 shadow-xs"
        >
          <Mail className="w-3 h-3 text-amber-500" />
          <span>Email Invite</span>
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="p-2 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <div className="flex-1 font-medium">{msg.text}</div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] ${
                isUser ? 'bg-slate-900 text-white' : 'bg-indigo-100 text-indigo-700 font-bold'
              }`}>
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                isUser
                  ? 'bg-slate-900 text-white rounded-tr-xs'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs shadow-xs'
              }`}>
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                {/* Interactive Action Button if suggested by AI */}
                {msg.suggestedAction && (
                  <button
                    type="button"
                    onClick={() => handleExecuteAction(msg.suggestedAction)}
                    className="mt-2.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold text-[11px] hover:bg-indigo-700 active:scale-95 shadow-xs flex items-center gap-1.5"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Apply This Change</span>
                  </button>
                )}

                <span className={`block text-[9px] mt-1 font-medium ${
                  isUser ? 'text-slate-400 text-right' : 'text-slate-400'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-xs p-3 text-xs flex items-center gap-2 text-slate-500">
              <div className="w-3 h-3 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
              <span>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-100 bg-white"
      >
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
          <input
            type="text"
            placeholder="Ask AI to re-time, add topics, or draft notes..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full text-xs bg-transparent px-2 text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
