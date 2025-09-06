import React, { useState, useEffect } from 'react';
import { NotesList } from './NotesList';
import { NoteEditor } from './NoteEditor';
import { Note } from '../types';
import { storageService } from '../services/storage';
import { Plus } from 'lucide-react';

export function NotesTab() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const loadedNotes = await storageService.getNotes();
    setNotes(loadedNotes);
  };

  const handleCreateNote = () => {
    setIsCreating(true);
    setEditingNote(null);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsCreating(false);
  };

  const handleSaveNote = async (note: Note) => {
    if (editingNote) {
      await storageService.updateNote(note);
    } else {
      await storageService.addNote(note);
    }
    await loadNotes();
    setEditingNote(null);
    setIsCreating(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    await storageService.deleteNote(noteId);
    await loadNotes();
  };

  const handleCancel = () => {
    setEditingNote(null);
    setIsCreating(false);
  };

  if (isCreating || editingNote) {
    return (
      <NoteEditor
        note={editingNote}
        onSave={handleSaveNote}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={handleCreateNote}
          className="w-full bg-white text-black py-2 px-4 rounded font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          CREATE NOTE
        </button>
      </div>
      
      <div className="flex-1 overflow-auto">
        <NotesList
          notes={notes}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>
    </div>
  );
}