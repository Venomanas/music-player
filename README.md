# 🎵 Music Player

A modern, feature-rich web music player built with Next.js and React, supporting multi-language song collections with an intuitive user interface.

## 🚀 Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) - React framework for production
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [Lucide React](https://lucide.dev/) - Beautiful icon library
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library
- **Audio Engine**: [Howler.js](https://howlerjs.com/) - Audio library for the modern web
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) - Small, fast state management
- **Backend**: [Supabase](https://supabase.com/) - Open source Firebase alternative
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) - Dark mode support
- **Notifications**: [react-hot-toast](https://react-hot-toast.com/) - Lightweight toast notifications

## ✨ Features

- 🎧 Multi-language music library (Hindi, English, Spanish, Japanese)
- 🎨 Modern, responsive UI with dark mode support
- 🎵 Advanced audio controls with Howler.js
- 📱 Mobile-friendly design
- 🔍 Filter songs by genre, mood, and language
- ⚡ Fast performance with Next.js optimization

## 🛠️ Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 📁 Project Structure

```
music-player/
├── src/
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── data/         # Song data (hindiSongs.ts)
│   ├── lib/          # Utilities and helpers
│   └── types/        # TypeScript type definitions
├── public/
│   ├── music/        # Audio files (.mp3)
│   └── coverImage/   # Album cover images
└── package.json      # Project dependencies
```

## 🎵 Adding Songs

Songs are managed in `src/data/hindiSongs.ts`. Each song entry includes:

- Title, artist, album
- Duration, year, genre, mood
- Language (hindi, english, spanish, japanese, etc.)
- Audio file path and cover image path

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📄 License

Private project - All rights reserved.
