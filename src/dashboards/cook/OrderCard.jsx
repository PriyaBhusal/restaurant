import React from 'react';

const OrderCard = ({ order, onSelect, onStatusUpdate, isSelected }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'preparing': return '#2196f3';
      case 'ready': return '#4caf50';
      default: return '#757575';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getItemCount = () => {
    if (order.items && Array.isArray(order.items)) {
      return order.items.reduce((total, item) => total + (item.quantity || 1), 0);
    }
    return 0;
  };

  const handleStatusUpdate = (e, newStatus) => {
    e.stopPropagation();
    console.log(`OrderCard: Updating order ${order.id} to ${newStatus}`);
    onStatusUpdate(order.id, newStatus);
  };

  return (
    <div 
      className={`order-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="order-header">
        <div className="order-number">#{order.id}</div>
        <div 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(order.status) }}
        >
          {order.status.replace('-', ' ').toUpperCase()}
        </div>
      </div>

      <div className="order-info">
        <div className="table-number">Table {order.table_number || 'N/A'}</div>
        <div className="order-time">{formatTime(order.created_at || order.order_time)}</div>
        <div className="item-count">{getItemCount()} items</div>
      </div>

      <div className="order-actions">
        {order.status === 'pending' && (
          <button
            className="action-btn start-prep"
            onClick={(e) => handleStatusUpdate(e, 'preparing')}
          >
            Start Preparation
          </button>
        )}
        
        {order.status === 'preparing' && (
          <button
            className="action-btn mark-ready"
            onClick={(e) => handleStatusUpdate(e, 'ready')}
          >
            Mark Ready
          </button>
        )}

        {order.status === 'ready' && (
          <div className="ready-indicator">
            ✓ Ready for Pickup
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
