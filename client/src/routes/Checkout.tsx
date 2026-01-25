import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Checkout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/CheckOut"!</div>
}