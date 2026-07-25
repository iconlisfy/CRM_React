import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './Store'; // Import the store
import App from './App';
import './App.css';
import { configReady } from './base';
import { startIdleTimer } from './utils/IdleTimeout';
// Use createRoot to render your application
const root = document.getElementById('root');
configReady.then(() => {
  startIdleTimer(store);


  createRoot(root).render(
    <React.StrictMode>

      <Provider store={store}>
        <App />
      </Provider>

    </React.StrictMode>
  );
});