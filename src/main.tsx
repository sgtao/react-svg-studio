import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from './components/ui/provider'
import './index.css'
import { AccentProvider } from './theme/AccentProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <AccentProvider>
        <App />
      </AccentProvider>
    </Provider>
  </StrictMode>,
)
