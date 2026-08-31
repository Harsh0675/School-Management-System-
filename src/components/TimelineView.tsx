import React, { useState } from 'react';
import { MeetingAgenda, AgendaTopic, Stakeholder, TopicCategory, ActionItem } from '../types/agenda';
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Edit2, 
  User, 
  ListChecks, 
  MoreVertical,
  Check,
  Sparkles
} from 'lucide-react';

interface TimelineViewProps {
  agenda: MeetingAgenda;
  onUpdateTopic: (topicId: string, updated: Partial<AgendaTopic>) => void;
  onDeleteTopic: (topicId: string) => void;
  onMoveTopic: (index: number, direction: 'up' | 'down') => void;
  onAddTopic: (afterIndex?: number) => void;
  onOpenStakeholderModal: () => void;
}

const CATEGORY_STYLES: Record<TopicCategory, { bg: string; text: string; dotRing: string }> = {
  'Opener': { bg: 'bg-slate-100', text: 'text-slate-600', dotRing: 'bg-indigo-600' },
  'Deep Dive': { bg: 'bg-emerald-50', text: 'text-emerald-700', dotRing: 'bg-emerald-600' },
  'Planning': { bg: 'bg-blue-50', text: 'text-blue-700', dotRing: 'bg-blue-600' },
  'Decision': { bg: 'bg-amber-50', text: 'text-amber-700', dotRing: 'bg-amber-600' },
  'Brainstorm': { bg: 'bg-purple-50', text: 'text-purple-700', dotRing: 'bg-purple-600' },
  'Review': { bg: 'bg-cyan-50', text: 'text-cyan-700', dotRing: 'bg-cyan-600' },
  'Q&A': { bg: 'bg-rose-50', text: 'text-rose-700', dotRing: 'bg-rose-600' },
  'Closing': { bg: 'bg-slate-100', text: 'text-slate-600', dotRing: 'bg-slate-600' }
};

export const TimelineView: React.FC<TimelineViewProps> = ({
  agenda,
  onUpdateTopic,
  onDeleteTopic,
  onMoveTopic,
  onAddTopic,
  onOpenStakeholderModal
}) => {
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [newBulletText, setNewBulletText] = useState<{ [topicId: string]: string }>({});
  const [newActionText, setNewActionText] = useState<{ [topicId: string]: string }>({});

  const handleAddBullet = (topicId: string, currentBullets: string[]) => {
    const text = (newBulletText[topicId] || '').trim();
    if (!text) return;
    onUpdateTopic(topicId, {
      bulletPoints: [...currentBullets, text]
    });
    setNewBulletText({ ...newBulletText, [topicId]: '' });
  };

  const handleRemoveBullet = (topicId: string, currentBullets: string[], indexToRemove: number) => {
    onUpdateTopic(topicId, {
      bulletPoints: currentBullets.filter((_, i) => i !== indexToRemove)
    });
  };

  const handleAddActionItem = (topic: AgendaTopic) => {
    const text = (newActionText[topic.id] || '').trim();
    if (!text) return;
    const newItem: ActionItem = {
      id: `act-${Date.now()}`,
      text,
      assigneeId: topic.stakeholderId,
      completed: false
    };
    onUpdateTopic(topic.id, {
      actionItems: [...(topic.actionItems || []), newItem]
    });
    setNewActionText({ ...newActionText, [topic.id]: '' });
  };

  const handleToggleActionCompleted = (topic: AgendaTopic, actionId: string) => {
    const updatedActions = (topic.actionItems || []).map(a => 
      a.id === actionId ? { ...a, completed: !a.completed } : a
    );
    onUpdateTopic(topic.id, { actionItems: updatedActions });
  };

  const handleRemoveAction = (topic: AgendaTopic, actionId: string) => {
    const updatedActions = (topic.actionItems || []).map(a => a).filter(a => a.id !== actionId);
    onUpdateTopic(topic.id, { actionItems: updatedActions });
  };

  return (
    <div className="relative pb-16">
      {/* Timeline Continuous Guide Line */}
      <div className="absolute left-[38px] sm:left-[47px] top-5 bottom-6 w-0.5 bg-slate-200"></div>

      <div className="space-y-6 sm:space-y-8">
        {agenda.topics.map((topic, index) => {
          const stakeholder = agenda.stakeholders.find(s => s.id === topic.stakeholderId);
          const categoryStyle = CATEGORY_STYLES[topic.category] || CATEGORY_STYLES['Planning'];
          const isFirst = index === 0;
          const isLast = index === agenda.topics.length - 1;
          const isEditing = editingTopicId === topic.id;

          return (
            <div key={topic.id} className="flex gap-3 sm:gap-6 relative group">
              {/* Left Column: Timestamp & Duration Pill */}
              <div className="w-16 sm:w-24 text-right flex flex-col pt-1 flex-shrink-0">
                <span className="text-xs sm:text-sm font-bold text-slate-900 font-mono tracking-tight">
                  {topic.startTime || '09:00'}
                </span>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 tracking-wider">
                    {topic.durationMinutes.toString().padStart(2, '0')} MIN
                  </span>
                </div>

                {/* Duration Increment/Decrement Controls */}
                <div className="flex items-center justify-end gap-0.5 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => onUpdateTopic(topic.id, { durationMinutes: Math.max(5, topic.durationMinutes - 5) })}
                    disabled={topic.durationMinutes <= 5}
                    className="w-4 h-4 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center disabled:opacity-30"
                    title="Decrease 5m"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateTopic(topic.id, { durationMinutes: topic.durationMinutes + 5 })}
                    className="w-4 h-4 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center"
                    title="Increase 5m"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Timeline Center Dot Marker */}
              <div className="mt-2 sm:mt-2.5 z-10 flex-shrink-0 flex items-center justify-center">
                <div className={`w-3 h-3 rounded-full ${categoryStyle.dotRing} ring-4 ring-white shadow-xs`}></div>
              </div>

              {/* Topic Content Card (ShadCN style) */}
              <div className="flex-1 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all">
                {/* Top Row: Title, Category Badge, and Item Controls */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-[200px]">
                    {isEditing ? (
                      <input
                        type="text"
                        value={topic.title}
                        onChange={(e) => onUpdateTopic(topic.id, { title: e.target.value })}
                        className="text-sm sm:text-base font-bold text-slate-900 border-b border-indigo-500 bg-transparent w-full focus:outline-none"
                      />
                    ) : (
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                        {topic.title}
                      </h4>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Category Selector */}
                    <select
                      value={topic.category}
                      onChange={(e) => onUpdateTopic(topic.id, { category: e.target.value as TopicCategory })}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider cursor-pointer border-0 ${categoryStyle.bg} ${categoryStyle.text} focus:ring-0 focus:outline-none`}
                    >
                      <option value="Opener">Opener</option>
                      <option value="Deep Dive">Deep Dive</option>
                      <option value="Planning">Planning</option>
                      <option value="Decision">Decision</option>
                      <option value="Brainstorm">Brainstorm</option>
                      <option value="Review">Review</option>
                      <option value="Q&A">Q&A</option>
                      <option value="Closing">Closing</option>
                    </select>

                    {/* Topic Reorder / Edit / Delete Actions */}
                    <div className="flex items-center gap-0.5 text-slate-400">
                      <button
                        type="button"
                        onClick={() => onMoveTopic(index, 'up')}
                        disabled={isFirst}
                        className="p-1 hover:text-slate-700 disabled:opacity-20 transition-colors"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMoveTopic(index, 'down')}
                        disabled={isLast}
                        className="p-1 hover:text-slate-700 disabled:opacity-20 transition-colors"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTopicId(isEditing ? null : topic.id)}
                        className={`p-1 transition-colors ${isEditing ? 'text-indigo-600' : 'hover:text-slate-700'}`}
                        title="Edit Description"
                      >
                        {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
                      </button>
                      {agenda.topics.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onDeleteTopic(topic.id)}
                          className="p-1 hover:text-rose-600 transition-colors"
                          title="Delete Topic"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {isEditing ? (
                  <textarea
                    value={topic.description}
                    onChange={(e) => onUpdateTopic(topic.id, { description: e.target.value })}
                    rows={2}
                    className="w-full text-xs text-slate-700 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-3"
                  />
                ) : (
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {topic.description}
                  </p>
                )}

                {/* Discussion Points / Takeaways */}
                {topic.bulletPoints && topic.bulletPoints.length > 0 && (
                  <div className="mb-3 pl-1">
                    <ul className="space-y-1.5">
                      {topic.bulletPoints.map((point, ptIdx) => (
                        <li key={ptIdx} className="text-xs text-slate-700 flex items-start gap-2 group/pt">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0 group-hover/pt:bg-indigo-500 transition-colors"></span>
                          <span className="flex-1 leading-snug">{point}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveBullet(topic.id, topic.bulletPoints, ptIdx)}
                            className="opacity-0 group-hover/pt:opacity-100 text-slate-300 hover:text-rose-500 text-[10px] px-1"
                            title="Remove bullet"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quick Add Discussion Point */}
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="+ Add discussion point or takeaway..."
                    value={newBulletText[topic.id] || ''}
                    onChange={(e) => setNewBulletText({ ...newBulletText, [topic.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddBullet(topic.id, topic.bulletPoints || [])}
                    className="text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-700 placeholder-slate-400 px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-400 flex-1"
                  />
                  {(newBulletText[topic.id] || '').trim() && (
                    <button
                      type="button"
                      onClick={() => handleAddBullet(topic.id, topic.bulletPoints || [])}
                      className="px-2 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                    >
                      Add
                    </button>
                  )}
                </div>

                {/* Action Items Box (if any) */}
                {topic.actionItems && topic.actionItems.length > 0 && (
                  <div className="bg-slate-50/70 rounded-lg p-2.5 mb-3 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <ListChecks className="w-3 h-3 text-slate-400" />
                      <span>Deliverables & Action Items ({topic.actionItems.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {topic.actionItems.map((act) => {
                        const assignee = agenda.stakeholders.find(s => s.id === act.assigneeId);
                        return (
                          <div key={act.id} className="flex items-center justify-between gap-2 text-xs group/act">
                            <button
                              type="button"
                              onClick={() => handleToggleActionCompleted(topic, act.id)}
                              className="flex items-center gap-2 text-left flex-1"
                            >
                              {act.completed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-slate-300 hover:text-slate-500 flex-shrink-0" />
                              )}
                              <span className={`${act.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                {act.text}
                              </span>
                            </button>
                            
                            {assignee && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200">
                                {assignee.name.split(' ')[0]}
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveAction(topic, act.id)}
                              className="opacity-0 group-hover/act:opacity-100 text-slate-300 hover:text-rose-500 text-[10px]"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer: Stakeholder Lead Assignment */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {stakeholder ? (
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full ${stakeholder.avatarBg} flex items-center justify-center text-[8px] font-bold ${stakeholder.avatarText}`}>
                          {stakeholder.initials}
                        </div>
                        <span className="text-[11px] font-medium text-slate-600">
                          {stakeholder.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({stakeholder.role})
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <User className="w-3.5 h-3.5" />
                        <span>Unassigned Lead</span>
                      </div>
                    )}

                    {/* Change Stakeholder Dropdown */}
                    <select
                      value={topic.stakeholderId || ''}
                      onChange={(e) => onUpdateTopic(topic.id, { stakeholderId: e.target.value })}
                      className="text-[10px] bg-transparent text-slate-500 hover:text-indigo-600 cursor-pointer border-0 focus:ring-0 focus:outline-none"
                    >
                      <option value="">Change Lead...</option>
                      {agenda.stakeholders.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Add inline action item trigger */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="+ Action item..."
                      value={newActionText[topic.id] || ''}
                      onChange={(e) => setNewActionText({ ...newActionText, [topic.id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddActionItem(topic)}
                      className="text-[11px] bg-transparent placeholder-slate-400 text-slate-700 px-2 py-0.5 border-b border-dashed border-slate-200 focus:border-indigo-500 focus:outline-none w-28 sm:w-36"
                    />
                    {(newActionText[topic.id] || '').trim() && (
                      <button
                        type="button"
                        onClick={() => handleAddActionItem(topic)}
                        className="text-[10px] font-bold text-indigo-600"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add New Section Button in Timeline Flow */}
        <div className="flex gap-3 sm:gap-6 relative items-center">
          <div className="w-16 sm:w-24 text-right flex-shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">+ Item</span>
          </div>
          <div className="w-3 h-3 rounded-full bg-slate-300 ring-4 ring-white shadow-xs z-10 flex-shrink-0"></div>
          <div className="flex-1">
            <button
              type="button"
              onClick={() => onAddTopic()}
              className="w-full py-3 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl bg-white hover:bg-indigo-50/30 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 group"
            >
              <Plus className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              <span>Add Next Agenda Topic</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
