import { useState, useEffect } from 'react';
import BoardColumn from '../components/BoardColumn';
import api from '../services/api';
import socket from '../services/socket';
import { Toolbar } from 'primereact/toolbar';
import { Tag } from 'primereact/tag';

const BoardPage = () => {
  const [cards, setCards] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);
  const [error, setError] = useState('');

  // Initial Data Load & Socket Connection
  useEffect(() => {
    // 1. Fetch initial cards from DB
    const fetchCards = async () => {
      try {
        const response = await api.get('/cards');
        setCards(response.data);
      } catch (err) {
        console.error('Failed to fetch cards:', err);
        setError('Could not load board data. Please try again.');
      }
    };
    
    fetchCards();

    // 2. Connect to Socket.IO
    socket.connect();
    
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('active_users', (count) => setActiveUsers(count));
    
    // 3. Listen for real-time events
    socket.on('card_created', (newCard) => {
      setCards((prev) => {
        if (prev.find(c => c.id === newCard.id)) return prev;
        return [...prev, newCard];
      });
    });

    socket.on('card_updated', (updatedCard) => {
      setCards((prev) => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    });

    socket.on('card_deleted', (deletedId) => {
      setCards((prev) => prev.filter(c => String(c.id) !== String(deletedId)));
    });

    // Cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('active_users');
      socket.off('card_created');
      socket.off('card_updated');
      socket.off('card_deleted');
      socket.disconnect();
    };
  }, []);

  // CRUD Handlers
  const handleAddCard = async (title, status) => {
    try {
      const response = await api.post('/cards', { title, status, position: 0 });
      setCards((prev) => {
        if (prev.find(c => c.id === response.data.id)) return prev;
        return [...prev, response.data];
      });
    } catch (err) {
      console.error('Error adding card:', err);
    }
  };

  const handleMoveCard = async (cardId, newStatus) => {
    const cardToMove = cards.find(c => String(c.id) === String(cardId));
    if (!cardToMove || cardToMove.status === newStatus) return;

    try {
      setCards((prev) => prev.map(c => 
        String(c.id) === String(cardId) ? { ...c, status: newStatus } : c
      ));

      await api.put(`/cards/${cardId}`, { status: newStatus });
    } catch (err) {
      console.error('Error moving card:', err);
      const response = await api.get('/cards');
      setCards(response.data);
    }
  };

  const handleRenameCard = async (cardId, newTitle) => {
    try {
      setCards((prev) => prev.map(c => 
        String(c.id) === String(cardId) ? { ...c, title: newTitle } : c
      ));
      await api.put(`/cards/${cardId}`, { title: newTitle });
    } catch (err) {
      console.error('Error renaming card:', err);
      const response = await api.get('/cards');
      setCards(response.data);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      setCards((prev) => prev.filter(c => String(c.id) !== String(cardId)));
      await api.delete(`/cards/${cardId}`);
    } catch (err) {
      console.error('Error deleting card:', err);
      const response = await api.get('/cards');
      setCards(response.data);
    }
  };

  const todoCards = cards.filter(c => c.status === 'To Do');
  const inProgressCards = cards.filter(c => c.status === 'In Progress');
  const doneCards = cards.filter(c => c.status === 'Done');

  const startContent = (
    <div className="flex align-items-center gap-2">
      <i className="pi pi-th-large text-3xl text-blue-500 mr-2"></i>
      <div>
        <h1 className="text-2xl font-bold m-0 tracking-tight text-gray-800">Trello Board</h1>
        <p className="text-gray-500 text-sm m-0 mt-1">Real-time collaboration</p>
      </div>
    </div>
  );

  const endContent = (
    <div className="flex align-items-center gap-4">
      {activeUsers > 0 && (
        <Tag 
          icon="pi pi-users" 
          severity="info" 
          value={`${activeUsers} Online`} 
          className="text-sm px-3 py-2 shadow-sm rounded-full"
        ></Tag>
      )}
      
      <Tag 
        icon={isConnected ? "pi pi-bolt" : "pi pi-spin pi-spinner"} 
        severity={isConnected ? "success" : "danger"} 
        value={isConnected ? "Live" : "Reconnecting"} 
        className="text-sm px-3 py-2 shadow-sm rounded-full"
      ></Tag>
    </div>
  );

  return (
    <div className="min-h-screen surface-ground p-4 md:p-6 font-sans">
      <Toolbar start={startContent} end={endContent} className="mb-5 bg-white border-none shadow-sm rounded-xl p-4" />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-5 flex align-items-center gap-2">
          <i className="pi pi-exclamation-triangle"></i>
          {error}
        </div>
      )}

      <div className="flex flex-nowrap md:grid md:grid-cols-3 gap-6 h-[calc(100vh-160px)] pb-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory">
        <div className="w-[85vw] md:w-auto shrink-0 snap-center h-full">
          <BoardColumn 
            title="To Do" 
            status="To Do" 
            cards={todoCards} 
            onAddCard={handleAddCard}
            onMoveCard={handleMoveCard}
            onDeleteCard={handleDeleteCard}
            onRenameCard={handleRenameCard}
          />
        </div>
        <div className="w-[85vw] md:w-auto shrink-0 snap-center h-full">
          <BoardColumn 
            title="In Progress" 
            status="In Progress" 
            cards={inProgressCards} 
            onAddCard={handleAddCard}
            onMoveCard={handleMoveCard}
            onDeleteCard={handleDeleteCard}
            onRenameCard={handleRenameCard}
          />
        </div>
        <div className="w-[85vw] md:w-auto shrink-0 snap-center h-full">
          <BoardColumn 
            title="Done" 
            status="Done" 
            cards={doneCards} 
            onAddCard={handleAddCard}
            onMoveCard={handleMoveCard}
            onDeleteCard={handleDeleteCard}
            onRenameCard={handleRenameCard}
          />
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
