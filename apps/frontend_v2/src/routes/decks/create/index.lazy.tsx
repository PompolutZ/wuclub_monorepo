import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/decks/create/')({
  component: () => <div>Hello /decks/create/!</div>,
})
