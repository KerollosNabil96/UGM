import React, { useContext } from 'react';
import { darkModeContext } from '../../Context/DarkModeContext';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { darkMode, toggleDarkMode, token, logout } = useContext(darkModeContext);
  const { t, i18n } = useTranslation('navbar');
  const navigate = useNavigate(); // ⬅️ مهم

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const handleLogout = () => {
    logout(); // ⬅️ من الكونتكست
    navigate('/signin'); // ⬅️ إعادة التوجيه
  };

  const role = localStorage.getItem('role');
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

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav justify-content-center mb-2 mb-lg-0" style={{ width: '100%' }}>
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? `${styles.line} nav-link active text-white` : 'nav-link active text-white'
                  }
                >
                  {t('navbar.links.home')}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? `${styles.line} nav-link active text-white` : 'nav-link active text-white'
                  }
                >
                  {t('navbar.links.about')}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    isActive ? `${styles.line} nav-link active text-white` : 'nav-link active text-white'
                  }
                >
                  {t('navbar.links.contact')}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/events"
                  className={({ isActive }) =>
                    isActive ? `${styles.line} nav-link active text-white` : 'nav-link active text-white'
                  }
                >
                  {t('navbar.links.events')}
                </NavLink>
              </li>

              {token && (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/kahoot-game"
                      className={({ isActive }) =>
                        isActive ? `${styles.line} nav-link active text-white` : 'nav-link active text-white'
                      }
                    >
                      {t('navbar.links.kahoot')}
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/Memories"
                      className={({ isActive }) =>
                        isActive ? `${styles.line} nav-link active text-white` : 'nav-link active text-white'
                      }
                    >
                      {t('navbar.links.memories')}
                    </NavLink>
                  </li>

                  {isAdmin && (
                    <>
                      <li className="nav-item">
                        <NavLink
                          to="/servantInfo"
                          className={({ isActive }) =>
                            isActive ? `${styles.line} nav-link active text-white` : 'nav-link active text-white'
                          }
                        >
                          {t('navbar.links.servantInfo')}
                        </NavLink>
                      </li>

                      <li className="nav-item">
                        <NavLink
                          to="/ServantList"
                          className={({ isActive }) =>
                            isActive ? `${styles.line} nav-link active text-white` : 'nav-link active text-white'
                          }
                        >
                          {t('navbar.links.servantList')}
                        </NavLink>
                      </li>

                      <li className="nav-item">
                        <NavLink
                          to="/share-event"
                          className={({ isActive }) =>
                            isActive ? `${styles.line} nav-link active text-white` : 'nav-link active text-white'
                          }
                        >
                          {t('navbar.links.shareEvent')}
                        </NavLink>
                      </li>
                    </>
                  )}
                </>
              )}
            </ul>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <i
                onClick={toggleDarkMode}
                className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'} text-white fs-3 me-lg-3 cursor-pointer`}
              />

              <div className="tw-relative tw-flex tw-items-center tw-me-3 tw-h-9 mx-2">
                <div className="tw-absolute tw-inset-0 tw-bg-[#4B0082] tw-rounded-full"></div>
                <div
                  onClick={toggleLanguage}
                  className="tw-relative tw-flex tw-items-center tw-h-full tw-px-1 tw-cursor-pointer tw-z-10"
                >
                  <span
                    className={`tw-px-3 tw-py-1 tw-rounded-full tw-transition-all ${
                      i18n.language === 'en' ? 'tw-bg-[#7E4BFF] tw-font-bold tw-text-white' : 'tw-text-white/80'
                    }`}
                  >
                    {t('navbar.languageSwitch.english')}
                  </span>
                  <span className="tw-mx-1 tw-text-white">|</span>
                  <span
                    className={`tw-px-3 tw-py-1 tw-rounded-full tw-transition-all ${
                      i18n.language === 'ar' ? 'tw-bg-[#7E4BFF] tw-font-bold tw-text-white' : 'tw-text-white/80'
                    }`}
                  >
                    {t('navbar.languageSwitch.arabic')}
                  </span>
                </div>
              </div>

              {!token ? (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/signin"
                      className={({ isActive }) =>
                        isActive ? `${styles.line} nav-link active text-white` : 'nav-link active text-white'
                      }
                    >
                      {t('navbar.links.signIn')}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/signup"
                      className={({ isActive }) =>
                        isActive ? `${styles.line} nav-link active text-white` : 'nav-link active text-white'
                      }
                    >
                      {t('navbar.links.signUp')}
                    </NavLink>
                  </li>
                </>
              ) : (
                <li className="nav-item dropdown position-relative">
                  <button
                    type="button"
                    className="btn bg-main dark:tw-bg-gray-900 text-white border border-1 dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ width: '170px' }}
                  >
                    {t('navbar.userDropdown.username')}
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
                      <button
                        onClick={handleLogout}
                        className="dropdown-item text-danger dark:tw-text-white"
                      >
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
