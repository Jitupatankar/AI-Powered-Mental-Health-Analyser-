import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if (!user) return null;

  return (
    <div className="user-menu" ref={menuRef}>
      <button className="user-menu-button" onClick={toggleMenu}>
        <span>👤</span>
        <span>{user.name}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.email}</div>
          </div>
          <button className="user-menu-item" onClick={() => {setIsOpen(false); navigate('/dashboard');}}>
            📊 Dashboard
          </button>
          <button className="user-menu-item" onClick={() => {setIsOpen(false); navigate('/mood');}}>
            😊 Mood Tracker
          </button>
          <button className="user-menu-item" onClick={() => {setIsOpen(false); navigate('/screening');}}>
            🧠 Mental Health Screening
          </button>
          <button className="user-menu-item" onClick={handleLogout}>
            🚪 Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;