import React, { useContext } from 'react';
import styles from './Events.module.css';
import maria from '../../assets/maria.jpg';
import der from '../../assets/der.jpg';
import siwa from '../../assets/siwa.jpg';
import { darkModeContext } from '../../Context/DarkModeContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Events() {
  const { darkMode } = useContext(darkModeContext);
  const { t } = useTranslation('events');
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <>
      <div className={`${darkMode ? 'tw-dark' : ''}`}>
        <div className="container-fluid dark:tw-bg-gray-800">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="container">
              <div className="row">
                <h1 className='mt-5 fw-bold mainColor dark:tw-text-indigo-600 text-center'>
                  {t('events.title')}
                </h1>

                <div className={`${styles.searching} , d-Myflex align-items-center rounded-4 py-4 dark:tw-bg-gray-900`}>
                  <input 
                    type="text" 
                    placeholder={t('events.search.placeholder')} 
                    className='w-input border border-0 pyt-3 me-2 rounded-2'
                  />
                  <select id="options" className='pyt-3 w-Drop me-3 my-2 border border-0 rounded-2' name="options">
                    <option value="All Categories" selected>{t('events.search.categories.all')}</option>
                    <option value="Events">{t('events.search.categories.events')}</option>
                    <option value="Trip">{t('events.search.categories.trip')}</option>
                  </select>
                  <button className={` ${styles.myButton} , bg-main dark:tw-bg-indigo-600 btn text-white w-myBtn py-3`}>
                    {t('events.search.button')}
                  </button>
                </div>

                <div className="row">
                  {/* Siwa Card */}
                  <div className="col-lg-4 col-md-6 my-4">
                    <div className="card dark:tw-bg-gray-900" style={{height:'630px'}}>
                      <img src={siwa} className="card-img-top w-100" style={{ height: "360px" }} />
                      <div className="card-body tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                        <h5 className="card-title mainColor dark:tw-text-indigo-600">
                          {t('events.cards.siwa.title')}
                        </h5>
                        <p className="card-text dark:tw-text-white">
                          {t('events.cards.siwa.description')}
                        </p>
                        <div className={`${styles.parent} ${isRTL ? styles.pad2 : styles.pad} parent`}>
                        <div className="card-end d-flex justify-content-between w-100">
                            <div className="card-date">
                              <span className="tw-text-gray-500 dark:tw-text-white my-2">
                                {t('events.cards.siwa.date')}
                              </span>
                            </div>
                            <div className="card-btn">
                              <button className="bg-main text-white tw-w-full dark:tw-bg-indigo-600 tw-px-7 py-2 rounded-3">
                                {t('events.cards.siwa.button')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monastery Card */}
                  <div className="col-lg-4 col-md-6 my-4">
                    <div className="card dark:tw-bg-gray-900" style={{height:'630px'}}>
                      <img src={der} className="card-img-top w-100" style={{height:'360px'}} />
                      <div className="card-body position-relative">
                        <h5 className="card-title mainColor dark:tw-text-indigo-600">
                          {t('events.cards.monastery.title')}
                        </h5>
                        <p className="card-text dark:tw-text-white">
                          {t('events.cards.monastery.description')}
                        </p>
                        <div className={`${styles.parent} ${isRTL ? styles.pad2 : styles.pad} parent`}>
                          <div className="card-end d-flex justify-content-between">
                            <div className="card-date">
                              <span className='tw-text-gray-500 dark:tw-text-white my-2'>
                                {t('events.cards.monastery.date')}
                              </span>
                            </div>
                            <div className="card-btn">
                              <button className="bg-main text-white tw-w-full tw-px-7 dark:tw-bg-indigo-600 py-2 rounded-3">
                                {t('events.cards.monastery.button')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Maria Card */}
                  <div className="col-lg-4 col-md-6 my-4">
                    <div className="card dark:tw-bg-gray-900" style={{height:'630px'}}>
                      <img src={maria} className="card-img-top w-100" style={{height:'360px'}} />
                      <div className="card-body position-relative">
                        <h5 className="card-title mainColor dark:tw-text-indigo-600">
                          {t('events.cards.maria.title')}
                        </h5>
                        <p className="card-text dark:tw-text-white">
                          {t('events.cards.maria.description')}
                        </p>
                        <div className={`${styles.parent} ${isRTL ? styles.pad2 : styles.pad} parent`}>
                          <div className="card-end d-flex justify-content-between flex-nowrap">
                            <div className="card-date">
                              <span className='tw-text-gray-500 dark:tw-text-white my-2'>
                                {t('events.cards.maria.date')}
                              </span>
                            </div>
                            <div className="card-btn">
                              <button className="bg-main text-white tw-w-full tw-px-7 dark:tw-bg-indigo-600 py-2 rounded-3">
                                {t('events.cards.maria.button')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}