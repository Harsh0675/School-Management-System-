import { DocumentUpload, MeetingAgenda } from '../types/agenda';

export const SAMPLE_DOCUMENTS: DocumentUpload[] = [
  {
    id: 'doc-1',
    name: 'Product_Specs_Q4.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadDate: 'Nov 14, 2024',
    status: 'processed',
    summary: 'Q4 Product Roadmap & Feature Specification including AI Copilot, Real-time Collaborative Canvases, and Enterprise SSO integrations.',
    rawText: `
# Product Specification Document: Q4 Core Strategic Deliverables
Author: Sarah Chen (VP of Product)
Stakeholders: Marcus Thorne (Lead Architect), Elena Rodriguez (Head of Design), David Vance (Finance & Ops), Rachel Green (QA Lead)

## 1. Executive Summary & Goals
In Q4, our primary goal is to accelerate enterprise client acquisition by shipping three major initiatives:
1. Real-time Multi-tenant Data Pipelines
2. AI-assisted Meeting & Workflow Automation
3. Enterprise RBAC and Audit Compliance

## 2. Feature Prioritization & Scope Breakdown
- Feature A (Critical Path): AI Agenda Builder & Timeline Synthesizer (Est. 4 sprint weeks). High impact for corporate clients.
- Feature B (High Priority): SOC2 Audit Trail Logging & Granular Permission Scopes.
- Feature C (Medium Priority): Integration with Slack & Microsoft Teams Webhooks.
- Feature D (Exploratory): Custom Webhook rate-limiting dashboard.

## 3. Architecture & Technical Dependencies
Marcus Thorne to review cloud infrastructure capacity in Asia-East and US-Central regions. Current database IOPS limits must be upgraded before enterprise beta launch.

## 4. Resource Allocation & Sprint Timeline
- Sprint 24 (Nov 15 - Nov 29): Backend architecture freeze and initial UI mockups by Elena.
- Sprint 25 (Dec 01 - Dec 15): Core feature code complete and integration testing.
- Sprint 26 (Dec 16 - Dec 28): Security penetration test and soft rollout to beta cohort.

## 5. Risk Assessment & Mitigations
- Potential delay in third-party API verification. Mitigation: Use mock sandbox adapters for initial staging tests.
- Budget cap: Cloud infrastructure expansion must stay within $14,500/month envelope.

## 6. Action Items & Next Steps
- Finalize priority ranking of 12 candidate sub-features.
- Allocate engineering squad leads for Sprint 24.
- Schedule security audit review with external partners.
`
  },
  {
    id: 'doc-2',
    name: 'Market_Research_Analysis.docx',
    type: 'DOCX',
    size: '4.8 MB',
    uploadDate: 'Nov 10, 2024',
    status: 'archived',
    summary: 'Comprehensive market study on enterprise productivity tooling, pricing tier benchmarks, and customer churn analysis.',
    rawText: `
# Enterprise Productivity Tools: Q3/Q4 Market Research & Competitor Benchmark
Compiled by: Marcus Vance & Elena Rodriguez

## Key Findings:
1. 78% of enterprise engineering teams reported losing 4.5 hours per week in unstructured meetings without clear agendas.
2. 64% of managers prefer visual timeline agendas with allocated discussion budgets per topic.
3. Pricing tolerance for AI-powered operational tools averages $18-24 per user/month.

## Recommendations for Product Positioning:
- Emphasize time-saving and automatic stakeholder assignment.
- Provide seamless calendar (.ics) and markdown exports for executive summaries.
`
  },
  {
    id: 'doc-3',
    name: 'Engineering_Architecture_Review.pdf',
    type: 'PDF',
    size: '1.8 MB',
    uploadDate: 'Nov 08, 2024',
    status: 'processed',
    summary: 'System architecture review for microservices migration, low-latency streaming, and database schema partitioning.',
    rawText: `
# Engineering Architecture Review & Performance Optimization Plan
Lead Architect: Marcus Thorne
Attendees: Sarah Chen, Alex Rivera, Dev Team Leads

1. Overview of Current Bottlenecks
- API response latency spikes under peak concurrency (95th percentile > 450ms).
- Need for Redis caching layer and connection pooling.

2. Proposed Microservice Architecture
- Splitting monolithic agenda engine into event-driven serverless workers.
- Zero-downtime database migration strategy.

3. Security & Compliance
- Data encryption at rest and in transit.
- Automated vulnerability scanning in CI/CD pipeline.
`
  }
];

export const INITIAL_AGENDA: MeetingAgenda = {
  id: 'agenda-q4-strategy',
  title: 'Q4 Strategy Alignment Meeting',
  documentId: 'doc-1',
  documentName: 'Product_Specs_Q4.pdf',
  date: '2024-11-14',
  startTime: '09:00',
  targetTotalMinutes: 60,
  locationOrLink: 'https://meet.google.com/evs-q4-strat',
  objective: 'Align executive stakeholders on Q4 feature priorities, resolve technical architecture blockers, and commit to Sprint 24-26 delivery milestones.',
  createdDate: 'Nov 14, 2024',
  stakeholders: [
    {
      id: 'stk-1',
      name: 'Sarah Chen',
      role: 'VP of Product',
      email: 'sarah.chen@company.com',
      avatarBg: 'bg-indigo-100',
      avatarText: 'text-indigo-700',
      initials: 'SC',
      confirmed: true
    },
    {
      id: 'stk-2',
      name: 'Marcus Thorne',
      role: 'Lead Architect',
      email: 'marcus.t@company.com',
      avatarBg: 'bg-emerald-100',
      avatarText: 'text-emerald-700',
      initials: 'MT',
      confirmed: true
    },
    {
      id: 'stk-3',
      name: 'Elena Rodriguez',
      role: 'Head of Design',
      email: 'elena.r@company.com',
      avatarBg: 'bg-amber-100',
      avatarText: 'text-amber-700',
      initials: 'ER',
      confirmed: true
    },
    {
      id: 'stk-4',
      name: 'David Vance',
      role: 'Finance & Ops Lead',
      email: 'david.v@company.com',
      avatarBg: 'bg-rose-100',
      avatarText: 'text-rose-700',
      initials: 'DV',
      confirmed: true
    },
    {
      id: 'stk-5',
      name: 'Rachel Green',
      role: 'QA & Compliance Lead',
      email: 'rachel.g@company.com',
      avatarBg: 'bg-purple-100',
      avatarText: 'text-purple-700',
      initials: 'RG',
      confirmed: false
    }
  ],
  topics: [
    {
      id: 'topic-1',
      title: 'Executive Briefing & Goals',
      category: 'Opener',
      durationMinutes: 5,
      description: 'Brief overview of the Q4 document objectives and establishing the definition of success for this meeting.',
      stakeholderId: 'stk-1',
      bulletPoints: [
        'Welcome attendees and align on primary target outcomes',
        'Review high-level Q4 OKRs: Enterprise client acquisition & pipeline reliability',
        'Set expectations for 60-minute timebox discipline'
      ],
      actionItems: [
        { id: 'act-1-1', text: 'Confirm meeting minutes scribe', assigneeId: 'stk-1', completed: true }
      ]
    },
    {
      id: 'topic-2',
      title: 'Feature Prioritization Review',
      category: 'Deep Dive',
      durationMinutes: 20,
      description: 'Analyzing the 12 proposed features. Vote on High/Medium/Low priority based on market research results in section 3.2.',
      stakeholderId: 'stk-2',
      bulletPoints: [
        'Review candidate features: AI Agenda Builder vs SOC2 Audit Logging vs Webhooks',
        'Evaluate engineering complexity scoring & customer demand signals',
        'Reach consensus on top 3 must-have deliverables for Q4 release'
      ],
      actionItems: [
        { id: 'act-2-1', text: 'Lock in scope freeze for Sprint 24', assigneeId: 'stk-2', completed: false },
        { id: 'act-2-2', text: 'Publish final backlog priority list in Jira', assigneeId: 'stk-1', completed: false }
      ]
    },
    {
      id: 'topic-3',
      title: 'Resource Allocation & Timeline',
      category: 'Planning',
      durationMinutes: 25,
      description: 'Mapping selected features to available sprint capacity for Nov/Dec. Identifying critical path dependencies.',
      stakeholderId: 'stk-3',
      bulletPoints: [
        'Review design deliverables & Figma handoff schedule (Elena)',
        'Check backend cloud infra headroom and Asia-East region limits (Marcus)',
        'Budget envelope verification: ensure cloud spend stays under $14,500/mo (David)'
      ],
      actionItems: [
        { id: 'act-3-1', text: 'Deliver UI design kit for core workflow', assigneeId: 'stk-3', completed: false },
        { id: 'act-3-2', text: 'Approve cloud infrastructure budget adjustment', assigneeId: 'stk-4', completed: false }
      ]
    },
    {
      id: 'topic-4',
      title: 'Wrap-up & Action Items',
      category: 'Closing',
      durationMinutes: 10,
      description: 'Summarizing decisions and assigning owners for the next steps mentioned in the wrap-up section.',
      stakeholderId: 'stk-1',
      bulletPoints: [
        'Recap key decisions and agreed timelines',
        'Confirm ownership for all outstanding action items',
        'Schedule next sync for Sprint 24 midpoint check-in'
      ],
      actionItems: [
        { id: 'act-4-1', text: 'Circulate meeting summary and calendar invites', assigneeId: 'stk-1', completed: false }
      ]
    }
  ]
};
