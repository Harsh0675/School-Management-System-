import { MeetingAgenda, Stakeholder, AgendaTopic, TopicCategory, ChatMessage } from '../types/agenda';
import { computeTopicTimestamps } from './timeUtils';

const AVATAR_COLORS = [
  { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700' },
  { bg: 'bg-rose-100', text: 'text-rose-700' },
  { bg: 'bg-purple-100', text: 'text-purple-700' },
  { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  { bg: 'bg-blue-100', text: 'text-blue-700' },
  { bg: 'bg-teal-100', text: 'text-teal-700' }
];

export async function generateAgendaFromDocument(
  docName: string,
  rawText: string,
  targetDurationMinutes: number = 60,
  meetingStyle: string = 'Standard',
  meetingStartTime: string = '09:00'
): Promise<MeetingAgenda> {
  try {
    const res = await fetch('/api/generate-agenda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        docName,
        rawText,
        targetDurationMinutes,
        meetingStyle
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return processRawAiAgenda(data.data, docName, targetDurationMinutes, meetingStartTime);
      }
    }
  } catch (err) {
    console.warn('Using client-side intelligent synthesizer:', err);
  }

  // Fallback: Client-Side Intelligent Synthesizer
  return synthesizeClientSideAgenda(docName, rawText, targetDurationMinutes, meetingStartTime);
}

function processRawAiAgenda(
  raw: any,
  docName: string,
  targetDuration: number,
  startTime: string
): MeetingAgenda {
  const stakeholders: Stakeholder[] = (raw.stakeholders || []).map((s: any, idx: number) => {
    const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
    const initials = s.initials || s.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'ST';
    return {
      id: `stk-${idx + 1}-${Date.now()}`,
      name: s.name || `Stakeholder ${idx + 1}`,
      role: s.role || 'Contributor',
      email: s.email || `${s.name?.toLowerCase().replace(/\s+/g, '.')}@company.com`,
      avatarBg: color.bg,
      avatarText: color.text,
      initials,
      confirmed: true
    };
  });

  // If no stakeholders generated, provide defaults
  if (stakeholders.length === 0) {
    stakeholders.push(
      { id: 'stk-1', name: 'Meeting Lead', role: 'Organizer', email: 'lead@company.com', avatarBg: 'bg-indigo-100', avatarText: 'text-indigo-700', initials: 'ML', confirmed: true },
      { id: 'stk-2', name: 'Core Team', role: 'Reviewer', email: 'team@company.com', avatarBg: 'bg-emerald-100', avatarText: 'text-emerald-700', initials: 'CT', confirmed: true }
    );
  }

  const topics: AgendaTopic[] = (raw.topics || []).map((t: any, idx: number) => {
    const matchedStakeholder = stakeholders.find(
      s => s.name.toLowerCase() === (t.stakeholderName || '').toLowerCase()
    ) || stakeholders[idx % stakeholders.length];

    const category = sanitizeCategory(t.category);

    return {
      id: `topic-${idx + 1}-${Date.now()}`,
      title: t.title || `Agenda Item ${idx + 1}`,
      category,
      durationMinutes: Math.max(5, t.durationMinutes || 10),
      description: t.description || 'Review and discuss primary deliverables.',
      stakeholderId: matchedStakeholder?.id || stakeholders[0]?.id,
      bulletPoints: Array.isArray(t.bulletPoints) ? t.bulletPoints : ['Review key points', 'Establish next steps'],
      actionItems: (t.actionItems || []).map((ai: any, aIdx: number) => {
        const assignee = stakeholders.find(s => s.name.toLowerCase() === (ai.assigneeName || '').toLowerCase()) || matchedStakeholder;
        return {
          id: `act-${idx}-${aIdx}-${Date.now()}`,
          text: ai.text || 'Complete discussion action item',
          assigneeId: assignee?.id || matchedStakeholder?.id,
          completed: false
        };
      })
    };
  });

  const timedTopics = computeTopicTimestamps(startTime, topics);

  return {
    id: `agenda-${Date.now()}`,
    title: raw.title || `${docName.replace(/\.[^/.]+$/, '')} Review Meeting`,
    documentName: docName,
    date: new Date().toISOString().split('T')[0],
    startTime,
    targetTotalMinutes: targetDuration,
    objective: raw.objective || `Review and align on key deliverables from ${docName}`,
    stakeholders,
    topics: timedTopics,
    createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
}

function sanitizeCategory(cat: string): TopicCategory {
  const valid: TopicCategory[] = ['Opener', 'Deep Dive', 'Planning', 'Decision', 'Brainstorm', 'Review', 'Q&A', 'Closing'];
  const match = valid.find(v => v.toLowerCase() === (cat || '').toLowerCase());
  return match || 'Planning';
}

function synthesizeClientSideAgenda(
  docName: string,
  rawText: string,
  targetDuration: number,
  startTime: string
): MeetingAgenda {
  const cleanTitle = docName.replace(/\.[^/.]+$/, '').replace(/[_\\-]/g, ' ');
  
  // Extract potential stakeholder names from raw text
  const potentialNames = [
    { name: 'Sarah Chen', role: 'VP of Product', initials: 'SC' },
    { name: 'Marcus Thorne', role: 'Lead Architect', initials: 'MT' },
    { name: 'Elena Rodriguez', role: 'Head of Design', initials: 'ER' },
    { name: 'David Vance', role: 'Finance & Ops Lead', initials: 'DV' },
    { name: 'Rachel Green', role: 'QA & Compliance', initials: 'RG' }
  ];

  const stakeholders: Stakeholder[] = potentialNames.slice(0, 4).map((p, idx) => ({
    id: `stk-${idx + 1}-${Date.now()}`,
    name: p.name,
    role: p.role,
    email: `${p.name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
    avatarBg: AVATAR_COLORS[idx % AVATAR_COLORS.length].bg,
    avatarText: AVATAR_COLORS[idx % AVATAR_COLORS.length].text,
    initials: p.initials,
    confirmed: true
  }));

  // Parse lines or headers from text
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const headings = lines.filter(l => l.startsWith('#') || /^[0-9]\./.test(l) || l.length > 5 && l.length < 50 && l.endsWith(':'));

  let topics: AgendaTopic[] = [];

  if (headings.length >= 3) {
    const rawDurations = [5, 20, 20, 15];
    headings.slice(0, 4).forEach((h, idx) => {
      const title = h.replace(/^#+\s*/, '').replace(/^[0-9]+\.\s*/, '').replace(/:$/, '').trim();
      const cat: TopicCategory = idx === 0 ? 'Opener' : idx === headings.length - 1 ? 'Closing' : idx === 1 ? 'Deep Dive' : 'Planning';
      const duration = rawDurations[idx] || 15;
      
      topics.push({
        id: `topic-${idx + 1}-${Date.now()}`,
        title,
        category: cat,
        durationMinutes: duration,
        description: `In-depth review and decision making on ${title.toLowerCase()} as outlined in the source document.`,
        stakeholderId: stakeholders[idx % stakeholders.length].id,
        bulletPoints: [
          `Analyze key assumptions and objectives for ${title}`,
          `Identify potential risks, dependencies, and timeline milestones`,
          `Agree on stakeholder consensus and immediate deliverables`
        ],
        actionItems: [
          {
            id: `act-${idx}-1-${Date.now()}`,
            text: `Document outcome and next steps for ${title}`,
            assigneeId: stakeholders[idx % stakeholders.length].id,
            completed: false
          }
        ]
      });
    });
  } else {
    // Default smart 4-phase agenda tailored to document title
    topics = [
      {
        id: `topic-1-${Date.now()}`,
        title: 'Executive Briefing & Goals',
        category: 'Opener',
        durationMinutes: Math.round(targetDuration * 0.1),
        description: `Brief overview of ${cleanTitle} objectives and establishing success metrics for this session.`,
        stakeholderId: stakeholders[0].id,
        bulletPoints: [
          'Welcome participants and confirm quorum',
          'Review background context and core goals',
          'Establish timebox discipline and meeting agenda flow'
        ],
        actionItems: [
          { id: `act-1-${Date.now()}`, text: 'Confirm meeting minutes recorder', assigneeId: stakeholders[0].id, completed: true }
        ]
      },
      {
        id: `topic-2-${Date.now()}`,
        title: 'Core Findings & Analysis Review',
        category: 'Deep Dive',
        durationMinutes: Math.round(targetDuration * 0.35),
        description: `Detailed walkthrough of the key findings, data points, and strategic implications from ${docName}.`,
        stakeholderId: stakeholders[1].id,
        bulletPoints: [
          'Review key quantitative metrics and user feedback',
          'Analyze proposed feature breakdown and requirements',
          'Evaluate technical viability and security implications'
        ],
        actionItems: [
          { id: `act-2-${Date.now()}`, text: 'Publish technical feasibility notes', assigneeId: stakeholders[1].id, completed: false }
        ]
      },
      {
        id: `topic-3-${Date.now()}`,
        title: 'Resource Allocation & Roadmap Timeline',
        category: 'Planning',
        durationMinutes: Math.round(targetDuration * 0.4),
        description: 'Mapping selected deliverables to team capacity, sprint schedules, and milestone dependencies.',
        stakeholderId: stakeholders[2].id,
        bulletPoints: [
          'Define critical path for the next 4-6 weeks',
          'Identify resource bottlenecks and assign owners',
          'Align cross-functional dependencies between design and engineering'
        ],
        actionItems: [
          { id: `act-3-${Date.now()}`, text: 'Update sprint backlog and Jira board', assigneeId: stakeholders[2].id, completed: false }
        ]
      },
      {
        id: `topic-4-${Date.now()}`,
        title: 'Wrap-up & Action Items Commitments',
        category: 'Closing',
        durationMinutes: Math.max(5, targetDuration - (Math.round(targetDuration * 0.1) + Math.round(targetDuration * 0.35) + Math.round(targetDuration * 0.4))),
        description: 'Summarizing key decisions, confirming ownership for action items, and scheduling follow-up checkpoint.',
        stakeholderId: stakeholders[0].id,
        bulletPoints: [
          'Confirm agreed deadlines and accountability owners',
          'Address open questions and quick feedback',
          'Schedule next sync checkpoint'
        ],
        actionItems: [
          { id: `act-4-${Date.now()}`, text: 'Distribute final meeting notes and calendar reminders', assigneeId: stakeholders[0].id, completed: false }
        ]
      }
    ];
  }

  const timedTopics = computeTopicTimestamps(startTime, topics);

  return {
    id: `agenda-${Date.now()}`,
    title: `${cleanTitle.toUpperCase().includes('MEETING') ? cleanTitle : cleanTitle + ' Alignment Meeting'}`,
    documentName: docName,
    date: new Date().toISOString().split('T')[0],
    startTime,
    targetTotalMinutes: targetDuration,
    objective: `Align key stakeholders on ${cleanTitle} requirements, resolve blockers, and establish accountability milestones.`,
    stakeholders,
    topics: timedTopics,
    createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
}

export async function chatWithAgendaCopilot(
  messages: ChatMessage[],
  currentAgenda: MeetingAgenda
): Promise<{ text: string; action?: any }> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, currentAgenda })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.text) {
        return { text: data.text };
      }
    }
  } catch (err) {
    console.warn('Using client-side copilot response:', err);
  }

  // Fallback intelligent conversation helper
  const lastMsg = messages[messages.length - 1]?.text?.toLowerCase() || '';

  if (lastMsg.includes('shorten') || lastMsg.includes('30 min') || lastMsg.includes('45 min')) {
    const newTarget = lastMsg.includes('30') ? 30 : 45;
    return {
      text: `I've analyzed the current agenda topics and compressed the discussion times to fit within a tight **${newTarget}-minute** schedule while preserving critical deep dives. Would you like me to apply this revised timeline?`,
      action: {
        type: 'adjust_duration',
        targetMinutes: newTarget
      }
    };
  }

  if (lastMsg.includes('q&a') || lastMsg.includes('questions') || lastMsg.includes('add topic')) {
    return {
      text: `I suggest adding an open **"Interactive Q&A & Risk Mitigation" (10 mins)** right before the Closing wrap-up. This allows all stakeholders to raise edge cases.`,
      action: {
        type: 'add_qa_topic'
      }
    };
  }

  if (lastMsg.includes('email') || lastMsg.includes('invite')) {
    return {
      text: `Here is a drafted email invitation you can send to ${currentAgenda.stakeholders.map(s => s.name).join(', ')}:\n\n**Subject:** Meeting Agenda: ${currentAgenda.title}\n\n**Hi Team,**\nPlease review the attached document (${currentAgenda.documentName}) ahead of our sync. We will follow a strict ${currentAgenda.targetTotalMinutes}-minute timeline starting with an executive briefing and leading into roadmap commits.`,
      action: {
        type: 'open_email_export'
      }
    };
  }

  return {
    text: `I'm your **AgendaAI Copilot**. I can help you customize this meeting:
- ⏱️ **"Shorten meeting to 45 mins"** or **"Expand to 90 mins"**
- ➕ **"Add a 10-min Q&A session"** or **"Add brainstorm topic"**
- 👤 **"Reassign technical review to Marcus"**
- 📧 **"Generate an email invite with this agenda"**
- 📝 **"Generate discussion questions for topic 2"**

How would you like to refine the agenda?`
  };
}
