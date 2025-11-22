# Critical Lesson: Next.js Auth Pages + Static Caching = Redirect Loops

## The Bug We Fixed

**Symptom:** Authenticated users stuck in infinite redirect loop between `/profile` and `/login`

**Root Cause:** Next.js statically cached the profile page at build time (with no cookies/session). The cached page always saw "no user" and redirected to `/login`. Login saw the user was authenticated and redirected back to `/profile`. Infinite loop.

## The Solution

```typescript
export const dynamic = 'force-dynamic'
```

This forces the page to render on every request with the user's actual cookies, not a cached version.

---

## Rules for Auth-Protected Pages

### 1. Always Add `force-dynamic`

Any page that checks authentication MUST have this at the top:

```typescript
export const dynamic = 'force-dynamic'
```

**Pages that need this:**
- `/profile` ✅
- `/likes` ✅
- `/messages` (client component, but good practice)
- `/dashboard`, `/settings`, `/account`, etc.

### 2. Use `getSession()` Not `getUser()`

**❌ Wrong:**
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

**✅ Correct:**
```typescript
const { data: { session } } = await supabase.auth.getSession()
const user = session?.user
```

**Why?**
- `getSession()` reads from cookies (fast, local, reliable)
- `getUser()` validates with Supabase servers (slower, can fail on network issues)

### 3. Use Only `@supabase/ssr`

**Do NOT mix packages!** Only use:
```json
"@supabase/ssr": "^0.7.0",
"@supabase/supabase-js": "^2.83.0"
```

The old `@supabase/auth-helpers-nextjs` conflicts with `@supabase/ssr`.

---

## Template for New Protected Pages

Always start with this:

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    redirect('/login')
  }

  // Your page code here...
  const user = session.user
}
```

---

## Debugging Checklist

If auth redirects break again, check in this order:

1. ✅ **Does the page have `export const dynamic = 'force-dynamic'`?**
2. ✅ **Are cookies reaching the server?** Log `cookieStore.getAll()`
3. ✅ **Is `getSession()` returning a session?** Log the result
4. ✅ **Is middleware interfering?** Check `middleware.ts` for redirects
5. ✅ **Package conflict?** Run `npm list | grep supabase` — should only see `@supabase/ssr`

---

## Remember

- **Localhost dev mode hides caching bugs** — always test in production or with `npm run build && npm start`
- **Auth pages + caching = redirect loops**
- **When in doubt, add `force-dynamic`**

---

## Files Fixed

- ✅ `app/profile/[[...id]]/page.tsx` - Added `force-dynamic`, switched to `getSession()`
- ✅ `app/likes/page.tsx` - Added `force-dynamic`, switched to `getSession()`
- ✅ `lib/supabase/client.ts` - Fixed cookie storage (was using localStorage)
- ✅ `components/Header.tsx` - Ignore SIGNED_IN/TOKEN_REFRESHED events

---

**Date Fixed:** November 22, 2025
**Author:** Learned the hard way after 2 hours of debugging 🎯
