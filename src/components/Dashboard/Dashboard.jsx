import React, { useContext } from 'react';
import styles from './Dashboard.module.css';
import { NavLink, Outlet } from 'react-router-dom';
import { darkModeContext } from '../../Context/DarkModeContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { darkMode } = useContext(darkModeContext);
  const { t, i18n } = useTranslation("dashboard"); 
  const role = localStorage.getItem('role');
  const isRTL = i18n.language === 'ar'; 

  return (
    <>
      <div className={`container-fluid ${darkMode ? 'tw-dark' : ''}`} style={{ minHeight: '80vh' }}>
        <div className="row tw-bg-gray-100 dark:tw-bg-gray-800">
          
          {/* Mobile navbar toggle */}
          <div
            className={`collapse ${darkMode ? 'tw-bg-gray-900' : 'bg-main'} ${styles.secNav}`}
            id="navbarToggleExternalContent"
          >
            <div className={`${darkMode ? 'tw-bg-gray-900' : 'bg-main'} py-4`}>
              <ul className={`${styles.paddingLeft}`} style={{ listStyle: 'none' }}>
                <li className="nav-item">
                  <NavLink className="nav-link active text-white" to="">
                    <i className="fa-solid fa-users me-1"></i> {t('dashboard.users')}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link active text-white" to="update-request">
                    <i className="fa-regular fa-hand me-1"></i> {t('dashboard.updateRequests')}
                  </NavLink>
                </li>
                {role === 'SuperAdmin' && (
                  <li className="nav-item">
                    <NavLink className="nav-link active text-white" to="messages">
                      <i className="fa-regular fa-envelope me-2"></i> {t('dashboard.messages')}
                    </NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <NavLink className="nav-link active text-white" to="wallet-managment">
                    <i className="fa-solid fa-wallet me-1"></i>{t('dashboard.walletManagment')}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="trip-list"
                    className={({ isActive }) =>
                      `nav-link text-white d-flex align-items-center ${isActive ? 'active' : ''}`
                    }
                  >
                    <i className="fa-solid fa-wallet me-1"></i>
                    <span>{t('dashboard.tripList')}</span>
                  </NavLink>
                </li>
                {/* إضافة رابط الاجتماعات */}
                <li className="nav-item">
                  <NavLink className="nav-link active text-white" to="meetings">
                    <i className="fa-solid fa-video me-1"></i> {t('dashboard.meetings')}
                  </NavLink>
                </li>
                 <li className="nav-item">
                  <NavLink className="nav-link active text-white" to="meetings-manager">
                    <i className="fa-solid fa-video me-1"></i> {t('dashboard.meetingsManager')}
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>

          {/* Top navbar */}
          <nav className={`navbar ${darkMode ? 'tw-bg-gray-900' : 'bg-main'} ${styles.secNav}`}>
            <div className="container-fluid">
              <h3 className="text-white">{t('dashboard.title')}</h3>
              <button
                className={`navbar-toggler ${isRTL ? 'me-auto' : 'ms-auto'} bg-white`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarToggleExternalContent"
                aria-controls="navbarToggleExternalContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
          </nav>

          {/* Sidebar */}
          <div className={`col-2 bg-main ${styles.sideHidden} dark:tw-bg-gray-900`} style={{ minHeight: '80vh' }}>
            <h4 className="text-white my-4">{t('dashboard.title')}</h4>
            <ul className="nav flex-column w-100 bg-main dark:tw-bg-gray-900 h-100">
              <li className="nav-item">
                <NavLink className="nav-link active text-white" to="">
                  <i className="fa-solid fa-users me-1"></i> {t('dashboard.users')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link active text-white" to="update-request">
                  <i className="fa-regular fa-hand me-1"></i> {t('dashboard.updateRequests')}
                </NavLink>
              </li>
              {role === 'SuperAdmin' && (
                <li className="nav-item">
                  <NavLink className="nav-link active  text-white" to="messages">
                    <i className="fa-regular fa-envelope me-2"></i> {t('dashboard.messages')}
                  </NavLink>
                </li>
              )}
              <li className="nav-item">
                <NavLink className="nav-link active text-white" to="wallet-managment">
                  <i className="fa-solid fa-wallet me-1"></i> {t('dashboard.walletManagment')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link active text-white" to="trip-list">
                  <i className="fa-solid fa-route me-1"></i> <span>{t('dashboard.tripList')}</span>
                </NavLink>
              </li>
              {/* إضافة رابط الاجتماعات في الشريط الجانبي */}
              <li className="nav-item">
                <NavLink className="nav-link active text-white" to="meetings">
                <i className="fa-solid fa-calendar-days me-1"></i>{t('dashboard.meetings')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link active text-white" to="meetings-manager">
                  <i className="fa-solid fa-clipboard-check me-1"></i>
 {t('dashboard.meetingsManager')}
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Main content */}
          <div className="col-12 col-md-10" style={{ minHeight: '80vh' }}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}