import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  RotateCcw,
  GraduationCap,
  Layers,
  Send,
  Loader2
} from 'lucide-react';
import { generateAcademicContent } from '../services/aiService';
import { Role } from '../types';

interface AiAcademicStudioProps {
  onPrintGeneratedDocument: (title: string, content: string, type: 'lesson_plan' | 'question_paper' | 'circular') => void;
  currentRole: Role;
}

export const AiAcademicStudio: React.FC<AiAcademicStudioProps> = ({
  onPrintGeneratedDocument,
  currentRole
}) => {
  const [activeStudioTab, setActiveStudioTab] = useState<'lesson_plan' | 'question_paper' | 'circular'>('lesson_plan');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Lesson Plan Form State
  const [lpGrade, setLpGrade] = useState('Class 10th');
  const [lpSubject, setLpSubject] = useState('Science (Physics)');
  const [lpTopic, setLpTopic] = useState('Light - Reflection and Refraction');
  const [lpDuration, setLpDuration] = useState('45 Minutes');
  const [lpModel, setLpModel] = useState('NEP 2020 5E Constructivist Model');

  // Question Paper Form State
  const [qpGrade, setQpGrade] = useState('Class 10th');
  const [qpSubject, setQpSubject] = useState('Mathematics');
  const [qpTopic, setQpTopic] = useState('Quadratic Equations & Arithmetic Progressions');
  const [qpMarks, setQpMarks] = useState('40 Marks (Periodic Test 2)');
  const [qpDifficulty, setQpDifficulty] = useState('30% Easy, 50% Medium, 20% HOTS (High Order Thinking)');

  // Circular Form State
  const [circTopic, setCircTopic] = useState('Annual Science Exhibition & Robotron 2025');
  const [circAudience, setCircAudience] = useState('Parents and Students (Classes 6th to 12th)');
  const [circDate, setCircDate] = useState('October 18, 2025');
  const [circInstructions, setCircInstructions] = useState('Parents are cordially invited to witness student science prototypes from 09:30 AM to 01:30 PM. Model submission deadline is October 14.');

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedOutput('');

    let prompt = '';
    if (activeStudioTab === 'lesson_plan') {
      prompt = `Create a comprehensive CBSE Lesson Plan for ${lpGrade}, Subject: ${lpSubject}, Chapter/Topic: "${lpTopic}". Duration: ${lpDuration}. Format using ${lpModel} with Learning Outcomes, 5E Phases (Engage, Explore, Explain, Elaborate, Evaluate), Teaching Aids, Real-world Bhopal/MP context connections, and Homework.`;
    } else if (activeStudioTab === 'question_paper') {
      prompt = `Generate a standard CBSE Question Paper and Blueprint for ${qpGrade}, Subject: ${qpSubject}, Topics: "${qpTopic}". Total Marks: ${qpMarks}, Difficulty: ${qpDifficulty}. Include Section A (1-mark MCQs), Section B (2-mark Short Answer), Section C (3-mark Conceptual), Section D (5-mark Long/Case Study) and a concise Marking Scheme.`;
    } else {
      prompt = `Draft an official, polished school circular for Education Valley School, Bhopal. Subject: "${circTopic}", Audience: ${circAudience}, Date/Event: ${circDate}. Key Instructions: ${circInstructions}. Make it professional, courteous, signed by Principal.`;
    }

    try {
      const response = await generateAcademicContent(activeStudioTab, prompt);
      setGeneratedOutput(response);
    } catch (err) {
      setGeneratedOutput('An error occurred during AI generation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const blob = new Blob([generatedOutput], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EVSB_${activeStudioTab}_${Date.now()}.md`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Academic Studio • Google Gemini Powered</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-outfit">
            Automated CBSE Pedagogy & Question Paper Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Generate NEP 2020 aligned 5E Lesson Plans, CBSE Blueprint Question Papers with marking schemes, and official campus circulars in seconds.
          </p>
        </div>
      </div>

      {/* Generator Mode Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => {
            setActiveStudioTab('lesson_plan');
            setGeneratedOutput('');
          }}
          className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
            activeStudioTab === 'lesson_plan'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className={`p-2.5 rounded-xl ${
            activeStudioTab === 'lesson_plan' ? 'bg-indigo-700 text-white' : 'bg-indigo-50 text-indigo-600'
          }`}>
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">CBSE 5E Lesson Plan</h3>
            <p className={`text-[11px] mt-0.5 ${
              activeStudioTab === 'lesson_plan' ? 'text-indigo-100' : 'text-slate-500'
            }`}>
              NEP 2020 outcomes & classroom activities
            </p>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveStudioTab('question_paper');
            setGeneratedOutput('');
          }}
          className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
            activeStudioTab === 'question_paper'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className={`p-2.5 rounded-xl ${
            activeStudioTab === 'question_paper' ? 'bg-indigo-700 text-white' : 'bg-indigo-50 text-indigo-600'
          }`}>
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Question Paper & Key</h3>
            <p className={`text-[11px] mt-0.5 ${
              activeStudioTab === 'question_paper' ? 'text-indigo-100' : 'text-slate-500'
            }`}>
              MCQs, Short/Long, HOTS & marking scheme
            </p>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveStudioTab('circular');
            setGeneratedOutput('');
          }}
          className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
            activeStudioTab === 'circular'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className={`p-2.5 rounded-xl ${
            activeStudioTab === 'circular' ? 'bg-indigo-700 text-white' : 'bg-indigo-50 text-indigo-600'
          }`}>
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Circular & Notice Drafter</h3>
            <p className={`text-[11px] mt-0.5 ${
              activeStudioTab === 'circular' ? 'text-indigo-100' : 'text-slate-500'
            }`}>
              Official parent/faculty communications
            </p>
          </div>
        </button>
      </div>

      {/* Main Studio Workspace: Parameters on Left, Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Parameters (4 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Generator Parameters
              </h3>
              <span className="text-[10px] text-indigo-600 font-semibold">Gemini 2.5 Flash Engine</span>
            </div>

            {/* Lesson Plan Mode Inputs */}
            {activeStudioTab === 'lesson_plan' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">Target Class</label>
                    <select
                      value={lpGrade}
                      onChange={(e) => setLpGrade(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="Class 10th">Class 10th (Secondary)</option>
                      <option value="Class 12th">Class 12th (Sr Secondary)</option>
                      <option value="Class 8th">Class 8th (Middle)</option>
                      <option value="Class 5th">Class 5th (Primary)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">Subject</label>
                    <input
                      type="text"
                      value={lpSubject}
                      onChange={(e) => setLpSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 text-[11px] mb-1">Chapter / Unit Topic</label>
                  <input
                    type="text"
                    value={lpTopic}
                    onChange={(e) => setLpTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="e.g. Life Processes: Human Circulatory System"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">Period Duration</label>
                    <input
                      type="text"
                      value={lpDuration}
                      onChange={(e) => setLpDuration(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">Pedagogical Framework</label>
                    <input
                      type="text"
                      value={lpModel}
                      onChange={(e) => setLpModel(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Question Paper Mode Inputs */}
            {activeStudioTab === 'question_paper' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">Class</label>
                    <select
                      value={qpGrade}
                      onChange={(e) => setQpGrade(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="Class 10th">Class 10th</option>
                      <option value="Class 12th">Class 12th</option>
                      <option value="Class 8th">Class 8th</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">Subject</label>
                    <input
                      type="text"
                      value={qpSubject}
                      onChange={(e) => setQpSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 text-[11px] mb-1">Syllabus / Chapter Chapters</label>
                  <input
                    type="text"
                    value={qpTopic}
                    onChange={(e) => setQpTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 text-[11px] mb-1">Marks Weightage</label>
                  <input
                    type="text"
                    value={qpMarks}
                    onChange={(e) => setQpMarks(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 text-[11px] mb-1">Bloom's Taxonomy / HOTS Ratio</label>
                  <input
                    type="text"
                    value={qpDifficulty}
                    onChange={(e) => setQpDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px]"
                  />
                </div>
              </div>
            )}

            {/* Circular Mode Inputs */}
            {activeStudioTab === 'circular' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 text-[11px] mb-1">Circular Subject</label>
                  <input
                    type="text"
                    value={circTopic}
                    onChange={(e) => setCircTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">Audience</label>
                    <input
                      type="text"
                      value={circAudience}
                      onChange={(e) => setCircAudience(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">Date of Event</label>
                    <input
                      type="text"
                      value={circDate}
                      onChange={(e) => setCircDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 text-[11px] mb-1">Key Directives</label>
                  <textarea
                    rows={3}
                    value={circInstructions}
                    onChange={(e) => setCircInstructions(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Submit Action */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Academic Content...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Document with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Preview Panel (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-full min-h-[500px]">
            {/* Output Toolbar */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-bold text-xs text-slate-800 font-outfit">
                  {activeStudioTab === 'lesson_plan'
                    ? 'Generated 5E Lesson Plan'
                    : activeStudioTab === 'question_paper'
                    ? 'Generated CBSE Question Paper'
                    : 'Generated School Circular'}
                </span>
              </div>

              {generatedOutput && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={copyToClipboard}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    title="Copy to Clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={downloadText}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    title="Download Markdown"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>

                  <button
                    onClick={() => onPrintGeneratedDocument(
                      activeStudioTab === 'lesson_plan' ? lpTopic : activeStudioTab === 'question_paper' ? qpTopic : circTopic,
                      generatedOutput,
                      activeStudioTab
                    )}
                    className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    title="Print Document"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              )}
            </div>

            {/* Output Content Area */}
            <div className="p-6 flex-1 overflow-y-auto font-sans text-xs sm:text-sm text-slate-800 leading-relaxed">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-3 py-16 text-slate-400">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <p className="text-xs font-medium">Generating CBSE compliant curriculum content...</p>
                </div>
              ) : generatedOutput ? (
                <div className="whitespace-pre-line font-mono bg-slate-50/50 p-4 rounded-xl border border-slate-200/60">
                  {generatedOutput}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-3 text-slate-400">
                  <Sparkles className="w-10 h-10 text-slate-300" />
                  <div className="max-w-sm">
                    <p className="font-bold text-slate-600 text-sm">AI Studio Ready</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure your class, subject and chapter parameters on the left, then click Generate to create lesson plans or exams.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
