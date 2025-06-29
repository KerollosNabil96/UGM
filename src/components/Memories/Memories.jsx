import React, { useContext, useState, useEffect } from 'react';
import styles from './Memories.module.css';
import maria from '../../assets/maria.jpg';
import der from '../../assets/der.jpg';
import siwa from '../../assets/siwa.jpg';
import afri from '../../assets/africa-safari-park-1200x1000.jpg';
import { darkModeContext } from '../../Context/DarkModeContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import Spinner from '../Spinner/Spinner'; 

export default function Memories() {
    const { darkMode } = useContext(darkModeContext);
    const { t } = useTranslation('memory');
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setAuthenticated(!!token);
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Spinner />; 
    }

    if (!authenticated) {
        return <Navigate to="/signin" replace />;
    }

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
                            <h1 className='mt-5 fw-bold text-purple-600 dark:text-purple-400 text-center tw-text-3xl'>
                                {t('pageTitle')}
                            </h1>

                            <div className={`${styles.searching} d-flex align-items-center rounded-4 py-4 px-4 dark:tw-bg-gray-900 tw-mb-8`}>
                                <input 
                                    type="text" 
                                    placeholder={t('searchPlaceholder')} 
                                    className='w-input border-0 tw-py-3 tw-px-4 me-2 rounded-2 dark:tw-bg-gray-700 dark:tw-text-white focus:tw-ring-2 focus:tw-ring-purple-500' 
                                />
                                <select 
                                    id="options" 
                                    className='tw-py-3 tw-px-4 w-Drop me-3 my-2 border-0 rounded-2 dark:tw-bg-gray-700 dark:tw-text-white focus:tw-ring-2 focus:tw-ring-purple-500' 
                                    name="options"
                                >
                                    <option value="All Categories" selected>{t('allCategories')}</option>
                                    <option value="Events">{t('events')}</option>
                                    <option value="Trip">{t('trip')}</option>
                                </select>
                                <button className='tw-bg-purple-600 hover:tw-bg-purple-700 tw-transition-colors btn text-white tw-px-7 tw-py-3 dark:tw-bg-purple-500 dark:hover:tw-bg-purple-600 tw-rounded-3'>
                                    {t('searchButton')}
                                </button>
                            </div>

                            <div className="row tw-mt-4">
                                {/* Card 1 */}
                                <div className="col-lg-4 col-md-6 my-4">
                                    <motion.div 
                                        className="card position-relative dark:tw-bg-gray-900 tw-h-[600px] tw-overflow-hidden tw-shadow-lg hover:tw-shadow-xl tw-transition-shadow"
                                        whileHover={{ y: -5 }}
                                    >
                                        <img src={siwa} className="card-img-top tw-w-full tw-h-[450px] tw-object-cover" alt="Siwa" />
                                        <div className="card-body tw-p-5">
                                            <h5 className="card-title tw-text-purple-600 dark:tw-text-purple-400 tw-text-xl tw-font-semibold">
                                                {t('cards.0.title')}
                                            </h5>
                                            <div className={`${styles.parent} ${isRTL ? styles.pad2 : styles.pad}`}>
                                                <div className="card-end d-flex justify-content-between tw-mt-4">
                                                    <div className="card-date tw-flex tw-items-center">
                                                        <span className="tw-text-gray-500 dark:tw-text-gray-300">
                                                            {t('cards.0.date')}
                                                        </span>
                                                    </div>
                                                    <div className="card-btn">
                                                        <button className="tw-bg-purple-600 hover:tw-bg-purple-700 tw-transition-colors text-white tw-w-full tw-px-7 dark:tw-bg-purple-500 dark:hover:tw-bg-purple-600 tw-py-2 tw-rounded-3">
                                                            {t('cards.0.button')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Card 2 */}
                                <div className="col-lg-4 col-md-6 my-4">
                                    <motion.div 
                                        className="card dark:tw-bg-gray-900 tw-h-[600px] tw-overflow-hidden tw-shadow-lg hover:tw-shadow-xl tw-transition-shadow"
                                        whileHover={{ y: -5 }}
                                    >
                                        <img src={der} className="card-img-top tw-w-full tw-h-[450px] tw-object-cover" alt="Der" />
                                        <div className="card-body tw-p-5">
                                            <h5 className="card-title tw-text-purple-600 dark:tw-text-purple-400 tw-text-xl tw-font-semibold">
                                                {t('cards.1.title')}
                                            </h5>
                                            <div className={`${styles.parent} ${isRTL ? styles.pad2 : styles.pad}`}>
                                                <div className="card-end d-flex justify-content-between tw-mt-4">
                                                    <div className="card-date tw-flex tw-items-center">
                                                        <span className='dark:tw-text-gray-300 tw-text-gray-500'>
                                                            {t('cards.1.date')}
                                                        </span>
                                                    </div>
                                                    <div className="card-btn">
                                                        <button className="tw-bg-purple-600 hover:tw-bg-purple-700 tw-transition-colors text-white tw-w-full tw-px-7 dark:tw-bg-purple-500 dark:hover:tw-bg-purple-600 tw-py-2 tw-rounded-3">
                                                            {t('cards.1.button')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Card 3 */}
                                <div className="col-lg-4 col-md-6 my-4">
                                    <motion.div 
                                        className="card dark:tw-bg-gray-900 tw-h-[600px] tw-overflow-hidden tw-shadow-lg hover:tw-shadow-xl tw-transition-shadow"
                                        whileHover={{ y: -5 }}
                                    >
                                        <img src={maria} className="card-img-top tw-w-full tw-h-[450px] tw-object-cover" alt="Maria" />
                                        <div className="card-body tw-p-5">
                                            <h5 className="card-title tw-text-purple-600 dark:tw-text-purple-400 tw-text-xl tw-font-semibold">
                                                {t('cards.2.title')}
                                            </h5>
                                            <div className={`${styles.parent} ${isRTL ? styles.pad2 : styles.pad}`}>
                                                <div className="card-end d-flex justify-content-between tw-mt-4">
                                                    <div className="card-date tw-flex tw-items-center">
                                                        <span className='tw-text-gray-500 dark:tw-text-gray-300'>
                                                            {t('cards.2.date')}
                                                        </span>
                                                    </div>
                                                    <div className="card-btn">
                                                        <button className="tw-bg-purple-600 hover:tw-bg-purple-700 tw-transition-colors text-white tw-w-full tw-px-7 dark:tw-bg-purple-500 dark:hover:tw-bg-purple-600 tw-py-2 tw-rounded-3">
                                                            {t('cards.2.button')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Card 4 */}
                                <div className="col-lg-4 col-md-6 my-4">
                                    <motion.div 
                                        className="card dark:tw-bg-gray-900 tw-h-[600px] tw-overflow-hidden tw-shadow-lg hover:tw-shadow-xl tw-transition-shadow"
                                        whileHover={{ y: -5 }}
                                    >
                                        <img src={afri} className="card-img-top tw-w-full tw-h-[450px] tw-object-cover" alt="Africa" />
                                        <div className="card-body tw-p-5">
                                            <h5 className="card-title tw-text-purple-600 dark:tw-text-purple-400 tw-text-xl tw-font-semibold">
                                                {t('cards.3.title')}
                                            </h5>
                                            <div className={`${styles.parent} ${isRTL ? styles.pad2 : styles.pad}`}>
                                                <div className="card-end d-flex justify-content-between tw-mt-4">
                                                    <div className="card-date tw-flex tw-items-center">
                                                        <span className='tw-text-gray-500 dark:tw-text-gray-300'>
                                                            {t('cards.3.date')}
                                                        </span>
                                                    </div>
                                                    <div className="card-btn">
                                                        <button className="tw-bg-purple-600 hover:tw-bg-purple-700 tw-transition-colors text-white tw-w-full tw-px-7 dark:tw-bg-purple-500 dark:hover:tw-bg-purple-600 tw-py-2 tw-rounded-3">
                                                            {t('cards.3.button')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}