import { useState } from 'react'
import Home from './views/Home'
import Session from './views/Session'
import Settings from './views/Settings'

type View = 'home' | 'session' | 'settings'

const tabs: { key: View; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: '⌂' },
  { key: 'session', label: 'Drill', icon: '⚡' },
  { key: 'settings', label: 'Settings', icon: '⚙' },
]

export default function App() {
  const [view, setView] = useState<View>('home')
  const [sessionKey, setSessionKey] = useState(0)

  const startSession = () => { setSessionKey(k => k + 1); setView('session') }

  return (
    <div className="min-h-dvh bg-bg text-text font-sans flex flex-col">
      <main className="flex-1 p-4 pb-20 max-w-lg mx-auto w-full">
        {view === 'home' && <Home onStart={startSession} />}
        {view === 'session' && <Session key={sessionKey} onExit={() => setView('home')} />}
        {view === 'settings' && <Settings />}
      </main>

      {view !== 'session' && (
        <nav className="fixed bottom-0 inset-x-0 bg-card border-t border-border">
          <div className="flex justify-around py-2 max-w-lg mx-auto">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => t.key === 'session' ? startSession() : setView(t.key)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors ${view === t.key ? 'text-accent' : 'text-text-dim'}`}
              >
                <span className="text-lg">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
