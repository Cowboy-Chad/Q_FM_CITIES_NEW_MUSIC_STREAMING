import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { SyncProvider } from './context/SyncContext'
import { PlayerProvider } from './context/PlayerContext'

console.log('[main.jsx] Starting render, root element:', document.getElementById('root'))

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <AuthProvider>
        <SyncProvider>
          <PlayerProvider>
            <App />
          </PlayerProvider>
        </SyncProvider>
      </AuthProvider>
    </React.StrictMode>
  )
  console.log('[main.jsx] Render call completed without throw')
} catch (err) {
  console.error('[main.jsx] Render error:', err)
}
