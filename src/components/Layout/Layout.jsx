// import React from 'react';
// import styles from './Layout.module.css';
// import Navbar from '../Navbar/Navbar';
// import Footer from '../Footer/Footer';
// import AnimatedCircle from '../AnimatedCircle/AnimatedCircle';
// import { Outlet } from 'react-router-dom';

// export default function Layout() {
//   return (
//     <div className={styles.layoutContainer}>
//       <Navbar />
//       <div className="tw-hidden lg:tw-block">
//         <AnimatedCircle />
//       </div>
//       <main className={styles.mainContent}>
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   );
// }



import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import AnimatedCircle from '../AnimatedCircle/AnimatedCircle';
import { Outlet } from 'react-router-dom';
import { darkModeContext } from '../../Context/DarkModeContext';

function isTokenExpired(token) {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (e) {
    return true;
  }
}

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, token } = useContext(darkModeContext); // تم إزالة setToken من هنا
  const [lastValidToken, setLastValidToken] = useState(token);

  const checkToken = (newToken) => {
  const currentToken = newToken || localStorage.getItem('token');

  if (!currentToken) {
    return true;
  }

  if (isTokenExpired(currentToken)) {
    logout();
    navigate('/signin'); 
    return false;
  }

  if (currentToken !== lastValidToken) {
    setLastValidToken(currentToken);
  }

  return true;
};


  useEffect(() => {
    checkToken();

    const handleStorageChange = (event) => {
      if (event.key === 'token') {
        checkToken(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(() => {
      checkToken();
    }, 10000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkToken();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate, logout, lastValidToken]);

  useEffect(() => {
    checkToken();
  }, [location.pathname]);

  return (
    <div className={styles.layoutContainer}>
      <Navbar />
      <div className="tw-hidden lg:tw-block">
        <AnimatedCircle />
      </div>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}