# Vite Build Optimization

**Priority:** MEDIUM
**Effort:** 2 hours
**Impact:** Smaller bundle size, faster load times

## Problem

Current Vite configuration only chunks `wudb/db` and misses other optimization opportunities:
- Large vendor bundles
- No image optimization
- Missing source maps for debugging
- No compression configuration

**File:** `apps/frontend_v2/vite.config.ts`

## Current State (Lines 20-28)

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'wudb-db': ['./src/data/wudb/db'],
      }
    }
  }
}
```

## Proposed Optimizations

### 1. Enhanced Code Splitting (30 min)

Split large route components and vendor libraries:

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        // Vendor chunking strategy
        if (id.includes('node_modules')) {
          // React ecosystem
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'vendor-react';
          }

          // UI libraries
          if (id.includes('@headlessui') || id.includes('@radix-ui')) {
            return 'vendor-ui';
          }

          // TanStack (React Query)
          if (id.includes('@tanstack')) {
            return 'vendor-query';
          }

          // Firebase
          if (id.includes('firebase')) {
            return 'vendor-firebase';
          }

          // 3D Dice libraries
          if (id.includes('@3d-dice')) {
            return 'vendor-dice';
          }

          // Other large libraries
          if (id.includes('lodash') || id.includes('immutable')) {
            return 'vendor-utils';
          }

          // Remaining vendor code
          return 'vendor';
        }

        // Application code chunking
        if (id.includes('/src/data/wudb/')) {
          return 'wudb-db';
        }

        if (id.includes('/src/pages/DeckCreator/')) {
          return 'page-deck-creator';
        }

        if (id.includes('/src/pages/Library/')) {
          return 'page-library';
        }

        if (id.includes('/src/pages/MyDecks/')) {
          return 'page-my-decks';
        }
      },
    },
  },
  chunkSizeWarningLimit: 600, // Warn for chunks > 600kb
}
```

**Benefits:**
- Better caching - vendor code doesn't change often
- Parallel downloads - multiple chunks load simultaneously
- Smaller initial bundle - route-based splitting

---

### 2. Source Maps Configuration (5 min)

Enable source maps for production debugging without exposing them:

```typescript
build: {
  sourcemap: 'hidden', // Generate but don't reference in bundle
  // OR for staging environment:
  // sourcemap: true, // Full source maps
}
```

**Benefits:**
- Debug production issues
- No performance penalty for users
- Maps not exposed in production

---

### 3. Image Optimization (30 min)

Install and configure image optimization plugin:

```bash
cd apps/frontend_v2
pnpm add -D vite-plugin-image-optimizer
```

Update `vite.config.ts`:

```typescript
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
    }),
  ],
  // ... rest of config
});
```

**Benefits:**
- Smaller image files
- Faster page loads
- Automatic optimization during build

---

### 4. Build Performance Optimization (15 min)

```typescript
build: {
  // Improve build speed
  target: 'es2020', // Modern browsers only

  // Rollup options
  rollupOptions: {
    // ... manualChunks from above

    // Optimize dependencies
    external: [], // Add any CDN dependencies here
  },

  // Minimize options
  minify: 'esbuild', // Faster than terser

  // CSS code splitting
  cssCodeSplit: true,
}
```

---

### 5. Preview Server Compression (10 min)

Add compression for preview server:

```bash
pnpm add -D vite-plugin-compression
```

```typescript
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    ViteImageOptimizer(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  // ... rest of config
});
```

**Benefits:**
- Smaller transfer sizes
- Faster load times
- Better production simulation

---

### 6. Dependency Pre-bundling (10 min)

Optimize dependency pre-bundling for development:

```typescript
optimizeDeps: {
  include: [
    'react',
    'react-dom',
    'react-router-dom',
    '@tanstack/react-query',
    'firebase/auth',
    'firebase/firestore',
  ],
  exclude: [
    // Large deps that benefit from individual bundling
    '@3d-dice/dice-box',
  ],
}
```

**Benefits:**
- Faster dev server startup
- More stable HMR
- Better development experience

---

### 7. Asset Handling Configuration (15 min)

Optimize how assets are handled:

```typescript
build: {
  assetsInlineLimit: 4096, // Inline assets < 4kb as base64

  rollupOptions: {
    output: {
      assetFileNames: (assetInfo) => {
        // Organize built assets
        const info = assetInfo.name.split('.');
        const ext = info[info.length - 1];

        if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
          return `assets/images/[name]-[hash][extname]`;
        }

        if (/woff2?|ttf|otf|eot/i.test(ext)) {
          return `assets/fonts/[name]-[hash][extname]`;
        }

        return `assets/[name]-[hash][extname]`;
      },

      chunkFileNames: 'assets/js/[name]-[hash].js',
      entryFileNames: 'assets/js/[name]-[hash].js',
    },
  },
}
```

---

## Complete vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import compression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
    }),
    compression({ algorithm: 'gzip', ext: '.gz' }),
    compression({ algorithm: 'brotliCompress', ext: '.br' }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@icons': path.resolve(__dirname, './src/svgs'),
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@wudb': path.resolve(__dirname, './src/data/wudb'),
      '@services': path.resolve(__dirname, './src/services'),
    },
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'firebase/auth',
      'firebase/firestore',
    ],
    exclude: ['@3d-dice/dice-box'],
  },

  build: {
    target: 'es2020',
    sourcemap: 'hidden',
    minify: 'esbuild',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    assetsInlineLimit: 4096,

    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('@headlessui') || id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            if (id.includes('@tanstack')) {
              return 'vendor-query';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('@3d-dice')) {
              return 'vendor-dice';
            }
            if (id.includes('lodash') || id.includes('immutable')) {
              return 'vendor-utils';
            }
            return 'vendor';
          }

          if (id.includes('/src/data/wudb/')) return 'wudb-db';
          if (id.includes('/src/pages/DeckCreator/')) return 'page-deck-creator';
          if (id.includes('/src/pages/Library/')) return 'page-library';
          if (id.includes('/src/pages/MyDecks/')) return 'page-my-decks';
        },

        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name.split('.').pop();
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/woff2?|ttf|otf|eot/i.test(ext)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },

        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
});
```

---

## Implementation Steps

### Step 1: Install Dependencies (5 min)

```bash
cd apps/frontend_v2
pnpm add -D vite-plugin-image-optimizer vite-plugin-compression
```

### Step 2: Update vite.config.ts (30 min)

Apply all optimizations from the complete config above.

### Step 3: Build and Analyze (15 min)

```bash
# Build with stats
pnpm build

# Install bundle analyzer
pnpm add -D rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  // ... other plugins
  visualizer({ open: true, gzipSize: true, brotliSize: true }),
]

# Build again to see visualization
pnpm build
```

### Step 4: Measure Improvements (20 min)

Compare before/after metrics:
- Bundle sizes
- Number of chunks
- Load times (use Chrome DevTools)

---

## Testing Checklist

### Build Testing

- [ ] `pnpm build` completes successfully
- [ ] No chunk size warnings > 600kb
- [ ] All routes load correctly
- [ ] Images display properly
- [ ] Fonts load correctly

### Performance Testing

- [ ] Lighthouse performance score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Total Blocking Time < 200ms
- [ ] Cumulative Layout Shift < 0.1

### Production Testing

- [ ] `pnpm serve` works correctly
- [ ] Gzip/Brotli files generated
- [ ] Source maps not exposed
- [ ] All features functional

---

## Success Criteria

- [ ] Bundle size reduced by 20%+
- [ ] Initial load time improved
- [ ] Better caching strategy
- [ ] Organized build output
- [ ] Production debugging enabled

---

## Metrics to Track

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Total bundle size | ? | ? | < 1MB gzipped |
| Initial JS | ? | ? | < 300KB |
| Largest chunk | ? | ? | < 500KB |
| Number of chunks | ? | ? | 10-15 |
| Lighthouse score | ? | ? | > 90 |

---

## Notes

- Test on production-like environment
- Monitor bundle sizes in CI/CD
- Consider CDN for large vendor libs
- Lazy load heavy features (3D dice)
