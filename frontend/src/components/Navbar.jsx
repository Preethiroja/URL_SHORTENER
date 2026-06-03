import { Link, useNavigate } from 'react-router-dom';
import { Link2, LogOut, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ user, onLogout, onOpenProfile }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Link2 size={24} style={{ color: 'var(--primary)' }} />
        <span>Linksy</span>
      </Link>

      {user && (
        <ul className="nav-links">
          {/* ⚡ THEME TOGGLE ADDED HERE */}
          <li>
            <ThemeToggle />
          </li>

          <li 
            className="nav-user" 
            onClick={onOpenProfile} 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}
            title="Open Profile Settings"
          >
            {user.avatar ? (
              <span style={{ 
                fontSize: '18px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#1f2937',
                borderRadius: '50%',
                width: '28px',
                height: '28px'
              }}>
                {user.avatar}
              </span>
            ) : (
              <User size={16} style={{ color: 'var(--accent)' }} />
            )}
            
            <span>{user.username}</span>
          </li>
          <li>
            <button className="btn-nav-logout" onClick={handleLogoutClick}>
              <LogOut size={16} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;