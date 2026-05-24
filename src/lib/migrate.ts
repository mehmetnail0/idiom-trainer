const NEW_KEY = 'idiom-trainer-data'
const OLD_KEYS = ['idiom-trainer', 'idiom-trainer-v3', 'idiom-trainer-v4']

export function migrateOldData() {
  if (localStorage.getItem(NEW_KEY)) return

  for (const key of OLD_KEYS) {
    const raw = localStorage.getItem(key)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (parsed.state?.items?.length > 0) {
          localStorage.setItem(NEW_KEY, raw)
          OLD_KEYS.forEach(k => localStorage.removeItem(k))
          return
        }
      } catch { /* skip */ }
    }
  }
}

export function cleanOldKeys() {
  OLD_KEYS.forEach(k => localStorage.removeItem(k))
}
