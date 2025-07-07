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
  const wallet = JSON.parse(localStorage.getItem('wallet'));

  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <div className="container-fluid dark:tw-bg-gray-800 tw-bg-gray-50 tw-py-5" style={{ minHeight: '80vh' }}>
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="container">
            <h1 className="text-center mainColor dark:tw-text-indigo-600 mt-2 fw-bolder pt-4 tw-text-2xl sm:tw-text-3xl md:tw-text-4xl lg:tw-text-5xl">
              {t('title')}
            </h1>

            <p className="text-center mb-4 tw-text-gray-700 dark:tw-text-white tw-text-base sm:tw-text-lg md:tw-text-xl lg:tw-text-2xl">
              {t('description')}
            </p>

            <div className={`${styles.shad} row w-100 mx-auto rounded-4 tw-shadow-lg tw-bg-white dark:tw-bg-gray-900 p-4 my-4`}>
              <h2 className="mainColor dark:tw-text-indigo-600 tw-text-xl sm:tw-text-2xl md:tw-text-3xl lg:tw-text-4xl">
                {t('hello')}, <span className="tw-text-black dark:tw-text-white">{userName}</span>!
              </h2>

              <p className="tw-text-gray-600 tw-text-base sm:tw-text-lg md:tw-text-xl lg:tw-text-2xl dark:tw-text-white">{t('niceDay')}</p>

              <div className={`${styles.line} ${isRTL ? styles.lineRTL : styles.lineLTR} tw-my-3`}></div>

              <h2 className="mt-4 fw-bold dark:tw-text-white tw-text-xl sm:tw-text-2xl md:tw-text-3xl lg:tw-text-4xl">{t('walletTitle')}</h2>
              <h3 className="mt-3 fw-semibold dark:tw-text-white tw-text-lg sm:tw-text-xl md:tw-text-2xl lg:tw-text-3xl">
                {t('balance')} <span className="fw-medium">{wallet} EGP</span>
              </h3>

              <div className={`${styles.line2} ${isRTL ? styles.line2RTL : styles.line2LTR} tw-my-3`}></div>

              <h2 className="mt-4 fw-bold dark:tw-text-white tw-text-xl sm:tw-text-2xl md:tw-text-3xl lg:tw-text-4xl">{t('bookingTitle')}</h2>

              {/* Placeholder box if no bookings */}
              <div className="w-100 my-4">
                <div className="tw-bg-gray-100 dark:tw-bg-gray-900 tw-p-6 tw-rounded-2xl tw-border tw-border-dashed tw-border-gray-400 dark:tw-border-gray-700 tw-text-center">
                  <h4 className="tw-text-gray-700 dark:tw-text-gray-300 tw-text-lg sm:tw-text-xl md:tw-text-2xl lg:tw-text-3xl tw-font-semibold">
                    {t('noBookingTitle')}
                  </h4>
                  <p className="tw-text-gray-600 dark:tw-text-gray-400 tw-mt-2 tw-text-base sm:tw-text-lg md:tw-text-xl lg:tw-text-2xl">
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