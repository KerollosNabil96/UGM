import React, { useContext } from 'react'
import styles from './About.module.css';
import { darkModeContext } from '../../Context/DarkModeContext';
import { useTranslation } from 'react-i18next';
import { motion } from "motion/react"

export default function About() {
  const { darkMode } = useContext(darkModeContext);
  const { t } = useTranslation('about'); 

  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <div className="container-fluid dark:tw-bg-gray-800">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="container">
            <div className="row">
              <h1 className='text-center dark:tw-text-white mt-5 fw-bolder fs-1'>
                {t('title')} <span className="mainColor dark:tw-text-indigo-600">{t('Us')}</span>
              </h1>
              <p className='tw-text-gray-500 dark:tw-text-white text-center tw-text-responsive mt-2'>
                {t('subtitle')}
              </p>

              <div className={`${styles.shad} w-60 my-4 col-sm-12 p-5 rounded-4 dark:tw-bg-gray-900`}>
                <h2 className='fw-bolder fs-1 mainColor text-center dark:tw-text-indigo-600'>
                  {t('whoTitle')}
                </h2>
                <p className='tw-text-responsive tw-text-gray-500 dark:tw-text-white text-center'>
                  {t('whoDesc')}
                </p>
              </div>

              <div className={`${styles.shad} w-60 my-4 col-sm-12 p-5 rounded-4 dark:tw-bg-gray-900`}>
                <h2 className='fw-bolder fs-1 mainColor text-center dark:tw-text-indigo-600'>
                  {t('visionTitle')}
                </h2>
                <p className='tw-text-responsive tw-text-gray-500 dark:tw-text-white text-center'>
                  {t('visionDesc')}
                </p>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
