import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  Plus, 
  Printer, 
  Calendar, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  Send,
  X,
  CheckCircle2,
  Users
} from 'lucide-react';
import { SchoolNotice, Role } from '../types';

interface NoticesViewProps {
  notices: SchoolNotice[];
  onAddNotice: (notice: SchoolNotice) => void;
  onPrintNotice: (notice: SchoolNotice) => void;
  onOpenAiStudio: () => void;
  currentRole: Role;
}

export const NoticesView: React.FC<NoticesViewProps> = ({
  notices,
  onAddNotice,
  onPrintNotice,
  onOpenAiStudio,
  currentRole
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isNewNoticeModalOpen, setIsNewNoticeModalOpen] = useState(false);

  // New Notice State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<SchoolNotice['targetAudience']>('all');
  const [category, setCategory] = useState<SchoolNotice['category']>('academic');
  const [priority, setPriority] = useState<SchoolNotice['priority']>('medium');
  const [signedBy, setSignedBy] = useState('Dr. Sudhir Sharma (Principal)');

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.signedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAudience = selectedAudience === 'all' || notice.targetAudience === selectedAudience;
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;

    return matchesSearch && matchesAudience && matchesCategory;
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice: SchoolNotice = {
      id: `not_${Date.now()}`,
      noticeNo: `EVSB/CIR/2025/${Math.floor(100 + Math.random() * 900)}`,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      targetAudience,
      category,
      priority,
      signedBy: signedBy || 'Principal, Education Valley School Bhopal'
    };

    onAddNotice(newNotice);
    setIsNewNoticeModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">Campus Circulars & Digital Board</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
              {filteredNotices.length} Active Circulars
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish official CBSE administrative orders, event notifications & parent circulars
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiStudio}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold border border-indigo-200 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Circular Generator</span>
          </button>

          <button
            onClick={() => setIsNewNoticeModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Circular</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search circular keywords, topics, or signee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedAudience}
            onChange={(e) => setSelectedAudience(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Audiences</option>
            <option value="parents">Parents</option>
            <option value="students">Students</option>
            <option value="teachers">Teachers</option>
            <option value="staff">Staff</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="academic">Academic</option>
            <option value="administrative">Administrative</option>
            <option value="sports_events">Sports & Events</option>
            <option value="holiday">Holiday</option>
            <option value="transport">Transport</option>
          </select>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map(notice => {
          const isUrgent = notice.priority === 'urgent' || notice.priority === 'high';

          return (
            <div
              key={notice.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md ${
                isUrgent ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono ${
                    notice.priority === 'urgent'
                      ? 'bg-rose-600 text-white'
                      : notice.priority === 'high'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {notice.priority} Priority
                  </span>

                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                    Category: {notice.category}
                  </span>

                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                    To: {notice.targetAudience.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{notice.date}</span>
                  </div>
                  <button
                    onClick={() => onPrintNotice(notice)}
                    className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                    title="Print Formal Circular"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Circular</span>
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 font-outfit">
                {notice.title}
              </h3>

              <p className="text-xs text-slate-700 mt-2 leading-relaxed whitespace-pre-line">
                {notice.content}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Education Valley School, Bhopal</span>
                <span className="font-semibold text-slate-800 italic">— {notice.signedBy}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Publish Notice Modal */}
      {isNewNoticeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 font-outfit text-base">Publish Official School Notice / Circular</h3>
              <button
                onClick={() => setIsNewNoticeModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Circular Subject / Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mandatory Parent-Teacher Meeting (PTM) for Classes 9th-12th"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Audience
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="all">Everyone</option>
                    <option value="parents">Parents</option>
                    <option value="students">Students</option>
                    <option value="teachers">Teachers</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="academic">Academic</option>
                    <option value="administrative">Administrative</option>
                    <option value="sports_events">Sports & Events</option>
                    <option value="holiday">Holiday</option>
                    <option value="transport">Transport</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Circular Body / Instructions
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter full notice text, meeting timings, venue, instructions..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Issued & Signed By
                </label>
                <input
                  type="text"
                  value={signedBy}
                  onChange={(e) => setSignedBy(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewNoticeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/20"
                >
                  Publish to Notice Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
