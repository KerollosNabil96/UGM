import React, { useContext } from 'react'
import styles from './About.module.css';
import { darkModeContext } from '../../Context/DarkModeContext';
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";
import { FaUsers, FaBullseye } from 'react-icons/fa';

export default function About() {
  const { darkMode } = useContext(darkModeContext);
  const { t, i18n } = useTranslation('about');
  const isRTL = i18n.language === 'ar';

  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <div className="container-fluid dark:tw-bg-gray-800 tw-overflow-x-hidden">

        <div className="tw-relative tw-w-full tw-h-[400px] tw-rounded-b-3xl tw-overflow-hidden">
          <img
            src="https://i.postimg.cc/4x6Sbt1Q/470229909-10225273510937048-1813529456201161110-n.jpg"
            alt="About Banner"
  className="tw-w-full tw-h-full tw-object-cover tw-object-[50%_70%]"
          />

          <div className="tw-absolute tw-inset-0 tw-bg-black/50 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="tw-text-4xl md:tw-text-5xl tw-font-bold tw-mb-3"
            >
              {t('title')} <span className="tw-text-indigo-400 dark:tw-text-indigo-200">{t('Us')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="tw-text-lg md:tw-text-xl tw-text-gray-200"
            >
              {t('subtitle')}
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="container py-5">
            
      <h2 className="tw-relative tw-text-center tw-text-xl tw-font-bold tw-text-indigo-600 dark:tw-text-indigo-400 tw-my-8 tw-flex tw-items-center tw-gap-4">
  <span className="tw-flex-grow tw-h-px tw-bg-indigo-500 dark:tw-bg-indigo-400" />
  
  <span
  className={`tw-text-center tw-break-words tw-px-2 
    ${i18n.language === 'en' ? 'tw-uppercase tw-tracking-wider' : ''}
    tw-text-sm sm:tw-text-base md:tw-text-lg`}
>
  ✨ {t('slogan')} ✨
</span>

  <span className="tw-flex-grow tw-h-px tw-bg-indigo-500 dark:tw-bg-indigo-400" />
</h2>
            {/* 🔷 Sections */}
            <div className="row justify-content-center mt-5 gap-4">
              <motion.div
                className={`${styles.shad} col-md-5 col-sm-12 p-5 rounded-4 dark:tw-bg-gray-900 tw-shadow-md`}
                whileHover={{ scale: 1.02 }}
              >
                <h2 className='fw-bold fs-2 text-center dark:tw-text-indigo-500 mb-3'>
                  <FaUsers className="mb-2 me-2" />
                  {t('whoTitle')}
                </h2>
                <p className='tw-text-gray-600 dark:tw-text-white text-center'>
                  {t('whoDesc')}
                </p>
              </motion.div>

              <motion.div
                className={`${styles.shad} col-md-5 col-sm-12 p-5 rounded-4 dark:tw-bg-gray-900 tw-shadow-md`}
                whileHover={{ scale: 1.02 }}
              >
                <h2 className='fw-bold fs-2 text-center dark:tw-text-indigo-500 mb-3'>
                  <FaBullseye className="mb-2 me-2" />
                  {t('visionTitle')}
                </h2>
                <p className='tw-text-gray-600 dark:tw-text-white text-center'>
                  {t('visionDesc')}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
