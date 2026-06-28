import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// PrimeReact CSS dependencies
import 'primereact/resources/themes/lara-light-blue/theme.css'; // Theme
import 'primereact/resources/primereact.min.css';             // Core CSS
import 'primeicons/primeicons.css';                           // Icons

// Tailwind and Custom global CSS
import './index.css'

import { PrimeReactProvider } from 'primereact/api';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider value={{ ripple: true }}>
      <App />
    </PrimeReactProvider>
  </StrictMode>,
)
