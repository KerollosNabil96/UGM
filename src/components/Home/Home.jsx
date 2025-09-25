import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { FaBirthdayCake } from 'react-icons/fa';
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

    const [verseIndex, setVerseIndex] = useState(0);
    const [todaysBirthdays, setTodaysBirthdays] = useState([]);
    const [loadingBirthdays, setLoadingBirthdays] = useState(true);

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
        {
            ar: 'ليكون الجميع واحدًا، كما أنك أنت أيها الآب فيَّ، وأنا فيك، ليكونوا هم أيضًا واحدًا فينا. (يوحنا 17:21)',
            en: 'That all of them may be one, Father, just as you are in me and I am in you. (John 17:21)'
        },
        {
            ar: 'كما أن لنا أعضاءً كثيرة في جسد واحد... هكذا نحن الكثيرين جسد واحد في المسيح، وأعضاء بعضًا لبعض كل واحد للآخر. (رومية 12:5)',
            en: 'So in Christ we, though many, form one body, and each member belongs to all the others. (Romans 12:5)'
        },
        {
            ar: 'كان هؤلاء كلهم يواظبون بنفس واحدة على الصلاة. (أعمال الرسل 1:14)',
            en: 'They all joined together constantly in prayer. (Acts 1:14)'
        },
        {
            ar: 'احملوا بعضكم أثقال بعض، وهكذا تمّموا ناموس المسيح. (غلاطية 6:2)',
            en: 'Carry each other’s burdens, and in this way you will fulfill the law of Christ. (Galatians 6:2)'
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setVerseIndex((prevIndex) => (prevIndex + 1) % verses.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [verses.length]);

    useEffect(() => {
        const fetchAndFilterBirthdays = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoadingBirthdays(false);
                    return;
                }
                const { data } = await axios.get(
                    'https://ugmproject.vercel.app/api/v1/user/gitAllUsers',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (data && data.users) {
                    const today = new Date();
                    const todayMonth = today.getMonth() + 1;
                    const todayDate = today.getDate();
                    const filtered = data.users.filter(user => {
                        if (!user.birthDate) return false;
                        try {
                            const birthDate = new Date(user.birthDate);
                            return birthDate.getMonth() + 1 === todayMonth && birthDate.getDate() === todayDate;
                        } catch (e) { return false; }
                    });
                    setTodaysBirthdays(filtered);
                }
            } catch (error) {
                console.error("Failed to fetch birthdays:", error);
            } finally {
                setLoadingBirthdays(false);
            }
        };
        fetchAndFilterBirthdays();
    }, []);

    const images = [firstImg, secImage, thirdImage, fourthImg, fifthImg];
    const imagePositions = [
        'center 80%', 'center 75%', 'center 70%', 'center 30%', 'center 60%',
    ];

    // ✅ ================= 1. تم تعديل دالة عرض الاسم ================= ✅
    const getUserFullName = (user) => {
        return [user.firstName, user.secName, user.familyName].filter(Boolean).join(' ');
    };

    return (
        <div className={`${darkMode ? 'tw-dark' : ''}`} style={{ overflow: 'hidden' }}>
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

                            {/* Verse Container */}
                            <div className="d-flex justify-content-center align-items-center my-4" style={{
                                height: '150px', position: 'relative', overflow: 'hidden'
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
                                            position: 'absolute', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                                            background: darkMode ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.6)',
                                            color: darkMode ? '#f0e9ff' : '#2c2c2c', borderLeft: '6px solid #8b5cf6',
                                            boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)', fontStyle: 'italic',
                                            fontWeight: '500', fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                                            minWidth: '250px', maxWidth: '90%', textAlign: 'center',
                                            lineHeight: '1.6', whiteSpace: 'pre-wrap',
                                        }}
                                    >
                                        {i18n.language === 'ar' ? verses[verseIndex].ar : verses[verseIndex].en}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Carousel */}
                            <div className="silder my-4 rounded-5" style={{ width: "100%", height: "300px" }}>
                                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" data-bs-interval="2000" style={{ height: "100%" }}>
                                    <div className="carousel-indicators">
                                        {images.map((_, index) => (
                                            <button key={index} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index} className={`indi ${index === 0 ? 'active' : ''}`} aria-label={t(`home.carousel.indicators.${index}`)}></button>
                                        ))}
                                    </div>
                                    <div className="carousel-inner rounded-5" style={{ height: "100%" }}>
                                        {images.map((img, i) => (
                                            <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''} rounded-5`} style={{ height: "100%" }}>
                                                <img src={img} className="d-block w-100" alt="" style={{ height: "100%", objectFit: "cover", objectPosition: imagePositions[i] || 'center center', }} />
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

                            {/* ================= Birthday Section ================= */}
                            {!loadingBirthdays && todaysBirthdays.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className={`
      tw-my-10 tw-p-5 tw-text-center tw-rounded-2xl tw-border
      tw-bg-gradient-to-br tw-from-purple-50 tw-to-blue-50 tw-border-purple-200
      dark:tw-bg-gray-900 dark:tw-border-purple-900 dark:tw-bg-none
    `}
  >
    <div className="tw-flex tw-items-center tw-justify-center tw-gap-3 tw-mb-2">
      {/* ✅ أيقونة عيد الميلاد بلون mainColor في اللايت و tw-indigo-600 في الدارك */}
      <FaBirthdayCake className="tw-text-3xl mainColor dark:tw-text-indigo-600" />

      {/* ✅ العنوان بلون mainColor في اللايت و tw-indigo-600 في الدارك */}
      <h4 className="tw-text-2xl tw-font-bold mainColor dark:tw-text-indigo-600">
         {t('home.birthday.title')}
      </h4>
    </div>

    <p className="tw-max-w-2xl tw-mx-auto tw-mb-5 tw-text-gray-600 dark:tw-text-white">
  {t('home.birthday.message')}
    </p>

    <div className="tw-flex tw-flex-wrap tw-justify-center tw-gap-3">
      {todaysBirthdays.map(user => (
        <motion.div
          key={user._id}
          whileHover={{ scale: 1.05, y: -2 }}
          className={`
            tw-px-4 tw-py-2 tw-font-semibold tw-rounded-full tw-cursor-default
            tw-bg-white tw-text-purple-700 tw-border-2 tw-border-purple-300
            dark:tw-bg-gray-700 dark:tw-text-purple-300 dark:tw-border-purple-600
          `}
        >
          {getUserFullName(user)}
        </motion.div>
      ))}
    </div>
  </motion.div>
)}

                            {/* ================= End of Birthday Section ================= */}

                        </div>
                    </div>

                    <Events />
                </motion.div>
            </div>
        </div>
    );
}