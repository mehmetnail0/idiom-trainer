# Idiom Trainer

Personal English idiom/word learning tool with FSRS spaced repetition.

## Supabase — CRITICAL SAFETY RULES

This project uses **NailingAI's Supabase instance** (dktgyunbrsmskajdbtnr).
Only ONE table belongs to this project: `idiom_trainer`.

- NEVER touch any other table in this Supabase instance
- NEVER run migrations that affect NailingAI tables
- NEVER modify RLS policies on tables other than `idiom_trainer`
- ONLY read/write the `idiom_trainer` table, row id = 'nail'
- Use ANON key only (never service role in frontend code)
- If in doubt, ASK before any Supabase operation

## Storage

Dual persistence:
1. **localStorage** (`idiom-trainer-data`) — instant, offline-capable
2. **Supabase** (`idiom_trainer` table) — cloud backup, survives browser wipes

Every `rate()` and `addItem()` writes to BOTH simultaneously.
On load, cloud data wins if it's newer (lastSaved timestamp comparison).

## Adding Items

User provides phrase → Claude fills: meaning, 5 examples, wrongExample, notes, category.
Examples should be diverse contexts (not just tech/startup).
Add via `addItem()` in store — persists to both storage layers.

## Quiz Rules

- 2 question types: fill-blank, meaning-match (+ sentence-judge)
- FSRS rating: wrong=Again(1d), correct=Good(×2.5)/Easy(×3.2)
- No in-session retry — FSRS handles cross-session repetition
- Examples shuffle each time — never same order twice
- Stability 30d+ → passive (sidebar collapse)
