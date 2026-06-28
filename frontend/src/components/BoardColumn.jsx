import { useState } from 'react';
import TaskCard from './TaskCard';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Badge } from 'primereact/badge';

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
    e.preventDefault();
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
      className="bg-gray-100 flex flex-col rounded-xl shadow-sm border border-gray-200 h-full max-h-full overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="p-3 bg-white rounded-t-xl font-bold text-gray-700 flex justify-between items-center shadow-sm border-b border-gray-100">
        <span className="text-lg">{title}</span>
        <Badge value={cards.length} size="large" severity="secondary" className="bg-blue-100 text-blue-700 font-bold" />
      </div>
      
      <div className="p-3 flex-1 overflow-y-auto min-h-0">
        {cards.map(card => (
          <TaskCard key={card.id} card={card} onDelete={onDeleteCard} onRename={onRenameCard} />
        ))}
      </div>

      <div className="p-3 pt-0">
        {isAdding ? (
          <form onSubmit={handleAddSubmit} className="mt-2 surface-card p-3 rounded-lg shadow-sm border border-gray-200 bg-white">
            <InputTextarea
              autoFocus
              className="w-full text-sm resize-none mb-2"
              rows={2}
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
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                label="Add card"
                size="small"
                className="p-button-sm p-button-primary"
              />
              <Button
                type="button"
                icon="pi pi-times"
                rounded text severity="secondary"
                aria-label="Cancel"
                onClick={() => {
                  setIsAdding(false);
                  setNewTitle('');
                }}
              />
            </div>
          </form>
        ) : (
          <Button
            label="Add a card"
            icon="pi pi-plus"
            text
            className="w-full text-left text-gray-600 hover:text-gray-900 justify-content-start hover:bg-gray-200 transition-colors py-2"
            onClick={() => setIsAdding(true)}
          />
        )}
      </div>
    </div>
  );
};

export default BoardColumn;
