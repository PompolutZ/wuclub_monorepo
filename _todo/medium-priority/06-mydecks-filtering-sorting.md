# MyDecks Filtering and Sorting Implementation Plan

## Overview
Add filtering and sorting capabilities to the MyDecks page (`apps/frontend_v2/src/pages/MyDecks/`) following modern web design patterns for both desktop and mobile.

## Current State Analysis

**Existing Implementation:**
- Decks currently sorted by `updatedutc` descending (hardcoded in `index.tsx:74`)
- Deck data structure includes:
  - `name`: string
  - `updatedutc`: number (timestamp)
  - `sets`: array of set IDs (e.g., ["BL", "ES", "PL"])
  - Other fields: `deckId`, `faction`, `private`, etc.
- UI uses Tailwind CSS and Headless UI components
- Available icons from lucide-react

## Requirements

### Sorting Features
- **Sort by Name** (alphabetical A-Z or Z-A)
- **Sort by Updated Date** (newest first or oldest first)
- **Toggle ascending/descending** for each sort option

### Filtering Features
- **Filter by Sets**: Show only decks that include specific sets
- Multiple sets can be selected (OR logic: show decks that contain ANY of the selected sets)
- Clear filters option

## UI/UX Design

### Desktop Layout
```
┌─────────────────────────────────────────────────────────┐
│  My Decks                                               │
│  ┌──────────┐  ┌─────────────────┐  ┌───────────────┐  │
│  │ Sort ▼   │  │ Filter by Sets ▼│  │ Clear Filters │  │
│  └──────────┘  └─────────────────┘  └───────────────┘  │
│                                                         │
│  [Deck 1]                                              │
│  [Deck 2]                                              │
│  ...                                                   │
└─────────────────────────────────────────────────────────┘
```

### Mobile Layout
```
┌──────────────────────┐
│  My Decks            │
│  ┌────────┐ ┌──────┐ │
│  │ Sort ▼ │ │Filter│ │
│  └────────┘ └──────┘ │
│                      │
│  [Deck 1]           │
│  [Deck 2]           │
│  ...                │
└──────────────────────┘
```

### Sort Dropdown Options
- Name (A → Z)
- Name (Z → A)
- Newest First (default)
- Oldest First

### Filter Dropdown
- Multi-select checkbox list of all available sets
- Search/filter within the sets list for easier navigation
- Show count of active filters
- "Clear all" option within the dropdown

## Technical Implementation

### 1. New Components to Create

#### `FilterSortBar.tsx`
Main container component for the filter/sort controls
- Renders sort and filter dropdowns
- Manages layout (responsive for mobile/desktop)
- Position: above deck list in `MyDecksPage`

#### `SortDropdown.tsx`
Sort selection dropdown component
- Uses Headless UI `Menu` component (already used in `DropdownMenu.tsx`)
- Props: `currentSort`, `onSortChange`
- Icons: `ArrowUpDown`, `ArrowUp`, `ArrowDown` from lucide-react

#### `FilterDropdown.tsx`
Multi-select filter component
- Uses Headless UI `Menu` with checkboxes
- Search input for filtering sets list (use `DebouncedInput`)
- Props: `selectedSets`, `onSetsChange`, `availableSets`
- Show badge with active filter count
- Display set icons using `ExpansionPicture` component

#### `ClearFiltersButton.tsx` (Optional - can be inline)
Button to clear all active filters
- Only visible when filters are active
- Props: `onClear`, `disabled`

### 2. State Management

Add to `MyDecksPage` component:
```typescript
type SortOption = 'name-asc' | 'name-desc' | 'date-desc' | 'date-asc';

const [sortBy, setSortBy] = useState<SortOption>('date-desc');
const [selectedSetFilters, setSelectedSetFilters] = useState<string[]>([]);
```

### 3. Filtering & Sorting Logic

#### Filtering Function
```typescript
const filterDecks = (decks: Deck[], filters: string[]) => {
  if (filters.length === 0) return decks;
  return decks.filter(deck =>
    deck.sets.some(set => filters.includes(set))
  );
};
```

#### Sorting Function
```typescript
const sortDecks = (decks: Deck[], sortOption: SortOption) => {
  const sorted = [...decks];
  switch (sortOption) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'date-desc':
      return sorted.sort((a, b) => b.updatedutc - a.updatedutc);
    case 'date-asc':
      return sorted.sort((a, b) => a.updatedutc - b.updatedutc);
    default:
      return sorted;
  }
};
```

#### Combined Application
Replace lines 69-81 in `index.tsx`:
```typescript
{userDecks && userDecks.total > 0 && (
  <div className="flex-1">
    <FilterSortBar
      sortBy={sortBy}
      onSortChange={setSortBy}
      selectedSets={selectedSetFilters}
      onSetsChange={setSelectedSetFilters}
      onClearFilters={() => setSelectedSetFilters([])}
      availableSets={Object.keys(sets)}
    />
    {sortDecks(
      filterDecks(
        userDecks.decks.map((deck) => ({ ...deck, id: deck.deckId })),
        selectedSetFilters
      ),
      sortBy
    ).map((deck) => (
      <DeckLink key={deck.id} onDelete={handleDeleteDeckId} deck={deck} />
    ))}
  </div>
)}
```

### 4. Styling Guidelines

**Consistent with existing patterns:**
- Use Tailwind utility classes
- Purple theme: `text-purple-700`, `bg-purple-100`, `border-purple-700`
- Responsive breakpoints: `lg:` for desktop variations
- Shadows and borders: `shadow-md`, `border-gray-500`
- Spacing: `p-4`, `space-x-2`, `space-y-2`

**Accessibility:**
- Proper ARIA labels for dropdowns
- Keyboard navigation support (provided by Headless UI)
- Focus states visible
- Screen reader friendly

### 5. Empty State Handling

When filters result in no decks:
```tsx
{filteredAndSortedDecks.length === 0 && selectedSetFilters.length > 0 && (
  <div className="flex-1 flex items-center justify-center">
    <p className="text-gray-600">
      No decks found with selected filters.{" "}
      <button
        className="text-purple-700 font-bold"
        onClick={() => setSelectedSetFilters([])}
      >
        Clear filters
      </button>
    </p>
  </div>
)}
```

### 6. Persistence (Optional Enhancement)

Consider persisting sort/filter preferences:
- Use `localStorage` to save user preferences
- Restore on page load
- Key: `mydecks-sort-filter-preferences`

## File Structure

New files to create:
```
apps/frontend_v2/src/pages/MyDecks/
├── components/
│   ├── FilterSortBar.tsx       (main container)
│   ├── SortDropdown.tsx        (sort dropdown)
│   └── FilterDropdown.tsx      (filter dropdown)
└── hooks/
    └── useFilterSort.ts        (optional: extract logic)
```

## Dependencies

**Already Available:**
- `@headlessui/react` - Menu component
- `lucide-react` - Icons
- Tailwind CSS - Styling
- lodash - debounce (for search)

**No new dependencies needed**

## Testing Considerations

### Manual Testing Checklist
- [ ] Sort by name A-Z works correctly
- [ ] Sort by name Z-A works correctly
- [ ] Sort by date newest first (default)
- [ ] Sort by date oldest first
- [ ] Filter by single set
- [ ] Filter by multiple sets (OR logic)
- [ ] Clear filters button works
- [ ] Empty state shows when no decks match filters
- [ ] UI responsive on mobile (< 768px)
- [ ] UI works on tablet (768px - 1024px)
- [ ] UI works on desktop (> 1024px)
- [ ] Dropdowns close when clicking outside
- [ ] Keyboard navigation works
- [ ] Works for anonymous users (offline decks)
- [ ] Works for authenticated users (API decks)

### E2E Tests (Playwright)
Create test file: `apps/frontend_v2/tests/mydecks-filtering-sorting.spec.ts`
- Test sorting changes deck order
- Test filtering reduces deck list
- Test clearing filters
- Test combined sorting + filtering
- Test persistence (if implemented)

## Implementation Steps

1. **Create component structure**
   - Create `components/` directory in `MyDecks/`
   - Create `FilterSortBar.tsx` with placeholder UI
   - Create `SortDropdown.tsx` with Headless UI Menu
   - Create `FilterDropdown.tsx` with multi-select

2. **Implement sorting**
   - Add sort state to `MyDecksPage`
   - Implement `sortDecks` function
   - Connect `SortDropdown` to state
   - Test sorting works correctly

3. **Implement filtering**
   - Add filter state to `MyDecksPage`
   - Implement `filterDecks` function
   - Create multi-select UI in `FilterDropdown`
   - Add search within filter dropdown
   - Test filtering works correctly

4. **Polish UI**
   - Add icons from lucide-react
   - Ensure responsive layout
   - Add clear filters button
   - Add empty state messaging
   - Add active filter count badge

5. **Test thoroughly**
   - Manual testing on different screen sizes
   - Test with 0, 1, and many decks
   - Test with anonymous and authenticated users
   - Write E2E tests if time permits

6. **Verify with build pipeline**
   ```bash
   cd apps/frontend_v2
   pnpm tsc        # Type check
   pnpm build      # Build succeeds
   pnpm test:e2e   # E2E tests pass (if written)
   ```

## Design Inspiration

Modern filtering/sorting patterns:
- **GitHub Issues**: Sort dropdown + filter pills
- **Notion**: Clean dropdowns with icons
- **Linear**: Minimalist filter bar
- **Airbnb**: Mobile-friendly filter drawer

Key principles:
- Clear visual hierarchy
- Obvious active states
- Easy to clear/reset
- Don't overwhelm on mobile
- Show filter count when active

## Notes

- Keep components simple and focused
- Reuse existing components (`ExpansionPicture`, `DebouncedInput`)
- Match existing purple theme
- Ensure works for both anonymous and authenticated users
- Consider performance with large deck lists (memoization if needed)

## Success Metrics

- Users can quickly find decks by set
- Sorting options are discoverable
- UI feels native to the existing app
- No performance degradation
- Works seamlessly on mobile and desktop
