import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';

const BoardPage = lazy(() => import('../pages/BoardPage'));
const HistoryPage = lazy(() => import('../pages/HistoryPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-xl text-gray-500 font-semibold animate-pulse">Loading Application...</div>
  </div>
);

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<BoardPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
