import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './style.css';
const root = document.getElementById('root');
createRoot(root).render(<React.StrictMode><App initialView={root.dataset.view || 'register'} initialNumber={root.dataset.number || ''} /></React.StrictMode>);
