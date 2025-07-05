import React, { useContext, useState, useEffect } from 'react';
import styles from './Home.module.css';
import firstImg from '../../assets/1.jpg';
import secImage from '../../assets/2.jpg';
import thirdImage from '../../assets/3.jpg';
import fourthImg from '../../assets/4.jpg';
import fifthImg from '../../assets/5.jpg';
import Events from '../Events/Events';
import { darkModeContext } from '../../Context/DarkModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { darkMode } = useContext(darkModeContext);
  const { t, i18n } = useTranslation('home');
  const isRTL = i18n.language === 'ar';

  const verses = [
    {
      ar: 'لأنه حيثما اجتمع اثنان أو ثلاثة باسمي فهناك أكون في وسطهم (متى 18:20)',
      en: 'For where two or three gather in my name, there am I with them. (Matthew 18:20)',
    },
    {
      ar: 'مواظبين على الصلاة والشركة وكسر الخبز (أعمال الرسل 2:42)',
      en: 'They devoted themselves to the apostle teaching and to fellowship, to the breaking of bread and to prayer. (Acts 2:42)',
    },
    {
      ar: 'لنلاحظ بعضنا بعضًا للتحريض على المحبة والأعمال الحسنة (عبرانيين 10:24)',
      en: 'And let us consider how we may spur one another on toward love and good deeds. (Hebrews 10:24)',
    },
  ];

  const [verseIndex, setVerseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVerseIndex((prevIndex) => (prevIndex + 1) % verses.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
              <h1 className='fs-1 mainColor mt-5 fw-bolder dark:tw-text-indigo-600'>
                {t('home.title')}
              </h1>

              <p className='paragraph dark:tw-text-white'>
                {t('home.subtitle')}
              </p>

              {/* ✅ Verse Container - Fixed Height with Smooth Transitions */}
              <div className="d-flex justify-content-center align-items-center my-4" style={{ 
                height: '150px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${verseIndex}-${i18n.language}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="px-4 py-3 rounded-4"
                    style={{
                      position: 'absolute',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      background: darkMode
                        ? 'rgba(30, 30, 30, 0.5)'
                        : 'rgba(255, 255, 255, 0.6)',
                      color: darkMode ? '#f0e9ff' : '#2c2c2c',
                      borderLeft: '6px solid #8b5cf6',
                      boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
                      fontStyle: 'italic',
                      fontWeight: '500',
                      fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                      minWidth: '250px',
                      maxWidth: '90%',
                      textAlign: 'center',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {i18n.language === 'ar'
                      ? verses[verseIndex].ar
                      : verses[verseIndex].en}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ✅ Carousel */}
              <div className="silder my-4 rounded-5" style={{ width: "100%", height: "300px" }}>
                <div
                  id="carouselExampleIndicators"
                  className="carousel slide"
                  data-bs-ride="carousel"
                  data-bs-interval="2000"
                  style={{ height: "100%" }}
                >
                  <div className="carousel-indicators">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <button
                        key={index}
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to={index}
                        className={`indi ${index === 0 ? 'active' : ''}`}
                        aria-label={t(`home.carousel.indicators.${index}`)}
                      ></button>
                    ))}
                  </div>

                  <div className="carousel-inner rounded-5" style={{ height: "100%" }}>
                    {[firstImg, secImage, thirdImage, fourthImg, fifthImg].map((img, i) => (
                      <div
                        key={i}
                        className={`carousel-item ${i === 0 ? 'active' : ''} rounded-5`}
                        style={{ height: "100%" }}
                      >
                        <img
                          src={img}
                          className="d-block w-100"
                          alt=""
                          style={{ height: "100%", objectFit: "cover", objectPosition: "center 60%" }}
                        />
                      </div>
                    ))}
                  </div>

                  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">{t('home.carousel.previous')}</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">{t('home.carousel.next')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Events />
        </motion.div>
      </div>
    </div>
  );
}