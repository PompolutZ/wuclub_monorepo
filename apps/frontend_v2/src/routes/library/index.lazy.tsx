import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/library/')({
  component: () => <div>Hello /library/!</div>,
})
