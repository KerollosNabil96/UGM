import React, { useContext } from 'react';
import { darkModeContext } from '../../Context/DarkModeContext';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  let { darkMode, toggleDarkMode } = useContext(darkModeContext);
  const { t, i18n } = useTranslation('navbar');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };
  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <nav className={`navbar navbar-expand-lg bg-main dark:tw-bg-gray-900 transition-colors duration-300 `} >
        <div className="container-fluid">
          <NavLink className="navbar-brand text-white tw-dark:text-blue-800 fw-bolder" to="/">
            UGM
          </NavLink>
          <button
            className="navbar-toggler"
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
                  className={({ isActive }) =>
                    isActive ? `${styles.line} nav-link active text-white ` : 'nav-link active text-white'
                  }
                  aria-current="page"
                  to="/"
                >
                  {t('navbar.links.home')}
                  </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? `${styles.line} nav-link active text-white ` : 'nav-link active text-white'
                  }
                  aria-current="page"
                  to="about"
                >
                  {t('navbar.links.about')}
                  </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? `${styles.line} nav-link active text-white ` : 'nav-link active text-white'
                  }
                  aria-current="page"
                  to="events"
                >
                  {t('navbar.links.events')}

                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? `${styles.line} nav-link active text-white ` : 'nav-link active text-white'
                  }
                  aria-current="page"
                  to="kahoot-game"
                >
                  {t('navbar.links.kahoot')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? `${styles.line} nav-link active text-white ` : 'nav-link active text-white'
                  }
                  aria-current="page"
                  to="Memories"
                >
                                    {t('navbar.links.memories')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? `${styles.line} nav-link active text-white ` : 'nav-link active text-white'
                  }
                  aria-current="page"
                  to="contact"
                >
             {t('navbar.links.contact')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? `${styles.line} nav-link active text-white ` : 'nav-link active text-white'
                  }
                  aria-current="page"
                  to="servantInfo"
                >
          {t('navbar.links.servantInfo')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? `${styles.line} nav-link active text-white ` : 'nav-link active text-white'
                  }
                  aria-current="page"
                  to="ServantList"
                >
              {t('navbar.links.servantList')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? `${styles.line} nav-link active text-white ` : 'nav-link active text-white'
                  }
                  aria-current="page"
                  to="share-event"
                >
              {t('navbar.links.shareEvent')}
                </NavLink>
              </li>
            </ul>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 position-relative">
              <i
                onClick={() => toggleDarkMode()}
                className={
                  darkMode
                    ? 'fa-solid fa-sun crsr text-white fs-3 d-flex me-lg-3 cursor-pointer align-items-center'
                    : 'fa-solid crsr fa-moon text-white fs-3 d-flex me-lg-3 cursor-pointer align-items-center'
                }
              />
  <div className="tw-relative tw-flex tw-items-center tw-me-3 tw-h-9 mx-2">
  <div className="tw-absolute tw-inset-0 tw-bg-[#4B0082] tw-rounded-full"></div>
  <div 
    onClick={toggleLanguage}
    className="tw-relative tw-flex tw-items-center tw-h-full tw-px-1 tw-cursor-pointer tw-z-10"
  >
    <span className={`tw-px-3 tw-py-1 tw-rounded-full tw-transition-all ${i18n.language === 'en' ? 'tw-bg-[#7E4BFF] tw-font-bold tw-text-white' : 'tw-text-white/80'}`}>
      {t('navbar.languageSwitch.english')}
    </span>
    <span className="tw-mx-1 tw-text-white">|</span>
    <span className={`tw-px-3 tw-py-1 tw-rounded-full tw-transition-all ${i18n.language === 'ar' ? 'tw-bg-[#7E4BFF] tw-font-bold tw-text-white' : 'tw-text-white/80'}`}>
    {t('navbar.languageSwitch.arabic')}

    </span>
  </div>
</div>
              <li className="nav-item">
                <NavLink
                  style={i18n.language === 'ar' ? { minWidth: '110px' } : {}}
                  className={({ isActive }) =>
                    isActive ? `${styles.line} nav-link active text-white ` : 'nav-link active text-white'
                  }
                  aria-current="page"
                  to="signin"
                >
                  {t('navbar.links.signIn')}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  style={i18n.language === 'ar' ? { minWidth: '100px' } : {}}
                  className={({ isActive } ) =>
                    isActive ? `${styles.line} nav-link active text-white ` : 'nav-link active text-white'
                  }
                  aria-current="page"
                  to="signup"
                >
                   {t('navbar.links.signUp')}
                </NavLink>
              </li>
              <li className="nav-item dropdown position-relative">
  <button
    type="button"
    className="btn bg-main dark:tw-bg-gray-900 text-white border border-1 dropdown-toggle"
    data-bs-toggle="dropdown"
    aria-expanded="false"
    style={{width:'170px'}}
  >
    {t('navbar.userDropdown.username')}
  </button>
  <ul className={`dropdown-menu dropdown-menu-end dark:tw-bg-gray-800 ${i18n.language === 'ar' ? 'tw-text-end tw-pe-3' : 'tw-ps-3'}`}>
    <li>
      <NavLink className="dropdown-item dark:tw-text-white tw-flex tw-items-center tw-justify-between" to={'dashboard'}>
        {i18n.language === 'ar' ? (
          <>
            <span>{t('navbar.userDropdown.dashboard')}</span>
            <i className="fa-solid fa-bars tw-ml-2 dark:tw-text-white"></i>
          </>
        ) : (
          <>
            <i className="fa-solid fa-bars tw-mr-2 dark:tw-text-white"></i>
            <span>{t('navbar.userDropdown.dashboard')}</span>
          </>
        )}
      </NavLink>
    </li>
    <li>
      <NavLink className="dropdown-item dark:tw-text-white tw-flex tw-items-center tw-justify-between" to={'profile'}>
        {i18n.language === 'ar' ? (
          <>
            <span>{t('navbar.userDropdown.profile')}</span>
            <i className="fa-solid fa-user tw-ml-2 dark:tw-text-white"></i>
          </>
        ) : (
          <>
            <i className="fa-solid fa-user tw-mr-2 dark:tw-text-white"></i>
            <span>{t('navbar.userDropdown.profile')}</span>
          </>
        )}
      </NavLink>
    </li>
    <li >
      <NavLink className="dropdown-item dark:tw-text-white tw-flex tw-items-center tw-justify-between" to={'settings'}>
        {i18n.language === 'ar' ? (
          <>
            <span>{t('navbar.userDropdown.settings')}</span>
            <i className="fa-solid fa-gear tw-ml-2 dark:tw-text-white"></i>
          </>
        ) : (
          <>
            <i className="fa-solid fa-gear tw-mr-2 dark:tw-text-white"></i>
            <span>{t('navbar.userDropdown.settings')}</span>
          </>
        )}
      </NavLink>
    </li>
    <li>
      <NavLink className="dropdown-item dark:tw-text-white text-danger tw-flex tw-items-center tw-justify-between" to={'/'}>
        {i18n.language === 'ar' ? (
          <>
            <span>{t('navbar.userDropdown.logout')}</span>
            <i className="fa-solid fa-right-from-bracket tw-ml-2 text-danger"></i>
          </>
        ) : (
          <>
            <i className="fa-solid fa-right-from-bracket tw-mr-2 text-danger"></i>
            <span>{t('navbar.userDropdown.logout')}</span>
          </>
        )}
      </NavLink>
    </li>
  </ul>
</li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}