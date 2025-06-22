import React, { useContext } from 'react';
import { darkModeContext } from '../../Context/DarkModeContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './Kahoot.module.css';

export default function Kahoot() {
  const { darkMode } = useContext(darkModeContext);
  const { t } = useTranslation('kahoot');
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  

  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <div className="container-fluid dark:tw-bg-gray-800">
        <motion.div
            initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="container">
            <div className="row">
              <h1 className='mt-5 fw-bold mainColor text-center dark:tw-text-indigo-600'>
                {t('kahoot.title')}
              </h1>
              <p className='paragraph dark:tw-text-white text-center'>
                {t('kahoot.description.line1')}<br/>
                {t('kahoot.description.line2')}
              </p>

              <div className={`${styles.shad} , my-5 col-sm-12 p-5 rounded-4 bg-main dark:tw-bg-gray-900`}>
                <div className="pin tw-bg-white dark:tw-bg-gray-800 py-5 mx-auto tw-p-5 rounded-3 tw-w-full md:tw-w-[600px]">
                  <input 
                    type="text" 
                    placeholder={t('kahoot.form.placeholder')}
                    className={`${styles.input} , p-4 w-100 dark:tw-bg-gray-900`} 
                  />
                  <button className={`${styles.myButton} , bg-main w-100 text-white fs-2 fw-bolder rounded-3 dark:tw-bg-indigo-600 py-3 mt-5 form-control`}>
                    {t('kahoot.form.button')}
                  </button>
                </div>
              </div>

              
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}