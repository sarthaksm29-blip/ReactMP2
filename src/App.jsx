import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { PlantProvider } from './context/PlantContext';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import LoginPage from './pages/Login';

// Pages
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import PlantDetail from './pages/PlantDetail';
import Schedule from './pages/Schedule';
import Growth from './pages/Growth';
import Gallery from './pages/Gallery';
import Alerts from './pages/Alerts';

import PageTransition from './components/layout/PageTransition';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="plants" element={<PageTransition><Library /></PageTransition>} />
          <Route path="plants/:id" element={<PageTransition><PlantDetail /></PageTransition>} />
          <Route path="schedule" element={<PageTransition><Schedule /></PageTransition>} />
          <Route path="growth" element={<PageTransition><Growth /></PageTransition>} />
          <Route path="gallery" element={<PageTransition><Gallery /></PageTransition>} />
          <Route path="alerts" element={<PageTransition><Alerts /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('floratrack_user') || '{}');
      if (user.loggedIn) {
        setIsLoggedIn(true);
      }
    } catch (e) {}
    setCheckingAuth(false);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('floratrack_user');
    setIsLoggedIn(false);
  };

  if (checkingAuth) return null;

  if (!isLoggedIn) {
    return (
      <PlantProvider>
        <LoginPage onLogin={handleLogin} />
      </PlantProvider>
    );
  }

  return (
    <PlantProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </PlantProvider>
  );
}

export default App;
