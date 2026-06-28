import { useState, useEffect } from 'react';
import BoardColumn from '../components/BoardColumn';
import api from '../services/api';
import socket from '../services/socket';
import { Users } from 'lucide-react';

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
    
    // Listen for live user count
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

  return (
    <div className="min-h-screen bg-blue-600 p-4 md:p-8 font-sans">
      <header className="mb-8 flex justify-between items-center bg-blue-700/50 p-4 rounded-xl text-white shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trello Board</h1>
          <p className="text-blue-100 text-sm mt-1">Real-time collaboration</p>
        </div>
        <div className="flex items-center gap-6">
          {/* Active Users Indicator */}
          {activeUsers > 0 && (
            <div className="flex items-center gap-2 text-blue-100 bg-blue-800/50 px-3 py-1.5 rounded-full" title="Users currently viewing this board">
              <Users size={16} />
              <span className="text-sm font-medium">{activeUsers} Online</span>
            </div>
          )}
          
          {/* Connection Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-red-500 animate-pulse'}`}></div>
            <span className="text-sm font-medium">{isConnected ? 'Live' : 'Reconnecting...'}</span>
          </div>
        </div>
      </header>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start h-[calc(100vh-180px)]">
        <BoardColumn 
          title="To Do" 
          status="To Do" 
          cards={todoCards} 
          onAddCard={handleAddCard}
          onMoveCard={handleMoveCard}
          onDeleteCard={handleDeleteCard}
          onRenameCard={handleRenameCard}
        />
        <BoardColumn 
          title="In Progress" 
          status="In Progress" 
          cards={inProgressCards} 
          onAddCard={handleAddCard}
          onMoveCard={handleMoveCard}
          onDeleteCard={handleDeleteCard}
          onRenameCard={handleRenameCard}
        />
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
  );
};

export default BoardPage;
