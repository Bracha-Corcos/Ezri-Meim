// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { signOut } from 'firebase/auth';
// import { auth } from './firebase.js';
// import logo from './logo.png'; 

// const HomePage = () => {
//   const navigate = useNavigate();
//   const userRole = localStorage.getItem('userRole');

//   const navigateTo = (path) => {
//     if (!userRole && path === '/personal-area') {
//       navigate('/login');
//     } else {
//       navigate(path);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       localStorage.removeItem('userRole');
//       navigate('/');
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };

//   return (
//     <div className="homepage-container">
//       <div className="page-header">
//         <img src={logo} alt="Logo" className="logo" />
//         <h1>Welcome to the Homepage</h1>
//       </div>
//       <div className="homepage-menu">
//         <button onClick={() => navigateTo('/personal-area')}>Personal Area</button>
//         <button onClick={() => navigateTo('/forums')}>Forums</button>
//         <button onClick={() => navigateTo('/calendar')}>Calendar</button>
//         {userRole === 'admin' && (
//           <button onClick={() => navigateTo('/manage-users')}>ניהול משתמשים</button>
//         )}
//         {userRole && (
//           <button onClick={handleLogout}>התנתק</button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomePage;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase.js';
import logo from './logo.png'; 

const HomePage = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const navigateTo = (path) => {
    if (!userRole && path === '/personal-area') {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userRole');
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
        <button onClick={() => navigateTo('/personal-area')}>Personal Area</button>
        <button onClick={() => navigateTo('/forums')}>Forums</button>
        <button onClick={() => navigateTo('/calendar')}>Calendar</button>
        {userRole === 'admin' && (
          <button onClick={() => navigateTo('/manage-users')}>ניהול משתמשים</button>
        )}
        {userRole && (
          <button onClick={handleLogout}>התנתק</button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
