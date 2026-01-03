# Refactor ReadonlyDeck Component

**Priority:** HIGH
**Effort:** 3-4 hours
**Impact:** Type safety, maintainability, performance, code quality

## Problem

The `ReadonlyDeck` component and its sub-components have several issues that affect maintainability and type safety:

1. **Mixed TypeScript/JavaScript** - Main component and several atoms are still `.jsx` instead of `.tsx`
2. **Prop Drilling** - Deep prop passing through multiple component layers
3. **Business Logic in UI** - Card filtering, sorting, and export logic mixed with presentation
4. **Inline SVG Code** - Large chunks of SVG markup in `DeckActionsMenuLarge.jsx` making it hard to read
5. **Missing TypeScript Types** - No proper interfaces for props, leading to poor IDE support
6. **No Memoization** - Components re-render unnecessarily on parent updates
7. **Inconsistent File Extensions** - Mix of `.jsx`, `.tsx`, and `.ts` files in the same directory

## Component Structure

### Current Files
```
ReadonlyDeck/
├── index.jsx                      ❌ JavaScript
├── DeckSummary.jsx                ❌ JavaScript
├── atoms/
│   ├── Card.jsx                   ❌ JavaScript
│   ├── DeckActionsMenu.jsx        ❌ JavaScript
│   ├── DeckActionsMenuLarge.jsx   ❌ JavaScript (contains inline SVGs)
│   ├── DeckPlotCards.tsx          ✅ TypeScript
│   ├── DeckPrivacyToggle.tsx      ✅ TypeScript
│   ├── DropdownMenu.tsx           ✅ TypeScript
│   ├── ExportMenu.tsx             ✅ TypeScript
│   ├── IconButton.tsx             ✅ TypeScript
│   ├── IconLink.tsx               ✅ TypeScript
│   └── Toast.jsx                  ❌ JavaScript
```

## Refactoring Plan

### Phase 1: TypeScript Migration ✅ COMPLETED

Migrated 6 ReadonlyDeck components from `.jsx` to `.tsx` with proper type definitions. Created `types.ts` with interfaces, fixed type issues (DeckCard uses Card from @wudb, DropdownMenu className optional, DeleteMenuButton uses Pick), updated parent component prop mapping. Build passes, no TypeScript errors.

### Phase 2: Extract Business Logic ✅ COMPLETED

Created two custom hooks and one utility module to separate business logic from presentation:
- `hooks/useDeckData.ts` - Memoized card filtering/sorting into objectives, gambits, upgrades
- `hooks/useObjectiveSummary.ts` - Memoized objective scoring summary and total glory calculation
- `utils/deckExport.ts` - Pure utility functions for UDB export, shareable links, and Vassal format

Refactored `index.tsx` to use hooks and call utility functions directly inline (no unnecessary useCallback wrappers). Removed inline card filtering/sorting logic. Code is cleaner and more maintainable.

### Phase 3: Extract Inline SVGs (45 min)

#### 3.1 Create Icon Components

**File:** `atoms/icons/ListIcon.tsx`

```typescript
export const ListIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="#C4B5FD"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 10h16M4 14h16M4 18h16"
    />
  </svg>
);
```

Similar for:
- `ImagesIcon.tsx`
- `DownloadIcon.tsx`
- `ExportIcon.tsx`
- `DeleteIcon.tsx`

**Or better:** Replace inline SVGs with icons from `lucide-react` (already used in the project):

```typescript
import { List, Image, Download, ExternalLink, Trash2 } from 'lucide-react';
```

#### 3.2 Update DeckActionsMenuLarge

Replace inline SVGs with icon components.

### Phase 4: Performance Optimizations (30 min)

#### 4.1 Add Memoization

Wrap components in `React.memo`:

```typescript
export const CardsSectionContent = memo(function CardsSectionContent({
  cards,
  listView
}: CardsSectionContentProps) {
  // ... implementation
});

export const DeckSummary = memo(function DeckSummary(props: DeckSummaryProps) {
  // ... implementation
});

export const Card = memo(function Card({ card, asImage }: CardProps) {
  // ... implementation
});
```

#### 4.2 Optimize Card Rendering

Use `useCallback` for event handlers passed to Card components:

```typescript
const toggleExpanded = useCallback(() => {
  setExpanded((prev) => !prev);
}, []);
```

### Phase 5: Code Quality Improvements (30 min)

#### 5.1 Fix Code Smells

1. **Remove React Fragment Wrapper** - In `DeckActionsMenuLarge`, replace `<React.Fragment>` with array return
2. **Consistent Naming** - Rename `DeckActionMenuLarge` → `DeckActionsMenuLarge` (consistency)
3. **Extract Magic Strings** - Move URLs and format strings to constants
4. **Remove Unused Variables** - Clean up any unused imports or variables

#### 5.2 Improve Readability

1. Extract `createdDate` calculation to utility function
2. Extract `authorDisplayName` logic to utility function
3. Add JSDoc comments to exported components

#### 5.3 Add Constants File

**File:** `ReadonlyDeck/constants.ts`

```typescript
export const UNDERWORLDS_DB_URL = 'https://www.underworldsdb.com';
export const DECK_TRANSFER_PREFIX = 'wuc';
export const VASSAL_LINE_SEPARATOR = '\r\n';
```

## Implementation Steps

### Step 1: Create Type Definitions (15 min)
1. Create `types.ts` with all interfaces
2. Create `constants.ts` with shared constants

### Step 2: Convert to TypeScript (1 hour)
1. Rename all `.jsx` files to `.tsx`
2. Apply types to each component
3. Fix type errors
4. Run `pnpm tsc --noEmit` to verify

### Step 3: Extract Business Logic ✅ COMPLETED
1. ✅ Create `hooks/` and `utils/` directories
2. ✅ Implement `useDeckData.ts`
3. ✅ Implement `useObjectiveSummary.ts`
4. ✅ Implement `utils/deckExport.ts` (pure functions instead of hook)
5. ✅ Update main component to use hooks and utilities

### Step 4: Replace Inline SVGs (30 min)
1. Option A: Create icon components in `atoms/icons/`
2. Option B: Replace with `lucide-react` icons (recommended)
3. Update `DeckActionsMenuLarge` to use icon components

### Step 5: Add Memoization (20 min)
1. Wrap components with `React.memo`
2. Add `useCallback` for event handlers
3. Verify performance with React DevTools Profiler

### Step 6: Code Quality (20 min)
1. Run ESLint and fix warnings
2. Remove unused code
3. Add JSDoc comments
4. Extract magic strings to constants

### Step 7: Testing (30 min)
1. Manual testing of all features
2. Verify deck viewing works
3. Test all export options
4. Test privacy toggle
5. Test edit/delete functionality

## Testing Checklist

- [ ] `pnpm tsc --noEmit` passes with no errors
- [ ] `pnpm lint` passes with no warnings
- [ ] Application starts: `pnpm dev`
- [ ] Deck loads and displays correctly
- [ ] Card list/image view toggle works
- [ ] Export to UnderworldsDB works
- [ ] Create shareable link works (copies to clipboard)
- [ ] Copy in Vassal format works
- [ ] Privacy toggle works for deck owners
- [ ] Edit button navigates correctly
- [ ] Delete button works for deck owners
- [ ] Plot cards display correctly
- [ ] Fighter cards portal works
- [ ] Objective summary displays correctly
- [ ] Card expansion works in list view
- [ ] Card images load in image view
- [ ] Proxy card picker modal opens
- [ ] No console errors or warnings
- [ ] React DevTools shows improved render performance

## Success Criteria

- [ ] All components converted to TypeScript
- [ ] No `any` types used
- [ ] Business logic extracted to custom hooks
- [ ] All inline SVGs replaced with icon components
- [ ] Components properly memoized
- [ ] No prop drilling beyond 2 levels
- [ ] ESLint passes with no warnings
- [ ] TypeScript compiler passes
- [ ] Manual testing confirms all features work
- [ ] Code is more maintainable and readable

## Benefits

### Type Safety
- Catch errors at compile time
- Better IDE autocomplete and IntelliSense
- Self-documenting code through types
- Easier refactoring

### Maintainability
- Clear separation of concerns
- Business logic separated from UI
- Reusable custom hooks
- Cleaner component code

### Performance
- Reduced unnecessary re-renders
- Optimized component updates
- Better memory usage

### Developer Experience
- Easier to understand code flow
- Better error messages
- Easier to add new features
- Consistent code style

## Migration Notes

- Keep backward compatibility during migration
- Test after each phase
- Use `@ts-expect-error` sparingly, only for known issues
- Document any workarounds needed
- Update imports in parent components if needed
- Ensure lazy-loaded components still work

## Related Files to Update

After completing this refactor, these files may need updates:

- `src/pages/Deck/index.jsx` - Parent component that uses ReadonlyDeck
- Any tests for ReadonlyDeck components
- Storybook stories if they exist

## Future Improvements (Out of Scope)

- Add unit tests for custom hooks
- Add Storybook stories for visual testing
- Consider breaking down into smaller sub-features
- Add error boundaries around critical sections
- Implement loading states for async operations
