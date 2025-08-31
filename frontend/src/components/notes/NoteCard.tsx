import React, { useState, useEffect } from 'react';
import { Trash2, Edit3, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Note } from '../../lib/api';

interface NoteCardProps {
  note: Note;
  onUpdate: (id: string, updates: { title?: string; content?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function NoteCard({ note, onUpdate, onDelete }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [deleting, setDeleting] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (!isEditing) return;

    const timeoutId = setTimeout(async () => {
      if (editTitle !== note.title || editContent !== note.content) {
        setAutoSaving(true);
        try {
          await onUpdate(note._id, {
            title: editTitle.trim() || 'Untitled',
            content: editContent,
          });
        } finally {
          setAutoSaving(false);
        }
      }
    }, 1000); // Auto-save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [editTitle, editContent, isEditing, note.title, note.content, note._id, onUpdate]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleConfirmEdit = async () => {
    await onUpdate(note._id, {
      title: editTitle.trim() || 'Untitled',
      content: editContent,
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(note._id);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="font-semibold text-lg"
            placeholder="Note title..."
            disabled={autoSaving}
          />
        ) : (
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {note.title}
          </h3>
        )}

        <div className="flex items-center space-x-1 ml-2">
          {autoSaving && (
            <span className="text-xs text-gray-500 mr-2">Saving...</span>
          )}
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleConfirmEdit}
                className="text-green-600 hover:text-green-700 p-1"
                disabled={autoSaving}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-700 p-1"
                disabled={autoSaving}
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="text-gray-600 hover:text-gray-700 p-1"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                loading={deleting}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full h-24 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Write your note content..."
          disabled={autoSaving}
        />
      ) : (
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {note.content || 'No content'}
        </p>
      )}

      <div className="flex justify-between items-center text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
        <span>Created: {formatDate(note.createdAt)}</span>
        {note.updatedAt !== note.createdAt && (
          <span>Updated: {formatDate(note.updatedAt)}</span>
        )}
      </div>
    </div>
  );
}