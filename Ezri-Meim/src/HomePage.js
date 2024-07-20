import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase.js';
import logo from './logo.png';

const HomePage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [userGender, setUserGender] = useState(localStorage.getItem('userGender'));
  const [userMaritalStatus, setUserMaritalStatus] = useState(localStorage.getItem('userMaritalStatus') === 'true');
  const [showForumDropdown, setShowForumDropdown] = useState(false);

  useEffect(() => {
    console.log('User Gender:', userGender);
    console.log('User Marital Status:', userMaritalStatus);
  }, [userGender, userMaritalStatus]);

  const isAuthenticated = !!userRole;

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
      if (forumType === 'general') {
        navigate('/forums?type=general');
      } else if (forumType === 'personal') {
        let personalType = '';
        if (userGender === 'male' && userMaritalStatus) {
          personalType = 'men';
        } else if (userGender === 'male' && !userMaritalStatus) {
          personalType = 'boys';
        } else if (userGender === 'female' && userMaritalStatus) {
          personalType = 'women';
        } else if (userGender === 'female' && !userMaritalStatus) {
          personalType = 'girls';
        }
  
        if (personalType) {
          navigate(`/forums?type=personal&subtype=${personalType}`);
        } else {
          alert('לא הצלחנו למצוא את הפורום המתאים');
        }
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
      setUserRole(null);
      setUserGender(null);
      setUserMaritalStatus(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="homepage-container">
      <div className="page-header">
        <img src={logo} alt="Logo" className="logo" />
        <h1>ברוך הבא לדף הבית</h1>
      </div>
      <div className="homepage-menu">
        {!isAuthenticated && (
          <button onClick={() => navigateTo('/personal-area')}>איזור אישי</button>
        )}
        <div className="forum-dropdown">
          <button onClick={() => setShowForumDropdown(!showForumDropdown)}>פורומים</button>
          {showForumDropdown && (
            <div className="dropdown-content">
              <button className="small-button" onClick={() => handleForumSelection('general')}>פורום כללי</button>
              <button className="small-button" onClick={() => handleForumSelection('personal')}>פורום אישי</button>
            </div>
          )}
        </div>
        {isAuthenticated && (
          <button onClick={() => navigateTo('/calendar')}>לוח שנה</button>
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
