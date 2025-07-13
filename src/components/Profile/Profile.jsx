// import React, { useContext } from 'react'
// import { darkModeContext } from '../../Context/DarkModeContext';
// import styles from './Profile.module.css';
// import { motion } from 'framer-motion';
// import { useTranslation } from 'react-i18next';

// export default function Profile() {
//   const { darkMode } = useContext(darkModeContext);
//   const { i18n, t } = useTranslation('profile');
//   const isRTL = i18n.language === 'ar';
//   const userName = localStorage.getItem('userName');
//   const wallet = JSON.parse(localStorage.getItem('wallet'));

//   return (
//     <div className={`${darkMode ? 'tw-dark' : ''}`}>
//       <div className="container-fluid dark:tw-bg-gray-800 tw-bg-gray-50 tw-py-5" style={{ minHeight: '80vh' }}>
//         <motion.div
//           initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 1 }}
//         >
//           <div className="container">
//             <h1 className="text-center mainColor dark:tw-text-indigo-600 mt-2 fw-bolder pt-4 tw-text-2xl sm:tw-text-3xl md:tw-text-4xl lg:tw-text-5xl">
//               {t('title')}
//             </h1>

//             <p className="text-center mb-4 tw-text-gray-700 dark:tw-text-white tw-text-base sm:tw-text-lg md:tw-text-xl lg:tw-text-2xl">
//               {t('description')}
//             </p>

//             <div className={`${styles.shad} row w-100 mx-auto rounded-4 tw-shadow-lg tw-bg-white dark:tw-bg-gray-900 p-4 my-4`}>
//               <h2 className="mainColor dark:tw-text-indigo-600 tw-text-xl sm:tw-text-2xl md:tw-text-3xl lg:tw-text-4xl">
//                 {t('hello')}, <span className="tw-text-black dark:tw-text-white">{userName}</span>!
//               </h2>

//               <p className="tw-text-gray-600 tw-text-base sm:tw-text-lg md:tw-text-xl lg:tw-text-2xl dark:tw-text-white">{t('niceDay')}</p>

//               <div className={`${styles.line} ${isRTL ? styles.lineRTL : styles.lineLTR} tw-my-3`}></div>

//               <h2 className="mt-4 fw-bold dark:tw-text-white tw-text-xl sm:tw-text-2xl md:tw-text-3xl lg:tw-text-4xl">{t('walletTitle')}</h2>
//               <h3 className="mt-3 fw-semibold dark:tw-text-white tw-text-lg sm:tw-text-xl md:tw-text-2xl lg:tw-text-3xl">
//                 {t('balance')} <span className="fw-medium">{wallet} EGP</span>
//               </h3>

//               <div className={`${styles.line2} ${isRTL ? styles.line2RTL : styles.line2LTR} tw-my-3`}></div>

//               <h2 className="mt-4 fw-bold dark:tw-text-white tw-text-xl sm:tw-text-2xl md:tw-text-3xl lg:tw-text-4xl">{t('bookingTitle')}</h2>

//               {/* Placeholder box if no bookings */}
//               <div className="w-100 my-4">
//                 <div className="tw-bg-gray-100 dark:tw-bg-gray-900 tw-p-6 tw-rounded-2xl tw-border tw-border-dashed tw-border-gray-400 dark:tw-border-gray-700 tw-text-center">
//                   <h4 className="tw-text-gray-700 dark:tw-text-gray-300 tw-text-lg sm:tw-text-xl md:tw-text-2xl lg:tw-text-3xl tw-font-semibold">
//                     {t('noBookingTitle')}
//                   </h4>
//                   <p className="tw-text-gray-600 dark:tw-text-gray-400 tw-mt-2 tw-text-base sm:tw-text-lg md:tw-text-xl lg:tw-text-2xl">
//                     {t('noBookingSubtext')}
//                   </p>
//                 </div>
//               </div>
//               {/* End */}
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

import React, { useContext, useEffect, useState } from 'react'
import { darkModeContext } from '../../Context/DarkModeContext';
import styles from './Profile.module.css';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { darkMode } = useContext(darkModeContext);
  const { i18n, t } = useTranslation('profile');
  const isRTL = i18n.language === 'ar';
  const userName = localStorage.getItem('userName');
  
  // طريقة آمنة لقراءة المحفظة
  const getSafeWallet = () => {
    try {
      const wallet = localStorage.getItem('wallet');
      return wallet ? JSON.parse(wallet) : 0;
    } catch {
      return 0;
    }
  };
  const wallet = getSafeWallet();

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    console.log(localStorage.getItem('bookings'))

    // دالة مساعدة لقراءة الحجوزات بشكل آمن
    const getSafeBookings = () => {
      try {
        const bookingsData = localStorage.getItem('bookings');
        
        // إذا كانت البيانات غير موجودة أو فارغة
        if (!bookingsData) return [];
        
        // إذا كانت البيانات بالفعل مصفوفة (مشكلة [object Object])
        if (typeof bookingsData === 'object') return bookingsData;
        
        // محاولة تحليل JSON
        return JSON.parse(bookingsData) || [];
      } catch (error) {
        console.error('Error reading bookings:', error);
        return [];
      }
    };

    const storedBookings = getSafeBookings();
    const currentDate = new Date();
    // تصفية الحجوزات المنتهية
    const activeBookings = storedBookings.filter(booking => {
      return booking && booking.eventDate && new Date(booking.eventDate) >= currentDate;
    });

    // إذا اختلف عدد الحجوزات بعد التصفية، نقوم بتحديث التخزين
    if (activeBookings.length !== storedBookings.length) {
      localStorage.setItem('bookings', JSON.stringify(activeBookings));
    }

    

    setBookings(activeBookings);
  }, []);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(i18n.language, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'tw-text-green-600 dark:tw-text-green-400';
      case 'pending':
        return 'tw-text-yellow-600 dark:tw-text-yellow-400';
      case 'rejected':
        return 'tw-text-red-600 dark:tw-text-red-400';
      default:
        return 'tw-text-gray-600 dark:tw-text-gray-400';
    }
  };

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

              {bookings.length > 0 ? (
                <div className="w-100 my-4">
                  {bookings.map((booking, index) => (
                    <div key={booking._id || index} className="tw-bg-gray-100 dark:tw-bg-gray-800 tw-p-4 tw-rounded-xl tw-mb-4 tw-border tw-border-solid tw-border-gray-300 dark:tw-border-gray-700">
                      <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-justify-between">
                        <div className="tw-mb-3 md:tw-mb-0">
                          <h4 className="tw-text-gray-800 dark:tw-text-white tw-text-lg sm:tw-text-xl md:tw-text-2xl tw-font-semibold">
                            {booking.eventName}
                          </h4>
                          <p className="tw-text-gray-600 dark:tw-text-gray-300 tw-mt-1 tw-text-base sm:tw-text-lg">
                            {t('date')}: {formatDate(booking.eventDate)}
                          </p>
                        </div>
                        <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center sm:tw-gap-4">
                          <p className="tw-text-gray-800 dark:tw-text-white tw-text-base sm:tw-text-lg">
                            {t('amount')}: <span className="tw-font-medium">{booking.amount} EGP</span>
                          </p>
                          <p className={`tw-text-base sm:tw-text-lg tw-font-medium ${getStatusColor(booking.status)}`}>
                            {t('status')}: {t(booking.status)}
                          </p>
                        </div>
                      </div>
                      <p className="tw-text-gray-600 dark:tw-text-gray-300 tw-mt-2 tw-text-base sm:tw-text-lg">
                        {t('paymentMethod')}: {t(booking.paymentMethod)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}