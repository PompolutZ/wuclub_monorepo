# Convert Class Components to Functional

**Priority:** LOW
**Effort:** 3-4 hours
**Impact:** Modern React patterns, consistency

## Problem

A few class components remain in the codebase. While functional, they use older React patterns. Converting to functional components with hooks improves consistency and enables better code reuse.

## Class Components Identified

### 1. `src/components/ErrorBoundary.jsx` - KEEP AS CLASS

**Status:** Should remain class component

**Reason:**
- Error boundaries MUST be class components
- No functional alternative exists yet
- This is the correct pattern

**Action:** No change needed (but see high-priority task to improve this component)

---

### 2. `src/pages/DeckCreator/DeckBuilder/components/Card.jsx` - WUCardInfo

**Class:** `WUCardInfo`
**Effort:** 1.5 hours
**Priority:** Medium-Low

**Current:**

```jsx
class WUCardInfo extends React.Component {
  render() {
    const { card, onClick, isSelected } = this.props;
    return (
      <div className={isSelected ? 'selected' : ''} onClick={onClick}>
        {/* Complex card rendering */}
      </div>
    );
  }
}
```

**Convert to:**

```jsx
import { memo, useCallback } from 'react';

const WUCardInfo = memo(function WUCardInfo({ card, onClick, isSelected }) {
  const handleClick = useCallback(() => {
    onClick?.(card.id);
  }, [onClick, card.id]);

  return (
    <div
      className={isSelected ? 'selected' : ''}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      {/* Complex card rendering */}
    </div>
  );
});

export default WUCardInfo;
```

**Benefits:**
- React.memo for performance
- useCallback for stable references
- Consistent with rest of codebase
- Better TypeScript support

---

### 3. `src/main.jsx` - ModalPresenter (if exists)

**Class:** `ModalPresenter`
**Effort:** 1 hour
**Priority:** Low

**Typical Pattern:**

```jsx
// Before
class ModalPresenter extends React.Component {
  state = {
    isOpen: false,
  };

  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });

  render() {
    return (
      <Modal isOpen={this.state.isOpen} onClose={this.close}>
        {this.props.children}
      </Modal>
    );
  }
}
```

**After:**

```jsx
import { useState, useCallback } from 'react';

function ModalPresenter({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <Modal isOpen={isOpen} onClose={close}>
      {children}
    </Modal>
  );
}

export default ModalPresenter;
```

---

## Implementation Strategy

### Phase 1: Identify All Class Components (30 min)

```bash
cd apps/frontend_v2

# Find all class components
pnpm exec grep -rn "class.*extends React.Component" src/
pnpm exec grep -rn "class.*extends Component" src/
pnpm exec grep -rn "extends PureComponent" src/
```

Create inventory:
| File | Class Name | Lines | Complexity | Keep/Convert |
|------|-----------|-------|------------|--------------|
| ... | ... | ... | ... | ... |

### Phase 2: Convert Simple Components First (1 hour)

Start with components that:
- Have minimal state
- No lifecycle methods
- Simple props

### Phase 3: Convert Complex Components (2 hours)

For complex components with:
- Multiple lifecycle methods
- Complex state management
- Performance optimizations

### Phase 4: Test Each Conversion (1 hour)

After each conversion:
- [ ] Component renders correctly
- [ ] All functionality preserved
- [ ] No performance regression
- [ ] Props work as expected

---

## Conversion Guide

### State Conversion

```jsx
// Class
class MyComponent extends React.Component {
  state = {
    count: 0,
    name: ''
  };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };
}

// Functional
function MyComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  const increment = useCallback(() => {
    setCount(c => c + 1);
  }, []);
}
```

---

### Lifecycle Methods Conversion

```jsx
// Class
componentDidMount() {
  this.fetchData();
}

componentWillUnmount() {
  this.cleanup();
}

// Functional
useEffect(() => {
  fetchData();

  return () => {
    cleanup();
  };
}, []); // Empty deps = mount/unmount only
```

---

### Props and Default Props

```jsx
// Class
class MyComponent extends React.Component {
  static defaultProps = {
    variant: 'default'
  };

  render() {
    return <div>{this.props.variant}</div>;
  }
}

// Functional
interface MyComponentProps {
  variant?: 'default' | 'primary';
}

function MyComponent({ variant = 'default' }: MyComponentProps) {
  return <div>{variant}</div>;
}
```

---

### Refs

```jsx
// Class
class MyComponent extends React.Component {
  inputRef = React.createRef();

  focus = () => {
    this.inputRef.current?.focus();
  };

  render() {
    return <input ref={this.inputRef} />;
  }
}

// Functional
function MyComponent() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} />;
}
```

---

### Performance: shouldComponentUpdate

```jsx
// Class
shouldComponentUpdate(nextProps, nextState) {
  return nextProps.id !== this.props.id;
}

// Functional - use React.memo
const MyComponent = memo(
  function MyComponent({ id }) {
    return <div>{id}</div>;
  },
  (prevProps, nextProps) => {
    // Return true if passing props are equal (skip re-render)
    return prevProps.id === nextProps.id;
  }
);
```

---

## Testing Checklist

For each converted component:

### Functionality
- [ ] Component renders
- [ ] State updates work
- [ ] Event handlers fire
- [ ] Side effects run correctly
- [ ] Cleanup happens on unmount

### Performance
- [ ] No unnecessary re-renders
- [ ] Memoization works (if used)
- [ ] Callbacks are stable
- [ ] No memory leaks

### TypeScript (if converted)
- [ ] Props properly typed
- [ ] State properly typed
- [ ] Refs properly typed
- [ ] No `any` types

### Integration
- [ ] Parent components work
- [ ] Child components work
- [ ] Context consumption works
- [ ] Existing tests pass

---

## Success Criteria

- [ ] All class components converted (except ErrorBoundary)
- [ ] Functionality preserved
- [ ] Performance maintained or improved
- [ ] Code is more maintainable
- [ ] Consistent patterns across codebase

---

## Common Patterns

### Context Consumption

```jsx
// Class
static contextType = MyContext;

render() {
  const value = this.context;
}

// Functional
const value = useContext(MyContext);
```

---

### Force Update (rare)

```jsx
// Class
this.forceUpdate();

// Functional - avoid, but if needed:
const [, forceUpdate] = useReducer(x => x + 1, 0);
// Call forceUpdate() to trigger re-render
```

---

### getDerivedStateFromProps

```jsx
// Class
static getDerivedStateFromProps(props, state) {
  if (props.value !== state.cachedValue) {
    return { cachedValue: props.value };
  }
  return null;
}

// Functional - usually not needed, but:
const [cachedValue, setCachedValue] = useState(value);

useEffect(() => {
  setCachedValue(value);
}, [value]);
```

---

## Notes

- Don't convert ErrorBoundary - must stay class
- Focus on components that will be edited frequently
- Low priority - only convert when touching code
- Consider leaving working code alone if not problematic
- This is code modernization, not a requirement
