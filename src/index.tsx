import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './RuneApp/App';
import BioPage from './BioPage/BioPage';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BioPage />
  </React.StrictMode>
);
