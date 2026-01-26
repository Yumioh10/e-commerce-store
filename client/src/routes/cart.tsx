import { createFileRoute } from '@tanstack/react-router'
import { Cart } from '@/components/Cart'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/cart')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto px-4 py-8">
      <Cart isOpen={true} onClose={() => navigate({ to: '/' })} />
    </div>
  )
}