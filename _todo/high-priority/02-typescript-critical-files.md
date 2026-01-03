# TypeScript Migration - Critical Files

**Priority:** HIGH
**Effort:** 1.5 hours
**Impact:** Type safety, developer experience, IDE support

## Problem

Critical application files are still in JavaScript (`.jsx`/`.js`), missing the benefits of TypeScript type checking and improved developer experience.

## Files to Convert

### 1. `src/main.jsx` → `src/main.tsx` (30 min)

**Current State:** Entry point without types

**Action:**
```typescript
// Add proper types for React Router setup
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

**Benefits:**
- Type safety for router configuration
- Better IDE autocomplete
- Catch errors at compile time

---

### 2. `src/hooks/useAuthUser.jsx` → `src/hooks/useAuthUser.tsx` (45 min)

**Current State:** Critical authentication hook without types

**Action:**

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from 'firebase/auth';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // ... implementation

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthUser(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthUser must be used within AuthProvider');
  }
  return context;
}
```

**Benefits:**
- Type-safe user object throughout app
- Enforce proper context usage
- Document expected shape of auth state

---

### 3. `src/pages/DeckCreator/effects.js` → `src/pages/DeckCreator/effects.ts` (15 min)

**Current State:** Side effect handlers without types

**Action:**

```typescript
import type { Deck } from '@/types/deck';

export async function saveDeckEffect(
  deck: Deck,
  userId: string | null
): Promise<{ success: boolean; deckId?: string; error?: Error }> {
  try {
    // ... implementation
    return { success: true, deckId };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}
```

**Benefits:**
- Type-safe deck operations
- Clear return types for effect functions
- Better error handling

## Implementation Steps

### Step 1: Rename Files

```bash
cd apps/frontend_v2

# Main entry point
mv src/main.jsx src/main.tsx

# Auth hook
mv src/hooks/useAuthUser.jsx src/hooks/useAuthUser.tsx

# Effects
mv src/pages/DeckCreator/effects.js src/pages/DeckCreator/effects.ts
```

### Step 2: Add Type Imports

Install missing type definitions if needed:

```bash
pnpm add -D @types/react @types/react-dom @types/react-router-dom
```

### Step 3: Define Interfaces

For each file, define proper interfaces for:
- Component props
- State objects
- Function parameters and return types
- Context values

### Step 4: Fix Type Errors

Run TypeScript compiler and fix any errors:

```bash
pnpm tsc --noEmit
```

### Step 5: Update Imports

Update any files that import these modules:

```typescript
// Before
import { useAuthUser } from '@/hooks/useAuthUser';

// After (same, but now type-safe)
import { useAuthUser } from '@/hooks/useAuthUser';
```

## Testing Checklist

- [ ] `pnpm tsc --noEmit` passes with no errors
- [ ] Application starts correctly: `pnpm dev`
- [ ] Authentication flow works (login, logout, refresh)
- [ ] Deck creation/editing still functions
- [ ] No runtime errors in browser console
- [ ] IDE autocomplete works for all exported functions
- [ ] Run `pnpm lint` - no new warnings

## Success Criteria

- [ ] All three files converted to TypeScript
- [ ] No `any` types used (except where absolutely necessary)
- [ ] Proper interfaces defined for all data structures
- [ ] Type errors caught at compile time
- [ ] Better IDE support and autocomplete
- [ ] Documentation through types

## Common Type Definitions Needed

Create `src/types/` folder if it doesn't exist:

### `src/types/deck.ts`
```typescript
export interface Deck {
  id: string;
  name: string;
  faction: string;
  cards: Card[];
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Card {
  id: string;
  name: string;
  type: 'objective' | 'gambit' | 'upgrade';
  // ... other fields
}
```

### `src/types/user.ts`
```typescript
import type { User as FirebaseUser } from 'firebase/auth';

export type User = FirebaseUser;

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous: boolean;
}
```

## Notes

- Use existing types from `@fxdxpz/schema` package where applicable
- Import Firebase types from `firebase/auth` instead of defining custom ones
- Keep backward compatibility - don't break existing code
- Focus on adding types, not refactoring logic
