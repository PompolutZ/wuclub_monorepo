# Clean Up Console Logging

**Priority:** HIGH
**Effort:** 2 hours
**Impact:** Production code quality, debugging experience

## Problem

Multiple files contain bare `console.error()` and `console.log()` statements that lack structure and don't provide user feedback. These should be replaced with proper error handling and user-facing messages.

## Files to Fix

### 1. `src/firebase/firebase.js`

**Lines to address:**
- Line 33: `console.warn("Firebase is not configured...")`
- Line 116: `console.error("Cannot login, fallback")`
- Line 121: `console.error(error)` - bare error logging

**Action:**
- Keep warnings for development
- Add user-facing error toast for login failures
- Structure error logging with context

### 2. `src/pages/Deck/index.tsx`

**Line 43:** `console.error(e)` - bare error in catch block

**Action:**
- Add user-facing error message
- Show toast notification: "Failed to load deck"
- Log structured error with deck ID for debugging

### 3. `src/pages/MyDecks/index.tsx`

**Line 37:** `console.error(e)` - bare error in catch block

**Action:**
- Add error state to UI
- Show user-friendly message: "Failed to load your decks"
- Log error with user context

### 4. `src/pages/DeckCreator/effects.js`

**Lines 24 & 51:** `console.error("Error saving deck", e)`

**Action:**
- Integrate with existing toast notification system
- Show user feedback: "Failed to save deck. Please try again."
- Consider retry mechanism

### 5. `src/pages/DeckCreator/useStateCreator.js`

**Line 45:** `console.warn("Card with ID ${wuid} not found...")`

**Action:**
- Keep as development warning
- Add data validation to prevent this scenario
- Consider fallback behavior

### 6. `src/pages/MyDecks/useAnonDeckSyncronisation.ts`

**Line 27:** `console.error("Error", e)` - vague error message

**Action:**
- Improve error message: "Failed to sync anonymous deck"
- Add user notification if sync affects UX
- Log with sync operation context

## Implementation Steps

### Step 1: Create Centralized Logger (30 min)

Create `src/utils/logger.ts`:

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context);
    }
  }

  info(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, context);
    }
  }

  warn(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, context);
    }
  }

  error(message: string, error?: Error, context?: LogContext) {
    // Always log errors, even in production
    console.error(`[ERROR] ${message}`, {
      error: error?.message,
      stack: error?.stack,
      ...context,
    });

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  }
}

export const logger = new Logger();
```

### Step 2: Replace Console Statements (1 hour)

Replace all `console.error()` calls with:

```typescript
import { logger } from '@/utils/logger';

// Before
console.error(e);

// After
logger.error('Failed to load deck', e, { deckId });
```

### Step 3: Add User Feedback (30 min)

For each error that affects user experience:

```typescript
import { toast } from '@/components/Toast'; // Use existing toast system

try {
  // operation
} catch (e) {
  logger.error('Failed to save deck', e, { deckId, userId });
  toast.error('Failed to save deck. Please try again.');
}
```

## Testing Checklist

- [ ] Run `pnpm lint` - no console.* warnings
- [ ] Test error scenarios in development - structured logs appear
- [ ] Test error scenarios in production build - user sees friendly messages
- [ ] Verify no sensitive data in logs
- [ ] Check toast notifications appear correctly

## Success Criteria

- [ ] All bare `console.error()` replaced with structured logging
- [ ] User-facing errors show toast notifications
- [ ] Development logs are structured and helpful
- [ ] Production logs don't expose sensitive data
- [ ] No console.* in production bundle (except logger)

## Future Enhancements

- Integrate with error tracking service (Sentry)
- Add log levels configuration
- Implement log sampling for high-frequency events
- Add performance logging utilities
