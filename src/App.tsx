import { useState } from 'react'
import { useStore } from './store/store'
import Home from './views/Home'
import Session from './views/Session'
import Settings from './views/Settings'
import IdiomSidebar from './components/IdiomSidebar'
import IdiomCard from './components/IdiomCard'

type View = 'home' | 'session' | 'settings'

const tabs: { key: View; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: '⌂' },
  { key: 'session', label: 'Drill', icon: '⚡' },
  { key: 'settings', label: 'Settings', icon: '⚙' },
]

export default function App() {
  const { idioms } = useStore()
  const [view, setView] = useState<View>('home')
  const [sessionKey, setSessionKey] = useState(0)
  const [selectedIdiom, setSelectedIdiom] = useState<string | undefined>()

  const startSession = () => { setSessionKey(k => k + 1); setView('session'); setSelectedIdiom(undefined) }
  const selected = idioms.find(i => i.id === selectedIdiom)

  return (
    <div className="min-h-dvh bg-bg text-text font-sans flex">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 pb-20 max-w-2xl mx-auto w-full overflow-y-auto">
          {view === 'home' && <Home onStart={startSession} />}
          {view === 'session' && <Session key={sessionKey} onExit={() => setView('home')} />}
          {view === 'settings' && <Settings />}
        </main>

        {view !== 'session' && (
          <nav className="fixed bottom-0 left-0 right-0 lg:right-80 bg-card border-t border-border z-10">
            <div className="flex justify-around py-2 max-w-2xl mx-auto">
              {tabs.map(t => (
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

      {/* Right sidebar — desktop only */}
      <aside className="hidden lg:flex w-80 border-l border-border flex-col h-dvh sticky top-0">
        {selected ? (
          <div className="flex-1 overflow-y-auto p-3">
            <button onClick={() => setSelectedIdiom(undefined)} className="text-xs text-text-dim hover:text-accent mb-3">← Back to list</button>
            <IdiomCard idiom={selected} />
          </div>
        ) : (
          <IdiomSidebar idioms={idioms} activeId={selectedIdiom} onSelect={setSelectedIdiom} />
        )}
      </aside>
    </div>
  )
}
