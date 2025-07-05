import React from 'react';
import { XCircle, Clock, User, Hash, CheckCircle } from 'lucide-react';

const OrdersList = ({ orders, setOrders, getStatusIcon }) => {
  const canCancelOrder = (status) => status === 'pending';

  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/order/orders/${orderId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      } else {
        alert('Failed to delete order.');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('An error occurred while deleting the order.');
    }
  };

  if (orders.length === 0) {
    return (
      <div className="orders-section">
        <div className="section-header">
          <h2>Current Orders</h2>
          <p>No orders yet</p>
        </div>
        <div className="empty-state">
          <Clock size={48} />
          <h3>No orders to display</h3>
          <p>Orders will appear here when customers place them</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-section">
      <div className="section-header">
        <h2>Current Orders</h2>
        <p>Manage customer orders and track status</p>
      </div>

      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-customer-info">
                <h3 className="customer-name">
                  <User size={16} />
                  {order.customerName}
                </h3>
                <p className="table-info">
                  <Hash size={14} />
                  Table {order.tableNumber}
                </p>
                <p className="order-time">
                  <Clock size={14} />
                  {order.orderTime}
                </p>
              </div>
              
              <div className="order-status-badge">
                {getStatusIcon(order.status)}
                <span className={`status-text ${order.status}`}>
                  {order.status === 'pending' && 'Pending'}
                  {order.status === 'preparing' && 'Preparing'}
                  {order.status === 'ready' && 'Ready'}
                </span>
              </div>
            </div>

            <div className="order-items-section">
              <h4 className="items-header">Order Items:</h4>
              <div className="order-items-list">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item-row">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <div className="item-details">
                        <span className="item-unit-price">
                          ${item.price.toFixed(2)} each
                        </span>
                      </div>
                    </div>
                    
                    <div className="item-quantity-price">
                      <div className="quantity-section">
                        <span className="quantity-label">Qty:</span>
                        <span className="quantity-value">{item.quantity}</span>
                      </div>
                      <div className="price-section">
                        <span className="item-total-price">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-footer">
              <div className="order-summary">
                <div className="summary-details">
                  <span className="total-items">
                    Total Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                  <span className="order-total">
                    <strong>Total: ${order.total.toFixed(2)}</strong>
                  </span>
                </div>
                <span className="order-timestamp">
                  {new Date(order.timestamp).toLocaleString()}
                </span>
              </div>
              
              <div className="order-actions">
                {canCancelOrder(order.status) && (
                  <button
                    className="cancel-order-btn"
                    onClick={() => {
                      if (window.confirm(`Cancel order for ${order.customerName}?`)) {
                        deleteOrder(order.id);
                      }
                    }}
                  >
                    <XCircle size={16} />
                    Cancel Order
                  </button>
                )}

                {order.status === 'ready' && (
                  <button
                    className="serve-order-btn"
                    onClick={() => {
                      if (window.confirm(`Mark order for ${order.customerName} as served?`)) {
                        deleteOrder(order.id);
                      }
                    }}
                  >
                    <CheckCircle size={16} />
                    Mark as Served
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersList;
