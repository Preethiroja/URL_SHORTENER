import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home'; 
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AnalyticsView from './components/AnalyticsView';
import Loader from './components/Shared/Loader';
import ProfileModal from "./components/ProfileModal";
import PublicStats from './components/PublicStats';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

const API_BASE = import.meta.env.VITE_API_URL || 'https://url-shortener-j2ye.onrender.com';

function AppContent() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation(); 

  // Load user data on startup if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Session expired');
        }

        const data = await response.json();
        const userData = data.user ? data.user : data;

        if (!userData || !userData.username) {
          throw new Error('User profile not found');
        }

        setUser({
          _id: userData._id || userData.id,
          username: userData.username,
          email: userData.email,
          bio: userData.bio || '',
          avatar: userData.avatar || '🦊'
        });

      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate('/login');
      } finally {
        if (loading) setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleLoginSuccess = (newToken, rawData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    
    const userData = rawData?.user ? rawData.user : rawData;
    setUser({
      _id: userData?._id || userData?.id,
      username: userData?.username || '',
      email: userData?.email || '',
      bio: userData?.bio || '',
      avatar: userData?.avatar || '🦊'
    });

    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const handleProfileUpdate = (updatedUserData, successMessage) => {
    const targetData = updatedUserData?.user ? updatedUserData.user : updatedUserData;

    setUser({
      _id: targetData?._id || targetData?.id,
      username: targetData?.username || '',
      email: targetData?.email || '',
      bio: targetData?.bio || '',
      avatar: targetData?.avatar || '🦊'
    });

    alert(successMessage || "Profile updated successfully!"); 
    setShowProfileModal(false);
  };

  if (loading) {
    return (
      <div className="app-container">
        {location.pathname !== '/' && <Navbar user={null} onLogout={handleLogout} />}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Loader message="Authenticating your session..." />
        </div>
      </div>
    );
  }

  const AnalyticsWrapper = () => {
    const { id } = useParams();
    return (
      <AnalyticsView
        token={token}
        urlId={id}
        onBack={() => navigate('/dashboard')}
      />
    );
  };

  return (
    <div className="app-container">
      {location.pathname !== '/' && (
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          onOpenProfile={() => setShowProfileModal(true)} 
        />
      )}
      
      <Routes>
        <Route 
          path="/" 
          element={token ? <Navigate to="/dashboard" replace /> : <Home />} 
        />

        <Route 
          path="/login" 
          element={token ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} 
        />
        
        <Route 
          path="/register" 
          element={token ? <Navigate to="/dashboard" replace /> : <Register onRegisterSuccess={handleLoginSuccess} />} 
        />

        {/* Password reset routes */}
        <Route 
          path="/forgot-password" 
          element={token ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} 
        />
        
        <Route 
          path="/reset-password/:token" 
          element={token ? <Navigate to="/dashboard" replace /> : <ResetPassword />} 
        />
        
        <Route 
          path="/dashboard" 
          element={
            token ? (
              <Dashboard 
                token={token} 
                user={user} 
                onViewAnalytics={(id) => navigate(`/analytics/${id}`)} 
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        <Route 
          path="/analytics/:id" 
          element={token ? <AnalyticsWrapper /> : <Navigate to="/login" replace />} 
        />

        {/* 🌐 FIXED: Public Stats Page Route linked inside Routes Switch container */}
        <Route 
          path="/stats/:id" 
          element={<PublicStats />} 
        />
        
        <Route 
          path="*" 
          element={<Navigate to={token ? "/dashboard" : "/"} replace />} 
        />
      </Routes>

      {showProfileModal && user && (
        <ProfileModal 
          user={user} 
          onClose={() => setShowProfileModal(false)} 
          onSaved={handleProfileUpdate} 
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;