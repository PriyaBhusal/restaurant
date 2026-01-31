import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import AdminDashboard from './dashboards/admin/AdminDashboard';
import WaiterDashboard from './dashboards/waiter/WaiterDashboard';
import CookDashboard from './dashboards/cook/CookDashboard';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // universal token for all roles
  return token ? children : <Navigate to="/" replace />; // redirect to login page
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login */}
        <Route path="/" element={<Home />} />

        {/* Dashboards */}
        <Route 
          path="/admindashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/waiterdashboard" 
          element={
            <ProtectedRoute>
              <WaiterDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cookdashboard" 
          element={
            <ProtectedRoute>
              <CookDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
