# School Management System

A modern **React + TypeScript** web application for organizing school operations through a responsive, component-driven interface. The project uses Vite for development/build tooling and includes an AI integration layer for Gemini-powered features.

## ✨ Highlights

- School operations management interface
- React 19 + TypeScript frontend
- Responsive Tailwind CSS styling
- Lucide React icons
- Motion-based interactions and visual effects
- Gemini AI integration capability
- Vite development and production workflow
- npm and Bun-compatible commands

## 🧩 Architecture

```text
React + TypeScript application
          ↓
Reusable UI components
          ↓
Client-side application logic
          ↓
Vite production build
          ↓
Static web deployment
```

The repository is primarily a frontend application. AI/API credentials should be handled through appropriate environment or server-side configuration rather than exposed as public client secrets.

## 🛠️ Technology Stack

| Technology | Role |
| --- | --- |
| React 19 | UI architecture |
| TypeScript | Type-safe development |
| Vite 6 | Development server and bundling |
| Tailwind CSS 4 | Styling |
| Lucide React | Icons |
| Motion | Interface animation |
| Canvas Confetti | Visual feedback |
| `@google/genai` | Gemini AI integration |
| Express | Server-side capability included by the project dependencies |

## 🚀 Getting Started

### Requirements

- Node.js 18+
- npm or Bun
- Gemini API credentials if AI features are enabled

### 1. Clone

```bash
git clone https://github.com/Harsh0675/School-Management-System-.git
cd School-Management-System-
```

### 2. Install

```bash
npm install
```

Or:

```bash
bun install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Add the required local configuration to `.env` rather than committing real credentials.

### 4. Start development

```bash
npm run dev
```

The configured Vite development server runs on **port 3000**.

## 📦 Production workflow

Build the application:

```bash
npm run build
```

Preview the production output:

```bash
npm run preview
```

Type-check the project:

```bash
npm run lint
```

Clean generated build artifacts:

```bash
npm run clean
```

## 📁 Project Structure

```text
School-Management-System-/
├── src/                # React + TypeScript source
├── public/             # Static assets
├── index.html          # Application entry document
├── package.json        # Scripts and dependencies
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── .env.example        # Environment template
└── README.md           # Documentation
```

## 🔐 Security notes

- Keep API keys out of Git history.
- Use `.env` for local development configuration.
- Treat browser-visible environment values as public.
- For production AI integrations, prefer a server-side proxy when a provider credential must remain private.

## 🎯 Portfolio value

This project demonstrates modern frontend engineering with React, TypeScript, utility-first CSS, animation, AI SDK integration, environment configuration, and a production-oriented Vite workflow.

## 📄 License

The repository currently describes the project as available for educational and commercial use. Review the repository's license terms before redistribution.

## 👤 Author

**Harsh0675** — https://github.com/Harsh0675
