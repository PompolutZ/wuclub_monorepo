# Improve User-Facing Error Messages

**Priority:** MEDIUM
**Effort:** 2 hours
**Impact:** Better user experience, reduced confusion

## Problem

Many error scenarios fail silently or only log to console, leaving users confused when operations fail. We need to add proper user feedback for all error cases.

## Files to Update

### 1. `src/shared/hooks/useSaveDeck.ts`

**Current Issue:** Silent error catching - user doesn't know save failed

**Current Code:**

```typescript
try {
  await saveDeck(deck);
} catch (e) {
  console.error(e); // Silent failure
}
```

**Solution:**

```typescript
import { toast } from '@/components/Toast';
import { logger } from '@/utils/logger';

export function useSaveDeck() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveDeck = useCallback(async (deck: Deck) => {
    setIsSaving(true);
    setError(null);

    try {
      const result = await apiClient.decks.$post({ json: deck });

      if (!result.ok) {
        throw new Error('Failed to save deck');
      }

      toast.success('Deck saved successfully');
      return result.data;

    } catch (e) {
      const error = e instanceof Error ? e : new Error('Unknown error');
      logger.error('Failed to save deck', error, { deckId: deck.id });

      setError(error);
      toast.error('Failed to save deck. Please try again.');

      throw error; // Re-throw for caller to handle
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { saveDeck, isSaving, error };
}
```

---

### 2. `src/shared/hooks/useUpdateDeck.ts`

**Current Issue:** No user feedback on update errors

**Solution:**

```typescript
export function useUpdateDeck() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateDeck = useCallback(async (deckId: string, updates: Partial<Deck>) => {
    setIsUpdating(true);
    setError(null);

    try {
      const result = await apiClient.decks[':id'].$patch({
        param: { id: deckId },
        json: updates,
      });

      if (!result.ok) {
        throw new Error('Failed to update deck');
      }

      toast.success('Deck updated');
      return result.data;

    } catch (e) {
      const error = e instanceof Error ? e : new Error('Unknown error');
      logger.error('Failed to update deck', error, { deckId, updates });

      setError(error);
      toast.error('Failed to update deck. Please try again.');

      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return { updateDeck, isUpdating, error };
}
```

---

### 3. `src/pages/MyDecks/index.tsx`

**Current Issue:** No error state in UI when deck loading fails

**Current Code:**

```typescript
try {
  const decks = await fetchDecks();
  setDecks(decks);
} catch (e) {
  console.error(e); // User sees nothing
}
```

**Solution:**

```typescript
function MyDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadDecks() {
      setIsLoading(true);
      setError(null);

      try {
        const decks = await fetchDecks();
        setDecks(decks);
      } catch (e) {
        const error = e instanceof Error ? e : new Error('Failed to load decks');
        logger.error('Failed to load user decks', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDecks();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load your decks"
        message="We couldn't load your decks. Please try again."
        action={{
          label: 'Retry',
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  if (decks.length === 0) {
    return <EmptyState message="You haven't created any decks yet" />;
  }

  return <DeckList decks={decks} />;
}
```

---

### 4. `src/pages/Deck/index.tsx`

**Current Issue:** Line 43 - bare error logging when deck fails to load

**Solution:**

```typescript
function DeckPage() {
  const { id } = useParams<{ id: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadDeck() {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const deck = await fetchDeck(id);
        setDeck(deck);
      } catch (e) {
        const error = e instanceof Error ? e : new Error('Failed to load deck');
        logger.error('Failed to load deck', error, { deckId: id });
        setError(error);
        toast.error('Failed to load deck');
      } finally {
        setIsLoading(false);
      }
    }

    loadDeck();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !deck) {
    return (
      <ErrorState
        title="Deck not found"
        message="This deck might have been deleted or you don't have access to it."
        action={{
          label: 'Go to My Decks',
          onClick: () => navigate('/decks'),
        }}
      />
    );
  }

  return <DeckView deck={deck} />;
}
```

---

### 5. `src/pages/DeckCreator/effects.js`

**Current Issue:** Lines 24 & 51 - console.error without user feedback

**Solution:**

```typescript
export async function saveDeckEffect(deck: Deck, userId: string | null) {
  try {
    const result = await apiClient.decks.$post({ json: deck });

    if (!result.ok) {
      throw new Error('Failed to save deck');
    }

    toast.success('Deck saved successfully');
    return { success: true, deckId: result.data.id };

  } catch (e) {
    const error = e instanceof Error ? e : new Error('Unknown error');
    logger.error('Error saving deck', error, { deckId: deck.id, userId });

    toast.error('Failed to save deck. Your changes may not be saved.', {
      action: {
        label: 'Retry',
        onClick: () => saveDeckEffect(deck, userId),
      },
    });

    return { success: false, error };
  }
}
```

---

## Create Reusable Error Components

### `src/components/ErrorState.tsx`

```typescript
interface ErrorStateProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
}

export function ErrorState({ title, message, action, icon }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      {icon || (
        <svg className="w-16 h-16 text-gray-400 mb-4" /* ... error icon ... */ />
      )}

      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h2>

      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
```

### `src/components/LoadingSpinner.tsx`

```typescript
interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ message, size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 ${sizeClasses[size]}`} />
      {message && (
        <p className="mt-4 text-gray-600">{message}</p>
      )}
    </div>
  );
}
```

### `src/components/EmptyState.tsx`

```typescript
interface EmptyStateProps {
  icon?: ReactNode;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      {icon || (
        <svg className="w-16 h-16 text-gray-400 mb-4" /* ... empty icon ... */ />
      )}

      <p className="text-gray-600 mb-6">{message}</p>

      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
```

---

## Enhance Toast Notification System

If not already implemented, enhance the toast system:

### `src/components/Toast/index.tsx`

```typescript
interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastOptions {
  duration?: number;
  action?: ToastAction;
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    showToast({ type: 'success', message, ...options });
  },

  error: (message: string, options?: ToastOptions) => {
    showToast({ type: 'error', message, duration: 5000, ...options });
  },

  info: (message: string, options?: ToastOptions) => {
    showToast({ type: 'info', message, ...options });
  },

  warning: (message: string, options?: ToastOptions) => {
    showToast({ type: 'warning', message, ...options });
  },
};
```

---

## Implementation Steps

### Step 1: Create Reusable Components (30 min)

- [ ] ErrorState component
- [ ] LoadingSpinner component
- [ ] EmptyState component

### Step 2: Update Hooks (45 min)

- [ ] useSaveDeck - add error state and toast
- [ ] useUpdateDeck - add error state and toast
- [ ] Add loading states to all hooks

### Step 3: Update Pages (45 min)

- [ ] MyDecks - add error/loading/empty states
- [ ] Deck - add error/loading states
- [ ] DeckCreator - integrate toast notifications

### Step 4: Test All Error Scenarios (30 min)

- [ ] Network offline
- [ ] API returns error
- [ ] Invalid data
- [ ] Timeout errors

---

## Testing Checklist

### Error Scenarios

- [ ] Offline mode - proper error message shown
- [ ] API error (500) - user-friendly message
- [ ] Not found (404) - helpful redirect
- [ ] Validation error - specific feedback
- [ ] Timeout - retry option provided

### User Experience

- [ ] Error messages are clear and actionable
- [ ] Loading states prevent confusion
- [ ] Empty states guide next action
- [ ] Toast notifications are readable
- [ ] Actions (retry, go home) work correctly

### Accessibility

- [ ] Error states have proper ARIA roles
- [ ] Screen readers announce errors
- [ ] Keyboard navigation works
- [ ] Focus management on error state

---

## Success Criteria

- [ ] No silent failures - all errors provide feedback
- [ ] User-friendly error messages (no technical jargon)
- [ ] Loading states for all async operations
- [ ] Empty states for all list views
- [ ] Retry mechanisms where appropriate
- [ ] Consistent error handling pattern across app

---

## Error Message Guidelines

### ✅ Good Error Messages

- "Failed to save deck. Please try again."
- "We couldn't load your decks. Check your connection and retry."
- "Deck not found. It may have been deleted."

### ❌ Bad Error Messages

- "Error: Network request failed"
- "500 Internal Server Error"
- "Something went wrong"

### Principles

1. **User-focused**: What happened and what can they do
2. **Clear**: No technical jargon
3. **Actionable**: Provide next steps
4. **Honest**: Don't promise fixes you can't guarantee
