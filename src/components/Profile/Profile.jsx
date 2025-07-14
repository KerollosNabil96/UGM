// import React, { useContext, useEffect, useState, useCallback } from 'react';
// import { darkModeContext } from '../../Context/DarkModeContext';
// import styles from './Profile.module.css';
// import { motion } from 'framer-motion';
// import { useTranslation } from 'react-i18next';
// import axios from 'axios';

// export default function Profile() {
//   const { darkMode } = useContext(darkModeContext);
//   const { i18n, t } = useTranslation('profile');
//   const isRTL = i18n.language === 'ar';
//   const userName = localStorage.getItem('userName');
//   const token = localStorage.getItem('token');
  
//   const getSafeWallet = useCallback(() => {
//     try {
//       const wallet = localStorage.getItem('wallet');
//       return wallet ? JSON.parse(wallet) : 0;
//     } catch {
//       return 0;
//     }
//   }, []);

//   const [wallet, setWallet] = useState(getSafeWallet());
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchBookings = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         'https://ugmproject.vercel.app/api/v1/user/getAllBookingsForUser',
//         {
//           headers: {
// Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       // Filter out past events and invalid bookings
//       const currentDate = new Date();
//       const activeBookings = (response.data.Bookings || []).filter(booking => {
//         if (!booking || !booking.eventDate) return false;
        
//         const eventDate = new Date(booking.eventDate);
//         return eventDate >= currentDate;
//       });

//       setBookings(activeBookings);
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching bookings:', err);
//       setError(t('fetchError'));
//       setBookings([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [token, t]);

//   const refreshData = useCallback(() => {
//     // Update wallet from local storage
//     setWallet(getSafeWallet());
    
//     // Fetch bookings from API
//     fetchBookings();
//   }, [getSafeWallet, fetchBookings]);

//   // Auto-refresh every 30 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       refreshData();
//     }, 30000);

//     return () => clearInterval(interval);
//   }, [refreshData]);

//   // Initial load
//   useEffect(() => {
//     refreshData();
//   }, [refreshData]);

//   const formatDate = (dateString) => {
//     const options = { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleDateString(i18n.language, options);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'approved':
//         return 'tw-text-green-600 dark:tw-text-green-400';
//       case 'pending':
//         return 'tw-text-yellow-600 dark:tw-text-yellow-400';
//       case 'rejected':
//         return 'tw-text-red-600 dark:tw-text-red-400';
//       default:
//         return 'tw-text-gray-600 dark:tw-text-gray-400';
//     }
//   };

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

//               {loading ? (
//                 <div className="w-100 my-4 tw-text-center">
//                   <div className="tw-animate-pulse tw-space-y-4">
//                     {[...Array(3)].map((_, i) => (
//                       <div key={i} className="tw-bg-gray-200 dark:tw-bg-gray-700 tw-h-24 tw-rounded-xl"></div>
//                     ))}
//                   </div>
//                 </div>
//               ) : error ? (
//                 <div className="w-100 my-4">
//                   <div className="tw-bg-red-100 dark:tw-bg-red-900 tw-p-6 tw-rounded-2xl tw-border tw-border-dashed tw-border-red-400 dark:tw-border-red-700 tw-text-center">
//                     <h4 className="tw-text-red-700 dark:tw-text-red-300 tw-text-lg sm:tw-text-xl md:tw-text-2xl tw-font-semibold">
//                       {error}
//                     </h4>
//                     <button 
//                       onClick={refreshData}
//                       className="tw-mt-4 tw-px-4 tw-py-2 tw-bg-indigo-600 tw-text-white tw-rounded-lg hover:tw-bg-indigo-700 tw-transition-colors"
//                     >
//                       {t('retry')}
//                     </button>
//                   </div>
//                 </div>
//               ) : bookings.length > 0 ? (
//                 <div className="w-100 my-4">
//                   {bookings.map((booking, index) => (
//                     <motion.div
//                       key={booking._id || index}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="tw-bg-gray-100 dark:tw-bg-gray-800 tw-p-4 tw-rounded-xl tw-mb-4 tw-border tw-border-solid tw-border-gray-300 dark:tw-border-gray-700"
//                     >
//                       <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-justify-between">
//                         <div className="tw-mb-3 md:tw-mb-0">
//                           <h4 className="tw-text-gray-800 dark:tw-text-white tw-text-lg sm:tw-text-xl md:tw-text-2xl tw-font-semibold">
//                             {booking.eventName}
//                           </h4>
//                           <p className="tw-text-gray-600 dark:tw-text-gray-300 tw-mt-1 tw-text-base sm:tw-text-lg">
//                             {t('date')}: {formatDate(booking.eventDate)}
//                           </p>
//                         </div>
//                         <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center sm:tw-gap-4">
//                           <p className="tw-text-gray-800 dark:tw-text-white tw-text-base sm:tw-text-lg">
//                             {t('amount')}: <span className="tw-font-medium">{booking.amount} EGP</span>
//                           </p>
//                           <p className={`tw-text-base sm:tw-text-lg tw-font-medium ${getStatusColor(booking.status)}`}>
//                             {t('status')}: {t(booking.status)}
//                           </p>
//                         </div>
//                       </div>
//                       <p className="tw-text-gray-600 dark:tw-text-gray-300 tw-mt-2 tw-text-base sm:tw-text-lg">
//                         {t('paymentMethod')}: {t(booking.paymentMethod)}
//                       </p>
//                     </motion.div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="w-100 my-4">
//                   <div className="tw-bg-gray-100 dark:tw-bg-gray-900 tw-p-6 tw-rounded-2xl tw-border tw-border-dashed tw-border-gray-400 dark:tw-border-gray-700 tw-text-center">
//                     <h4 className="tw-text-gray-700 dark:tw-text-gray-300 tw-text-lg sm:tw-text-xl md:tw-text-2xl lg:tw-text-3xl tw-font-semibold">
//                       {t('noBookingTitle')}
//                     </h4>
//                     <p className="tw-text-gray-600 dark:tw-text-gray-400 tw-mt-2 tw-text-base sm:tw-text-lg md:tw-text-xl lg:tw-text-2xl">
//                       {t('noBookingSubtext')}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }





// ================================================================

import React, { useContext, useEffect, useState, useCallback } from 'react';
import { darkModeContext } from '../../Context/DarkModeContext';
import styles from './Profile.module.css';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function Profile() {
  const { darkMode } = useContext(darkModeContext);
  const { i18n, t } = useTranslation('profile');
  const isRTL = i18n.language === 'ar';
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');
  
  const [wallet, setWallet] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [walletHistory, setWalletHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  const fetchWalletBalance = useCallback(async () => {
    try {
      const response = await axios.get(
        'https://ugmproject.vercel.app/api/v1/user/getMyWalletBalance',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const balance = localStorage.getItem('wallet')
      setWallet(balance || response.data.balance);
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
      setWallet(0);
    }
  }, [token]);

  const fetchWalletHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      setHistoryError(null);
      const response = await axios.get(
        'https://ugmproject.vercel.app/api/v1/user/getMyWalletHistory',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data)
      setWalletHistory(response.data.walletHistory || []);
    } catch (err) {
      console.error('Error fetching wallet history:', err);
      setHistoryError(t('historyFetchError'));
      setWalletHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [token, t]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://ugmproject.vercel.app/api/v1/user/getAllBookingsForUser',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const currentDate = new Date();
      const activeBookings = (response.data.Bookings || []).filter(booking => {
        if (!booking || !booking.eventDate) return false;
        const eventDate = new Date(booking.eventDate);
        return eventDate >= currentDate;
      });

      setBookings(activeBookings);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(t('fetchError'));
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [token, t]);

  const refreshData = useCallback(() => {
    fetchWalletBalance();
    fetchBookings();
  }, [fetchWalletBalance, fetchBookings]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData]);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleShowHistory = async () => {
    setShowHistory(true);
    await fetchWalletHistory();
  };

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

  const formatHistoryDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
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

  const getOperationColor = (operation) => {
    return operation === 'add' 
      ? 'tw-text-green-600 dark:tw-text-green-400' 
      : 'tw-text-red-600 dark:tw-text-red-400';
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
              <div className="tw-flex tw-items-center tw-gap-4 tw-flex-wrap">
                <h3 className="mt-3 fw-semibold dark:tw-text-white tw-text-lg sm:tw-text-xl md:tw-text-2xl lg:tw-text-3xl">
                  {t('balance')} <span className="fw-medium">{wallet} EGP</span>
                </h3>
                <button 
                  onClick={handleShowHistory}
                  className="tw-px-4 tw-py-2 tw-bg-indigo-600 tw-text-white tw-rounded-lg hover:tw-bg-indigo-700 tw-transition-colors tw-text-sm sm:tw-text-base"
                >
                  {t('viewHistory')}
                </button>
              </div>

              <div className={`${styles.line2} ${isRTL ? styles.line2RTL : styles.line2LTR} tw-my-3`}></div>

              <h2 className="mt-4 fw-bold dark:tw-text-white tw-text-xl sm:tw-text-2xl md:tw-text-3xl lg:tw-text-4xl">{t('bookingTitle')}</h2>

              {loading ? (
                <div className="w-100 my-4 tw-text-center">
                  <div className="tw-animate-pulse tw-space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="tw-bg-gray-200 dark:tw-bg-gray-700 tw-h-24 tw-rounded-xl"></div>
                    ))}
                  </div>
                </div>
              ) : error ? (
                <div className="w-100 my-4">
                  <div className="tw-bg-red-100 dark:tw-bg-red-900 tw-p-6 tw-rounded-2xl tw-border tw-border-dashed tw-border-red-400 dark:tw-border-red-700 tw-text-center">
                    <h4 className="tw-text-red-700 dark:tw-text-red-300 tw-text-lg sm:tw-text-xl md:tw-text-2xl tw-font-semibold">
                      {error}
                    </h4>
                    <button 
                      onClick={refreshData}
                      className="tw-mt-4 tw-px-4 tw-py-2 tw-bg-indigo-600 tw-text-white tw-rounded-lg hover:tw-bg-indigo-700 tw-transition-colors"
                    >
                      {t('retry')}
                    </button>
                  </div>
                </div>
              ) : bookings.length > 0 ? (
                <div className="w-100 my-4">
                  {bookings.map((booking, index) => (
                    <motion.div
                      key={booking._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="tw-bg-gray-100 dark:tw-bg-gray-800 tw-p-4 tw-rounded-xl tw-mb-4 tw-border tw-border-solid tw-border-gray-300 dark:tw-border-gray-700"
                    >
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
                    </motion.div>
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

      {/* Custom Wallet History Modal */}
      {showHistory && (
        <div className="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-bg-black tw-bg-opacity-50">
          <div className={`tw-relative tw-w-full tw-max-w-2xl tw-mx-4 tw-max-h-[90vh] tw-overflow-y-auto ${darkMode ? 'dark:tw-bg-gray-800 tw-text-white' : 'tw-bg-white'} tw-rounded-lg tw-shadow-xl`}>
            {/* Modal Header */}
            <div className={`tw-flex tw-justify-between tw-items-center tw-p-4 tw-border-b ${darkMode ? 'tw-border-gray-700' : 'tw-border-gray-200'}`}>
              <h3 className="tw-text-xl sm:tw-text-2xl tw-font-semibold">
                {t('walletHistoryTitle')}
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className={`tw-p-1 tw-rounded-full ${darkMode ? 'hover:tw-bg-gray-700' : 'hover:tw-bg-gray-200'}`}
              >
                <svg className="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="tw-p-4">
              {historyLoading ? (
                <div className="tw-text-center tw-py-8">
                  <div className="tw-inline-block tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-t-2 tw-border-b-2 tw-border-indigo-600"></div>
                </div>
              ) : historyError ? (
                <div className={`tw-p-4 tw-rounded-lg tw-text-center ${darkMode ? 'tw-bg-red-900' : 'tw-bg-red-100'}`}>
                  <p className={darkMode ? 'tw-text-red-300' : 'tw-text-red-700'}>{historyError}</p>
                  <button 
                    onClick={fetchWalletHistory}
                    className="tw-mt-4 tw-px-4 tw-py-2 tw-bg-indigo-600 tw-text-white tw-rounded-lg hover:tw-bg-indigo-700 tw-transition-colors"
                  >
                    {t('retry')}
                  </button>
                </div>
              ) : walletHistory.length > 0 ? (
                <div className="tw-space-y-4">
                  {walletHistory.map((item, index) => (
                    <div 
                      key={index} 
                      className={`tw-p-4 tw-rounded-lg tw-border ${darkMode ? 'tw-bg-gray-700 tw-border-gray-600' : 'tw-bg-gray-100 tw-border-gray-200'}`}
                    >
                      <div className="tw-flex tw-justify-between tw-items-start tw-gap-4">
                        <div className="tw-flex-1">
                          <div className="tw-flex tw-items-center tw-gap-2 tw-mb-2">
                            <span className={`tw-font-semibold ${getOperationColor(item.operation)}`}>
                              {item.operation === 'add' ? t('added') : t('removed')}
                            </span>
                            <span className={`tw-font-bold ${getOperationColor(item.operation)}`}>
                              {item.amount} EGP
                            </span>
                          </div>
                          <p className={`tw-text-sm ${darkMode ? 'tw-text-gray-300' : 'tw-text-gray-600'} tw-mb-2`}>
                            {item.description || t('noReasonProvided')}
                          </p>
                          <div className="tw-flex tw-flex-wrap tw-gap-x-4 tw-gap-y-2">
                            <p className={`tw-text-xs ${darkMode ? 'tw-text-gray-400' : 'tw-text-gray-500'}`}>
                              {t('date')}: {formatHistoryDate(item.createdAt)}
                            </p>
                            {item.performedBy && (
                              <p className={`tw-text-xs ${darkMode ? 'tw-text-gray-400' : 'tw-text-gray-500'}`}>
                                {t('performedBy')}: {item.performedBy.adminName}
                              </p>
                            )}
                            <p className={`tw-text-xs ${darkMode ? 'tw-text-gray-400' : 'tw-text-gray-500'}`}>
                              {t('previousBalance')}: {item.newBalance} EGP
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="tw-text-center tw-py-8">
                  <p className={darkMode ? 'tw-text-gray-400' : 'tw-text-gray-600'}>
                    {t('noHistoryFound')}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className={`tw-p-4 tw-border-t ${darkMode ? 'tw-border-gray-700' : 'tw-border-gray-200'} tw-text-right`}>
              <button
                onClick={() => setShowHistory(false)}
                className={`tw-px-4 tw-py-2 tw-rounded-lg ${darkMode ? 'tw-bg-gray-700 hover:tw-bg-gray-600 tw-text-white' : 'tw-bg-gray-200 hover:tw-bg-gray-300'} tw-transition-colors`}
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}