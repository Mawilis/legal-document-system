import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import Header from './components/Header'; // Note the updated path
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Instructions from './pages/Instructions';
import Profile from './pages/Profile';
import Login from './pages/Login';
import authService from './services/authService';
import DocumentForm from './pages/DocumentForm'; // Import DocumentForm 
import DocumentDetails from './pages/DocumentDetails'; // Import DocumentDetails
import './App.css'; // Import your App-level CSS for styling


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [userRole, setUserRole] = useState(authService.getUserRole());
  const navigate = useNavigate();

  useEffect(() => {
    // Check and update authentication status whenever it changes
    const handleAuthChange = () => {
      setIsAuthenticated(authService.isAuthenticated());
      setUserRole(authService.getUserRole());
    };
    handleAuthChange();

    authService.on('login', handleAuthChange);
    authService.on('logout', handleAuthChange);
    authService.on('tokenExpired', handleAuthChange); // Add listener for token expiration

    return () => {
      authService.off('login', handleAuthChange);
      authService.off('logout', handleAuthChange);
      authService.off('tokenExpired', handleAuthChange);
    };
  }, [navigate]);

  const ProtectedRoute = ({ role, children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (role && role !== userRole) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div>
        <Header
          isAuthenticated={isAuthenticated}
          userRole={userRole}
          onLogout={authService.logout}
        />
        <ToastContainer />
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/documents" element={<ProtectedRoute role="attorney"><Documents /></ProtectedRoute>} />
            <Route path="/documents/new" element={<ProtectedRoute role="attorney"><DocumentForm /></ProtectedRoute>} /> {/* Add a new route for DocumentForm */}
            <Route path="/documents/:documentId" element={<ProtectedRoute><DocumentDetails /></ProtectedRoute>} /> {/* Add a new route for DocumentDetails */}
            <Route path="/documents/:documentId/edit" element={<ProtectedRoute role="attorney"><DocumentForm /></ProtectedRoute>} />
            <Route path="/instructions" element={<ProtectedRoute role="sheriff"><Instructions /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
