import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.css'
import { migrateOldData } from './lib/migrate'
import App from './App'

migrateOldData()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
