// import React, { useEffect, useState, useContext } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import axios from 'axios';
// import {
//   FaWallet,
//   FaPaperPlane,
//   FaArrowLeft,
//   FaTimes,
//   FaClock,
//   FaCheck,
//   FaUser,
// } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';
// import { darkModeContext } from '../../Context/DarkModeContext';
// import { useTranslation } from 'react-i18next';

// export default function EventBooking() {
//   const { darkMode } = useContext(darkModeContext);
//   const { t, i18n } = useTranslation('eventBooking');
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isRTL = i18n.language === 'ar';

//   const [event, setEvent] = useState(null);
//   const [activeModal, setActiveModal] = useState(null);
//   const [responsible, setResponsible] = useState('');
//   const [screenshot, setScreenshot] = useState(null);
//   const [sending, setSending] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const wallet = parseFloat(localStorage.getItem('wallet')) || 0;
//   const token = localStorage.getItem('token');
//   const Id = localStorage.getItem('Id');
//   const userName = localStorage.getItem('userName');

//   const displayFileName = (name) => {
//     if (name.length > 24) {
//       return `${name.substring(0, 10)}...${name.substring(name.length - 10)}`;
//     }
//     return name;
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   useEffect(() => {
//     if (!Id) {
//       toast.error(t('eventBooking.userIdMissing'));
//       navigate('/login');
//     }
//   }, [Id, navigate, t]);

//   const fetchEvent = async () => {
//     if (!Id) return;

//     try {
//       const res = await axios.get(
//         `https://ugmproject.vercel.app/api/v1/event/getEventById/${id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setEvent(res.data.event);
//     } catch (err) {
//       toast.error(t('eventBooking.fetchError'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvent();
//   }, [id]);

//   const handleWalletBooking = async () => {
//     if (!Id) {
//       toast.error(t('eventBooking.userIdMissing'));
//       return;
//     }

//     const price = parseFloat(event.price);

//     if (wallet < price) {
//       toast.error(t('eventBooking.walletError'));
//       return;
//     }

//     try {
//       // 1. Update wallet
//       const walletResponse = await axios.put(
//         `https://ugmproject.vercel.app/api/v1/user/updateWallet/${Id}`,
//         {
//           amount: price,
//           operation: 'remove',
//           description: `Booking for event: ${event.eventName}`,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // 2. Create booking
//       const bookingData = {
//         eventId: event._id,
//         eventName: event.eventName,
//         price: price.toString(),
//         userName,
//       };

//       const bookingResponse = await axios.post(
//         'https://ugmproject.vercel.app/api/v1/booking/bookingByWallet',
//         bookingData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       // Log the response from the booking API
//       console.log('Booking API Response:', bookingResponse.data);

//       // 3. Update local wallet balance
//       const newWalletBalance = wallet - price;
//       localStorage.setItem('wallet', newWalletBalance.toString());

//       toast.success(t('eventBooking.walletSuccess'));
//       navigate('/events');
//     } catch (err) {
//       console.error('Booking API Error:', err.response?.data);
//       toast.error(err.response?.data?.err || t('eventBooking.bookingError'));
//     }
//   };

//   const handleUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith('image/')) {
//       setScreenshot(file);
//     } else {
//       toast.error(t('eventBooking.invalidFile'));
//     }
//   };

//   const handleSubmitProof = async () => {
//     if (!Id) {
//       toast.error(t('eventBooking.userIdMissing'));
//       return;
//     }

//     if (!screenshot || !responsible) {
//       toast.error(t('eventBooking.requiredFields'));
//       return;
//     }

//     setSending(true);

//     try {
//       const formData = {
//         eventId: event._id,
//         userId: Id,
//         userName,
//         eventName: event.eventName,
//         price: event.price,
//         paymentMethod: 'proof',
//         responsiblePerson: responsible,
//         status: 'pending',
//         screenshot: screenshot.name,
//       };

//       console.log('Proof submission data:', formData);

//       toast.success(t('eventBooking.proofSuccess'));
//       navigate('/events');
//     } catch (err) {
//       console.error('Proof Submission Error:', err.response?.data);
//       toast.error(err.response?.data?.message || t('eventBooking.bookingError'));
//     } finally {
//       setSending(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div
//         className={`${
//           darkMode ? 'tw-dark' : ''
//         } tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-white dark:tw-bg-gray-800 tw-z-50`}
//       >
//         <div className="tw-w-12 tw-h-12 tw-border-4 tw-border-blue-500 tw-border-t-transparent tw-rounded-full tw-animate-spin"></div>
//       </div>
//     );
//   }

//   if (!event) {
//     return (
//       <div
//         className={`${
//           darkMode ? 'tw-dark' : ''
//         } tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-white dark:tw-bg-gray-800`}
//       >
//         <div className="tw-text-center">
//           <p className="tw-text-lg tw-text-gray-700 dark:tw-text-gray-300">
//             {t('eventBooking.eventNotFound')}
//           </p>
//           <button
//             onClick={() => navigate('/events')}
//             className="tw-mt-4 tw-px-4 tw-py-2 tw-bg-blue-600 tw-text-white tw-rounded-lg hover:tw-bg-blue-700"
//           >
//             {t('eventBooking.backToEvents')}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const handleBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div className={`${darkMode ? 'tw-dark' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
//       <div className="container-fluid dark:tw-bg-gray-800 tw-min-h-[80vh]">
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.6 }}
//           className="tw-container tw-max-w-3xl tw-mx-auto tw-p-6 tw-bg-gradient-to-b tw-from-white tw-to-gray-50 dark:tw-from-gray-800 dark:tw-to-gray-850"
//         >
//           {/* Back Button */}
//           <div className="tw-mb-6">
//             <button
//               onClick={handleBack}
//               className={`tw-flex tw-items-center tw-gap-2 tw-text-blue-600 hover:tw-text-blue-800 dark:tw-text-blue-400 dark:hover:tw-text-blue-200 tw-font-medium tw-bg-blue-50 dark:tw-bg-gray-800 tw-px-4 tw-py-2 tw-rounded-xl tw-shadow-sm hover:tw-shadow-md tw-transition-all ${
//                 isRTL ? 'tw-flex-row-reverse' : ''
//               }`}
//             >
//               <FaArrowLeft className="tw-text-lg" /> {t('eventBooking.back')}
//             </button>
//           </div>

//           {/* Event Details */}
//           <div className="tw-bg-white dark:tw-bg-gray-900 tw-rounded-xl tw-shadow-md tw-p-6 tw-mb-8">
//             <h1 className="tw-text-2xl tw-font-bold tw-mb-4 tw-text-blue-700 dark:tw-text-blue-300">
//               {event.eventName}
//             </h1>

//             <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
//               <div>
//                 <p className="tw-text-gray-700 dark:tw-text-gray-300">
//                   <span className="tw-font-medium">{t('eventBooking.eventPrice')}:</span> {event.price} EGP
//                 </p>
//                 <p className="tw-text-gray-700 dark:tw-text-gray-300">
//                   <span className="tw-font-medium">{t('eventBooking.responsiblePerson')}:</span> {event.responsiblePerson}
//                 </p>
//               </div>
//               <div>
//                 <p className="tw-text-gray-700 dark:tw-text-gray-300">
//                   <span className="tw-font-medium">{t('eventBooking.yourWallet')}:</span>
//                   <span
//                     className={`tw-font-bold ${
//                       wallet >= event.price
//                         ? 'tw-text-green-600 dark:tw-text-green-300'
//                         : 'tw-text-red-600 dark:tw-text-red-300'
//                     }`}
//                   >
//                     {wallet} EGP
//                   </span>
//                 </p>
//                 {wallet < event.price && (
//                   <p className="tw-text-yellow-600 dark:tw-text-yellow-300 tw-text-sm">
//                     {t('eventBooking.insufficientFunds')}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* User Info */}
//           <div className="tw-bg-blue-50 dark:tw-bg-gray-700 tw-rounded-xl tw-p-4 tw-mb-8 tw-flex tw-items-center tw-gap-4">
//             <div className="tw-bg-blue-100 dark:tw-bg-gray-600 tw-w-12 tw-h-12 tw-rounded-full tw-flex tw-items-center tw-justify-center">
//               <FaUser className="tw-text-blue-600 dark:tw-text-blue-300" />
//             </div>
//             <div>
//               <h3 className="tw-font-medium tw-text-gray-800 dark:tw-text-gray-200">{userName}</h3>
//               <p className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-100">ID: {Id}</p>
//             </div>
//           </div>

//           {/* Payment Method Cards */}
//           <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6 tw-mb-8">
//             {/* Wallet Card */}
//             <motion.div
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setActiveModal('wallet')}
//               className="tw-bg-blue-50 dark:tw-bg-gray-700 tw-rounded-xl tw-p-6 tw-cursor-pointer tw-text-center tw-border-2 tw-border-blue-200 dark:tw-border-gray-600 hover:tw-shadow-lg tw-transition-all"
//             >
//               <div className="tw-bg-blue-100 dark:tw-bg-gray-600 tw-w-16 tw-h-16 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4">
//                 <FaWallet className="tw-text-2xl tw-text-blue-600 dark:tw-text-blue-300" />
//               </div>
//               <h3 className="tw-text-xl tw-font-semibold tw-mb-2">{t('eventBooking.walletMethod')}</h3>
//               <p className="tw-text-gray-600 dark:tw-text-gray-300">{t('eventBooking.walletDescription')}</p>
//               <div className="tw-mt-4 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-text-green-600 dark:tw-text-green-300">
//                 <FaCheck /> {t('eventBooking.instantApproval')}
//               </div>
//             </motion.div>

//             {/* Proof Card */}
//             <motion.div
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setActiveModal('proof')}
//               className="tw-bg-green-50 dark:tw-bg-gray-700 tw-rounded-xl tw-p-6 tw-cursor-pointer tw-text-center tw-border-2 tw-border-green-200 dark:tw-border-gray-600 hover:tw-shadow-lg tw-transition-all"
//             >
//               <div className="tw-bg-green-100 dark:tw-bg-gray-600 tw-w-16 tw-h-16 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4">
//                 <FaPaperPlane className="tw-text-2xl tw-text-green-600 dark:tw-text-green-300" />
//               </div>
//               <h3 className="tw-text-xl tw-font-semibold tw-mb-2">{t('eventBooking.proofMethod')}</h3>
//               <p className="tw-text-gray-600 dark:tw-text-gray-300">{t('eventBooking.proofDescription')}</p>
//               <div className="tw-mt-4 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-text-yellow-600 dark:tw-text-yellow-300">
//                 <FaClock /> {t('eventBooking.adminApproval')}
//               </div>
//             </motion.div>
//           </div>

//           {/* Wallet Payment Modal */}
//           <AnimatePresence>
//             {activeModal === 'wallet' && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="tw-fixed tw-inset-0 tw-bg-black/50 tw-z-50 tw-flex tw-items-center tw-justify-center tw-p-4"
//                 onClick={() => setActiveModal(null)}
//               >
//                 <motion.div
//                   initial={{ scale: 0.9, y: 20 }}
//                   animate={{ scale: 1, y: 0 }}
//                   exit={{ scale: 0.9, y: 20 }}
//                   className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-xl tw-w-full tw-max-w-md tw-overflow-hidden"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <div className="tw-flex tw-justify-between tw-items-center tw-p-4 tw-border-b dark:tw-border-gray-700">
//                     <h2 className="tw-text-xl tw-font-bold tw-text-gray-800 dark:tw-text-gray-200">
//                       {t('eventBooking.walletPayment')}
//                     </h2>
//                     <button
//                       onClick={() => setActiveModal(null)}
//                       className="tw-text-gray-500 hover:tw-text-gray-700 dark:hover:tw-text-gray-300"
//                     >
//                       <FaTimes />
//                     </button>
//                   </div>

//                   <div className="tw-p-6 tw-space-y-4">
//                     <div className="tw-flex tw-justify-between tw-items-center tw-p-4 tw-bg-gray-50 dark:tw-bg-gray-700 tw-rounded-lg">
//                       <span className="tw-text-lg dark:tw-text-white">{t('eventBooking.tripPrice')}</span>
//                       <span className="tw-font-bold tw-text-blue-600 dark:tw-text-blue-300">{event.price} EGP</span>
//                     </div>

//                     <div className="tw-flex tw-justify-between tw-items-center tw-p-4 tw-bg-gray-50 dark:tw-bg-gray-700 tw-rounded-lg">
//                       <span className="tw-text-lg dark:tw-text-white">{t('eventBooking.yourWallet')}</span>
//                       <span
//                         className={`tw-font-bold ${
//                           wallet >= event.price
//                             ? 'tw-text-green-600 dark:tw-text-green-300'
//                             : 'tw-text-red-600 dark:tw-text-red-300'
//                         }`}
//                       >
//                         {wallet} EGP
//                       </span>
//                     </div>

//                     {wallet < event.price && (
//                       <div className="tw-p-4 tw-bg-yellow-50 dark:tw-bg-yellow-900 tw-rounded-lg tw-text-yellow-800 dark:tw-text-yellow-200">
//                         {t('eventBooking.insufficientFunds')}
//                       </div>
//                     )}

//                     <div className="tw-p-4 tw-bg-blue-50 dark:tw-bg-blue-900/30 tw-rounded-lg tw-text-blue-800 dark:tw-text-blue-200 tw-text-sm">
//                       <p className="tw-font-medium tw-flex tw-items-center tw-gap-2">
//                         <FaCheck /> {t('eventBooking.instantApprovalNote')}
//                       </p>
//                       <p className="tw-mt-2">{t('eventBooking.walletDeductionNote')}</p>
//                     </div>

//                     <button
//                       onClick={handleWalletBooking}
//                       disabled={wallet < event.price}
//                       className={`tw-w-full tw-py-3 tw-rounded-xl tw-font-semibold tw-text-white tw-transition tw-flex tw-items-center tw-justify-center tw-gap-2 ${
//                         wallet >= event.price
//                           ? 'tw-bg-blue-600 hover:tw-bg-blue-700 dark:tw-bg-blue-700 dark:hover:tw-bg-blue-800'
//                           : 'tw-bg-gray-400 dark:tw-bg-gray-600 tw-cursor-not-allowed'
//                       }`}
//                     >
//                       <FaWallet />
//                       {t('eventBooking.confirmBooking')}
//                     </button>
//                   </div>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Payment Proof Modal */}
//           <AnimatePresence>
//             {activeModal === 'proof' && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="tw-fixed tw-inset-0 tw-bg-black/50 tw-z-50 tw-flex tw-items-center tw-justify-center tw-p-4"
//                 onClick={() => setActiveModal(null)}
//               >
//                 <motion.div
//                   initial={{ scale: 0.9, y: 20 }}
//                   animate={{ scale: 1, y: 0 }}
//                   exit={{ scale: 0.9, y: 20 }}
//                   className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-xl tw-w-full tw-max-w-md tw-overflow-hidden"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <div className="tw-flex tw-justify-between tw-items-center tw-p-4 tw-border-b dark:tw-border-gray-700">
//                     <h2 className="tw-text-xl tw-font-bold tw-text-gray-800 dark:tw-text-gray-200">
//                       {t('eventBooking.uploadPaymentProof')}
//                     </h2>
//                     <button
//                       onClick={() => setActiveModal(null)}
//                       className="tw-text-gray-500 hover:tw-text-gray-700 dark:hover:tw-text-gray-300"
//                     >
//                       <FaTimes />
//                     </button>
//                   </div>

//                   {/* Scrollable content container */}
//                   <div className="tw-max-h-[70vh] tw-overflow-y-auto tw-px-6">
//                     <div className="tw-space-y-4 tw-py-4">
//                       <div className="tw-p-4 tw-bg-yellow-50 dark:tw-bg-yellow-900 tw-rounded-lg tw-text-yellow-800 dark:tw-text-yellow-200 tw-text-sm">
//                         <p className="tw-font-medium tw-flex tw-items-center tw-gap-2">
//                           <FaClock /> {t('eventBooking.adminApprovalNote')}
//                         </p>
//                         <p className="tw-mt-2">{t('eventBooking.processingTimeNote')}</p>
//                       </div>

//                       <label className="tw-block">
//                         <span className="tw-text-lg tw-font-medium tw-text-gray-700 dark:tw-text-gray-200 tw-mb-2 tw-block">
//                           {t('eventBooking.uploadScreenshot')}
//                         </span>
//                         <div className="tw-relative tw-border-2 tw-border-dashed tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg tw-p-6 tw-text-center hover:tw-border-blue-500 tw-transition upload-container">
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleUpload}
//                             className="tw-absolute tw-inset-0 tw-w-full tw-h-full tw-opacity-0 tw-cursor-pointer"
//                           />
//                           {screenshot ? (
//                             <div className="tw-text-green-600 dark:tw-text-green-300 tw-max-w-full">
//                               <FaPaperPlane className="tw-text-3xl tw-mx-auto tw-mb-2" />
//                               <p className="tw-truncate tw-px-2">{displayFileName(screenshot.name)}</p>
//                               <p className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">
//                                 {t('eventBooking.fileSelected')}
//                               </p>
//                             </div>
//                           ) : (
//                             <div className="tw-text-gray-500 dark:tw-text-gray-400">
//                               <FaPaperPlane className="tw-text-3xl tw-mx-auto tw-mb-2" />
//                               <p>{t('eventBooking.uploadInstructions')}</p>
//                               <p className="tw-text-sm">(JPG, PNG, etc.)</p>
//                             </div>
//                           )}
//                         </div>
//                       </label>

//                       <label className="tw-block">
//                         <span className="tw-text-lg tw-font-medium tw-text-gray-700 dark:tw-text-gray-200 tw-mb-2 tw-block">
//                           {t('eventBooking.selectResponsible')}
//                         </span>
//                         <select
//                           value={responsible}
//                           onChange={(e) => setResponsible(e.target.value)}
//                           className="tw-w-full dark:tw-text-white tw-px-4 tw-py-3 tw-rounded-lg tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-bg-white dark:tw-bg-gray-800 focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-blue-500"
//                         >
//                           <option value="">{t('eventBooking.selectOption')}</option>
//                           <option value="Beshoy Gerges">Beshoy Gerges</option>
//                           <option value="Rafayl Zaher">Rafayl Zaher</option>
//                           <option value="Mina Adel">Mina Adel</option>
//                         </select>
//                       </label>

//                       <div className="tw-p-4 tw-bg-gray-50 dark:tw-bg-gray-700 tw-rounded-lg">
//                         <h4 className="tw-font-medium tw-mb-2 dark:tw-text-white">{t('eventBooking.yourInformation')}</h4>
//                         <p className="tw-text-sm dark:tw-text-white">
//                           <span className="tw-font-medium dark:tw-text-white">ID:</span>  {Id}
//                         </p>
//                         <p className="tw-text-sm dark:tw-text-white">
//                           <span className="tw-font-medium dark:tw-text-white">{t('eventBooking.name')}:</span> {userName}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Fixed footer with submit button */}
//                   <div className="tw-sticky tw-bottom-0 tw-left-0 tw-right-0 tw-bg-white dark:tw-bg-gray-800 tw-p-4 tw-border-t dark:tw-border-gray-700">
//                     <button
//                       onClick={handleSubmitProof}
//                       disabled={sending || !screenshot || !responsible}
//                       className={`tw-w-full tw-py-3 tw-rounded-xl tw-font-semibold tw-text-white tw-transition tw-flex tw-items-center tw-justify-center tw-gap-2 ${
//                         !sending && screenshot && responsible
//                           ? 'tw-bg-green-600 hover:tw-bg-green-700 dark:tw-bg-green-700 dark:hover:tw-bg-green-800'
//                           : 'tw-bg-gray-400 dark:tw-bg-gray-600 tw-cursor-not-allowed'
//                       }`}
//                     >
//                       {sending ? (
//                         <>
//                           <svg
//                             className="tw-animate-spin tw-h-5 tw-w-5 tw-text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="tw-opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="tw-opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             ></path>
//                           </svg>
//                           {t('eventBooking.sending')}
//                         </>
//                       ) : (
//                         <>
//                           <FaPaperPlane />
//                           {t('eventBooking.submitProof')}
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  FaWallet,
  FaPaperPlane,
  FaArrowLeft,
  FaTimes,
  FaClock,
  FaCheck,
  FaUser,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { darkModeContext } from '../../Context/DarkModeContext';
import { useTranslation } from 'react-i18next';
import Spinner from '../Spinner/Spinner';

export default function EventBooking() {
  const { darkMode } = useContext(darkModeContext);
  const { t, i18n } = useTranslation('eventBooking');
  const { id } = useParams();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const [event, setEvent] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [responsible, setResponsible] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);

  const wallet = parseFloat(localStorage.getItem('wallet')) || 0;
  const token = localStorage.getItem('token');
  const Id = localStorage.getItem('Id');
  const userName = localStorage.getItem('userName');

  const displayFileName = (name) => {
    if (name.length > 24) {
      return `${name.substring(0, 10)}...${name.substring(name.length - 10)}`;
    }
    return name;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!Id) {
      toast.error(t('eventBooking.userIdMissing'));
      navigate('/login');
    }
  }, [Id, navigate, t]);

  const fetchEvent = async () => {
    if (!Id) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `https://ugmproject.vercel.app/api/v1/event/getEventById/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvent(res.data.event);
    } catch (err) {
      toast.error(t('eventBooking.fetchError'));
    }
  };

  const fetchAdmins = async () => {
    try {
      const role = localStorage.getItem('role');
      if (role === 'SuperAdmin') {
        const adminsResponse = await axios.get(
          'https://ugmproject.vercel.app/api/v1/user/gitAllAdmins',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const adminsData = adminsResponse.data?.users || [];
        setAdmins(Array.isArray(adminsData) ? adminsData : []);
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchEvent();
      await fetchAdmins();
    };
    
    fetchData();
  }, [id]);

  const handleWalletBooking = async () => {
    if (!Id) {
      toast.error(t('eventBooking.userIdMissing'));
      return;
    }

    const price = parseFloat(event.price);

    if (wallet < price) {
      toast.error(t('eventBooking.walletError'));
      return;
    }

    try {
      // 1. Update wallet
      await axios.put(
        `https://ugmproject.vercel.app/api/v1/user/updateWallet/${Id}`,
        {
          amount: price,
          operation: 'remove',
          description: `Booking for event: ${event.eventName}`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 2. Create booking
      const bookingData = {
        eventId: event._id,
        eventName: event.eventName,
        price: price.toString(),
        userName,
      };

      await axios.post(
        'https://ugmproject.vercel.app/api/v1/booking/bookingByWallet',
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // 3. Update local wallet balance
      const newWalletBalance = wallet - price;
      localStorage.setItem('wallet', newWalletBalance.toString());

      toast.success(t('eventBooking.walletSuccess'));
      navigate('/events');
    } catch (err) {
      console.error('Booking API Error:', err.response?.data);
      toast.error(err.response?.data?.err || t('eventBooking.bookingError'));
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setScreenshot(file);
    } else {
      toast.error(t('eventBooking.invalidFile'));
    }
  };

  const handleSubmitProof = async () => {
    if (!Id) {
      toast.error(t('eventBooking.userIdMissing'));
      return;
    }

    if (!screenshot || !responsible) {
      toast.error(t('eventBooking.requiredFields'));
      return;
    }

    setSending(true);

    try {
      const selectedAdmin = admins.find(admin => admin.userName === responsible);
      
      if (!selectedAdmin) {
        toast.error(t('eventBooking.adminNotFound'));
        return;
      }

      const formData = new FormData();
      formData.append('eventId', event._id);
      formData.append('userId', Id);
      formData.append('userName', userName);
      formData.append('eventName', event.eventName);
      formData.append('price', event.price);
      formData.append('paymentMethod', 'proof');
      formData.append('responsiblePerson', responsible);
      formData.append('adminId', selectedAdmin._id);
      formData.append('status', 'pending');
      formData.append('screenshot', screenshot);

      const response = await axios.post(
        'https://ugmproject.vercel.app/api/v1/booking/bookingByProof',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success(response.data.message, {
        duration: 5000,
        style: {
          background: '#10B981',
          color: '#FFFFFF',
          fontSize: '16px',
          padding: '16px',
          borderRadius: '8px',
        },
      });

      navigate('/events');
    } catch (err) {
      console.error('Proof Submission Error:', err.response?.data);
      
      if (err.response?.data?.err === 'You have already booked this event') {
        toast.error(err.response.data.err, {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#FFFFFF',
            fontSize: '16px',
            padding: '16px',
            borderRadius: '8px',
          },
        });
      } else {
        toast.error(err.response?.data?.message || t('eventBooking.bookingError'), {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: '#FFFFFF',
            fontSize: '16px',
            padding: '16px',
            borderRadius: '8px',
          },
        });
      }
    } finally {
      setSending(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={`${darkMode ? 'tw-dark' : ''}`}>
        <div className="container-fluid dark:tw-bg-gray-800" style={{ minHeight: '80vh' }}>
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="tw-py-10 tw-flex tw-flex-col tw-items-center tw-justify-center"
              style={{ minHeight: '70vh' }}
            >
              <Spinner />
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="tw-text-center tw-mt-20 tw-text-red-600 tw-font-bold tw-text-xl">
        {t('eventBooking.eventNotFound')}
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container-fluid dark:tw-bg-gray-800 tw-min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="tw-container tw-max-w-3xl tw-mx-auto tw-p-6 tw-bg-gradient-to-b tw-from-white tw-to-gray-50 dark:tw-from-gray-800 dark:tw-to-gray-850"
        >
          {/* Back Button */}
          <div className="tw-mb-6">
            <button
              onClick={handleBack}
              className={`tw-flex tw-items-center tw-gap-2 tw-text-blue-600 hover:tw-text-blue-800 dark:tw-text-blue-400 dark:hover:tw-text-blue-200 tw-font-medium tw-bg-blue-50 dark:tw-bg-gray-800 tw-px-4 tw-py-2 tw-rounded-xl tw-shadow-sm hover:tw-shadow-md tw-transition-all ${
                isRTL ? 'tw-flex-row-reverse' : ''
              }`}
            >
              <FaArrowLeft className="tw-text-lg" /> {t('eventBooking.back')}
            </button>
          </div>

          {/* Event Details */}
          <div className="tw-bg-white dark:tw-bg-gray-900 tw-rounded-xl tw-shadow-md tw-p-6 tw-mb-8">
            <h1 className="tw-text-2xl tw-font-bold tw-mb-4 tw-text-blue-700 dark:tw-text-blue-300">
              {event.eventName}
            </h1>

            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
              <div>
                <p className="tw-text-gray-700 dark:tw-text-gray-300">
                  <span className="tw-font-medium">{t('eventBooking.eventPrice')}:</span> {event.price} EGP
                </p>
                <p className="tw-text-gray-700 dark:tw-text-gray-300">
                  <span className="tw-font-medium">{t('eventBooking.responsiblePerson')}:</span> {event.responsiblePerson}
                </p>
              </div>
              <div>
                <p className="tw-text-gray-700 dark:tw-text-gray-300">
                  <span className="tw-font-medium">{t('eventBooking.yourWallet')}:</span>
                  <span
                    className={`tw-font-bold ${
                      wallet >= event.price
                        ? 'tw-text-green-600 dark:tw-text-green-300'
                        : 'tw-text-red-600 dark:tw-text-red-300'
                    }`}
                  >
                    {wallet} EGP
                  </span>
                </p>
                {wallet < event.price && (
                  <p className="tw-text-yellow-600 dark:tw-text-yellow-300 tw-text-sm">
                    {t('eventBooking.insufficientFunds')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="tw-bg-blue-50 dark:tw-bg-gray-700 tw-rounded-xl tw-p-4 tw-mb-8 tw-flex tw-items-center tw-gap-4">
            <div className="tw-bg-blue-100 dark:tw-bg-gray-600 tw-w-12 tw-h-12 tw-rounded-full tw-flex tw-items-center tw-justify-center">
              <FaUser className="tw-text-blue-600 dark:tw-text-blue-300" />
            </div>
            <div>
              <h3 className="tw-font-medium tw-text-gray-800 dark:tw-text-gray-200">{userName}</h3>
              <p className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-100">ID: {Id}</p>
            </div>
          </div>

          {/* Payment Method Cards */}
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6 tw-mb-8">
            {/* Wallet Card */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveModal('wallet')}
              className="tw-bg-blue-50 dark:tw-bg-gray-700 tw-rounded-xl tw-p-6 tw-cursor-pointer tw-text-center tw-border-2 tw-border-blue-200 dark:tw-border-gray-600 hover:tw-shadow-lg tw-transition-all"
            >
              <div className="tw-bg-blue-100 dark:tw-bg-gray-600 tw-w-16 tw-h-16 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4">
                <FaWallet className="tw-text-2xl tw-text-blue-600 dark:tw-text-blue-300" />
              </div>
              <h3 className="tw-text-xl tw-font-semibold tw-mb-2">{t('eventBooking.walletMethod')}</h3>
              <p className="tw-text-gray-600 dark:tw-text-gray-300">{t('eventBooking.walletDescription')}</p>
              <div className="tw-mt-4 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-text-green-600 dark:tw-text-green-300">
                <FaCheck /> {t('eventBooking.instantApproval')}
              </div>
            </motion.div>

            {/* Proof Card */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveModal('proof')}
              className="tw-bg-green-50 dark:tw-bg-gray-700 tw-rounded-xl tw-p-6 tw-cursor-pointer tw-text-center tw-border-2 tw-border-green-200 dark:tw-border-gray-600 hover:tw-shadow-lg tw-transition-all"
            >
              <div className="tw-bg-green-100 dark:tw-bg-gray-600 tw-w-16 tw-h-16 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4">
                <FaPaperPlane className="tw-text-2xl tw-text-green-600 dark:tw-text-green-300" />
              </div>
              <h3 className="tw-text-xl tw-font-semibold tw-mb-2">{t('eventBooking.proofMethod')}</h3>
              <p className="tw-text-gray-600 dark:tw-text-gray-300">{t('eventBooking.proofDescription')}</p>
              <div className="tw-mt-4 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-text-yellow-600 dark:tw-text-yellow-300">
                <FaClock /> {t('eventBooking.adminApproval')}
              </div>
            </motion.div>
          </div>

          {/* Wallet Payment Modal */}
          <AnimatePresence>
            {activeModal === 'wallet' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="tw-fixed tw-inset-0 tw-bg-black/50 tw-z-50 tw-flex tw-items-center tw-justify-center tw-p-4"
                onClick={() => setActiveModal(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-xl tw-w-full tw-max-w-md tw-overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="tw-flex tw-justify-between tw-items-center tw-p-4 tw-border-b dark:tw-border-gray-700">
                    <h2 className="tw-text-xl tw-font-bold tw-text-gray-800 dark:tw-text-gray-200">
                      {t('eventBooking.walletPayment')}
                    </h2>
                    <button
                      onClick={() => setActiveModal(null)}
                      className="tw-text-gray-500 hover:tw-text-gray-700 dark:hover:tw-text-gray-300"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="tw-p-6 tw-space-y-4">
                    <div className="tw-flex tw-justify-between tw-items-center tw-p-4 tw-bg-gray-50 dark:tw-bg-gray-700 tw-rounded-lg">
                      <span className="tw-text-lg dark:tw-text-white">{t('eventBooking.tripPrice')}</span>
                      <span className="tw-font-bold tw-text-blue-600 dark:tw-text-blue-300">{event.price} EGP</span>
                    </div>

                    <div className="tw-flex tw-justify-between tw-items-center tw-p-4 tw-bg-gray-50 dark:tw-bg-gray-700 tw-rounded-lg">
                      <span className="tw-text-lg dark:tw-text-white">{t('eventBooking.yourWallet')}</span>
                      <span
                        className={`tw-font-bold ${
                          wallet >= event.price
                            ? 'tw-text-green-600 dark:tw-text-green-300'
                            : 'tw-text-red-600 dark:tw-text-red-300'
                        }`}
                      >
                        {wallet} EGP
                      </span>
                    </div>

                    {wallet < event.price && (
                      <div className="tw-p-4 tw-bg-yellow-50 dark:tw-bg-yellow-900 tw-rounded-lg tw-text-yellow-800 dark:tw-text-yellow-200">
                        {t('eventBooking.insufficientFunds')}
                      </div>
                    )}

                    <div className="tw-p-4 tw-bg-blue-50 dark:tw-bg-blue-900/30 tw-rounded-lg tw-text-blue-800 dark:tw-text-blue-200 tw-text-sm">
                      <p className="tw-font-medium tw-flex tw-items-center tw-gap-2">
                        <FaCheck /> {t('eventBooking.instantApprovalNote')}
                      </p>
                      <p className="tw-mt-2">{t('eventBooking.walletDeductionNote')}</p>
                    </div>

                    <button
                      onClick={handleWalletBooking}
                      disabled={wallet < event.price}
                      className={`tw-w-full tw-py-3 tw-rounded-xl tw-font-semibold tw-text-white tw-transition tw-flex tw-items-center tw-justify-center tw-gap-2 ${
                        wallet >= event.price
                          ? 'tw-bg-blue-600 hover:tw-bg-blue-700 dark:tw-bg-blue-700 dark:hover:tw-bg-blue-800'
                          : 'tw-bg-gray-400 dark:tw-bg-gray-600 tw-cursor-not-allowed'
                      }`}
                    >
                      <FaWallet />
                      {t('eventBooking.confirmBooking')}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Payment Proof Modal */}
          <AnimatePresence>
            {activeModal === 'proof' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="tw-fixed tw-inset-0 tw-bg-black/50 tw-z-50 tw-flex tw-items-center tw-justify-center tw-p-4"
                onClick={() => setActiveModal(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-xl tw-w-full tw-max-w-md tw-overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="tw-flex tw-justify-between tw-items-center tw-p-4 tw-border-b dark:tw-border-gray-700">
                    <h2 className="tw-text-xl tw-font-bold tw-text-gray-800 dark:tw-text-gray-200">
                      {t('eventBooking.uploadPaymentProof')}
                    </h2>
                    <button
                      onClick={() => setActiveModal(null)}
                      className="tw-text-gray-500 hover:tw-text-gray-700 dark:hover:tw-text-gray-300"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  {/* Scrollable content container */}
                  <div className="tw-max-h-[70vh] tw-overflow-y-auto tw-px-6">
                    <div className="tw-space-y-4 tw-py-4">
                      <div className="tw-p-4 tw-bg-yellow-50 dark:tw-bg-yellow-900 tw-rounded-lg tw-text-yellow-800 dark:tw-text-yellow-200 tw-text-sm">
                        <p className="tw-font-medium tw-flex tw-items-center tw-gap-2">
                          <FaClock /> {t('eventBooking.adminApprovalNote')}
                        </p>
                        <p className="tw-mt-2">{t('eventBooking.processingTimeNote')}</p>
                      </div>

                      <label className="tw-block">
                        <span className="tw-text-lg tw-font-medium tw-text-gray-700 dark:tw-text-gray-200 tw-mb-2 tw-block">
                          {t('eventBooking.uploadScreenshot')}
                        </span>
                        <div className="tw-relative tw-border-2 tw-border-dashed tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg tw-p-6 tw-text-center hover:tw-border-blue-500 tw-transition upload-container">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            className="tw-absolute tw-inset-0 tw-w-full tw-h-full tw-opacity-0 tw-cursor-pointer"
                          />
                          {screenshot ? (
                            <div className="tw-text-green-600 dark:tw-text-green-300 tw-max-w-full">
                              <FaPaperPlane className="tw-text-3xl tw-mx-auto tw-mb-2" />
                              <p className="tw-truncate tw-px-2">{displayFileName(screenshot.name)}</p>
                              <p className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">
                                {t('eventBooking.fileSelected')}
                              </p>
                            </div>
                          ) : (
                            <div className="tw-text-gray-500 dark:tw-text-gray-400">
                              <FaPaperPlane className="tw-text-3xl tw-mx-auto tw-mb-2" />
                              <p>{t('eventBooking.uploadInstructions')}</p>
                              <p className="tw-text-sm">(JPG, PNG, etc.)</p>
                            </div>
                          )}
                        </div>
                      </label>

                      <label className="tw-block">
                        <span className="tw-text-lg tw-font-medium tw-text-gray-700 dark:tw-text-gray-200 tw-mb-2 tw-block">
                          {t('eventBooking.selectResponsible')}
                        </span>
                        <select
                          value={responsible}
                          onChange={(e) => setResponsible(e.target.value)}
                          className="tw-w-full dark:tw-text-white tw-px-4 tw-py-3 tw-rounded-lg tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-bg-white dark:tw-bg-gray-800 focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-blue-500"
                        >
                          <option value="">{t('eventBooking.selectOption')}</option>
                          {admins && admins.length > 0 ? (
                            admins.map((admin) => (
                              <option key={admin._id} value={admin.userName}>
                                {admin.userName}
                              </option>
                            ))
                          ) : (
                            <option disabled>{t('eventBooking.noAdminsAvailable')}</option>
                          )}
                        </select>
                      </label>

                      <div className="tw-p-4 tw-bg-gray-50 dark:tw-bg-gray-700 tw-rounded-lg">
                        <h4 className="tw-font-medium tw-mb-2 dark:tw-text-white">{t('eventBooking.yourInformation')}</h4>
                        <p className="tw-text-sm dark:tw-text-white">
                          <span className="tw-font-medium dark:tw-text-white">ID:</span>  {Id}
                        </p>
                        <p className="tw-text-sm dark:tw-text-white">
                          <span className="tw-font-medium dark:tw-text-white">{t('eventBooking.name')}:</span> {userName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fixed footer with submit button */}
                  <div className="tw-sticky tw-bottom-0 tw-left-0 tw-right-0 tw-bg-white dark:tw-bg-gray-800 tw-p-4 tw-border-t dark:tw-border-gray-700">
                    <button
                      onClick={handleSubmitProof}
                      disabled={sending || !screenshot || !responsible}
                      className={`tw-w-full tw-py-3 tw-rounded-xl tw-font-semibold tw-text-white tw-transition tw-flex tw-items-center tw-justify-center tw-gap-2 ${
                        !sending && screenshot && responsible
                          ? 'tw-bg-green-600 hover:tw-bg-green-700 dark:tw-bg-green-700 dark:hover:tw-bg-green-800'
                          : 'tw-bg-gray-400 dark:tw-bg-gray-600 tw-cursor-not-allowed'
                      }`}
                    >
                      {sending ? (
                        <>
                          <svg
                            className="tw-animate-spin tw-h-5 tw-w-5 tw-text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="tw-opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="tw-opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {t('eventBooking.sending')}
                        </>
                      ) : (
                        <>
                          <FaPaperPlane />
                          {t('eventBooking.submitProof')}
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}