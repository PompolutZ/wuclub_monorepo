/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()
const LibraryIndexLazyImport = createFileRoute('/library/')()
const DecksIndexLazyImport = createFileRoute('/decks/')()

// Create/Update Routes

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const LibraryIndexLazyRoute = LibraryIndexLazyImport.update({
  id: '/library/',
  path: '/library/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/library/index.lazy').then((d) => d.Route))

const DecksIndexLazyRoute = DecksIndexLazyImport.update({
  id: '/decks/',
  path: '/decks/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/decks/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/decks/': {
      id: '/decks/'
      path: '/decks'
      fullPath: '/decks'
      preLoaderRoute: typeof DecksIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/library/': {
      id: '/library/'
      path: '/library'
      fullPath: '/library'
      preLoaderRoute: typeof LibraryIndexLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/decks': typeof DecksIndexLazyRoute
  '/library': typeof LibraryIndexLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/decks': typeof DecksIndexLazyRoute
  '/library': typeof LibraryIndexLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/decks/': typeof DecksIndexLazyRoute
  '/library/': typeof LibraryIndexLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/decks' | '/library'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/decks' | '/library'
  id: '__root__' | '/' | '/decks/' | '/library/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  DecksIndexLazyRoute: typeof DecksIndexLazyRoute
  LibraryIndexLazyRoute: typeof LibraryIndexLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  DecksIndexLazyRoute: DecksIndexLazyRoute,
  LibraryIndexLazyRoute: LibraryIndexLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/decks/",
        "/library/"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/decks/": {
      "filePath": "decks/index.lazy.tsx"
    },
    "/library/": {
      "filePath": "library/index.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
