import { useRef, useState } from 'react'
import { useStore } from '../store/store'

export default function Settings() {
  const { resetProgress, exportData, importData, items } = useStore()
  const [confirm, setConfirm] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold">Settings</h2>
      <div className="bg-card rounded-xl p-4 border border-border space-y-1 text-sm">
        <div className="flex justify-between"><span className="text-text-dim">Library</span><span>{items.length} items</span></div>
        <div className="flex justify-between"><span className="text-text-dim">Idioms</span><span>{items.filter(i => i.type === 'idiom').length}</span></div>
        <div className="flex justify-between"><span className="text-text-dim">Words</span><span>{items.filter(i => i.type === 'word').length}</span></div>
      </div>
      <div className="space-y-3">
        <button onClick={() => {
          const blob = new Blob([exportData()], { type: 'application/json' })
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
          a.download = `idiom-trainer-${new Date().toISOString().slice(0, 10)}.json`; a.click()
        }} className="w-full bg-card-hover border border-border text-text py-3 rounded-xl text-sm font-medium">Export</button>
        <button onClick={() => fileRef.current?.click()} className="w-full bg-card-hover border border-border text-text py-3 rounded-xl text-sm font-medium">Import</button>
        <input ref={fileRef} type="file" accept=".json" onChange={e => {
          const f = e.target.files?.[0]; if (!f) return
          const r = new FileReader()
          r.onload = () => { const ok = importData(r.result as string); setMsg(ok ? 'Done!' : 'Invalid'); setTimeout(() => setMsg(''), 2000) }
          r.readAsText(f)
        }} className="hidden" />
        {msg && <p className="text-sm text-center text-accent">{msg}</p>}
      </div>
      <div className="border-t border-border pt-4">
        {!confirm ? (
          <button onClick={() => setConfirm(true)} className="w-full text-wrong text-sm py-3">Reset Progress</button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-wrong text-center">Reset all progress?</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirm(false)} className="flex-1 bg-card-hover border border-border py-2 rounded-xl text-sm">Cancel</button>
              <button onClick={() => { resetProgress(); setConfirm(false) }} className="flex-1 bg-wrong text-white py-2 rounded-xl text-sm font-semibold">Reset</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
