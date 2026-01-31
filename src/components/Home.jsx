import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const roles = ["admin", "cook", "waiter"];
  const navigate = useNavigate();

  const roleRoutes = {
    admin: "/admindashboard",
    cook: "/cookdashboard",
    waiter: "/waiterdashboard",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email.includes("@")) return "Invalid email format.";
    if (formData.password.length < 6) return "Password must be at least 6 characters.";
    if (!isLogin && !formData.name.trim()) return "Name is required.";
    if (!isLogin && !formData.role) return "Role is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const validationError = validateForm();
    if (validationError) return setErrorMessage(validationError);

    setIsSubmitting(true);

    try {
      const url = `http://localhost:5000/api/auth/${isLogin ? "login" : "register"}`;
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      if (isLogin) {
        localStorage.setItem("role", data.role);
        const route = roleRoutes[data.role];
        if (route) navigate(route);
        else throw new Error("Unknown user role");
      } else {
        setShowSuccessModal(true);
        setIsLogin(true);
        setFormData({ name: "", email: "", password: "", role: "" });
        setTimeout(() => setShowSuccessModal(false), 3000);
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-box">
        <h1 className="restaurant-name">🍽 Everest Inn Restaurant</h1>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {!isLogin && (
          <>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select role
                </option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide" : "Show"}
            >
              {showPassword ? "👁" : "🚫👁"}
            </span>
          </div>
        </div>

        {errorMessage && <div className="error">{errorMessage}</div>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Please wait..."
            : isLogin
            ? "Sign In"
            : "Register"}
        </button>

        <button
          type="button"
          className="toggle-btn"
          onClick={() => {
            setIsLogin(!isLogin);
            setErrorMessage("");
          }}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>
      </form>

      {showSuccessModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSuccessModal(false)}
        >
          <div className="modal-box">
            <div className="check-icon">✅</div>
            <h3>Registered Successfully</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
