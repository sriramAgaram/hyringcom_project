import { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { confirmDialog } from 'primereact/confirmdialog';

const TaskCard = ({ card, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [isHovered, setIsHovered] = useState(false);

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

  const confirmDelete = () => {
    confirmDialog({
      message: 'Are you sure you want to delete this task?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => onDelete(card.id)
    });
  };

  return (
    <div
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`mb-3 ${!isEditing ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <div className={`bg-white rounded p-2 shadow-sm border transition-all duration-200 ${isHovered && !isEditing ? 'shadow-md border-blue-300' : 'border-gray-200'}`}>
        <div className="flex justify-between items-center relative min-h-[24px]">
          
          {isEditing ? (
            <div className="w-full flex">
              <InputText
                autoFocus
                className="w-full text-sm p-1"
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
            </div>
          ) : (
            <div className="text-gray-800 text-sm font-medium pr-10 w-full break-words leading-tight">
              {card.title}
            </div>
          )}

          {!isEditing && isHovered && (
            <div className="absolute top-1/2 -translate-y-1/2 right-0 flex gap-1 pl-2 items-center">
              <Button 
                icon="pi pi-pencil" 
                rounded text severity="info" 
                aria-label="Edit" 
                onClick={() => setIsEditing(true)}
                className="w-1.5rem h-1.5rem p-0"
                tooltip="Rename"
                tooltipOptions={{ position: 'top' }}
              />
              <Button 
                icon="pi pi-trash" 
                rounded text severity="danger" 
                aria-label="Delete" 
                onClick={confirmDelete}
                className="w-1.5rem h-1.5rem p-0"
                tooltip="Delete"
                tooltipOptions={{ position: 'top' }}
              />
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
