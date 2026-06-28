import { useState, useEffect } from 'react';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Check, Settings, List, Circle } from 'lucide-react';
import api from '../services/api';

const HistoryPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/history');
        setEvents(response.data);
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };
    fetchHistory();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done': return Check;
      case 'In Progress': return Settings;
      case 'To Do': return List;
      default: return Circle;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return '#22C55E'; // Tailwind green-500
      case 'In Progress': return '#3B82F6'; // Tailwind blue-500
      case 'To Do': return '#64748B'; // Tailwind slate-500
      default: return '#94A3B8';
    }
  };

  const customizedMarker = (item) => {
    const IconComponent = getStatusIcon(item.to_status);
    return (
      <span 
        className="flex w-1.5rem h-1.5rem align-items-center justify-content-center text-white border-circle z-1 shadow-sm"
      >
        <IconComponent size={14} strokeWidth={3} color='black' />
      </span>
    );
  };

  const customizedContent = (item) => {
    return (
      <div className="bg-white border border-gray-200 rounded p-2 mb-4 shadow-sm text-sm">
        <div className="font-semibold text-gray-800">{item.card_title}</div>
        <div className="text-gray-500 text-xs mt-1">
          Moved to <strong className="text-gray-700">{item.to_status}</strong> (from {item.from_status})
        </div>
      </div>
    );
  };

  const customizedOpposite = (item) => {
    const date = new Date(item.moved_at);
    return (
      <div className="text-xs text-gray-500 font-medium pt-1 pr-3 text-right">
        <div>{date.toLocaleDateString()}</div>
        <div className="mt-1">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Global Timeline</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No history recorded yet.</p>
        ) : (
          <Timeline 
            value={events} 
            opposite={customizedOpposite} 
            content={customizedContent} 
            marker={customizedMarker}
            className="w-full customized-timeline"
          />
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
