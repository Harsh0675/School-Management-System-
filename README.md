# School Management System

A modern web application built with React, TypeScript, and Vite for managing school operations.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **bun** package manager
- **Gemini API Key** (for AI features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Harsh0675/School-Management-System-.git
cd School-Management-System-
```

2. **Install dependencies**

Using npm:
```bash
npm install
```

Or using bun:
```bash
bun install
```

3. **Set up environment variables**

Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
GEMINI_API_KEY=your_gemini_api_key_here
APP_URL=http://localhost:3000
```

### Running the Application

#### Development Mode
```bash
npm run dev
# or
bun run dev
```

The application will start at `http://localhost:3000`

#### Build for Production
```bash
npm run build
# or
bun run build
```

#### Preview Production Build
```bash
npm run preview
# or
bun run preview
```

#### Type Checking
```bash
npm run lint
# or
bun run lint
```

#### Clean Build Artifacts
```bash
npm run clean
# or
bun run clean
```

## 📦 Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **UI Components**: Lucide React
- **Animations**: Motion & Canvas Confetti
- **AI Integration**: Google Generative AI (@google/genai)
- **Backend**: Express.js
- **Runtime**: Bun (optional, but recommended)

## 📁 Project Structure

```
├── src/                    # Source code
├── public/                 # Static assets
├── index.html             # Main HTML entry point
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── .env.example           # Environment variables template
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Generative AI API key for AI features | Yes |
| `APP_URL` | Base URL of the application | Yes |

Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## 🛠️ Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check TypeScript types |
| `npm run clean` | Remove dist folder and build artifacts |

### Project Configuration

- **TypeScript**: Configured for module type with strict settings
- **Vite**: Configured with React plugin for HMR and optimized builds
- **Tailwind CSS**: v4 with Vite plugin support

## 📝 License

This project is provided as-is for educational and commercial use.

## 👤 Author

[Harsh0675](https://github.com/Harsh0675)

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

**Happy coding! 🎉**
