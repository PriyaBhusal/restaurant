import React, { useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { DashboardOverview } from "./DashboardOverview";
import { DishesSection } from "./DishesSection";
import { UsersSection } from "./UsersSection";
import { OrdersSection } from "./OrdersSection";
import "./admin.css";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [dishes, setDishes] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMsg, setModalMsg] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch dishes
      const dishesRes = await fetch("http://localhost:5000/api/menu/menus", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!dishesRes.ok) throw new Error("Failed to fetch dishes");
      const dishesData = await dishesRes.json();
      setDishes(dishesData);

      // Fetch users
      const usersRes = await fetch("http://localhost:5000/api/user/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!usersRes.ok) throw new Error("Failed to fetch users");
      const usersData = await usersRes.json();
      setUsers(usersData);

      // Fetch orders
      const ordersRes = await fetch("http://localhost:5000/order/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!ordersRes.ok) throw new Error("Failed to fetch orders");
      const ordersData = await ordersRes.json();
      setOrders(ordersData);
    } catch (err) {
      showModal(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (msg) => {
    setModalMsg(msg);
    setTimeout(() => setModalMsg(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const renderActiveSection = () => {
    if (loading)
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      );

    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview dishes={dishes} users={users} orders={orders} />;
      case "dishes":
        return <DishesSection dishes={dishes} setDishes={setDishes} showModal={showModal} token={token} />;
      case "users":
        return <UsersSection users={users} setUsers={setUsers} showModal={showModal} token={token} />;
      case "orders":
        return <OrdersSection orders={orders} setOrders={setOrders} token={token} showModal={showModal} />;
      default:
        return <DashboardOverview dishes={dishes} users={users} orders={orders} />;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={handleLogout} />
      <main className="main-content">
        <div className="content-wrapper">{renderActiveSection()}</div>
      </main>
      {modalMsg && (
        <div className="modal">
          <div className="modal-content">{modalMsg}</div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
