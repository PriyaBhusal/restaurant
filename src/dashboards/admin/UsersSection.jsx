import React, { useState } from "react";
import "./admin.css";

export function UsersSection({ users, setUsers, showModal }) {
  const [editingUserId, setEditingUserId] = useState(null);
  const [userEdits, setUserEdits] = useState({ 
    name: "", 
    email: "", 
    role: "Waiter", 
    password: "" 
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleEditUser = (user) => {
    setEditingUserId(user.id);
    setUserEdits({ 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      password: "" 
    });
  };

  const handleSaveUser = async (id) => {
    try {
      if (userEdits.password && userEdits.password.length < 6) {
        showModal("Password must be at least 6 characters.");
        return;
      }

      await fetch(`http://localhost:5000/user/users/${id}/details`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userEdits.name,
          email: userEdits.email,
        }),
      });

      await fetch(`http://localhost:5000/user/users/${id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: userEdits.role }),
      });

      if (userEdits.password) {
        const res = await fetch(`http://localhost:5000/user/users/${id}/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: userEdits.password }),
        });

        const result = await res.json();
        if (!res.ok) {
          showModal(result?.error || "Password reset failed");
          return;
        }
      }

      const updatedUsersResponse = await fetch("http://localhost:5000/user/users");
      const updatedUsers = await updatedUsersResponse.json();
      setUsers(updatedUsers);
      setEditingUserId(null);
      showModal("User updated successfully");
    } catch (error) {
      showModal("Failed to update user");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/user/users/${id}`, { 
        method: "DELETE" 
      });
      
      if (response.ok) {
        setUsers(users.filter(u => u.id !== id));
        showModal("User deleted successfully");
      } else {
        showModal("Failed to delete user");
      }
    } catch (error) {
      showModal("Error deleting user");
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h1 className="section-title">Manage Users</h1>
        <div className="badge">
          {users.length} users
        </div>
      </div>

      <div className="users-list">
        {users.map((user) => (
          <div key={user.id} className="card user-card">
            <div className="card-content">
              {editingUserId === user.id ? (
                <div className="edit-form">
                  <input
                    className="input"
                    value={userEdits.name}
                    onChange={(e) => setUserEdits({ ...userEdits, name: e.target.value })}
                    placeholder="Name"
                  />
                  <input
                    className="input"
                    value={userEdits.email}
                    onChange={(e) => setUserEdits({ ...userEdits, email: e.target.value })}
                    placeholder="Email"
                  />
                  <select 
                    className="input select"
                    value={userEdits.role} 
                    onChange={(e) => setUserEdits({ ...userEdits, role: e.target.value })}
                  >
                    {["Waiter", "Cook", "Admin"].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <div className="password-input-container">
                    <input
                      className="input"
                      placeholder="New Password (optional)"
                      type={showPassword ? "text" : "password"}
                      value={userEdits.password}
                      onChange={(e) => setUserEdits({ ...userEdits, password: e.target.value })}
                    />
                    <span
                      className="eye-icon"
                      onClick={() => setShowPassword(prev => !prev)}
                    >
                      {showPassword ? "👁️" : "🙈"}
                    </span>
                  </div>
                  <div className="button-group">
                    <button 
                      className="btn btn-primary btn-sm" 
                      onClick={() => handleSaveUser(user.id)}
                    >
                      Save
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => setEditingUserId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="user-info">
                  <div className="user-details">
                    <h3 className="user-name">{user.name}</h3>
                    <p className="user-email">{user.email}</p>
                    <div className="user-role-badge">{user.role}</div>
                  </div>
                  <div className="button-group">
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="card empty-state">
          <div className="card-content text-center">
            <div className="empty-icon">👥</div>
            <h3>No users yet</h3>
            <p>Users will appear here once they are registered.</p>
          </div>
        </div>
      )}
    </div>
  );
}
