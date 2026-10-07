import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { StudyProvider } from './context/StudyContext';
import App from './App';
import './index.css';

// HashRouter so the built app also works when opened from any static host or folder.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <StudyProvider>
        <App />
      </StudyProvider>
    </HashRouter>
  </React.StrictMode>
);
