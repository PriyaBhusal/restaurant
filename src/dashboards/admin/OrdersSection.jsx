import React from "react";
import "./admin.css";

export function OrdersSection({ orders = [] }) {
  return (
    <div className="orders-cards-section">
      <h1 className="section-title" style={{ textAlign: "center", marginBottom: "2rem" }}>
        All Orders
      </h1>
      <div className="orders-cards-grid">
        {orders.length === 0 && (
          <div className="empty-state">No orders found.</div>
        )}
        {orders.map(order => (
          <div className="order-card" key={order.id}>
            <div className="order-card-header">
              <span className="order-id">Order #{order.id}</span>
              <span className={`order-status status-${order.status}`}>{order.status}</span>
            </div>
            <div className="order-card-body">
              <div><b>Table:</b> {order.table_number}</div>
              <div><b>Customer:</b> {order.customer_name}</div>
              <div>
                <b>Items:</b>{" "}
                {Array.isArray(order.items)
                  ? order.items.map(i => `${i.name} (${i.quantity})`).join(", ")
                  : order.items}
              </div>
              <div><b>Quantity:</b> {order.quantity}</div>
              <div><b>Created At:</b> {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
