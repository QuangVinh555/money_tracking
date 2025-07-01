import { Navigate } from 'react-router-dom';

function GuestRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('token');

  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

export default GuestRoute