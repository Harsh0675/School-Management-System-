import { MeetingAgenda, Stakeholder } from '../types/agenda';
import { formatTime12h, formatDurationHuman } from './timeUtils';

export function generateMarkdownAgenda(agenda: MeetingAgenda): string {
  const totalMinutes = agenda.topics.reduce((acc, t) => acc + (t.durationMinutes || 0), 0);
  
  let md = `# ${agenda.title}\n\n`;
  md += `**Date:** ${agenda.date || 'TBD'} | **Time:** ${formatTime12h(agenda.startTime)} (${formatDurationHuman(totalMinutes)})\n`;
  if (agenda.locationOrLink) {
    md += `**Location / Link:** ${agenda.locationOrLink}\n`;
  }
  md += `**Source Document:** ${agenda.documentName}\n\n`;
  
  if (agenda.objective) {
    md += `## Meeting Objective\n${agenda.objective}\n\n`;
  }
  
  md += `## Stakeholders & Attendees\n`;
  agenda.stakeholders.forEach(s => {
    md += `- **${s.name}** (${s.role}) - ${s.email}\n`;
  });
  md += `\n`;
  
  md += `## Agenda Timeline\n\n`;
  agenda.topics.forEach((t, i) => {
    const stakeholder = agenda.stakeholders.find(s => s.id === t.stakeholderId);
    md += `### ${i + 1}. [${t.startTime || ''} - ${t.endTime || ''}] ${t.title} (${t.durationMinutes} mins) - *${t.category}*\n`;
    if (stakeholder) {
      md += `**Lead:** ${stakeholder.name} (${stakeholder.role})\n\n`;
    }
    md += `${t.description}\n\n`;
    
    if (t.bulletPoints && t.bulletPoints.length > 0) {
      md += `**Discussion Points:**\n`;
      t.bulletPoints.forEach(bp => {
        md += `- ${bp}\n`;
      });
      md += `\n`;
    }
    
    if (t.actionItems && t.actionItems.length > 0) {
      md += `**Action Items:**\n`;
      t.actionItems.forEach(ai => {
        const assignee = agenda.stakeholders.find(s => s.id === ai.assigneeId);
        md += `- [${ai.completed ? 'x' : ' '}] ${ai.text}${assignee ? ` (*Assignee: ${assignee.name}*)` : ''}\n`;
      });
      md += `\n`;
    }
    md += `---\n\n`;
  });
  
  md += `*Generated automatically with AgendaAI on ${new Date().toLocaleDateString()}*\n`;
  return md;
}

export function generateEmailInvite(agenda: MeetingAgenda): { subject: string; body: string } {
  const totalMinutes = agenda.topics.reduce((acc, t) => acc + (t.durationMinutes || 0), 0);
  const subject = `[Meeting Agenda] ${agenda.title} - ${agenda.date} at ${formatTime12h(agenda.startTime)}`;
  
  let body = `Hi Team,\n\nPlease find the agenda for our upcoming meeting:\n\n`;
  body += `Meeting: ${agenda.title}\n`;
  body += `Date: ${agenda.date} at ${formatTime12h(agenda.startTime)} (${formatDurationHuman(totalMinutes)})\n`;
  if (agenda.locationOrLink) {
    body += `Link: ${agenda.locationOrLink}\n`;
  }
  body += `\nGoal: ${agenda.objective}\n\n`;
  body += `--- AGENDA TIMELINE ---\n`;
  
  agenda.topics.forEach((t, idx) => {
    const leader = agenda.stakeholders.find(s => s.id === t.stakeholderId);
    body += `${idx + 1}. [${t.startTime} - ${t.durationMinutes}m] ${t.title} (${t.category}) ${leader ? `- Lead: ${leader.name}` : ''}\n`;
    if (t.bulletPoints && t.bulletPoints.length > 0) {
      t.bulletPoints.forEach(pt => {
        body += `   • ${pt}\n`;
      });
    }
  });
  
  body += `\nPlease review the attached source document (${agenda.documentName}) prior to the sync.\n\nBest regards,\nMeeting Organizer`;
  
  return { subject, body };
}

export function downloadIcsFile(agenda: MeetingAgenda) {
  const dateParts = (agenda.date || '2025-01-01').split('-');
  const timeParts = (agenda.startTime || '09:00').split(':');
  
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const day = parseInt(dateParts[2], 10);
  const hour = parseInt(timeParts[0], 10);
  const min = parseInt(timeParts[1], 10);
  
  const startDt = new Date(year, month - 1, day, hour, min);
  const totalMinutes = agenda.topics.reduce((acc, t) => acc + (t.durationMinutes || 0), 0);
  const endDt = new Date(startDt.getTime() + totalMinutes * 60 * 1000);
  
  const formatDateForIcs = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const description = agenda.topics.map(t => `${t.startTime || ''} (${t.durationMinutes}m): ${t.title}`).join('\\n');
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AgendaAI//Meeting Generator//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:agenda-${agenda.id}-${Date.now()}@agendaai.app`,
    `DTSTAMP:${formatDateForIcs(new Date())}`,
    `DTSTART:${formatDateForIcs(startDt)}`,
    `DTEND:${formatDateForIcs(endDt)}`,
    `SUMMARY:${agenda.title.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${agenda.objective ? agenda.objective.replace(/\n/g, '\\n') + '\\n\\n' : ''}${description}`,
    agenda.locationOrLink ? `LOCATION:${agenda.locationOrLink}` : '',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n');
  
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${agenda.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
