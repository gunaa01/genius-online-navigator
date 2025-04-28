import React, { useEffect, useState } from 'react';
import { useApiError } from '../../hooks/useApiError';
import { apiFetch } from '../../utils/apiFetch';

export interface Order {
  id: string;
  gig_id: string;
  client_id: string;
  status: string;
}

interface OrdersProps {
  userId: string;
}

const Orders: React.FC<OrdersProps> = ({ userId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, handleError] = useApiError();

  useEffect(() => {
    apiFetch(`/api/for-hire/orders?user_id=${userId}`)
      .then(async res => {
        if (await handleError(res)) return;
        setOrders(await res.json());
      });
  }, [userId, handleError]);

  return (
    <div>
      <h2>Your Orders</h2>
      {error && <div className="error">{error}</div>}
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            Gig: {order.gig_id} | Status: {order.status}
            {/* Link to order detail or messaging */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
