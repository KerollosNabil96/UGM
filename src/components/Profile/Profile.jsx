// import React, { useContext, useEffect, useState, useCallback } from 'react';
// import { darkModeContext } from '../../Context/DarkModeContext';
// import styles from './Profile.module.css'; // Keep existing custom styles
// import { motion, AnimatePresence } from 'framer-motion';
// import { useTranslation } from 'react-i18next';
// import axios from 'axios';

// // Import Heroicons for a modern look
// import { 
//   WalletIcon, 
//   TicketIcon, 
//   QrCodeIcon, 
//   ClockIcon, 
//   TrashIcon, 
//   XMarkIcon,
//   ExclamationCircleIcon,
//   ArrowPathIcon
// } from '@heroicons/react/24/solid';

// export default function Profile() {
//   const { darkMode } = useContext(darkModeContext);
//   const { i18n, t } = useTranslation('profile');
//   const isRTL = i18n.language === 'ar';
//   const userName = localStorage.getItem('userName');
//   const token = localStorage.getItem('token');
//   const userId = localStorage.getItem('Id');

//   const [wallet, setWallet] = useState(0);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showHistory, setShowHistory] = useState(false);
//   const [walletHistory, setWalletHistory] = useState([]);
//   const [historyLoading, setHistoryLoading] = useState(false);
//   const [historyError, setHistoryError] = useState(null);
//   const [clearingHistory, setClearingHistory] = useState(false);

//   const fetchWalletBalance = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         'https://ugmproject.vercel.app/api/v1/user/getMyWalletBalance',
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setWallet(response.data.balance);
//     } catch (err) {
//       console.error('Error fetching wallet balance:', err);
//       setWallet(0);
//     }
//   }, [token]);

//   const fetchWalletHistory = useCallback(async () => {
//     try {
//       setHistoryLoading(true);
//       setHistoryError(null);
//       const response = await axios.get(
//         'https://ugmproject.vercel.app/api/v1/user/getMyWalletHistory',
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setWalletHistory(response.data.walletHistory || []);
//     } catch (err) {
//       console.error('Error fetching wallet history:', err);
//       setHistoryError(t('historyFetchError'));
//       setWalletHistory([]);
//     } finally {
//       setHistoryLoading(false);
//     }
//   }, [token, t]);

//   const clearWalletHistory = async () => {
//     if (!userId) {
//       setHistoryError(t('userIdMissing'));
//       return;
//     }

//     try {
//       setClearingHistory(true);
//       await axios.patch(
//         `https://ugmproject.vercel.app/api/v1/user/clearWalletHistory/${userId}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       await fetchWalletHistory();
//     } catch (err) {
//       console.error('Error clearing wallet history:', err);
//       setHistoryError(t('clearHistoryError'));
//     } finally {
//       setClearingHistory(false);
//     }
//   };

//   const fetchBookings = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         'https://ugmproject.vercel.app/api/v1/user/getAllBookingsForUser',
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

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
//     fetchWalletBalance();
//     fetchBookings();
//   }, [fetchWalletBalance, fetchBookings]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       refreshData();
//     }, 60000);

//     return () => clearInterval(interval);
//   }, [refreshData]);

//   useEffect(() => {
//     refreshData();
//   }, [refreshData]);

//   const handleShowHistory = async () => {
//     setShowHistory(true);
//     await fetchWalletHistory();
//   };

//   const formatDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     };
//     return new Date(dateString).toLocaleDateString(i18n.language, options);
//   };

//   const formatHistoryDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
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

//   const getOperationColor = (operation) => {
//     return operation === 'add'
//       ? 'tw-text-green-600 dark:tw-text-green-400'
//       : 'tw-text-red-600 dark:tw-text-red-400';
//   };

//   return (
//     <div className={`${darkMode ? 'tw-dark' : ''}`}>
//       <div className="tw-bg-gray-50 dark:tw-bg-gray-900 tw-py-8 tw-min-h-screen tw-font-sans">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="tw-container tw-mx-auto tw-px-4 md:tw-px-6 lg:tw-px-8"
//         >
//           {/* Main Profile Card */}
//           <div className="tw-max-w-4xl tw-mx-auto tw-bg-white dark:tw-bg-gray-800 tw-rounded-2xl tw-shadow-2xl tw-p-6 md:tw-p-10 tw-border tw-border-gray-200 dark:tw-border-gray-700">
//             <h1 className="text-center mainColor dark:tw-text-indigo-600 mt-2 fw-bolder">
//               {t('title')} 
//             </h1>
//             <p className="tw-text-center tw-text-gray-600 dark:tw-text-gray-300 tw-mb-8 tw-text-base md:tw-text-lg">
//               {t('description')}
//             </p>

//             {/* User Info Section */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.2, duration: 0.8 }}
//               className="tw-border-b tw-border-gray-200 dark:tw-border-gray-700 tw-pb-6 tw-mb-6"
//             >
//               <h2 className="tw-text-xl sm:tw-text-2xl tw-font-bold tw-text-gray-900 dark:tw-text-white">
//                 {t('hello')}, <span className="mainColor dark:tw-text-indigo-600">{userName}</span>!
//               </h2>
//               <p className="tw-text-gray-500 dark:tw-text-gray-400 tw-text-base md:tw-text-lg">{t('niceDay')}</p>
//             </motion.div>

//             {/* Wallet Section */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4, duration: 0.8 }}
//               className="tw-bg-gray-100 dark:tw-bg-gray-700 tw-rounded-xl tw-p-5 tw-mb-6 tw-flex tw-items-center tw-justify-between"
//             >
//               <div className="tw-flex tw-items-center tw-gap-4">
//                 <WalletIcon className="tw-h-10 tw-w-10 mainColor dark:tw-text-indigo-600" />
//                 <div>
//                   <h3 className="tw-text-lg tw-font-medium tw-text-gray-900 dark:tw-text-white">{t('walletTitle')}</h3>
//                   <p className="tw-text-2xl tw-font-bold tw-text-gray-800 dark:tw-text-gray-200">
//                     {wallet} EGP
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={handleShowHistory}
//                 className="tw-px-4 tw-py-2 tw-bg-indigo-600 tw-text-white tw-rounded-full hover:tw-bg-indigo-700 tw-transition-all tw-duration-300 tw-flex tw-items-center tw-gap-2 tw-text-sm md:tw-text-base tw-shadow-md hover:tw-shadow-lg"
//               >
//                 <ClockIcon className="tw-h-5 tw-w-5 " /> {t('viewHistory')}
//               </button>
//             </motion.div>

//             {/* QR Code Section */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.6, duration: 0.8 }}
//               className="tw-bg-gray-100 dark:tw-bg-gray-700 tw-rounded-xl tw-p-5 tw-mb-6 tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-gap-6"
//             >
//               <div className="tw-flex-shrink-0">
//                 <QrCodeIcon className="tw-h-12 tw-w-12 mainColor dark:tw-text-indigo-600 tw-mb-2 md:tw-mb-0" />
//               </div>
//               <div className="tw-flex-1 tw-text-center md:tw-text-start">
//                 <h3 className="tw-text-lg tw-font-medium tw-text-gray-900 dark:tw-text-white">{t('qrCodeTitle')}</h3>
//                 <p className="tw-text-gray-600 dark:tw-text-gray-300 tw-text-sm md:tw-text-base tw-mt-1">
//                   {t('qrCodeDescription')}
//                 </p>
//               </div>
//               <img
//                 src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=UGM-USER-STATIC-QR-CODE"
//                 alt="QR Code"
//                 className="tw-w-32 tw-h-32 tw-border-4 tw-border-white dark:tw-border-gray-800 tw-rounded-lg tw-shadow-md"
//               />
//             </motion.div>

//             {/* Bookings Section */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.8, duration: 0.8 }}
//               className="tw-mt-6"
//             >
//               <div className="tw-flex tw-items-center tw-gap-3 tw-mb-4">
//                 <TicketIcon className="tw-h-8 tw-w-8 mainColor dark:tw-text-indigo-600" />
//                 <h2 className="tw-text-xl sm:tw-text-2xl tw-font-bold tw-text-gray-900 dark:tw-text-white">{t('bookingTitle')}</h2>
//               </div>

//               {loading ? (
//                 <div className="w-100 tw-my-4 tw-text-center">
//                   <div className="tw-animate-pulse tw-space-y-4">
//                     {[...Array(3)].map((_, i) => (
//                       <div key={i} className="tw-bg-gray-200 dark:tw-bg-gray-700 tw-h-20 tw-rounded-xl"></div>
//                     ))}
//                   </div>
//                 </div>
//               ) : error ? (
//                 <div className="w-100 tw-my-4">
//                   <div className="tw-bg-red-100 dark:tw-bg-red-900 tw-p-6 tw-rounded-2xl tw-border tw-border-dashed tw-border-red-400 dark:tw-border-red-700 tw-text-center tw-flex tw-flex-col tw-items-center">
//                     <ExclamationCircleIcon className="tw-h-12 tw-w-12 tw-text-red-600 dark:tw-text-red-400 tw-mb-4" />
//                     <h4 className="tw-text-red-700 dark:tw-text-red-300 tw-text-lg sm:tw-text-xl tw-font-semibold">
//                       {error}
//                     </h4>
//                     <button
//                       onClick={refreshData}
//                       className="tw-mt-4 tw-px-6 tw-py-2 tw-bg-indigo-600 tw-text-white tw-rounded-lg hover:tw-bg-indigo-700 tw-transition-colors"
//                     >
//                       <ArrowPathIcon className="tw-w-4 tw-h-4 tw-inline-block ltr:tw-mr-2 rtl:tw-ml-2" />
//                       {t('retry')}
//                     </button>
//                   </div>
//                 </div>
//               ) : bookings.length > 0 ? (
//                 <div className="w-100 tw-my-4 tw-space-y-4">
//                   <AnimatePresence>
//                     {bookings.map((booking, index) => (
//                       <motion.div
//                         key={booking._id || index}
//                         initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
//                         transition={{ duration: 0.3 }}
//                         className="tw-bg-gray-50 dark:tw-bg-gray-700 tw-p-5 tw-rounded-xl tw-border tw-border-solid tw-border-gray-200 dark:tw-border-gray-600 tw-shadow-sm hover:tw-shadow-md tw-transition-all tw-duration-300"
//                       >
//                         <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-justify-between">
//                           <div className="tw-mb-3 md:tw-mb-0">
//                             <h4 className="tw-text-gray-900 dark:tw-text-white tw-text-lg sm:tw-text-xl tw-font-semibold">
//                               {booking.eventName}
//                             </h4>
//                             <p className="tw-text-gray-600 dark:tw-text-gray-300 tw-mt-1 tw-text-sm sm:tw-text-base">
//                               {t('date')}: <span className="tw-font-medium">{formatDate(booking.eventDate)}</span>
//                             </p>
//                           </div>
//                           <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center sm:tw-gap-4">
//                             <p className="tw-text-gray-800 dark:tw-text-white tw-text-sm sm:tw-text-base">
//                               {t('amount')}: <span className="tw-font-bold">{booking.amount} EGP</span>
//                             </p>
//                             <span
//                               className={`tw-text-sm sm:tw-text-base tw-font-bold tw-px-3 tw-py-1 tw-rounded-full tw-text-white ${
//                                 booking.status === 'approved'
//                                   ? 'tw-bg-green-500'
//                                   : booking.status === 'pending'
//                                   ? 'tw-bg-yellow-500'
//                                   : 'tw-bg-red-500'
//                               }`}
//                             >
//                               {t(booking.status)}
//                             </span>
//                           </div>
//                         </div>
//                         <p className="tw-text-gray-500 dark:tw-text-gray-400 tw-mt-2 tw-text-xs sm:tw-text-sm">
//                           {t('paymentMethod')}: {t(booking.paymentMethod)}
//                         </p>
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>
//                 </div>
//               ) : (
//                 <div className="w-100 tw-my-4">
//                   <div className="tw-bg-gray-100 dark:tw-bg-gray-900 tw-p-6 tw-rounded-2xl tw-border tw-border-dashed tw-border-gray-400 dark:tw-border-gray-700 tw-text-center">
//                     <h4 className="tw-text-gray-700 dark:tw-text-gray-300 tw-text-lg sm:tw-text-xl tw-font-semibold">
//                       {t('noBookingTitle')}
//                     </h4>
//                     <p className="tw-text-gray-600 dark:tw-text-gray-400 tw-mt-2 tw-text-sm sm:tw-text-base">
//                       {t('noBookingSubtext')}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Custom Wallet History Modal */}
//       <AnimatePresence>
//         {showHistory && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-bg-black tw-bg-opacity-50 tw-p-4"
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//               className={`tw-relative tw-w-full tw-max-w-2xl tw-mx-auto tw-max-h-[90vh] tw-overflow-y-auto ${
//                 darkMode ? 'dark:tw-bg-gray-800 tw-text-white' : 'tw-bg-white'
//               } tw-rounded-2xl tw-shadow-2xl`}
//             >
//               {/* Modal Header */}
//               <div
//                 className={`tw-flex tw-justify-between tw-items-center tw-p-6 tw-border-b ${
//                   darkMode ? 'tw-border-gray-700' : 'tw-border-gray-200'
//                 }`}
//               >
//                 <h3 className="tw-text-xl sm:tw-text-2xl tw-font-semibold">
//                   {t('walletHistoryTitle')}
//                 </h3>
//                 <button
//                   onClick={() => setShowHistory(false)}
//                   className={`tw-p-2 tw-rounded-full ${darkMode ? 'hover:tw-bg-gray-700' : 'hover:tw-bg-gray-200'}`}
//                 >
//                   <XMarkIcon className="tw-w-6 tw-h-6" />
//                 </button>
//               </div>

//               {/* Modal Body */}
//               <div className="tw-p-6">
//                 {historyLoading ? (
//                   <div className="tw-text-center tw-py-8">
//                     <div className="tw-inline-block tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-4 tw-border-t-indigo-600 tw-border-indigo-200"></div>
//                   </div>
//                 ) : historyError ? (
//                   <div className={`tw-p-4 tw-rounded-lg tw-text-center tw-flex tw-flex-col tw-items-center ${darkMode ? 'tw-bg-red-900' : 'tw-bg-red-100'}`}>
//                     <ExclamationCircleIcon className="tw-h-12 tw-w-12 tw-text-red-600 dark:tw-text-red-400 tw-mb-4" />
//                     <p className={darkMode ? 'tw-text-red-300' : 'tw-text-red-700'}>{historyError}</p>
//                     <button
//                       onClick={fetchWalletHistory}
//                       className="tw-mt-4 tw-px-4 tw-py-2 tw-bg-indigo-600 tw-text-white tw-rounded-lg hover:tw-bg-indigo-700 tw-transition-colors"
//                     >
//                        <ArrowPathIcon className="tw-w-4 tw-h-4 tw-inline-block ltr:tw-mr-2 rtl:tw-ml-2" />
//                       {t('retry')}
//                     </button>
//                   </div>
//                 ) : walletHistory.length > 0 ? (
//                   <div className="tw-space-y-4">
//                     {walletHistory.map((item, index) => (
//                       <div
//                         key={index}
//                         className={`tw-p-4 tw-rounded-lg tw-border ${
//                           darkMode ? 'tw-bg-gray-700 tw-border-gray-600' : 'tw-bg-gray-100 tw-border-gray-200'
//                         }`}
//                       >
//                         <div className="tw-flex tw-justify-between tw-items-start tw-gap-4">
//                           <div className="tw-flex-1">
//                             <div className="tw-flex tw-items-center tw-gap-2 tw-mb-2">
//                               <span className={`tw-font-semibold tw-text-lg ${getOperationColor(item.operation)}`}>
//                                 {item.operation === 'add' ? `+ ${item.amount} EGP` : `- ${item.amount} EGP`}
//                               </span>
//                             </div>
//                             <p className={`tw-text-sm ${darkMode ? 'tw-text-gray-300' : 'tw-text-gray-600'} tw-mb-2`}>
//                               {item.description || t('noReasonProvided')}
//                             </p>
//                             <div className="tw-flex tw-flex-wrap tw-gap-x-4 tw-gap-y-1 tw-text-xs">
//                               <p className={darkMode ? 'tw-text-gray-400' : 'tw-text-gray-500'}>
//                                 <span className="tw-font-medium">{t('date')}:</span> {formatHistoryDate(item.createdAt)}
//                               </p>
//                               {item.performedBy?.adminName && item.performedBy.adminName.trim() !== '' && (
//                                 <p className={darkMode ? 'tw-text-gray-400' : 'tw-text-gray-500'}>
//                                   <span className="tw-font-medium">{t('performedBy')}:</span> {item.performedBy.adminName}
//                                 </p>
//                               )}
//                               <p className={darkMode ? 'tw-text-gray-400' : 'tw-text-gray-500'}>
//                                 <span className="tw-font-medium">{t('previousBalance')}:</span> {item.previousBalance} EGP
//                               </p>
//                               <p className={darkMode ? 'tw-text-gray-400' : 'tw-text-gray-500'}>
//                                 <span className="tw-font-medium">{t('newBalance')}:</span> {item.newBalance} EGP
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="tw-text-center tw-py-8">
//                     <p className={darkMode ? 'tw-text-gray-400' : 'tw-text-gray-600'}>
//                       {t('noHistoryFound')}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Modal Footer */}
//               <div className={`tw-sticky tw-bottom-0 tw-p-6 tw-border-t ${darkMode ? 'tw-border-gray-700' : 'tw-border-gray-200'} tw-flex tw-justify-between tw-bg-white dark:tw-bg-gray-800`}>
//                 {walletHistory.length > 0 && (
//                   <button
//                     onClick={clearWalletHistory}
//                     disabled={clearingHistory || !userId}
//                     className={`tw-px-4 tw-py-2 tw-rounded-lg tw-flex tw-items-center tw-gap-2 ${
//                       darkMode ? 'tw-bg-red-700 hover:tw-bg-red-600 tw-text-white' : 'tw-bg-red-600 hover:tw-bg-red-500 tw-text-white'
//                     } tw-transition-colors ${clearingHistory ? 'tw-opacity-70' : ''} ${!userId ? 'tw-opacity-50 tw-cursor-not-allowed' : ''}`}
//                     title={!userId ? t('userIdMissing') : ''}
//                   >
//                     {clearingHistory ? (
//                       <>
//                         <svg className="tw-animate-spin tw-h-4 tw-w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="tw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="tw-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         {t('clearing')}
//                       </>
//                     ) : (
//                       <>
//                         <TrashIcon className="tw-h-4 tw-w-4" />
//                         {t('clearHistory')}
//                       </>
//                     )}
//                   </button>
//                 )}
//                 <button
//                   onClick={() => setShowHistory(false)}
//                   className={`tw-px-4 tw-py-2 tw-rounded-lg tw-transition-colors ${
//                     darkMode ? 'tw-bg-gray-700 hover:tw-bg-gray-600 tw-text-white' : 'tw-bg-gray-200 hover:tw-bg-gray-300 tw-text-gray-800'
//                   }`}
//                 >
//                   {t('close')}
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }











// ================================================================



import React, { useContext, useEffect, useState, useCallback } from 'react';
import { darkModeContext } from '../../Context/DarkModeContext';
import styles from './Profile.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import QRCode from 'qrcode';

// Import Heroicons for a modern look
import { 
  WalletIcon, 
  TicketIcon, 
  QrCodeIcon, 
  ClockIcon, 
  TrashIcon, 
  XMarkIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  UserIcon
} from '@heroicons/react/24/solid';

export default function Profile() {
  const { darkMode } = useContext(darkModeContext);
  const { i18n, t } = useTranslation('profile');
  const isRTL = i18n.language === 'ar';
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('Id');

  const [wallet, setWallet] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [walletHistory, setWalletHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [clearingHistory, setClearingHistory] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // إنشاء بيانات المستخدم لـ QR Code (فقط userId و userName)
  const userQrData = userId && userName 
    ? JSON.stringify({ userId, userName })
    : null;

  useEffect(() => {
    if (userQrData) {
      const generateQrCode = async () => {
        try {
          const url = await QRCode.toDataURL(userQrData, {
            width: 150,
            margin: 2,
            color: {
              dark: darkMode ? '#4f46e5' : '#3730a3',
              light: darkMode ? '#1f2937' : '#ffffff'
            }
          });
          setQrCodeUrl(url);
        } catch (err) {
          console.error('Error generating QR code:', err);
          // استخدام صورة بديلة إذا فشل إنشاء QR code
          setQrCodeUrl('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2YzZjRmNSIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==');
        }
      };
      
      generateQrCode();
    }
  }, [userQrData, darkMode]);

  const fetchWalletBalance = useCallback(async () => {
    try {
      const response = await axios.get(
        'https://ugmproject.vercel.app/api/v1/user/getMyWalletBalance',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWallet(response.data.balance);
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
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWalletHistory(response.data.walletHistory || []);
    } catch (err) {
      console.error('Error fetching wallet history:', err);
      setHistoryError(t('historyFetchError'));
      setWalletHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [token, t]);

  const clearWalletHistory = async () => {
    if (!userId) {
      setHistoryError(t('userIdMissing'));
      return;
    }

    try {
      setClearingHistory(true);
      await axios.patch(
        `https://ugmproject.vercel.app/api/v1/user/clearWalletHistory/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchWalletHistory();
    } catch (err) {
      console.error('Error clearing wallet history:', err);
      setHistoryError(t('clearHistoryError'));
    } finally {
      setClearingHistory(false);
    }
  };

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://ugmproject.vercel.app/api/v1/user/getAllBookingsForUser',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 60000);

    return () => clearInterval(interval);
  }, [refreshData]);

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
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(i18n.language, options);
  };

  const formatHistoryDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
      <div className="tw-bg-gray-50 dark:tw-bg-gray-900 tw-py-8 tw-min-h-screen tw-font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="tw-container tw-mx-auto tw-px-4 md:tw-px-6 lg:tw-px-8"
        >
          {/* Main Profile Card */}
          <div className="tw-max-w-4xl tw-mx-auto tw-bg-white dark:tw-bg-gray-800 tw-rounded-2xl tw-shadow-2xl tw-p-6 md:tw-p-10 tw-border tw-border-gray-200 dark:tw-border-gray-700">
            <h1 className="text-center mainColor dark:tw-text-indigo-600 mt-2 fw-bolder">
              {t('title')} 
            </h1>
            <p className="tw-text-center tw-text-gray-600 dark:tw-text-gray-300 tw-mb-8 tw-text-base md:tw-text-lg">
              {t('description')}
            </p>

            {/* User Info Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="tw-border-b tw-border-gray-200 dark:tw-border-gray-700 tw-pb-6 tw-mb-6"
            >
              <h2 className="tw-text-xl sm:tw-text-2xl tw-font-bold tw-text-gray-900 dark:tw-text-white">
                {t('hello')}, <span className="mainColor dark:tw-text-indigo-600">{userName}</span>!
              </h2>
              <p className="tw-text-gray-500 dark:tw-text-gray-400 tw-text-base md:tw-text-lg">{t('niceDay')}</p>
            </motion.div>

            {/* Wallet Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="tw-bg-gray-100 dark:tw-bg-gray-700 tw-rounded-xl tw-p-5 tw-mb-6 tw-flex tw-items-center tw-justify-between"
            >
              <div className="tw-flex tw-items-center tw-gap-4">
                <WalletIcon className="tw-h-10 tw-w-10 mainColor dark:tw-text-indigo-600" />
                <div>
                  <h3 className="tw-text-lg tw-font-medium tw-text-gray-900 dark:tw-text-white">{t('walletTitle')}</h3>
                  <p className="tw-text-2xl tw-font-bold tw-text-gray-800 dark:tw-text-gray-200">
                    {wallet} EGP
                  </p>
                </div>
              </div>
              <button
                onClick={handleShowHistory}
                className="tw-px-4 tw-py-2 tw-bg-indigo-600 tw-text-white tw-rounded-full hover:tw-bg-indigo-700 tw-transition-all tw-duration-300 tw-flex tw-items-center tw-gap-2 tw-text-sm md:tw-text-base tw-shadow-md hover:tw-shadow-lg"
              >
                <ClockIcon className="tw-h-5 tw-w-5 " /> {t('viewHistory')}
              </button>
            </motion.div>

            {/* QR Code Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="tw-bg-gray-100 dark:tw-bg-gray-700 tw-rounded-xl tw-p-5 tw-mb-6 tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-gap-6"
            >
              <div className="tw-flex-shrink-0">
                <QrCodeIcon className="tw-h-12 tw-w-12 mainColor dark:tw-text-indigo-600 tw-mb-2 md:tw-mb-0" />
              </div>
              <div className="tw-flex-1 tw-text-center md:tw-text-start">
                <h3 className="tw-text-lg tw-font-medium tw-text-gray-900 dark:tw-text-white">{t('qrCodeTitle')}</h3>
                <p className="tw-text-gray-600 dark:tw-text-gray-300 tw-text-sm md:tw-text-base tw-mt-1">
                  {t('qrCodeDescription')}
                </p>
                <div className="tw-mt-3 tw-flex tw-items-center tw-justify-center md:tw-justify-start">
                  <UserIcon className="tw-h-4 tw-w-4 tw-mr-2 mainColor dark:tw-text-indigo-400" />
                  <span className="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">
                    ID: {userId} | Name: {userName}
                  </span>
                </div>
              </div>
              {qrCodeUrl ? (
                <div className="tw-flex tw-flex-col tw-items-center">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="tw-w-32 tw-h-32 tw-border-4 tw-border-white dark:tw-border-gray-800 tw-rounded-lg tw-shadow-md"
                  />
                  <p className="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400 tw-mt-2">
                    {t('scanForAttendance')}
                  </p>
                </div>
              ) : (
                <div className="tw-w-32 tw-h-32 tw-flex tw-items-center tw-justify-center tw-bg-gray-200 dark:tw-bg-gray-600 tw-rounded-lg">
                  <p className="tw-text-xs tw-text-center tw-text-gray-500 dark:tw-text-gray-400">
                    {t('noUserData')}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Bookings Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="tw-mt-6"
            >
              <div className="tw-flex tw-items-center tw-gap-3 tw-mb-4">
                <TicketIcon className="tw-h-8 tw-w-8 mainColor dark:tw-text-indigo-600" />
                <h2 className="tw-text-xl sm:tw-text-2xl tw-font-bold tw-text-gray-900 dark:tw-text-white">{t('bookingTitle')}</h2>
              </div>

              {loading ? (
                <div className="w-100 tw-my-4 tw-text-center">
                  <div className="tw-animate-pulse tw-space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="tw-bg-gray-200 dark:tw-bg-gray-700 tw-h-20 tw-rounded-xl"></div>
                    ))}
                  </div>
                </div>
              ) : error ? (
                <div className="w-100 tw-my-4">
                  <div className="tw-bg-red-100 dark:tw-bg-red-900 tw-p-6 tw-rounded-2xl tw-border tw-border-dashed tw-border-red-400 dark:tw-border-red-700 tw-text-center tw-flex tw-flex-col tw-items-center">
                    <ExclamationCircleIcon className="tw-h-12 tw-w-12 tw-text-red-600 dark:tw-text-red-400 tw-mb-4" />
                    <h4 className="tw-text-red-700 dark:tw-text-red-300 tw-text-lg sm:tw-text-xl tw-font-semibold">
                      {error}
                    </h4>
                    <button
                      onClick={refreshData}
                      className="tw-mt-4 tw-px-6 tw-py-2 tw-bg-indigo-600 tw-text-white tw-rounded-lg hover:tw-bg-indigo-700 tw-transition-colors"
                    >
                      <ArrowPathIcon className="tw-w-4 tw-h-4 tw-inline-block ltr:tw-mr-2 rtl:tw-ml-2" />
                      {t('retry')}
                    </button>
                  </div>
                </div>
              ) : bookings.length > 0 ? (
                <div className="w-100 tw-my-4 tw-space-y-4">
                  <AnimatePresence>
                    {bookings.map((booking, index) => (
                      <motion.div
                        key={booking._id || index}
                        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                        transition={{ duration: 0.3 }}
                        className="tw-bg-gray-50 dark:tw-bg-gray-700 tw-p-5 tw-rounded-xl tw-border tw-border-solid tw-border-gray-200 dark:tw-border-gray-600 tw-shadow-sm hover:tw-shadow-md tw-transition-all tw-duration-300"
                      >
                        <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-justify-between">
                          <div className="tw-mb-3 md:tw-mb-0">
                            <h4 className="tw-text-gray-900 dark:tw-text-white tw-text-lg sm:tw-text-xl tw-font-semibold">
                              {booking.eventName}
                            </h4>
                            <p className="tw-text-gray-600 dark:tw-text-gray-300 tw-mt-1 tw-text-sm sm:tw-text-base">
                              {t('date')}: <span className="tw-font-medium">{formatDate(booking.eventDate)}</span>
                            </p>
                          </div>
                          <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center sm:tw-gap-4">
                            <p className="tw-text-gray-800 dark:tw-text-white tw-text-sm sm:tw-text-base">
                              {t('amount')}: <span className="tw-font-bold">{booking.amount} EGP</span>
                            </p>
                            <span
                              className={`tw-text-sm sm:tw-text-base tw-font-bold tw-px-3 tw-py-1 tw-rounded-full tw-text-white ${
                                booking.status === 'approved'
                                  ? 'tw-bg-green-500'
                                  : booking.status === 'pending'
                                  ? 'tw-bg-yellow-500'
                                  : 'tw-bg-red-500'
                              }`}
                            >
                              {t(booking.status)}
                            </span>
                          </div>
                        </div>
                        <p className="tw-text-gray-500 dark:tw-text-gray-400 tw-mt-2 tw-text-xs sm:tw-text-sm">
                          {t('paymentMethod')}: {t(booking.paymentMethod)}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="w-100 tw-my-4">
                  <div className="tw-bg-gray-100 dark:tw-bg-gray-900 tw-p-6 tw-rounded-2xl tw-border tw-border-dashed tw-border-gray-400 dark:tw-border-gray-700 tw-text-center">
                    <h4 className="tw-text-gray-700 dark:tw-text-gray-300 tw-text-lg sm:tw-text-xl tw-font-semibold">
                      {t('noBookingTitle')}
                    </h4>
                    <p className="tw-text-gray-600 dark:tw-text-gray-400 tw-mt-2 tw-text-sm sm:tw-text-base">
                      {t('noBookingSubtext')}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Custom Wallet History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-bg-black tw-bg-opacity-50 tw-p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`tw-relative tw-w-full tw-max-w-2xl tw-mx-auto tw-max-h-[90vh] tw-overflow-y-auto ${
                darkMode ? 'dark:tw-bg-gray-800 tw-text-white' : 'tw-bg-white'
              } tw-rounded-2xl tw-shadow-2xl`}
            >
              {/* Modal Header */}
              <div
                className={`tw-flex tw-justify-between tw-items-center tw-p-6 tw-border-b ${
                  darkMode ? 'tw-border-gray-700' : 'tw-border-gray-200'
                }`}
              >
                <h3 className="tw-text-xl sm:tw-text-2xl tw-font-semibold">
                  {t('walletHistoryTitle')}
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className={`tw-p-2 tw-rounded-full ${darkMode ? 'hover:tw-bg-gray-700' : 'hover:tw-bg-gray-200'}`}
                >
                  <XMarkIcon className="tw-w-6 tw-h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="tw-p-6">
                {historyLoading ? (
                  <div className="tw-text-center tw-py-8">
                    <div className="tw-inline-block tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-4 tw-border-t-indigo-600 tw-border-indigo-200"></div>
                  </div>
                ) : historyError ? (
                  <div className={`tw-p-4 tw-rounded-lg tw-text-center tw-flex tw-flex-col tw-items-center ${darkMode ? 'tw-bg-red-900' : 'tw-bg-red-100'}`}>
                    <ExclamationCircleIcon className="tw-h-12 tw-w-12 tw-text-red-600 dark:tw-text-red-400 tw-mb-4" />
                    <p className={darkMode ? 'tw-text-red-300' : 'tw-text-red-700'}>{historyError}</p>
                    <button
                      onClick={fetchWalletHistory}
                      className="tw-mt-4 tw-px-4 tw-py-2 tw-bg-indigo-600 tw-text-white tw-rounded-lg hover:tw-bg-indigo-700 tw-transition-colors"
                    >
                       <ArrowPathIcon className="tw-w-4 tw-h-4 tw-inline-block ltr:tw-mr-2 rtl:tw-ml-2" />
                      {t('retry')}
                    </button>
                  </div>
                ) : walletHistory.length > 0 ? (
                  <div className="tw-space-y-4">
                    {walletHistory.map((item, index) => (
                      <div
                        key={index}
                        className={`tw-p-4 tw-rounded-lg tw-border ${
                          darkMode ? 'tw-bg-gray-700 tw-border-gray-600' : 'tw-bg-gray-100 tw-border-gray-200'
                        }`}
                      >
                        <div className="tw-flex tw-justify-between tw-items-start tw-gap-4">
                          <div className="tw-flex-1">
                            <div className="tw-flex tw-items-center tw-gap-2 tw-mb-2">
                              <span className={`tw-font-semibold tw-text-lg ${getOperationColor(item.operation)}`}>
                                {item.operation === 'add' ? `+ ${item.amount} EGP` : `- ${item.amount} EGP`}
                              </span>
                            </div>
                            <p className={`tw-text-sm ${darkMode ? 'tw-text-gray-300' : 'tw-text-gray-600'} tw-mb-2`}>
                              {item.description || t('noReasonProvided')}
                            </p>
                            <div className="tw-flex tw-flex-wrap tw-gap-x-4 tw-gap-y-1 tw-text-xs">
                              <p className={darkMode ? 'tw-text-gray-400' : 'tw-text-gray-500'}>
                                <span className="tw-font-medium">{t('date')}:</span> {formatHistoryDate(item.createdAt)}
                              </p>
                              {item.performedBy?.adminName && item.performedBy.adminName.trim() !== '' && (
                                <p className={darkMode ? 'tw-text-gray-400' : 'tw-text-gray-500'}>
                                  <span className="tw-font-medium">{t('performedBy')}:</span> {item.performedBy.adminName}
                                </p>
                              )}
                              <p className={darkMode ? 'tw-text-gray-400' : 'tw-text-gray-500'}>
                                <span className="tw-font-medium">{t('previousBalance')}:</span> {item.previousBalance} EGP
                              </p>
                              <p className={darkMode ? 'tw-text-gray-400' : 'tw-text-gray-500'}>
                                <span className="tw-font-medium">{t('newBalance')}:</span> {item.newBalance} EGP
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
              <div className={`tw-sticky tw-bottom-0 tw-p-6 tw-border-t ${darkMode ? 'tw-border-gray-700' : 'tw-border-gray-200'} tw-flex tw-justify-between tw-bg-white dark:tw-bg-gray-800`}>
                {walletHistory.length > 0 && (
                  <button
                    onClick={clearWalletHistory}
                    disabled={clearingHistory || !userId}
                    className={`tw-px-4 tw-py-2 tw-rounded-lg tw-flex tw-items-center tw-gap-2 ${
                      darkMode ? 'tw-bg-red-700 hover:tw-bg-red-600 tw-text-white' : 'tw-bg-red-600 hover:tw-bg-red-500 tw-text-white'
                    } tw-transition-colors ${clearingHistory ? 'tw-opacity-70' : ''} ${!userId ? 'tw-opacity-50 tw-cursor-not-allowed' : ''}`}
                    title={!userId ? t('userIdMissing') : ''}
                  >
                    {clearingHistory ? (
                      <>
                        <svg className="tw-animate-spin tw-h-4 tw-w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="tw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="tw-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('clearing')}
                      </>
                    ) : (
                      <>
                        <TrashIcon className="tw-h-4 tw-w-4" />
                        {t('clearHistory')}
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => setShowHistory(false)}
                  className={`tw-px-4 tw-py-2 tw-rounded-lg tw-transition-colors ${
                    darkMode ? 'tw-bg-gray-700 hover:tw-bg-gray-600 tw-text-white' : 'tw-bg-gray-200 hover:tw-bg-gray-300 tw-text-gray-800'
                  }`}
                >
                  {t('close')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}