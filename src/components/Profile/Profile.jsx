import React, { useContext } from 'react'
import { darkModeContext } from '../../Context/DarkModeContext';
import styles from './Profile.module.css';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { darkMode } = useContext(darkModeContext);
  const { i18n, t } = useTranslation('profile');
  const isRTL = i18n.language === 'ar';
  const userName = localStorage.getItem('userName');

  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <div className="container-fluid dark:tw-bg-gray-800" style={{ minHeight: '80vh' }}>
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="container">
            <h1 className="text-center mainColor dark:tw-text-indigo-600 mt-2 fw-bolder pt-4">
              {t('title')}
            </h1>

            <p className="text-center mb-4 fs-4 tw-text-gray-600 dark:tw-text-white text-sm">
              {t('description')}
            </p>

            <div className={`${styles.shad} row w-100 mx-auto rounded-4 p-3 my-4`}>
              <h2 className="mainColor dark:tw-text-indigo-600">
                {t('hello')}, <span className="tw-text-black dark:tw-text-white">{userName}</span>!
              </h2>

              <p className="tw-text-gray-500 fs-4 dark:tw-text-white">{t('niceDay')}</p>

              <div className={`${styles.line} ${isRTL ? styles.lineRTL : styles.lineLTR}`}></div>

              <h2 className="mt-4 fw-bold dark:tw-text-white">{t('walletTitle')}</h2>
              <h3 className="mt-3 fw-semibold dark:tw-text-white">
                {t('balance')} <span className="fw-medium">0 EGP</span>
              </h3>

              <div className={`${styles.line2} ${isRTL ? styles.line2RTL : styles.line2LTR} mt-3`}></div>

              <h2 className="mt-4 fw-bold dark:tw-text-white">{t('bookingTitle')}</h2>

              {/* Placeholder box if no bookings */}
              <div className="w-100 my-4">
                <div className="tw-bg-gray-100 dark:tw-bg-gray-900 tw-p-6 tw-rounded-2xl tw-border tw-border-dashed tw-border-gray-400 dark:tw-border-gray-700 tw-text-center">
                  <h4 className="tw-text-gray-600 dark:tw-text-gray-300 tw-text-lg tw-font-semibold">
                    {t('noBookingTitle')}
                  </h4>
                  <p className="tw-text-gray-500 dark:tw-text-gray-400 tw-mt-2">
                    {t('noBookingSubtext')}
                  </p>
                </div>
              </div>
              {/* End */}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
