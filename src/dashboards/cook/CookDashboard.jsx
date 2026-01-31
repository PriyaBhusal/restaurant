import React, { useState, useEffect } from 'react';
import OrderCard from './OrderCard';
import OrderDetails from './OrderDetails';
import { updateOrderStatusAPI } from './StatusUpdateHelper';
import './cook.css';
import { useNavigate } from 'react-router-dom';

const CookDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("cookToken");
      if (!token) throw new Error("Not authenticated. Please login.");

      const endpoint =
        filter === 'pending'
          ? 'http://localhost:5000/order/orders?status=pending'
          : 'http://localhost:5000/order/orders';

      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      const parsedOrders = data.map(order => ({
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
        order_time: order.createdAt || order.created_at,
        created_at: order.createdAt || order.created_at,
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
      const updatedOrder = await updateOrderStatusAPI(orderId, newStatus);

      setOrders(prevOrders =>
        prevOrders.map(order => order.id === orderId ? updatedOrder : order)
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }

      showNotification(`Order #${orderId} status updated to ${newStatus}`, 'success');
    } catch (error) {
      console.error(error);
      showNotification(`Failed to update status: ${error.message}`, 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cookToken');
    sessionStorage.clear();
    showNotification('Logging out...', 'info');
    setTimeout(() => navigate('/login'), 800);
  };

  const filteredOrders = orders.filter(order => filter === 'all' || order.status === filter);

  const counts = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="cook-dashboard">
      {notification && <div className={`notification ${notification.type}`}>{notification.message}</div>}

      <header className="dashboard-header">
        <h1>Cook Dashboard</h1>
        <div className="header-right">
          <div className="status-summary">
            <div className="status-item pending"><span className="count">{counts.pending}</span><span>Pending</span></div>
            <div className="status-item preparing"><span className="count">{counts.preparing}</span><span>Preparing</span></div>
            <div className="status-item ready"><span className="count">{counts.ready}</span><span>Ready</span></div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="orders-section">
          <div className="filter-tabs">
            {['all', 'pending', 'preparing', 'ready'].map(status => (
              <button key={status} className={filter === status ? 'active' : ''} onClick={() => setFilter(status)}>
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
                    isSelected={selectedOrder?.id === order.id}
                  />
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
