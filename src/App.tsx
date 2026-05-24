import { useState } from 'react'
import { useStore } from './store/store'
import Home from './views/Home'
import Session from './views/Session'
import Settings from './views/Settings'
import Sidebar from './components/Sidebar'

type View = 'home' | 'session' | 'settings'

export default function App() {
  const { items } = useStore()
  const [view, setView] = useState<View>('home')
  const [sessionKey, setSessionKey] = useState(0)

  const startSession = () => { setSessionKey(k => k + 1); setView('session') }

  return (
    <div className="min-h-dvh bg-bg text-text font-sans flex">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 pb-20 max-w-2xl mx-auto w-full overflow-y-auto">
          {view === 'home' && <Home onStart={startSession} />}
          {view === 'session' && <Session key={sessionKey} onExit={() => setView('home')} />}
          {view === 'settings' && <Settings />}
        </main>

        {view !== 'session' && (
          <nav className="fixed bottom-0 left-0 right-0 lg:right-72 bg-card border-t border-border z-10">
            <div className="flex justify-around py-2 max-w-2xl mx-auto">
              {[
                { key: 'home' as const, label: 'Home', icon: '⌂' },
                { key: 'session' as const, label: 'Drill', icon: '⚡' },
                { key: 'settings' as const, label: 'Settings', icon: '⚙' },
              ].map(t => (
                <button key={t.key}
                  onClick={() => t.key === 'session' ? startSession() : setView(t.key)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors ${view === t.key ? 'text-accent' : 'text-text-dim'}`}>
                  <span className="text-lg">{t.icon}</span>{t.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>

      <aside className="hidden lg:flex w-72 border-l border-border flex-col h-dvh sticky top-0">
        <Sidebar items={items} />
      </aside>
    </div>
  )
}
