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
        <main className="flex-1 p-5 pb-16 max-w-lg mx-auto w-full">
          {view === 'home' && <Home onStart={startSession} />}
          {view === 'session' && <Session key={sessionKey} onExit={() => setView('home')} />}
          {view === 'settings' && <Settings />}
        </main>

        {view !== 'session' && (
          <nav className="fixed bottom-0 left-0 right-0 lg:right-64 bg-bg border-t border-border/30 z-10">
            <div className="flex justify-around py-2 max-w-lg mx-auto">
              {[
                { key: 'home' as const, label: 'home' },
                { key: 'session' as const, label: 'drill' },
                { key: 'settings' as const, label: 'settings' },
              ].map(t => (
                <button key={t.key}
                  onClick={() => t.key === 'session' ? startSession() : setView(t.key)}
                  className={`text-[10px] uppercase tracking-[0.15em] px-4 py-1.5 transition-colors ${view === t.key ? 'text-accent' : 'text-text-dim/40 hover:text-text-dim'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>

      <aside className="hidden lg:flex w-64 border-l border-border/30 flex-col h-dvh sticky top-0 bg-card/50">
        <Sidebar items={items} />
      </aside>
    </div>
  )
}
