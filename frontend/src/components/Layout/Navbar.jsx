import { Link, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function Navbar() {
    const location = useLocation();
    const user = authService.getCurrentUser();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = () => {
        authService.logout();
        toast.success('Logged out');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link to="/dashboard" className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        TaskFlow
                    </Link>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link 
                            to="/dashboard" 
                            style={{ 
                                color: isActive('/dashboard') ? '#667eea' : '#4a5568',
                                textDecoration: 'none',
                                fontWeight: isActive('/dashboard') ? '600' : '400'
                            }}
                        >
                            Dashboard
                        </Link>
                        <Link 
                            to="/projects" 
                            style={{ 
                                color: isActive('/projects') ? '#667eea' : '#4a5568',
                                textDecoration: 'none',
                                fontWeight: isActive('/projects') ? '600' : '400'
                            }}
                        >
                            Projects
                        </Link>
                    </div>
                </div>
                
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: '#667eea',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold'
                        }}>
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ color: '#4a5568' }}>{user?.username}</span>
                    </button>
                    
                    {showProfileMenu && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '0.5rem',
                            background: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            minWidth: '200px',
                            zIndex: 100
                        }}>
                            <div style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                                <div style={{ fontWeight: '600' }}>{user?.username}</div>
                                <div style={{ fontSize: '0.8rem', color: '#718096' }}>{user?.email}</div>
                            </div>
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '0.75rem',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#ef4444'
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}