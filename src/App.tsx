import React, { useState } from 'react';
import { NotesTab } from './components/NotesTab';
import { AIChat } from './components/AIChat';

function App() {
  const [activeTab, setActiveTab] = useState<'notes' | 'ai'>('notes');

  return (
    <div className="w-full h-full bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'notes'
              ? 'bg-white text-black'
              : 'bg-black text-white hover:bg-gray-900'
          }`}
        >
          NOTES
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'ai'
              ? 'bg-white text-black'
              : 'bg-black text-white hover:bg-gray-900'
          }`}
        >
          AI CHAT
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'notes' ? <NotesTab /> : <AIChat />}
      </div>
    </div>
  );
}

export default App;