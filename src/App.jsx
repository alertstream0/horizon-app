import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LivingBackground from './components/ui/LivingBackground';
import ClientLayout from './components/layout/ClientLayout';
import AdminLayout from './components/admin/AdminLayout';

// Pages
import Landing from './pages/Landing';
import Complaint from './pages/Complaint';
import Baggage from './pages/Baggage';
import Success from './pages/Success';
import Tracking from './pages/Tracking';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminClaims from './pages/admin/Claims';
import AdminClaimDetail from './pages/admin/ClaimDetail';
import Auth from './pages/auth/Auth';
import Profile from './pages/Profile';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen text-slate-100">
        <LivingBackground />
        <Router>
          <Routes>
            {/* Client Routes */}
            <Route element={<ClientLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/complaint" element={<Complaint />} />
                <Route path="/baggage" element={<Baggage />} />
                <Route path="/success" element={<Success />} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="claims" element={<AdminClaims />} />
                <Route path="claims/:id" element={<AdminClaimDetail />} />
                <Route path="baggage" element={<AdminClaims />} /> {/* Reuse Claims for now */}
            </Route>
          </Routes>
        </Router>
      </div>
    </AppProvider>
  );
}

export default App;
