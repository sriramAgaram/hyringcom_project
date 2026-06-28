import { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';

const TaskCard = ({ card, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);

  const handleDragStart = (e) => {
    if (isEditing) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('cardId', card.id);
  };

  const handleRenameSubmit = () => {
    if (editTitle.trim() && editTitle !== card.title) {
      onRename(card.id, editTitle);
    }
    setIsEditing(false);
  };

  return (
    <div
      draggable={!isEditing}
      onDragStart={handleDragStart}
      className={`bg-white p-3 rounded shadow-sm border border-gray-200 mb-3 group relative transition-shadow ${!isEditing ? 'cursor-grab active:cursor-grabbing hover:shadow-md' : ''}`}
    >
      {isEditing ? (
        <input
          autoFocus
          className="w-full text-sm text-gray-800 p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleRenameSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRenameSubmit();
            if (e.key === 'Escape') {
              setEditTitle(card.title);
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <p className="text-gray-800 text-sm font-medium pr-12 break-words">{card.title}</p>
      )}
      
      {!isEditing && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white pl-1 rounded">
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-blue-500"
            title="Rename Card"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="text-gray-400 hover:text-red-500"
            title="Delete Card"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
