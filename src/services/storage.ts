import { Note } from '../types';

const STORAGE_KEY = 'bolt_notes';

export const storageService = {
  async getNotes(): Promise<Note[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const notes = JSON.parse(stored);
      return notes.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  },

  async saveNotes(notes: Note[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  },

  async addNote(note: Note): Promise<void> {
    const notes = await this.getNotes();
    notes.unshift(note);
    await this.saveNotes(notes);
  },

  async updateNote(updatedNote: Note): Promise<void> {
    const notes = await this.getNotes();
    const index = notes.findIndex(note => note.id === updatedNote.id);
    if (index !== -1) {
      notes[index] = updatedNote;
      await this.saveNotes(notes);
    }
  },

  async deleteNote(noteId: string): Promise<void> {
    const notes = await this.getNotes();
    const filtered = notes.filter(note => note.id !== noteId);
    await this.saveNotes(filtered);
  }
};