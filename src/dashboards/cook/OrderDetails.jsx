import React from 'react';
import './orderDetails.css';

const OrderDetails = ({ order, onClose, onStatusUpdate }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const getTotal = () => {
    if (order.items && Array.isArray(order.items)) {
      return order.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    }
    return order.total || 0;
  };

  const handleStatusUpdate = (newStatus) => {
    console.log(`OrderDetails: Updating order ${order.id} to ${newStatus}`);
    onStatusUpdate(order.id, newStatus);
  };

  return (
    <div className="order-details">
      <div className="details-header">
        <h3>Order #{order.id}</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="details-content">
        <div className="order-meta">
          <div className="meta-item">
            <label>Table Number:</label>
            <span>{order.table_number || 'N/A'}</span>
          </div>
          <div className="meta-item">
            <label>Order Time:</label>
            <span>{formatTime(order.created_at || order.order_time)}</span>
          </div>
          <div className="meta-item">
            <label>Status:</label>
            <span className={`status ${order.status}`}>
              {order.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>
          {order.customer_name && (
            <div className="meta-item">
              <label>Customer:</label>
              <span>{order.customer_name}</span>
            </div>
          )}
        </div>

        <div className="order-items">
          <h4>Order Items</h4>
          {order.items && Array.isArray(order.items) ? (
            <div className="items-list">
              {order.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    {item.notes && (
                      <span className="item-notes">Note: {item.notes}</span>
                    )}
                  </div>
                  <div className="item-quantity">x{item.quantity}</div>
                  <div className="item-price">{formatPrice(item.price)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-items">No items details available</div>
          )}
        </div>

        <div className="order-total">
          <strong>Total: {formatPrice(getTotal())}</strong>
        </div>

        {order.special_instructions && (
          <div className="special-instructions">
            <h4>Special Instructions</h4>
            <p>{order.special_instructions}</p>
          </div>
        )}

        <div className="action-buttons">
          {order.status === 'pending' && (
            <button
              className="btn primary"
              onClick={() => handleStatusUpdate('preparing')}
            >
              Start Preparation
            </button>
          )}
          
          {order.status === 'preparing' && (
            <button
              className="btn success"
              onClick={() => handleStatusUpdate('ready')}
            >
              Mark as Ready
            </button>
          )}

          {order.status === 'ready' && (
            <div className="ready-status">
              ✓ Order is Ready for Pickup
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
