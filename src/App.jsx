
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AdminDashboard from './dashboards/admin/AdminDashboard';
import WaiterDashboard from './dashboards/waiter/WaiterDashboard';
import CookDashboard from './dashboards/cook/CookDashboard';
import './App.css';

const App = () => {

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/admindashboard' element={<AdminDashboard />} />
          <Route path='/waiterdashboard' element={<WaiterDashboard />} />
          <Route path='/cookdashboard' element={<CookDashboard />} />
        </Routes>
      </BrowserRouter>
  );
};
export default App;
