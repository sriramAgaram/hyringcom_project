import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const BoardPage = lazy(() => import('../pages/BoardPage'));

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
          <Route path="/" element={<BoardPage />} />
          {/* Catch-all route can be added here later */}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
