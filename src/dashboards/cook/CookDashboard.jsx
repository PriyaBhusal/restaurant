import React, { useState, useEffect } from 'react';
import OrderCard from './OrderCard';
import OrderDetails from './OrderDetails';
import { updateOrderStatusAPI } from './StatusUpdateHelper';
import { Flame } from 'lucide-react';
import './cook.css';

const CookDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 5000); // ⏱ Poll every 5 seconds
    return () => clearInterval(interval);
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const endpoint = filter === 'pending'
        ? 'http://localhost:5000/order/orders?status=pending'
        : 'http://localhost:5000/order/orders';

      const response = await fetch(endpoint);
      const data = await response.json();

      const parsedOrders = data.map(order => ({
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
        order_time: order.createdAt || order.created_at,
        created_at: order.createdAt || order.created_at
      }));

      setOrders(parsedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
      showNotification('Failed to fetch orders', 'error');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatusAPI(orderId, newStatus);

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      showNotification(`Order #${orderId} status updated to ${newStatus}`, 'success');
    } catch (error) {
      console.error('Error updating order status:', error);
      showNotification(`Failed to update order status: ${error.message}`, 'error');
    }
  };

  const markInPreparation = async (orderId) => {
    await updateOrderStatus(orderId, 'preparing');
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getOrderCounts = () => {
    return {
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
    };
  };

  const counts = getOrderCounts();

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="cook-dashboard">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <header className="dashboard-header">
        <h1>Cook Dashboard</h1>
        <div className="status-summary">
          <div className="status-item pending">
            <span className="count">{counts.pending}</span>
            <span className="label">Pending</span>
          </div>
          <div className="status-item preparing">
            <span className="count">{counts.preparing}</span>
            <span className="label">Preparing</span>
          </div>
          <div className="status-item ready">
            <span className="count">{counts.ready}</span>
            <span className="label">Ready</span>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="orders-section">
          <div className="filter-tabs">
            {['all', 'pending', 'preparing', 'ready'].map(status => (
              <button
                key={status}
                className={filter === status ? 'active' : ''}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="orders-grid">
            {filteredOrders.length === 0 ? (
              <div className="no-orders">No orders found</div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="order-card-wrapper">
                  <OrderCard
                    order={order}
                    onSelect={() => setSelectedOrder(order)}
                    onStatusUpdate={updateOrderStatus}
                    isSelected={selectedOrder && selectedOrder.id === order.id}
                  />
                  {/* {order.status === 'pending' && (
                    <button
                      className="start-preparing-btn"
                      onClick={() => markInPreparation(order.id)}
                    >
                      <Flame size={16} /> Start Preparing
                    </button>
                  )} */}
                </div>
              ))
            )}
          </div>
        </div>

        {selectedOrder && (
          <div className="order-details-section">
            <OrderDetails
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
              onStatusUpdate={updateOrderStatus}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CookDashboard;
