import { useState } from 'react';
import TaskCard from './TaskCard';
import { Plus, X } from 'lucide-react';

const BoardColumn = ({ title, status, cards, onAddCard, onMoveCard, onDeleteCard, onRenameCard }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleDrop = (e) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    if (cardId) {
      onMoveCard(cardId, status);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow dropping
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAddCard(newTitle, status);
      setNewTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div
      className="bg-gray-100 flex flex-col rounded-lg max-h-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="p-3 bg-gray-200 rounded-t-lg font-semibold text-gray-700 flex justify-between items-center shadow-sm">
        <span>{title}</span>
        <span className="text-xs bg-gray-300 text-gray-600 px-2 py-1 rounded-full">{cards.length}</span>
      </div>
      
      <div className="p-3 flex-1 overflow-y-auto min-h-[150px]">
        {cards.map(card => (
          <TaskCard key={card.id} card={card} onDelete={onDeleteCard} onRename={onRenameCard} />
        ))}
      </div>

      <div className="p-3 pt-0">
        {isAdding ? (
          <form onSubmit={handleAddSubmit} className="mt-2">
            <textarea
              autoFocus
              className="w-full p-2 text-sm border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows="2"
              placeholder="Enter a title for this card..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddSubmit(e);
                }
              }}
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Add card
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewTitle('');
                }}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={20} />
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 w-full p-2 rounded transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
};

export default BoardColumn;
