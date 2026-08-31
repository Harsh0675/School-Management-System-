import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/generate-agenda' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              const { docName, rawText, targetDurationMinutes = 60, meetingStyle = 'Standard' } = JSON.parse(bodyStr || '{}');
              const apiKey = process.env.GEMINI_API_KEY;

              if (!apiKey) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, useFallback: true, message: 'No API Key found' }));
                return;
              }

              const ai = new GoogleGenAI({ apiKey });
              const prompt = `You are an expert executive meeting facilitator and agenda strategist.
Given the following document title and content, generate a structured, high-impact meeting agenda with an optimal timeline.

Document Title: ${docName}
Target Total Duration: ${targetDurationMinutes} minutes
Meeting Style / Type: ${meetingStyle}

Document Content:
"""
${(rawText || '').slice(0, 15000)}
"""

You MUST respond strictly with valid JSON conforming to this schema (no markdown fences, pure JSON):
{
  "title": "Clear Meeting Title",
  "objective": "1-2 sentence crisp meeting goal and expected outcome",
  "stakeholders": [
    {
      "name": "Full Name",
      "role": "Job Title / Role",
      "email": "username@company.com",
      "initials": "2 letters uppercase"
    }
  ],
  "topics": [
    {
      "title": "Topic Name",
      "category": "Opener",
      "durationMinutes": 10,
      "description": "Short 1-2 sentence description of what will be covered",
      "stakeholderName": "Exact match to one of the stakeholders name above",
      "bulletPoints": [
        "Key discussion point 1",
        "Key discussion point 2"
      ],
      "actionItems": [
        {
          "text": "Specific actionable deliverable",
          "assigneeName": "Stakeholder Name"
        }
      ]
    }
  ]
}
Category can be: Opener, Deep Dive, Planning, Decision, Brainstorm, Review, Q&A, or Closing.
Note: The sum of topic durationMinutes SHOULD equal approximately ${targetDurationMinutes} minutes.`;

              const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                  responseMimeType: 'application/json'
                }
              });

              const responseText = response.text || '';
              const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(cleaned);

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, data: parsed }));
            } catch (err: any) {
              console.error('Gemini agenda generation error:', err);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, useFallback: true, error: err?.message || 'Error generating agenda' }));
            }
          });
          return;
        }

        if (req.url === '/api/chat' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              const { messages, currentAgenda } = JSON.parse(bodyStr || '{}');
              const apiKey = process.env.GEMINI_API_KEY;

              if (!apiKey) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, useFallback: true }));
                return;
              }

              const ai = new GoogleGenAI({ apiKey });
              const systemInstruction = `You are the AgendaAI Copilot, an AI executive meeting strategist.
You help users refine their meeting agendas, re-time topics, assign stakeholders, suggest interactive formats, draft email invites, and ensure meetings finish on time with clear action items.
Current Meeting Context:
Title: ${currentAgenda?.title}
Duration: ${currentAgenda?.targetTotalMinutes} mins
Topics Count: ${currentAgenda?.topics?.length}
Topics: ${JSON.stringify(currentAgenda?.topics?.map((t: any) => ({ title: t.title, duration: t.durationMinutes, category: t.category })))}
Stakeholders: ${JSON.stringify(currentAgenda?.stakeholders?.map((s: any) => s.name))}

Provide helpful, concise, executive-grade answers. If the user asks to add/modify topics or adjust time, outline the exact suggested updates.`;

              const lastMessage = messages[messages.length - 1]?.text || 'Hello';
              const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: lastMessage,
                config: {
                  systemInstruction
                }
              });

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, text: response.text }));
            } catch (err: any) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, useFallback: true, error: err?.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
