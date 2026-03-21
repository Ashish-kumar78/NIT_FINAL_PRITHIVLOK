// ============================================================
// App — Router with Sidebar-based Dashboard Layout
// ============================================================
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import DustbinLocator from './pages/DustbinLocator';
import AddDustbin from './pages/AddDustbin';
import WasteClassification from './pages/WasteClassification';
import ImpactScanner from './pages/ImpactScanner';
import Community from './pages/Community';
import Learning from './pages/Learning';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import CryptoExchange from './pages/CryptoExchange';
import CarbonTracker from './pages/CarbonTracker';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Landing from './pages/Landing';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// Leaflet CSS
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#131b2e',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontSize: '0.875rem',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#000' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />

          <Routes>
            {/* ── Cinematic Welcome — first thing users see ── */}
            <Route path="/" element={<Welcome />} />

            {/* ── Auth pages — full-screen, no sidebar ── */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* ── Admin Panel — separate from user app ── */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* ── Landing page (3D Earth overview) ── */}
            <Route path="/landing" element={<Landing />} />

            {/* ── Dashboard layout — sidebar + topbar + outlet ── */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="dustbins" element={<ProtectedRoute><DustbinLocator /></ProtectedRoute>} />
              <Route path="leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
              <Route path="exchange" element={<ProtectedRoute><CryptoExchange /></ProtectedRoute>} />
              <Route path="carbon-tracker" element={<ProtectedRoute><CarbonTracker /></ProtectedRoute>} />
              <Route path="waste" element={<ProtectedRoute><WasteClassification /></ProtectedRoute>} />
              <Route path="impact" element={<ProtectedRoute><ImpactScanner /></ProtectedRoute>} />
              <Route path="learning" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
              <Route path="community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="dustbins/add" element={<ProtectedRoute><AddDustbin /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Route>
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
