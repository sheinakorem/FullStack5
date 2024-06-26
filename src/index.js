import React, { StrictMode ,BrowserRouter} from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
//rendering the app 
root.render(

  <StrictMode>
    <App />
  </StrictMode>

);