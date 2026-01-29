import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Ideas } from './pages/Ideas';
import { IdeaDetail } from './pages/IdeaDetail';
import { PRDEditor } from './pages/PRDEditor';
import { TechStackPlanner } from './pages/TechStack';
import { Hackathons } from './pages/Hackathons';
import { Auth } from './pages/Auth';

const ProtectedRoute: React.FC = () => {
  const user = useStore(state => state.user);
  const authReady = useStore(state => state.authReady);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

const AnimatedOutlet: React.FC = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const initAuth = useStore(state => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'font-bold',
          style: {
            borderRadius: '12px',
            border: '2px solid #1E272E',
          }
        }}
      />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout><AnimatedOutlet /></Layout>}>
            <Route index element={<Dashboard />} />
            <Route path="ideas" element={<Ideas />} />
            <Route path="ideas/:id" element={<IdeaDetail />} />
            <Route path="prds/:ideaId" element={<PRDEditor />} />
            <Route path="stack/:ideaId" element={<TechStackPlanner />} />
            <Route path="hackathons" element={<Hackathons />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
