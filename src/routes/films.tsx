import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/films')({
  component: () => <div>Hello /films!</div>,
})
