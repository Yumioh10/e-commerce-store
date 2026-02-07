import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/account/orders')({
  component: OrdersPage,
});

function OrdersPage() {
  const mockOrders = [
    { id: 'ORD-001', date: '2024-01-15', status: 'delivered', total: 234.89 },
    { id: 'ORD-002', date: '2024-01-28', status: 'shipped', total: 156.0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-medical-text mb-6">Order History</h1>
      <div className="bg-medical-white rounded-lg shadow-sm overflow-hidden">
        {mockOrders.map((order) => (
          <div key={order.id} className="border-b border-medical-gray last:border-0 p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{order.id}</h3>
                <p className="text-sm text-medical-text-secondary">{order.date}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'delivered'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className=" font-medium">{order.total.toFixed(2)} Dh</span>
              <button className="text-brand-primary hover:underline text-sm">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}