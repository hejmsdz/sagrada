import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/player/$id/score')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/player/$id/score"!</div>
}
