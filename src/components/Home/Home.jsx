import React, { useContext } from 'react';
import styles from './Home.module.css';
import firstImg from '../../assets/1.jpg';
import secImage from '../../assets/2.jpg';
import thirdImage from '../../assets/3.jpg';
import fourthImg from '../../assets/4.jpg';
import fifthImg from '../../assets/5.jpg';
import Events from '../Events/Events';
import { darkModeContext } from '../../Context/DarkModeContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { darkMode } = useContext(darkModeContext);
  const { t } = useTranslation('home');
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
              <h1 className='fs-1 mainColor mt-5 fw-bolder dark:tw-text-indigo-600'>
                {t('home.title')}
              </h1>
              <p className='paragraph dark:tw-text-white'>
                {t('home.subtitle')}
              </p>

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
                    <div className="carousel-item active rounded-5" style={{ height: "100%" }}>
                      <img
                        src={firstImg}
                        className="d-block w-100"
                        alt=""
                        style={{ height: "100%", objectFit: "cover", objectPosition: "center 80%" }}
                      />
                    </div>
                    <div className="carousel-item rounded-5" style={{ height: "100%" }}>
                      <img
                        src={secImage}
                        className="d-block w-100"
                        alt=""
                        style={{ height: "100%", objectFit: "cover", objectPosition: "center 80%" }}
                      />
                    </div>
                    <div className="carousel-item rounded-5" style={{ height: "100%" }}>
                      <img
                        src={thirdImage}
                        className="d-block w-100"
                        alt=""
                        style={{ height: "100%", objectFit: "cover", objectPosition: "center 70%" }}
                      />
                    </div>
                    <div className="carousel-item rounded-5" style={{ height: "100%" }}>
                      <img
                        src={fourthImg}
                        className="d-block w-100"
                        alt=""
                        style={{ height: "100%", objectFit: "cover", objectPosition: "center 35%" }}
                      />
                    </div>
                    <div className="carousel-item rounded-5" style={{ height: "100%" }}>
                      <img
                        src={fifthImg}
                        className="d-block w-100"
                        alt=""
                        style={{ height: "100%", objectFit: "cover", objectPosition: "center 60%" }}
                      />
                    </div>
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
