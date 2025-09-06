import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { aiService } from '../services/ai';
import { storageService } from '../services/storage';
import { Send, Bot, User, Loader } from 'lucide-react';

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Check if user wants a checklist/note
      const isChecklistRequest = /checklist|steps|routine|guide|todo|tasks|plan/i.test(inputText);
      
      if (isChecklistRequest) {
        const { title, tasks } = await aiService.generateNoteFromPrompt(inputText);
        
        // Create and save the note
        const newNote = {
          id: Date.now().toString(),
          title,
          tasks: tasks.map((text, index) => ({
            id: `${Date.now()}-${index}`,
            text,
            completed: false
          })),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await storageService.addNote(newNote);
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I've created a checklist titled "${title}" with ${tasks.length} tasks and saved it to your Notes tab. You can find it there to check off items as you complete them!`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const response = await aiService.generateResponse(inputText);
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <Bot size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">AI Assistant</p>
            <p className="text-sm">Ask me to create checklists, routines, or step-by-step guides!</p>
            <div className="mt-4 text-xs space-y-1">
              <p>Try: "Create a morning routine checklist"</p>
              <p>Or: "Give me workout steps for beginners"</p>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-black" />
              </div>
            )}
            
            <div
              className={`max-w-[280px] p-3 rounded-lg text-sm ${
                message.role === 'user'
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-white'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <div className="text-xs opacity-60 mt-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            {message.role === 'user' && (
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-black" />
            </div>
            <div className="bg-gray-800 text-white p-3 rounded-lg">
              <Loader size={16} className="animate-spin" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask for checklists, routines, or guides..."
            className="flex-1 bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 focus:border-white focus:outline-none text-sm resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-white text-black px-3 py-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}