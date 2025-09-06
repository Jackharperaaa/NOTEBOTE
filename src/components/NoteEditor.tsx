import React, { useState, useEffect } from 'react';
import { Note, Task } from '../types';
import { Save, X, Plus } from 'lucide-react';

interface NoteEditorProps {
  note?: Note | null;
  onSave: (note: Note) => void;
  onCancel: () => void;
}

export function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setTasks(note.tasks);
    } else {
      setTitle('');
      setTasks([]);
    }
  }, [note]);

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
    }
  };

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const updateTaskText = (taskId: string, text: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, text } : task
    ));
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const noteToSave: Note = {
      id: note?.id || Date.now().toString(),
      title: title.trim(),
      tasks,
      createdAt: note?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onSave(noteToSave);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="bg-white text-black px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={14} />
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-800 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 focus:border-white focus:outline-none"
          autoFocus
        />
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2 group">
              <input
                type="text"
                value={task.text}
                onChange={(e) => updateTaskText(task.id, e.target.value)}
                className="flex-1 bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 focus:border-white focus:outline-none text-sm"
                placeholder="Task description..."
              />
              <button
                onClick={() => removeTask(task.id)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add new task..."
              className="flex-1 bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 focus:border-white focus:outline-none text-sm"
            />
            <button
              onClick={addTask}
              disabled={!newTaskText.trim()}
              className="p-2 bg-white text-black rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}