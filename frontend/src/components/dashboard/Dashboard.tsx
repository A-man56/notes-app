import React from 'react';
import { Header } from './Header';
import { WelcomeSection } from './WelcomeSection';
import { CreateNote } from '../notes/CreateNote';
import { NoteCard } from '../notes/NoteCard';
import { useNotes } from '../../hooks/useNotes';
import { Loader2, FileText } from 'lucide-react';

export function Dashboard() {
  const { notes, loading, error, createNote, updateNote, deleteNote } = useNotes();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection />

        <div className="space-y-6">
          <CreateNote onCreateNote={createNote} />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">Error: {error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Your Notes</h3>
              <span className="text-sm text-gray-500">{notes.length} notes</span>
            </div>

            {notes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
                <p className="text-gray-500">Create your first note to get started!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onUpdate={updateNote}
                    onDelete={deleteNote}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}