import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './Store'; // Import the store
import App from './App';
import './App.css';
import { configReady } from './base';
// Use createRoot to render your application
const root = document.getElementById('root');
configReady.then(() => {
createRoot(root).render(
  <React.StrictMode>
   
    <Provider store={store}>
      <App />
    </Provider>
   
  </React.StrictMode>
);
});