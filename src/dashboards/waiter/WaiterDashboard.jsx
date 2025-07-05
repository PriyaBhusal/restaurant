import React, { useState, useEffect, useRef } from 'react';
import { Plus, Clock, CheckCircle, XCircle, Eye, User, ShoppingCart, LogOut, Bell, Settings, Search } from 'lucide-react';
import OrderForm from './OrderForm';
import OrdersList from './OrderList';
import './waiter.css';
import { useNavigate } from 'react-router-dom';


const WaiterDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('menu');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const modalRef = useRef(null);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('http://localhost:5000/menu/menus');
        if (!response.ok) throw new Error('Failed to fetch menu items');
        const data = await response.json();

        const formattedData = data.map(item => ({
          id: item.id,
          name: item.item,
          description: item.description || 'Delicious dish prepared with care',
          price: item.price,
          category: item.category || 'Main Course',
          available: item.available !== false
        }));

        setMenuItems(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingMenu(false);
      }
    };

    fetchMenu();
    fetchOrders(); // ✅ fetch orders initially on mount
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/order/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      const transformedOrders = data.map(order => ({
        id: order.id,
        customerName: order.customer_name || 'Guest',
        tableNumber: order.table_number,
        status: order.status,
        items: order.items || [],
        total: order.items ? order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0,
        timestamp: order.createdAt,
        orderTime: new Date(order.createdAt).toLocaleTimeString(),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }));
      setOrders(transformedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders(); // ✅ also re-fetch when switching to orders tab
    }
  }, [activeTab]);

  useEffect(() => {
    if (showModal && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showModal]);

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateOrder = async (orderData) => {
    const newOrder = {
      customerName: orderData.customerName,
      tableNumber: orderData.tableNumber,
      items: orderData.items.map(item => ({
        itemId: item.id,
        quantity: item.quantity
      })),
      status: 'pending'
    };

    try {
      const response = await fetch('http://localhost:5000/order/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
      });

      if (!response.ok) throw new Error('Failed to create order');
      const savedOrder = await response.json();

      setOrderSuccess(true);
      setShowModal(true);
      setTimeout(() => {
        setOrderSuccess(false);
        setShowModal(false);
      }, 3000);

      fetchOrders(); // ✅ fetch latest orders after successful submission
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('There was an error submitting the order.');
    }
  };

  const handleCancelOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="status-icon pending" />;
      case 'preparing':
        return <Eye className="status-icon preparation" />;
      case 'ready':
        return <CheckCircle className="status-icon ready" />;
      default:
        return <Clock className="status-icon pending" />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate("/"); 
  };

  const ConfirmationModal = ({ show, onClose }) => {
    if (!show) return null;
    return (
      <div ref={modalRef} className="modal-overlay">
        <div className="modal-content">
          <div className="modal-icon">✓</div>
          <h2>Order Submitted!</h2>
          <p>Your order has been placed successfully.</p>
          <button onClick={onClose}>Continue</button>
        </div>
      </div>
    );
  };

  const LogoutModal = ({ show, onClose, onConfirm }) => {
    if (!show) return null;
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-icon" style={{ color: '#ef4444' }}>⚠</div>
          <h2>Confirm Logout</h2>
          <p>Are you sure you want to logout?</p>
          <div className="modal-actions">
            <button onClick={onClose}>Cancel</button>
            <button onClick={onConfirm} style={{ background: '#ef4444', color: '#fff' }}>Logout</button>
          </div>
        </div>
      </div>
    );
  };

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
    };
  };

  const stats = getOrderStats();

  return (
    <div className="waiter-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Waiter Dashboard</h1>
          <p>Manage orders and serve customers efficiently</p>
        </div>
        <div className="header-right">
          <button className="header-btn"><Bell size={16} /> Notifications</button>
          <button className="header-btn"><Settings size={16} /> Settings</button>
          <button className="header-btn logout" onClick={() => setShowLogoutModal(true)}><LogOut size={16} /> Logout</button>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card total">
            <p>Total Orders</p>
            <h2>{stats.total}</h2>
            <ShoppingCart />
          </div>
          <div className="stat-card pending">
            <p>Pending</p>
            <h2>{stats.pending}</h2>
            <Clock />
          </div>
          <div className="stat-card preparing">
            <p>Preparing</p>
            <h2>{stats.preparing}</h2>
            <Eye />
          </div>
          <div className="stat-card ready">
            <p>Ready</p>
            <h2>{stats.ready}</h2>
            <CheckCircle />
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-buttons">
          <button className={activeTab === 'menu' ? 'active' : ''} onClick={() => setActiveTab('menu')}><Eye size={16} /> View Menu</button>
          <button className={activeTab === 'order' ? 'active' : ''} onClick={() => setActiveTab('order')}><Plus size={16} /> New Order</button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}><ShoppingCart size={16} /> Orders ({orders.length})</button>
        </div>

        {/* Content */}
        <div className="tab-content">
          {activeTab === 'menu' && (
            <div>
              <h2>Restaurant Menu</h2>
              <div className="search-bar">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {loadingMenu && <p className="loading">Loading menu...</p>}
              {error && <p className="error">{error}</p>}
              {!loadingMenu && filteredMenuItems.length === 0 && (
                <p className="empty">No matching menu items.</p>
              )}
              <div className="menu-grid">
                {filteredMenuItems.map(item => (
                  <div key={item.id} className={`menu-card ${!item.available ? 'unavailable' : ''}`}>
                    <div className="menu-header">
                      <h3>{item.name}</h3>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                    <p>{item.description}</p>
                    <div className="menu-footer">
                      <span className="menu-category">{item.category}</span>
                      <span className={`menu-status ${item.available ? 'available' : 'out'}`}>
                        {item.available ? 'Available' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'order' && (
            <>
              <ConfirmationModal show={showModal} onClose={() => { setShowModal(false); setOrderSuccess(false); }} />
              <OrderForm
                menuItems={menuItems.filter(item => item.available)}
                onCreateOrder={handleCreateOrder}
              />
            </>
          )}

          {activeTab === 'orders' && (
            <>
              {error && (
                <div className="error-banner">
                  {error}
                </div>
              )}
              <OrdersList
                orders={orders}
                onCancelOrder={handleCancelOrder}
                getStatusIcon={getStatusIcon}
              />
            </>
          )}
        </div>
      </div>

      <LogoutModal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default WaiterDashboard;
