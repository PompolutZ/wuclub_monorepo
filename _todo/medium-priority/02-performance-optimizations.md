# Performance Optimizations

**Priority:** MEDIUM
**Effort:** 2-3 hours
**Impact:** Reduced re-renders, better user experience

## Problem

Several components are re-rendering unnecessarily, causing performance issues. Adding memoization and optimizing callbacks will improve performance, especially on lower-end devices.

## Optimizations to Implement

### 1. Add React.memo to CardImage (15 min)

**File:** `src/shared/components/CardImage.jsx`

**Issue:** Simple component that re-renders frequently

**Solution:**

```jsx
import { memo } from 'react';

export const CardImage = memo(function CardImage({ src, alt, className }) {
  return <img src={src} alt={alt} className={className} loading="lazy" />;
});
```

**Impact:**
- Prevents re-renders when parent updates
- Significant impact in card lists (100+ cards)

---

### 2. Optimize LibraryFilters Component (1 hour)

**File:** `src/pages/DeckCreator/DeckBuilder/components/LibraryFilters/index.jsx`

**Issue:** Complex filter component with animations - missing useCallback for handlers

**Current Problem:**

```jsx
// Every render creates new function references
function LibraryFilters({ onFilterChange, filters }) {
  return (
    <div>
      <input onChange={(e) => onFilterChange('name', e.target.value)} />
      <select onChange={(e) => onFilterChange('type', e.target.value)} />
    </div>
  );
}
```

**Solution:**

```jsx
import { useCallback, useMemo } from 'react';

function LibraryFilters({ onFilterChange, filters }) {
  const handleNameChange = useCallback((e) => {
    onFilterChange('name', e.target.value);
  }, [onFilterChange]);

  const handleTypeChange = useCallback((e) => {
    onFilterChange('type', e.target.value);
  }, [onFilterChange]);

  // Memoize expensive computations
  const filteredOptions = useMemo(() => {
    return computeOptions(filters);
  }, [filters]);

  return (
    <div>
      <input onChange={handleNameChange} />
      <select onChange={handleTypeChange}>
        {filteredOptions.map(opt => <option key={opt.id}>{opt.label}</option>)}
      </select>
    </div>
  );
}

// Memoize the component itself
export default memo(LibraryFilters);
```

**Impact:**
- Prevents child component re-renders
- Reduces filter animation jank
- Better user experience during typing

---

### 3. Optimize Card Component in DeckBuilder (45 min)

**File:** `src/pages/DeckCreator/DeckBuilder/components/Card.jsx`

**Issue:** `WUCardInfo` class component not optimized

**Current State:**

```jsx
class WUCardInfo extends React.Component {
  render() {
    return <div>...</div>;
  }
}

const CardInDeck = memo(function CardInDeck({ card }) {
  return <WUCardInfo card={card} />;
});
```

**Solution:**

Convert `WUCardInfo` to functional component with memo:

```jsx
const WUCardInfo = memo(function WUCardInfo({ card, onClick, isSelected }) {
  const handleClick = useCallback(() => {
    onClick?.(card.id);
  }, [onClick, card.id]);

  return (
    <div onClick={handleClick}>
      {/* ... */}
    </div>
  );
});

const CardInDeck = memo(function CardInDeck({ card, onClick, isSelected }) {
  return <WUCardInfo card={card} onClick={onClick} isSelected={isSelected} />;
});
```

**Impact:**
- Prevents unnecessary re-renders in deck view
- Faster deck building experience
- Smoother drag-and-drop

---

### 4. Optimize ObjectivesList, GambitsList, UpgradesList (30 min)

**Files:**
- `src/pages/DeckCreator/DeckBuilder/components/ObjectivesList.jsx`
- `src/pages/DeckCreator/DeckBuilder/components/GambitsList.jsx`
- `src/pages/DeckCreator/DeckBuilder/components/UpgradesList.jsx`

**Issue:** List components re-render entire list on any change

**Solution:**

```jsx
import { memo, useCallback } from 'react';

const CardListItem = memo(function CardListItem({ card, onAdd }) {
  const handleAdd = useCallback(() => {
    onAdd(card.id);
  }, [onAdd, card.id]);

  return <div onClick={handleAdd}>{card.name}</div>;
});

function ObjectivesList({ cards, onAddCard }) {
  const handleAdd = useCallback((cardId) => {
    onAddCard(cardId);
  }, [onAddCard]);

  return (
    <div>
      {cards.map(card => (
        <CardListItem key={card.id} card={card} onAdd={handleAdd} />
      ))}
    </div>
  );
}

export default memo(ObjectivesList);
```

**Impact:**
- Only re-render changed items
- Smoother scrolling in large lists
- Better performance with filters

---

### 5. Optimize ExpansionIcon Components (15 min)

**Files:**
- `src/atoms/ExpansionIcon.jsx`
- `src/atoms/ToggableExpansionIcon.jsx`

**Solution:**

```jsx
import { memo } from 'react';

export const ExpansionIcon = memo(function ExpansionIcon({ expansionId, size = 'md' }) {
  return <img src={getExpansionIcon(expansionId)} alt="" className={sizeClasses[size]} />;
});

export const ToggableExpansionIcon = memo(function ToggableExpansionIcon({
  expansionId,
  selected,
  onChange
}) {
  const handleClick = useCallback(() => {
    onChange(!selected);
  }, [onChange, selected]);

  return (
    <button onClick={handleClick} aria-pressed={selected}>
      <ExpansionIcon expansionId={expansionId} />
    </button>
  );
});
```

## Implementation Steps

### Step 1: Profile Current Performance

Use React DevTools Profiler to identify bottlenecks:

```bash
# Run in development mode
pnpm dev
```

1. Open React DevTools
2. Go to Profiler tab
3. Start recording
4. Interact with deck builder (add cards, change filters)
5. Stop recording
6. Identify components with most re-renders

### Step 2: Apply Optimizations

Start with highest-impact optimizations:

1. CardImage (used everywhere)
2. LibraryFilters (user interaction heavy)
3. Card lists (many items)
4. Individual card components

### Step 3: Measure Impact

After each optimization:

1. Profile again with React DevTools
2. Compare render counts
3. Check for performance improvements
4. Verify functionality still works

### Step 4: Add Performance Monitoring

```jsx
// Development-only performance logging
if (import.meta.env.DEV) {
  const CardListWithPerf = ({ cards, ...props }) => {
    const renderCount = useRef(0);
    renderCount.current += 1;

    console.log(`CardList rendered ${renderCount.current} times`);

    return <CardList cards={cards} {...props} />;
  };
}
```

## Testing Checklist

### Performance Testing

- [ ] Profile before optimization (baseline)
- [ ] Apply optimizations
- [ ] Profile after optimization
- [ ] Compare render counts
- [ ] Test on slower device/CPU throttling

### Functionality Testing

- [ ] All interactive features work
- [ ] Filters update correctly
- [ ] Cards can be added/removed
- [ ] Animations still smooth
- [ ] No visual regressions

### Edge Cases

- [ ] Empty lists render correctly
- [ ] Large datasets (500+ cards) perform well
- [ ] Rapid filter changes handled
- [ ] Scroll performance acceptable

## Success Criteria

- [ ] 50% reduction in unnecessary re-renders
- [ ] Smooth filter interactions (no lag)
- [ ] List scrolling at 60 FPS
- [ ] No functionality broken
- [ ] React DevTools shows optimized render counts

## Performance Metrics to Track

Before and after measurements:

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Filter change re-renders | ? | ? | < 10 components |
| Card list scroll FPS | ? | ? | 60 FPS |
| Add card response time | ? | ? | < 100ms |
| Initial render time | ? | ? | < 2s |

## Common Pitfalls to Avoid

### 1. Over-Memoization

Don't memoize everything - it has overhead:

```jsx
// ❌ Don't memoize simple components
const SimpleText = memo(({ text }) => <span>{text}</span>);

// ✅ Do memoize expensive components
const ComplexCard = memo(({ card }) => {
  // Complex rendering logic
});
```

### 2. Incorrect Dependencies

```jsx
// ❌ Missing dependencies
const handleClick = useCallback(() => {
  doSomething(prop);
}, []); // prop not in deps

// ✅ Correct dependencies
const handleClick = useCallback(() => {
  doSomething(prop);
}, [prop]);
```

### 3. Inline Object/Array Creation

```jsx
// ❌ Creates new object every render
<Component style={{ margin: 10 }} />

// ✅ Define outside or memoize
const style = { margin: 10 };
<Component style={style} />
```

## Future Optimizations

- [ ] Implement virtual scrolling for long lists
- [ ] Add code splitting for heavy components
- [ ] Lazy load card images
- [ ] Debounce filter inputs
- [ ] Cache filter results
