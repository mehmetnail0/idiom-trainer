import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dktgyunbrsmskajdbtnr.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdGd5dW5icnNtc2thamRidG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NTc2MDQsImV4cCI6MjA4MTUzMzYwNH0.L1IZjl4j_8rdxyxiHZLVZ-4Mfda0LArCQN5NoncX3N8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const ROW_ID = 'nail'

type ProgressData = {
  items: unknown[]
  stats: unknown[]
  lastSaved: number
}

export async function loadProgress(): Promise<ProgressData | null> {
  try {
    const { data, error } = await supabase
      .from('idiom_trainer')
      .select('progress')
      .eq('id', ROW_ID)
      .single()

    if (error || !data?.progress) return null
    return data.progress as ProgressData
  } catch {
    return null
  }
}

export async function saveProgress(progress: ProgressData): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('idiom_trainer')
      .upsert({ id: ROW_ID, progress, updated_at: new Date().toISOString() })

    return !error
  } catch {
    return false
  }
}
