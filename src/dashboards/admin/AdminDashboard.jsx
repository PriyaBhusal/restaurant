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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const dishesResponse = await fetch("http://localhost:5000/menu/menus");
      const dishesData = await dishesResponse.json();
      setDishes(dishesData);
      
      const usersResponse = await fetch("http://localhost:5000/user/users");
      const usersData = await usersResponse.json();
      setUsers(usersData);
      
      const ordersResponse = await fetch("http://localhost:5000/order/orders");
      const ordersData = await ordersResponse.json();
      setOrders(ordersData);
    } catch (error) {
      showModal("Failed to fetch data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (msg) => {
    setModalMsg(msg);
    setTimeout(() => setModalMsg(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // or sessionStorage if you're using that
    window.location.href = "/"; // redirect to login page
  };

  const renderActiveSection = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }

    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview dishes={dishes} users={users} orders={orders} />;
      case "dishes":
        return (
          <DishesSection
            dishes={dishes}
            setDishes={setDishes}
            showModal={showModal}
          />
        );
      case "users":
        return (
          <UsersSection
            users={users}
            setUsers={setUsers}
            showModal={showModal}
          />
        );
      case "orders":
        return <OrdersSection orders={orders} setOrders={setOrders} />;
      default:
        return <DashboardOverview dishes={dishes} users={users} orders={orders} />;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />
      <main className="main-content">
        <div className="content-wrapper">
          {renderActiveSection()}
        </div>
      </main>
      
      {modalMsg && (
        <div className="modal">
          <div className="modal-content">
            {modalMsg}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
