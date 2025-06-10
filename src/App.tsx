import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ToastContainer';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ResultsPage from './pages/ResultsPage';
import CandidateDetailsPage from './pages/CandidateDetailsPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/ErrorBoundary';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/globals.css';
import './styles/custom.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <AppProvider>
              <Router>
                <div className="app-container">
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/results" element={<ResultsPage />} />
                      <Route path="/candidate/:id" element={<CandidateDetailsPage />} />
                      <Route path="/history" element={<HistoryPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                </div>
              </Router>
            </AppProvider>
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
