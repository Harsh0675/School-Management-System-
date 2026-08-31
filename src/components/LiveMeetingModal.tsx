import React, { useState, useEffect } from 'react';
import { MeetingAgenda, AgendaTopic } from '../types/agenda';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  SkipBack, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Volume2,
  FileText,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  agenda: MeetingAgenda;
  onUpdateTopic: (topicId: string, updated: Partial<AgendaTopic>) => void;
}

export const LiveMeetingModal: React.FC<LiveMeetingModalProps> = ({
  isOpen,
  onClose,
  agenda,
  onUpdateTopic
}) => {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [meetingNotes, setMeetingNotes] = useState<{ [topicId: string]: string }>({});

  const currentTopic = agenda.topics[currentTopicIndex] || agenda.topics[0];
  const totalTopics = agenda.topics.length;

  // Initialize timer whenever current topic changes
  useEffect(() => {
    if (currentTopic) {
      setSecondsRemaining(currentTopic.durationMinutes * 60);
    }
  }, [currentTopicIndex, currentTopic?.durationMinutes]);

  // Play a soft sound using Web Audio API
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {
      // Audio context might be restricted before gesture
    }
  };

  // Countdown timer loop
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isRunning) {
      setIsRunning(false);
      playChime();
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  if (!isOpen || !currentTopic) return null;

  const stakeholder = agenda.stakeholders.find(s => s.id === currentTopic.stakeholderId);
  const minutesLeft = Math.floor(secondsRemaining / 60);
  const secondsLeft = secondsRemaining % 60;
  const isTimeCritical = secondsRemaining <= 60 && secondsRemaining > 0;
  const isTimeUp = secondsRemaining === 0;

  const handleNextTopic = () => {
    if (currentTopicIndex < totalTopics - 1) {
      setCurrentTopicIndex(currentTopicIndex + 1);
      setIsRunning(true);
      playChime();
    } else {
      setIsRunning(false);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handlePrevTopic = () => {
    if (currentTopicIndex > 0) {
      setCurrentTopicIndex(currentTopicIndex - 1);
      setIsRunning(true);
    }
  };

  const handleToggleAction = (actionId: string) => {
    const updated = (currentTopic.actionItems || []).map(a => 
      a.id === actionId ? { ...a, completed: !a.completed } : a
    );
    onUpdateTopic(currentTopic.id, { actionItems: updated });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full h-[90vh] max-h-[750px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              LIVE
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">{agenda.title}</h2>
              <p className="text-[11px] text-slate-500">
                Topic {currentTopicIndex + 1} of {totalTopics} • {currentTopic.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={playChime}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              title="Test Chime Sound"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Split Body: Left active topic & timer, Right agenda overview & live scribe */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Left Column: Active Topic & Big Clock */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {currentTopic.category}
                </span>
                <span className="text-xs font-semibold text-slate-400 font-mono">
                  Target: {currentTopic.durationMinutes} mins
                </span>
              </div>

              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight font-display mb-3">
                {currentTopic.title}
              </h1>

              <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
                {currentTopic.description}
              </p>

              {/* Lead Stakeholder */}
              {stakeholder && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 mb-4">
                  <div className={`w-6 h-6 rounded-full ${stakeholder.avatarBg} flex items-center justify-center text-[9px] font-bold ${stakeholder.avatarText}`}>
                    {stakeholder.initials}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{stakeholder.name}</span>
                  <span className="text-[10px] text-slate-500">({stakeholder.role})</span>
                </div>
              )}

              {/* Bullet Points */}
              {currentTopic.bulletPoints && currentTopic.bulletPoints.length > 0 && (
                <div className="space-y-2 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Key Discussion Points
                  </span>
                  <ul className="space-y-1.5">
                    {currentTopic.bulletPoints.map((bp, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Big Countdown Timer Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isTimeUp 
                ? 'bg-rose-50 border-rose-200 ring-2 ring-rose-500/20' 
                : isTimeCritical 
                ? 'bg-amber-50 border-amber-200 animate-pulse' 
                : 'bg-slate-900 text-white border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                  isTimeUp ? 'text-rose-600' : isTimeCritical ? 'text-amber-700' : 'text-slate-400'
                }`}>
                  {isTimeUp ? 'Time Overrun' : 'Topic Time Remaining'}
                </span>
                <Clock className={`w-4 h-4 ${isTimeUp ? 'text-rose-600' : isTimeCritical ? 'text-amber-700' : 'text-indigo-400'}`} />
              </div>

              <div className="flex items-center justify-between">
                <div className={`text-3xl sm:text-4xl font-bold font-mono tracking-tight ${
                  isTimeUp ? 'text-rose-600' : isTimeCritical ? 'text-amber-800' : 'text-white'
                }`}>
                  {minutesLeft.toString().padStart(2, '0')}:{secondsLeft.toString().padStart(2, '0')}
                </div>

                {/* Play / Pause / Reset Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95 flex items-center gap-1.5 ${
                      isRunning
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30'
                    }`}
                  >
                    {isRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                    <span>{isRunning ? 'Pause' : 'Start'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSecondsRemaining(currentTopic.durationMinutes * 60)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs"
                    title="Reset topic timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mini Timeline & Live Meeting Notes */}
          <div className="w-full md:w-80 p-6 bg-slate-50 flex flex-col justify-between space-y-4 overflow-y-auto">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Meeting Progression
              </h3>
              <div className="space-y-2 mb-6">
                {agenda.topics.map((t, idx) => {
                  const isCurrent = idx === currentTopicIndex;
                  const isPast = idx < currentTopicIndex;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setCurrentTopicIndex(idx)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-2.5 ${
                        isCurrent
                          ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/10 shadow-xs font-bold text-slate-900'
                          : isPast
                          ? 'bg-slate-100/80 border-transparent text-slate-400'
                          : 'bg-white/70 border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent 
                          ? 'bg-indigo-600 text-white' 
                          : isPast 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isPast ? '✓' : idx + 1}
                      </div>
                      <div className="flex-1 truncate">
                        <p className="truncate">{t.title}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{t.durationMinutes}m</span>
                    </div>
                  );
                })}
              </div>

              {/* Action Items for Current Topic */}
              {currentTopic.actionItems && currentTopic.actionItems.length > 0 && (
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Action Items Checkoff
                  </span>
                  <div className="space-y-1.5">
                    {currentTopic.actionItems.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => handleToggleAction(a.id)}
                        className="w-full flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 text-left text-xs"
                      >
                        {a.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                        )}
                        <span className={a.completed ? 'line-through text-slate-400' : 'text-slate-700'}>
                          {a.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Topic Minutes / Notes Scratchpad */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <FileText className="w-3 h-3 text-slate-400" />
                  <span>Live Topic Notes</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Type notes or key decisions agreed for this topic..."
                  value={meetingNotes[currentTopic.id] || ''}
                  onChange={(e) => setMeetingNotes({ ...meetingNotes, [currentTopic.id]: e.target.value })}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Bottom Next/Prev Navigation */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handlePrevTopic}
                disabled={currentTopicIndex === 0}
                className="flex-1 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 disabled:opacity-30 transition-colors flex items-center justify-center gap-1"
              >
                <SkipBack className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <button
                type="button"
                onClick={handleNextTopic}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 active:scale-95 shadow-sm transition-all flex items-center justify-center gap-1"
              >
                <span>{currentTopicIndex === totalTopics - 1 ? 'Finish' : 'Next Topic'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
