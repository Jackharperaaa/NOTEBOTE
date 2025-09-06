import React from 'react';
import { Note } from '../types';
import { Edit, Trash2, CheckSquare, Square } from 'lucide-react';
import { storageService } from '../services/storage';

interface NotesListProps {
  notes: Note[];
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
}

export function NotesList({ notes, onEditNote, onDeleteNote }: NotesListProps) {
  const handleToggleTask = async (note: Note, taskId: string) => {
    const updatedNote = {
      ...note,
      tasks: note.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
      updatedAt: new Date()
    };
    
    await storageService.updateNote(updatedNote);
    window.location.reload(); // Simple refresh to update UI
  };

  if (notes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        <CheckSquare size={48} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg mb-2">No notes yet</p>
        <p className="text-sm">Create your first note to get started</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {notes.map((note) => (
        <div key={note.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-medium text-white truncate flex-1">{note.title}</h3>
            <div className="flex gap-2 ml-2">
              <button
                onClick={() => onEditNote(note)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => onDeleteNote(note.id)}
                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {note.tasks.map((task) => (
              <div key={task.id} className="flex items-start gap-2 group">
                <button
                  onClick={() => handleToggleTask(note, task.id)}
                  className="mt-0.5 text-gray-400 hover:text-white transition-colors"
                >
                  {task.completed ? <CheckSquare size={16} /> : <Square size={16} />}
                </button>
                <span
                  className={`text-sm flex-1 transition-all duration-250 ${
                    task.completed
                      ? 'line-through text-gray-500 opacity-60'
                      : 'text-gray-300'
                  }`}
                >
                  {task.text}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-3 text-xs text-gray-500">
            {note.tasks.filter(t => t.completed).length} of {note.tasks.length} completed
          </div>
        </div>
      ))}
    </div>
  );
}