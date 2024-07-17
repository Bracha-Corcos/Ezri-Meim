import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase.js';
import logo from './logo.png';

const HomePage = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const isAuthenticated = !!userRole;
  const userGender = localStorage.getItem('userGender');
  const userMaritalStatus = localStorage.getItem('userMaritalStatus');

  const [showForumDropdown, setShowForumDropdown] = useState(false);

  const navigateTo = (path) => {
    if (!isAuthenticated) {
      if (path.startsWith('/forum')) {
        alert('כניסה לפורום מותנית בהתחברות');
        navigate('/login');
      } else if (path === '/personal-area') {
        navigate('/login');
      }
    } else {
      navigate(path);
    }
  };

  const handleForumSelection = (forumType) => {
  console.log('Forum type:', forumType);
  console.log('User Gender:', userGender);
  console.log('User Marital Status:', userMaritalStatus);

  if (!isAuthenticated) {
    alert('כניסה לפורום מותנית בהתחברות');
    navigate('/login');
  } else {
    let path = '';
    if (forumType === 'general') {
      path = '/forum/generalForum';
    } else if (forumType === 'personal') {
      if (userGender === 'male' && !userMaritalStatus) {
        path = '/forum/menForum';
      } else if (userGender === 'male' && userMaritalStatus) {
        path = '/forum/boysForum';
      } else if (userGender === 'female' && !userMaritalStatus) {
        path = '/forum/womenForum';
      } else if (userGender === 'female' && userMaritalStatus) {
        path = '/forum/girlsForum';
      }
    }

    console.log('Navigating to:', path);

    if (path) {
      navigate(path);
    } else {
      alert('לא הצלחנו למצוא את הפורום המתאים');
    }
  }
  setShowForumDropdown(false);
};


  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userRole');
      localStorage.removeItem('userGender');
      localStorage.removeItem('userMaritalStatus');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="homepage-container">
      <div className="page-header">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Welcome to the Homepage</h1>
      </div>
      <div className="homepage-menu">
        {!isAuthenticated && (
          <button onClick={() => navigateTo('/personal-area')}>Personal Area</button>
        )}
        <div className="forum-dropdown">
          <button onClick={() => setShowForumDropdown(!showForumDropdown)}>פורומים</button>
          {showForumDropdown && (
            <div className="dropdown-content">
              <button onClick={() => handleForumSelection('general')}>פורום כללי</button>
              <button onClick={() => handleForumSelection('personal')}>פורום אישי</button>
            </div>
          )}
        </div>
        {isAuthenticated && (
          <button onClick={() => navigateTo('/calendar')}>Calendar</button>
        )}
        {userRole === 'admin' && (
          <button onClick={() => navigateTo('/manage-users')}>ניהול משתמשים</button>
        )}
        {isAuthenticated && (
          <button onClick={handleLogout}>התנתק</button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
