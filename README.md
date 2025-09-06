# BOLT NOTES - Chrome Extension

A minimalist, AI-powered note-taking Chrome extension with intelligent checklist generation.

## Features

### 📝 Smart Note Taking
- **Minimalist Design**: Clean black and white interface optimized for focus
- **Auto-Checkbox Generation**: Each typed line automatically becomes a checkable task
- **Interactive Tasks**: Click checkboxes for smooth fade animations and strikethrough effects
- **Local Storage**: All notes persist across browser sessions

### 🤖 AI Assistant Integration
- **Intelligent Content Generation**: AI creates relevant checklists and step-by-step guides
- **Auto-Note Creation**: Keywords like "step-by-step", "routine", "checklist" trigger automatic note generation
- **Smart Categorization**: AI assigns appropriate titles based on content context
- **Seamless Workflow**: Generated content automatically saves to your Notes tab

### 🎨 Design Excellence
- **Extension-Optimized**: Perfect 380x600px popup dimensions
- **Smooth Animations**: 250ms transitions for all interactions
- **Vector Icons**: Scalable Lucide React icons throughout
- **Accessibility**: Proper focus states and keyboard navigation
- **Responsive**: Adapts beautifully to different screen sizes

## Installation (Development)

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the extension
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable "Developer mode"
6. Click "Load unpacked" and select the `dist` folder

## Usage

### Creating Notes
1. Click the "CREATE" button in the Notes tab
2. Enter a descriptive title
3. Type tasks line by line - each line becomes a checkbox automatically
4. Click the save button to store your note

### Using AI Assistant
1. Switch to the "AI CHAT" tab
2. Ask for help with phrases like:
   - "Create a morning routine checklist"
   - "Give me step-by-step workout guide"
   - "Study routine steps"
3. AI will automatically generate and save relevant notes

### Managing Tasks
- Click any checkbox to mark tasks as complete
- Completed tasks show fade animation and strikethrough
- Edit task text directly by clicking on it
- Delete tasks using the X button that appears on hover

## Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React vector icons
- **Build Tool**: Vite with Chrome extension optimizations
- **Storage**: Chrome Extension Storage API + localStorage fallback
- **AI Integration**: Pattern-based mock service (ready for real AI API integration)

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Chrome Extension Manifest

The extension uses Manifest V3 with the following permissions:
- `storage`: For persistent note storage
- `activeTab`: For enhanced user experience

## AI Service Integration

The current implementation uses a sophisticated pattern-matching system that responds to various keywords and generates contextually appropriate checklists. For production deployment, integrate with:

- **Hugging Face Inference API** (free tier available)
- **Cohere API** (generous free tier)
- **OpenAI API** (paid but highly capable)

## File Structure

```
src/
├── components/          # React components
│   ├── AIChat.tsx      # AI assistant interface
│   ├── NoteEditor.tsx  # Note creation/editing
│   ├── NotesList.tsx   # Notes display and management
│   └── NotesTab.tsx    # Notes tab container
├── services/           # Business logic
│   ├── ai.ts          # AI service integration
│   └── storage.ts     # Data persistence
├── types/             # TypeScript definitions
│   └── index.ts       # Shared interfaces
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and animations
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the existing code style
4. Test thoroughly in Chrome extension environment
5. Submit a pull request

## License

MIT License - feel free to use this code for your own projects!