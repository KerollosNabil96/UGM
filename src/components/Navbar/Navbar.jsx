import React, { useContext, useRef } from 'react';
import { darkModeContext } from '../../Context/DarkModeContext';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { darkMode, toggleDarkMode, token, logout } = useContext(darkModeContext);
  const { t, i18n } = useTranslation('navbar');
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const collapseRef = useRef();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const closeNavbar = () => {
    const collapseEl = collapseRef.current;
    if (collapseEl && collapseEl.classList.contains('show')) {
      collapseEl.classList.remove('show');
    }
  };

  const role = localStorage.getItem('role');
  const userName = localStorage.getItem('userName');
  const isAdmin = role === 'Admin' || role === 'SuperAdmin';

  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <nav className="navbar navbar-expand-lg bg-main dark:tw-bg-gray-900 transition-colors duration-300">
        <div className="container-fluid">
          <NavLink className="navbar-brand text-white tw-dark:text-blue-800 fw-bolder" to="/">
            UGM
          </NavLink>

          <button
            className="navbar-toggler bg-white"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div ref={collapseRef} className="collapse navbar-collapse smooth-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav justify-content-center mb-2 mb-lg-0" style={{ width: '100%' }}>
              <li className="nav-item">
                <NavLink to="/" onClick={closeNavbar} className={({ isActive }) => isActive ? `${styles.line} nav-link active text-white` : 'nav-link text-white'}>
                  {t('navbar.links.home')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/about" onClick={closeNavbar} className={({ isActive }) => isActive ? `${styles.line} nav-link active text-white` : 'nav-link text-white'}>
                  {t('navbar.links.about')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/contact" onClick={closeNavbar} className={({ isActive }) => isActive ? `${styles.line} nav-link active text-white` : 'nav-link text-white'}>
                  {t('navbar.links.contact')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/events" onClick={closeNavbar} className={({ isActive }) => isActive ? `${styles.line} nav-link active text-white` : 'nav-link text-white'}>
                  {t('navbar.links.events')}
                </NavLink>
              </li>
              {token && (
                <>
                  <li className="nav-item">
                    <NavLink to="/kahoot-game" onClick={closeNavbar} className={({ isActive }) => isActive ? `${styles.line} nav-link active text-white` : 'nav-link text-white'}>
                      {t('navbar.links.kahoot')}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/Memories" onClick={closeNavbar} className={({ isActive }) => isActive ? `${styles.line} nav-link active text-white` : 'nav-link text-white'}>
                      {t('navbar.links.memories')}
                    </NavLink>
                  </li>
                  {isAdmin && (
                    <>
                      <li className="nav-item">
                        <NavLink to="/servantInfo" onClick={closeNavbar} className={({ isActive }) => isActive ? `${styles.line} nav-link active text-white` : 'nav-link text-white'}>
                          {t('navbar.links.servantInfo')}
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink to="/ServantList" onClick={closeNavbar} className={({ isActive }) => isActive ? `${styles.line} nav-link active text-white` : 'nav-link text-white'}>
                          {t('navbar.links.servantList')}
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink to="/share-event" onClick={closeNavbar} className={({ isActive }) => isActive ? `${styles.line} nav-link active text-white` : 'nav-link text-white'}>
                          {t('navbar.links.shareEvent')}
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink to="/share-Memory" onClick={closeNavbar} className={({ isActive }) => isActive ? `${styles.line} nav-link active text-white` : 'nav-link text-white'}>
                          {t('navbar.links.shareMemory')}
                        </NavLink>
                      </li>
                    </>
                  )}
                </>
              )}
            </ul>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <i onClick={toggleDarkMode} className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'} text-white fs-3 me-lg-3 cursor-pointer`} />

              <div className="tw-relative tw-flex tw-items-center tw-me-3 tw-h-9 mx-2">
                <div className="tw-absolute tw-inset-0 tw-bg-[#4B0082] tw-rounded-full"></div>
                <div onClick={toggleLanguage} className="tw-relative tw-flex tw-items-center tw-h-full tw-px-1 tw-cursor-pointer tw-z-10">
                  <span className={`tw-px-3 tw-py-1 tw-rounded-full tw-transition-all ${i18n.language === 'en' ? 'tw-bg-[#7E4BFF] tw-font-bold tw-text-white' : 'tw-text-white/80'}`}>
                    {t('navbar.languageSwitch.english')}
                  </span>
                  <span className="tw-mx-1 tw-text-white">|</span>
                  <span className={`tw-px-3 tw-py-1 tw-rounded-full tw-transition-all ${i18n.language === 'ar' ? 'tw-bg-[#7E4BFF] tw-font-bold tw-text-white' : 'tw-text-white/80'}`}>
                    {t('navbar.languageSwitch.arabic')}
                  </span>
                </div>
              </div>

              {!token ? (
                <div className={`tw-flex tw-items-center tw-gap-3 tw-flex-nowrap ${isRTL ? 'tw-min-w-[220px]' : ''}`}>
                  <li className="nav-item">
                    <NavLink to="/signin" onClick={closeNavbar} className={({ isActive }) => isActive ? `${styles.line} nav-link active text-white` : 'nav-link text-white'}>
                      {t('navbar.links.signIn')}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/signup" onClick={closeNavbar} className={({ isActive }) => isActive ? `${styles.line} nav-link active text-white` : 'nav-link text-white'}>
                      {t('navbar.links.signUp')}
                    </NavLink>
                  </li>
                </div>
              ) : (
                <li className="nav-item dropdown position-relative">
                  <button
                    type="button"
                    className="btn bg-main dark:tw-bg-gray-900 text-white border border-1 dropdown-toggle tw-flex tw-items-center tw-gap-2"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ width: '170px' }}
                  >
                    <div
                      className={`tw-rounded-full tw-w-7 tw-h-7 tw-flex tw-items-center tw-justify-center tw-text-sm fw-bold
                        ${darkMode 
                          ? 'tw-bg-indigo-400 tw-text-white' 
                          : 'tw-bg-white tw-text-[#0d6efd]'
                        }`}
                    >
                      {userName?.charAt(0).toUpperCase()}
                    </div>
                    <span className="tw-truncate tw-text-start" style={{ maxWidth: '100px' }}>{userName}</span>
                  </button>
                  <ul className={`dropdown-menu dropdown-menu-end dark:tw-bg-gray-800`}>
                    {role !== 'User' && (
                      <li>
                        <NavLink className="dropdown-item dark:tw-text-white" to="/dashboard">
                          {t('navbar.userDropdown.dashboard')}
                        </NavLink>
                      </li>
                    )}
                    <li>
                      <NavLink className="dropdown-item dark:tw-text-white" to="/profile">
                        {t('navbar.userDropdown.profile')}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item dark:tw-text-white" to="/settings">
                        {t('navbar.userDropdown.settings')}
                      </NavLink>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item text-danger dark:tw-text-white">
                        <i className="fa-solid fa-right-from-bracket me-2 text-danger"></i>
                        {t('navbar.userDropdown.logout')}
                      </button>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
