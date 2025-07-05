import React, { useState } from 'react';
import { Plus, Minus, XCircle, User, Hash, Search, ShoppingCart } from 'lucide-react';

const OrderForm = ({ menuItems, onCreateOrder }) => {
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItemToOrder = (item) => {
    const existingItem = selectedItems.find(selected => selected.id === item.id);
    if (existingItem) {
      setSelectedItems(prev =>
        prev.map(selected =>
          selected.id === item.id
            ? { ...selected, quantity: selected.quantity + 1 }
            : selected
        )
      );
    } else {
      setSelectedItems(prev => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      setSelectedItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (itemId) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    if (!customerName.trim() || !tableNumber.trim() || selectedItems.length === 0) {
      alert('Please fill in all fields and select at least one item');
      return;
    }

    const orderData = {
      customerName: customerName.trim(),
      tableNumber: tableNumber.trim(),
      items: selectedItems,
      total: calculateTotal()
    };

    onCreateOrder(orderData);
    
    // Reset form
    setCustomerName('');
    setTableNumber('');
    setSelectedItems([]);
    setSearchTerm('');
  };

  return (
    <div className="order-form-container">
      <div className="order-form-header">
        <h2 className="order-form-title">
          <ShoppingCart size={24} />
          Create New Order
        </h2>
        <p className="order-form-subtitle">Fill customer details and select menu items</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="order-form">
        {/* Customer Information Section */}
        <div className="customer-info-section">
          <h3 className="section-title">Customer Information</h3>
          <div className="customer-info-grid">
            <div className="form-group">
              <label htmlFor="customerName" className="form-label">
                <User size={16} />
                Customer Name
              </label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="tableNumber" className="form-label">
                <Hash size={16} />
                Table Number
              </label>
              <input
                id="tableNumber"
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Table #"
                className="form-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Menu Selection Section */}
        <div className="menu-selection-section">
          <h3 className="section-title">Select Menu Items</h3>
          
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search available items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="menu-items-grid">
            {filteredMenuItems.map(item => (
              <div key={item.id} className="menu-item-card">
                <div className="menu-item-info">
                  <h4 className="menu-item-name">{item.name}</h4>
                  <p className="menu-item-description">{item.description}</p>
                  <div className="menu-item-footer">
                    <span className="menu-item-price">${item.price.toFixed(2)}</span>
                    <span className="menu-item-category">{item.category}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="add-to-cart-btn"
                  onClick={() => addItemToOrder(item)}
                >
                  <Plus size={16} />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Section */}
        {selectedItems.length > 0 && (
          <div className="order-summary-section">
            <div className="cart-header">
              <h3 className="section-title">
                <ShoppingCart size={20} />
                Order Summary ({selectedItems.length} items)
              </h3>
            </div>
            
            <div className="cart-items">
              {selectedItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <div className="cart-item-details">
                      <span className="cart-item-price">
                        ${item.price.toFixed(2)} each
                      </span>
                    </div>
                  </div>
                  
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        type="button"
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <div className="cart-item-total">
                      <span className="item-total-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeItem(item.id)}
                      title="Remove item"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <div className="total-breakdown">
                  <span className="total-items">
                    Total Items: {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                  <span className="total-amount">
                    Total Amount: ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
              
              <button type="submit" className="submit-order-btn">
                <ShoppingCart size={16} />
                Submit Order
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default OrderForm;
