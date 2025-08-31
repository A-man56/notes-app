import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CreateNoteProps {
  onCreateNote: (title: string, content: string) => Promise<void>;
}

export function CreateNote({ onCreateNote }: CreateNoteProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onCreateNote(title.trim(), content.trim());
      setTitle('');
      setContent('');
      setIsCreating(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setTitle('');
    setContent('');
  };

  if (!isCreating) {
    return (
      <Button
        onClick={() => setIsCreating(true)}
        className="w-full mb-6"
        size="lg"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create New Note
      </Button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
          required
          autoFocus
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-24 p-2 border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Write your note content..."
          />
        </div>

        <div className="flex space-x-3">
          <Button
            type="submit"
            loading={loading}
            disabled={!title.trim() || loading}
          >
            Create Note
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}