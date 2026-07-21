import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import queryClient from './components/queryClient'
import { ToastProvider } from './components'

const navigationEntry = performance.getEntriesByType('navigation')[0]
if (navigationEntry?.type === 'reload') {
  window.history.replaceState(null, '', '/')
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)


