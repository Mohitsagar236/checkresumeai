# Vercel Environment Variables

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables.
Set all to **Production** environment (and Preview if you want).

---

## Required — App breaks without these

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://rvmvahwyfptyhchlvtvr.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | *(copy from Supabase Dashboard → Project Settings → API → anon/public key)* |
| `VITE_GROQ_API_KEY` | *(your Groq API key from console.groq.com — rotate it first if exposed)* |

---

## Required — Features break without these

| Variable | Value |
|---|---|
| `VITE_USE_MOCK_API` | `false` |
| `VITE_ENABLE_PREMIUM_FEATURES` | `true` |
| `VITE_ENABLE_REAL_TIME_ANALYSIS` | `true` |

---

## Optional — Set if you have the keys

| Variable | Purpose |
|---|---|
| `VITE_OPENAI_API_KEY` | OpenAI fallback for AI analysis |
| `VITE_TOGETHER_API_KEY` | Together AI fallback for AI analysis |
| `VITE_OPENROUTER_API_KEY` | OpenRouter fallback for AI analysis |
| `VITE_API_BASE_URL` | Backend URL (leave blank for frontend-only deploy) |

---

## Notes

- `VITE_SUPABASE_ANON_KEY` is safe to expose — it's a public key by design.
- **Rotate your Groq/OpenAI keys** before deploying — they were previously committed to git.
- `VITE_API_BASE_URL` — leave blank for now. Features that need the backend
  (contact form, payment) will show a friendly error instead of crashing.
- All `VITE_` keys are bundled into the frontend JS and visible to users.
  Keep backend-only secrets out of `VITE_` vars.
