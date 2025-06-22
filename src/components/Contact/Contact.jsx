import React, { useContext } from 'react';
import styles from './Contact.module.css';
import { darkModeContext } from '../../Context/DarkModeContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { darkMode } = useContext(darkModeContext);
  const { t } = useTranslation('contact');
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
              <h1 className='text-center mt-5 fw-bolder dark:tw-text-white'>
                {t('contact.title.part1')} <span className="mainColor dark:tw-text-indigo-600">{t('contact.title.part2')}</span>
              </h1>
              <p className='tw-text-gray-500 dark:tw-text-white text-center fs-2 mt-2'>
                {t('contact.subtitle')}
              </p>
              
              <div className={`${styles.shad} , my-4 col-sm-12 p-5 rounded-4 dark:tw-bg-gray-900`}>
                <div className={`${styles.child} , p-4 rounded-4`}>
                  <div>
                    <span className='tw-text-responsive fw-bold'>{t('contact.details.meetingTime')}</span> 
                    <span className='tw-text-responsive ms-2'>{t('contact.details.meetingValue')}</span>
                  </div>
                  <div className='py-3'>
                    <span className='tw-text-responsive fw-bold py-3'>{t('contact.details.location')}</span> 
                    <span className='tw-text-responsive ms-2'>{t('contact.details.locationValue')}</span>
                  </div>
                  <div className='py-3'>
                    <span className='tw-text-responsive fw-bold py-3'>{t('contact.details.phone')}</span> 
                    <span className='tw-text-responsive ms-2'>{t('contact.details.phoneValue')}</span>
                  </div>
                  <div>
                    <span className='tw-text-responsive fw-bold py-3'>{t('contact.details.email')}</span> 
                    <span className='tw-text-responsive ms-2'>{t('contact.details.emailValue')}</span>
                  </div>
                </div>
                
                <form className='position-relative'>
                  <div className="parent d-flex gap-3 justify-content-between mt-5">
                    <input 
                      type="text" 
                      className={`${styles.child} , w-100 child w-40 py-4 rounded-4 px-3 border border-0`} 
                      placeholder={t('contact.form.namePlaceholder')} 
                    />
                    <input 
                      type="text" 
                      className={`${styles.child} , w-100 child w-40 py-4 px-3 rounded-4 border border-0`} 
                      placeholder={t('contact.form.phonePlaceholder')} 
                    />
                  </div>
                  <textarea 
                    placeholder={t('contact.form.messagePlaceholder')} 
                    name="message" 
                    id="message" 
                    className={`${styles.child} , ${styles.myArea} , p-3 w-100 border border-0 mb-5 rounded-4 mt-5`}
                  ></textarea>
                  <button className={`${styles.absolute} , bg-main text-white rounded-5 px-5 lft dark:tw-bg-indigo-600 py-3`}>
                    {t('contact.form.submitButton')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}