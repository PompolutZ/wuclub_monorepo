# TypeScript Migration - Shared Components

**Priority:** MEDIUM
**Effort:** 4-6 hours
**Impact:** Type safety across reusable components

## Problem

Frequently used shared components are still in JavaScript (`.jsx`), missing type safety benefits. These components are used throughout the application, so proper typing will improve developer experience significantly.

## Components to Convert

### Phase 1: Simple Components (1-2 hours)

#### 1. `src/shared/components/IconButton.jsx` → `.tsx`

**Estimated:** 20 minutes

```typescript
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string; // for accessibility
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  className,
  ...props
}: IconButtonProps) {
  // ... implementation
}
```

#### 2. `src/shared/components/Divider.jsx` → `.tsx`

**Estimated:** 10 minutes

```typescript
interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({ orientation = 'horizontal', className }: DividerProps) {
  // ... implementation
}
```

#### 3. `src/shared/components/ScoreIcon.jsx` → `.tsx`

**Estimated:** 15 minutes

```typescript
interface ScoreIconProps {
  score: number;
  type?: 'glory' | 'damage' | 'wound';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ScoreIcon({ score, type = 'glory', size = 'md', className }: ScoreIconProps) {
  // ... implementation
}
```

---

### Phase 2: Medium Complexity (2-3 hours)

#### 4. `src/shared/components/HexToggle.jsx` → `.tsx`

**Estimated:** 30 minutes

```typescript
interface HexToggleProps {
  selected: boolean;
  onChange: (selected: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

export function HexToggle({
  selected,
  onChange,
  label,
  disabled = false,
  className
}: HexToggleProps) {
  // ... implementation
}
```

#### 5. `src/shared/components/NavigationPanel.jsx` → `.tsx`

**Estimated:** 45 minutes

```typescript
interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: ReactNode;
  badge?: number;
}

interface NavigationPanelProps {
  items: NavigationItem[];
  currentPath: string;
  onNavigate?: (path: string) => void;
  className?: string;
}

export function NavigationPanel({
  items,
  currentPath,
  onNavigate,
  className
}: NavigationPanelProps) {
  // ... implementation
}
```

#### 6. `src/shared/components/DeckPlayFormatInfo.jsx` → `.tsx`

**Estimated:** 45 minutes

```typescript
import type { PlayFormat } from '@fxdxpz/schema';

interface DeckPlayFormatInfoProps {
  format: PlayFormat;
  deckId?: string;
  showDetails?: boolean;
  className?: string;
}

export function DeckPlayFormatInfo({
  format,
  deckId,
  showDetails = false,
  className
}: DeckPlayFormatInfoProps) {
  // ... implementation
}
```

---

### Phase 3: Complex Components (1-2 hours)

#### 7. `src/shared/components/GrouppedFactionsToggle.jsx` → `.tsx`

**Estimated:** 1 hour

```typescript
import type { Faction } from '@wudb/types';

interface FactionGroup {
  label: string;
  factions: Faction[];
}

interface GrouppedFactionsToggleProps {
  groups: FactionGroup[];
  selectedFactions: string[];
  onChange: (factionIds: string[]) => void;
  allowMultiple?: boolean;
  className?: string;
}

export function GrouppedFactionsToggle({
  groups,
  selectedFactions,
  onChange,
  allowMultiple = true,
  className
}: GrouppedFactionsToggleProps) {
  // ... implementation
}
```

#### 8. `src/shared/components/CardImage.jsx` → `.tsx`

**Estimated:** 30 minutes

```typescript
import { ImgHTMLAttributes, memo } from 'react';

interface CardImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  cardId: string;
  src?: string;
  alt: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
}

export const CardImage = memo(function CardImage({
  cardId,
  src,
  alt,
  fallback = '/placeholder-card.png',
  loading = 'lazy',
  className,
  ...props
}: CardImageProps) {
  // ... implementation
});
```

## Implementation Strategy

### Step 1: Set Up Type Definitions

Create shared type files if they don't exist:

```typescript
// src/types/ui.ts
export type Size = 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type Orientation = 'horizontal' | 'vertical';
```

### Step 2: Convert Files One at a Time

For each component:

1. Rename `.jsx` to `.tsx`
2. Add type imports
3. Define prop interface
4. Add types to function parameters
5. Fix any type errors
6. Test the component

### Step 3: Update Consumers

After converting each component, verify imports still work:

```bash
# Search for imports of the component
pnpm exec grep -r "from '@components/IconButton'" src/
```

### Step 4: Run Type Check

```bash
pnpm tsc --noEmit
```

## Implementation Order

**Week 1:**
- [ ] IconButton
- [ ] Divider
- [ ] ScoreIcon
- [ ] CardImage (with React.memo optimization)

**Week 2:**
- [ ] HexToggle
- [ ] NavigationPanel
- [ ] DeckPlayFormatInfo

**Week 3:**
- [ ] GrouppedFactionsToggle

## Testing Checklist

For each component:

### Type Safety
- [ ] No `any` types used
- [ ] All props properly typed
- [ ] Event handlers have correct types
- [ ] Children prop typed correctly

### Functionality
- [ ] Component renders correctly
- [ ] All props work as expected
- [ ] Event handlers fire correctly
- [ ] Conditional rendering works

### Integration
- [ ] All consumers still work
- [ ] No new TypeScript errors
- [ ] IDE autocomplete works
- [ ] Prop validation works

### Build
- [ ] `pnpm tsc --noEmit` passes
- [ ] `pnpm build` succeeds
- [ ] No runtime errors

## Success Criteria

- [ ] All 8 components converted to TypeScript
- [ ] Proper interfaces defined for all props
- [ ] No `any` types (except where truly necessary)
- [ ] All consumers updated and working
- [ ] Type checking passes
- [ ] Better IDE support and autocomplete

## Common Patterns

### Extending HTML Props

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}
```

### Optional Callback Props

```typescript
interface ComponentProps {
  onClick?: (id: string) => void;
  onChange?: (value: string) => void;
}
```

### Children Prop

```typescript
import { ReactNode } from 'react';

interface ComponentProps {
  children: ReactNode;
}
```

### Ref Forwarding

```typescript
import { forwardRef, HTMLAttributes } from 'react';

interface ComponentProps extends HTMLAttributes<HTMLDivElement> {
  // ... props
}

export const Component = forwardRef<HTMLDivElement, ComponentProps>(
  function Component({ ...props }, ref) {
    return <div ref={ref} {...props} />;
  }
);
```

## Notes

- Use existing types from `@fxdxpz/schema` where applicable
- Import types from `@wudb/types` for card/faction data
- Keep components backward compatible
- Document complex prop types with JSDoc comments
- Consider making this part of coding standards going forward
