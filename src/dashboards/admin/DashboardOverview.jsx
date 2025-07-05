import React from "react";
import "./admin.css";

export function DashboardOverview({ dishes, users, orders }) {
  const totalRevenue = dishes.reduce((sum, dish) => {
    const dishOrders = orders.filter(order => {
      const orderItems = typeof order.items === 'string' ? 
        JSON.parse(order.items) : order.items;
      return Array.isArray(orderItems) ? 
        orderItems.some(item => item.name === dish.item) : false;
    });
    return sum + (dishOrders.length * dish.price);
  }, 0);

  const stats = [
    {
      title: "Total Dishes",
      value: dishes.length,
      icon: "🍽️",
      color: "blue"
    },
    {
      title: "Total Users",
      value: users.length,
      icon: "👥",
      color: "green"
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: "📋",
      color: "orange"
    },
    {
      title: "Revenue",
      value: `£${totalRevenue.toFixed(2)}`,
      icon: "💰",
      color: "purple"
    }
  ];

  const recentOrders = orders.slice(-5).reverse();
  const topDishes = dishes.slice(0, 5);

  return (
    <div className="section">
      <div className="section-header">
        <h1 className="section-title">Dashboard Overview</h1>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`card stat-card stat-${stat.color}`}>
            <div className="card-content">
              <div className="stat-content">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-details">
                  <h3 className="stat-title">{stat.title}</h3>
                  <p className="stat-value">{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Orders</h3>
            </div>
            <div className="card-content">
              {recentOrders.length > 0 ? (
                <div className="recent-orders">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="recent-order-item">
                      <div className="order-info">
                        <span className="order-id">Order #{order.id}</span>
                        <span className="order-table">Table {order.table_number}</span>
                      </div>
                      <div className="order-quantity">
                        Qty: {order.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-text">No recent orders</p>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Menu Items</h3>
            </div>
            <div className="card-content">
              {topDishes.length > 0 ? (
                <div className="top-dishes">
                  {topDishes.map((dish) => (
                    <div key={dish.id} className="dish-item">
                      <div className="dish-info">
                        <span className="dish-name">{dish.item}</span>
                        <span className="dish-price">£{parseFloat(dish.price).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-text">No dishes available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
