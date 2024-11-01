import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/boards/')({
  component: () => <div>Hello /boards/!</div>,
})
