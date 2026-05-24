import { useRef, useState } from 'react'
import { useStore } from '../store/store'

export default function Settings() {
  const { resetProgress, exportData, importData, idioms } = useStore()
  const [confirm, setConfirm] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `idiom-trainer-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const ok = importData(reader.result as string)
      setMsg(ok ? 'Imported!' : 'Invalid file')
      setTimeout(() => setMsg(''), 2000)
    }
    reader.readAsText(file)
  }

  const mastered = idioms.filter(i => i.status === 'mastered').length
  const learning = idioms.filter(i => i.status === 'learning').length

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold">Settings</h2>

      <div className="bg-card rounded-xl p-4 border border-border space-y-1 text-sm">
        <div className="flex justify-between"><span className="text-text-dim">Total idioms</span><span>{idioms.length}</span></div>
        <div className="flex justify-between"><span className="text-text-dim">Mastered</span><span className="text-correct">{mastered}</span></div>
        <div className="flex justify-between"><span className="text-text-dim">Learning</span><span className="text-accent">{learning}</span></div>
        <div className="flex justify-between"><span className="text-text-dim">New</span><span>{idioms.length - mastered - learning}</span></div>
      </div>

      <div className="space-y-3">
        <button onClick={handleExport} className="w-full bg-card-hover border border-border text-text py-3 rounded-xl text-sm font-medium">
          Export Backup (JSON)
        </button>
        <button onClick={() => fileRef.current?.click()} className="w-full bg-card-hover border border-border text-text py-3 rounded-xl text-sm font-medium">
          Import Backup
        </button>
        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        {msg && <p className="text-sm text-center text-accent">{msg}</p>}
      </div>

      <div className="border-t border-border pt-4">
        {!confirm ? (
          <button onClick={() => setConfirm(true)} className="w-full text-wrong text-sm py-3">Reset All Progress</button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-wrong text-center">Reset everything?</p>
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
