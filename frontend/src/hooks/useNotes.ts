import { useState, useEffect } from 'react';
import { notesAPI, Note } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export function useNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notes
  const fetchNotes = async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await notesAPI.getNotes();
      setNotes(response.data.notes);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  // Create note
  const createNote = async (title: string, content: string = '') => {
    if (!user) return;

    try {
      const response = await notesAPI.createNote({ title, content });
      setNotes(prev => [response.data.note, ...prev]);
      setError(null);
      return response.data.note;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create note');
    }
  };

  // Update note
  const updateNote = async (id: string, updates: { title?: string; content?: string }) => {
    try {
      const response = await notesAPI.updateNote(id, updates);
      setNotes(prev => prev.map(note => note._id === id ? response.data.note : note));
      setError(null);
      return response.data.note;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update note');
    }
  };

  // Delete note
  const deleteNote = async (id: string) => {
    try {
      await notesAPI.deleteNote(id);
      setNotes(prev => prev.filter(note => note._id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete note');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes,
  };
}