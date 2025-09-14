// import React, { useState, useEffect, useContext } from 'react';
// import styles from './UpdateReq.module.css';
// import { useTranslation } from 'react-i18next';
// import Spinner from '../Spinner/Spinner';
// import { darkModeContext } from '../../Context/DarkModeContext';
// import toast, { Toaster } from 'react-hot-toast';

// export default function UpdateReq() {
//   const [isActive, setIsActive] = useState(false);
//   const [actionType, setActionType] = useState(null); 
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [bookingRequests, setBookingRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const { t } = useTranslation("updatedReq");
//   const { darkMode } = useContext(darkModeContext);

//   const rawToken = localStorage.getItem('token');
//   const token = rawToken?.startsWith("Bearer ") ? rawToken : `Bearer ${rawToken}`;

//   useEffect(() => {
//     const fetchPendingBookings = async () => {
//       try {
//         const response = await fetch('https://ugmproject.vercel.app/api/v1/booking/pendingBookings', {
//           headers: {
//             'Authorization': token,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch booking requests');
//         }

//         const data = await response.json();
//         console.log("API data:", data);

//         const pendingBookings = Array.isArray(data?.bookings) 
//           ? data.bookings.filter(booking => booking.status === 'pending') 
//           : [];
        
//         setBookingRequests(pendingBookings);
//         setLoading(false);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchPendingBookings();
//     } else {
//       setError('Authentication token not found');
//       setLoading(false);
//     }
//   }, [token]);

//   const handleStatusUpdate = async (bookingId, actionType) => {
//     try {
//       const status = actionType === 'approve' ? 'approved' : 'rejected';
      
//       console.log(`Updating booking ${bookingId} to status: ${status}`);
      
//       const response = await fetch(`https://ugmproject.vercel.app/api/v1/booking/updateStatus/${bookingId}`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': token,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           status,
//           ...(actionType === 'reject' && { rejectionReason: "Booking rejected by admin" })
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => null);
//         const errorMessage = errorData?.message || `Failed to update status to ${status}`;
        
//         // Show toast notification for no available seats
//         if (errorMessage.includes('no available seats') || errorMessage.includes('Failed to update status to approved')) {
//           toast.error('No available seats for this trip', {
//             position: 'top-center',
//             style: {
//               background: darkMode ? '#1f2937' : '#fff',
//               color: darkMode ? '#fff' : '#000',
//               boxShadow: darkMode ? '0 4px 10px rgba(0, 0, 0, 0.3)' : '0 4px 10px rgba(0, 0, 0, 0.1)',
//             }
//           });
//         } else {
//           throw new Error(errorMessage);
//         }
//         return;
//       }

//       setBookingRequests(prev => prev.filter(booking => booking._id !== bookingId));
//       setIsActive(false);
      
//       // Show success toast
//       toast.success(`Booking ${status} successfully`, {
//         position: 'top-center',
//         style: {
//           background: darkMode ? '#1f2937' : '#fff',
//           color: darkMode ? '#fff' : '#000',
//           boxShadow: darkMode ? '0 4px 10px rgba(0, 0, 0, 0.3)' : '0 4px 10px rgba(0, 0, 0, 0.1)',
//         }
//       });
      
//     } catch (err) {
//       console.error("Error updating status:", {
//         message: err.message,
//         stack: err.stack,
//       });
//       setError(`Failed to ${actionType} booking: ${err.message}`);
//     }
//   };

//   if (loading) return (
//     <div className={`tw-flex tw-items-center tw-justify-center tw-h-[80vh] ${darkMode ? 'dark:tw-bg-gray-900' : ''}`}>
//       <Spinner />
//     </div>
//   );
  
//   if (error) return (
//     <div className={`tw-text-center tw-py-5 tw-h-[80vh] ${darkMode ? 'dark:tw-bg-gray-900 dark:tw-text-white' : ''}`}>
//       Error: {error}
//     </div>
//   );

//   return (
//     <div className={`tw-min-h-[80vh] ${darkMode ? 'dark:tw-bg-gray-900 dark:tw-text-white' : ''}`}>
//       {/* Toaster Component */}
//       <Toaster
//         position="top-center"
//         toastOptions={{
//           style: {
//             background: darkMode ? '#1f2937' : '#fff',
//             color: darkMode ? '#fff' : '#000',
//             boxShadow: darkMode ? '0 4px 10px rgba(0, 0, 0, 0.3)' : '0 4px 10px rgba(0, 0, 0, 0.1)',
//           },
//         }}
//       />

//       {/* Confirmation Popup */}
//       {isActive && (
//         <div 
//           onClick={() => setIsActive(false)} 
//           className="tw-fixed tw-inset-0 tw-flex tw-justify-center tw-items-center tw-z-[9999] tw-bg-black/60"
//         >
//           <div 
//             onClick={(e) => e.stopPropagation()} 
//             className={`tw-p-6 tw-rounded-2xl ${styles.popupWidth} ${
//               darkMode ? 'dark:tw-bg-gray-800 dark:tw-text-white' : 'tw-bg-white'
//             }`}
//           >
//             <h3 className='tw-text-lg tw-font-semibold tw-mb-4'>
//               {actionType === 'approve' ? (
//                 <i className="fa-solid fa-circle-check tw-text-green-500 tw-me-2"></i>
//               ) : (
//                 <i className="fa-solid fa-circle-xmark tw-text-red-500 tw-me-2"></i>
//               )}
//               {actionType === 'approve' 
//                 ? t('updateRequest.popups.approve.title') 
//                 : t('updateRequest.popups.reject.title')}
//             </h3>
//             <p className={`tw-mb-4 ${darkMode ? 'dark:tw-text-gray-300' : 'tw-text-gray-600'}`}>
//               {actionType === 'approve' 
//                 ? t('updateRequest.popups.approve.message') 
//                 : t('updateRequest.popups.reject.message')}
//             </p>
//             <div className="tw-flex tw-justify-end tw-gap-3">
//               <button 
//                 onClick={() => setIsActive(false)} 
//                 className={`tw-border tw-border-gray-400 tw-text-gray-600 dark:tw-text-gray-300 dark:tw-border-gray-600 tw-rounded-md tw-px-4 tw-py-2 hover:tw-bg-gray-200 dark:hover:tw-bg-gray-700`}
//               >
//                 {t('updateRequest.buttons.cancel')}
//               </button>
//               <button 
//                 onClick={() => handleStatusUpdate(selectedRequest._id, actionType)} 
//                 className={`tw-border-0 tw-rounded-md tw-px-4 tw-py-2 tw-text-white ${
//                   actionType === 'approve' 
//                     ? 'tw-bg-green-500 hover:tw-bg-green-600' 
//                     : 'tw-bg-red-500 hover:tw-bg-red-600'
//                 }`}
//               >
//                 {t('updateRequest.buttons.confirm')}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Screenshot Preview Popup */}
//       {selectedImage && (
//         <div 
//           onClick={() => setSelectedImage(null)} 
//           className="tw-fixed tw-inset-0 tw-flex tw-justify-center tw-items-center tw-z-[9999] tw-bg-black/60 tw-p-4"
//         >
//           <div 
//             onClick={(e) => e.stopPropagation()} 
//             className={`tw-flex tw-flex-col tw-p-4 tw-rounded-2xl tw-shadow-lg tw-max-w-full tw-max-h-[90vh] ${
//               darkMode ? 'dark:tw-bg-gray-800' : 'tw-bg-white'
//             }`}
//           >
//             <div className="tw-flex-1 tw-overflow-auto tw-flex tw-justify-center tw-items-center">
//               <img 
//                 src={selectedImage} 
//                 alt="Proof" 
//                 className="tw-max-w-full tw-max-h-[70vh] tw-object-contain tw-rounded-lg" 
//               />
//             </div>
//             <div className="tw-mt-4 tw-text-right">
//               <button 
//                 onClick={() => setSelectedImage(null)} 
//                 className="tw-bg-gray-300 dark:tw-bg-gray-600 tw-text-black dark:tw-text-white tw-rounded-md tw-px-4 tw-py-2 hover:tw-bg-gray-400 dark:hover:tw-bg-gray-500"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Table */}
//       <div className="tw-container-fluid tw-px-4 tw-py-6">
//         <div className="tw-row tw-flex tw-justify-center">
//           <div className={`tw-w-full tw-rounded-2xl tw-p-6 tw-relative ${styles.shad} ${
//             darkMode ? 'dark:tw-bg-gray-800 dark:tw-text-white' : 'tw-bg-white'
//           }`}>
//             <h3 className={`tw-text-xl md:tw-text-2xl tw-font-semibold tw-mb-6 ${
//               darkMode ? 'dark:tw-text-white' : ''
//             }`}>
//               {t('updateRequest.requestDetails')}
//             </h3>
            
//             <div className="tw-overflow-auto" style={{ maxHeight: 'calc(80vh - 200px)' }}>
//               <table className={`tw-w-full ${darkMode ? 'dark:tw-bg-gray-800 dark:tw-text-white' : ''}`}>
//                 <thead className={darkMode ? 'dark:tw-bg-gray-700' : 'tw-bg-gray-100'}>
//                   <tr>
//                     <th className="tw-px-4 tw-py-3 tw-sticky tw-top-0 tw-z-10 tw-bg-inherit">{t('updateRequest.tableHeaders.id')}</th>
//                     <th className="tw-px-4 tw-py-3 tw-sticky tw-top-0 tw-z-10 tw-bg-inherit">{t('updateRequest.tableHeaders.tripName')}</th>
//                     <th className="tw-px-4 tw-py-3 tw-sticky tw-top-0 tw-z-10 tw-bg-inherit">{t('updateRequest.tableHeaders.user')}</th>
//                     <th className="tw-px-4 tw-py-3 tw-sticky tw-top-0 tw-z-10 tw-bg-inherit">{t('updateRequest.tableHeaders.screenshot')}</th>
//                     <th className="tw-px-4 tw-py-3 tw-sticky tw-top-0 tw-z-10 tw-bg-inherit">{t('updateRequest.tableHeaders.action')}</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bookingRequests.length > 0 ? (
//                     bookingRequests.map((request, index) => (
//                       <tr 
//                         key={request._id}
//                         className={`${darkMode ? 'dark:tw-bg-gray-800 dark:hover:tw-bg-gray-700 dark:tw-border-gray-700' : 'tw-border-t hover:tw-bg-gray-50'}`}
//                       >
//                         <td className="tw-px-4 tw-py-3">{index + 1}</td>
//                         <td className="tw-px-4 tw-py-3">{request.eventName || 'N/A'}</td>
//                         <td className="tw-px-4 tw-py-3">{request.user?.userName || 'N/A'}</td>
//                         <td className="tw-px-4 tw-py-3">
//                           {request.screenshot && (
//                             <span 
//                               onClick={() => setSelectedImage(request.screenshot)} 
//                               className={`tw-text-blue-500 dark:tw-text-blue-400 hover:tw-underline tw-cursor-pointer`}
//                             >
//                               {t('updateRequest.viewScreenshot')}
//                             </span>
//                           )}
//                         </td>
//                         <td className="tw-px-4 tw-py-3">
//                           <i 
//                             onClick={() => {
//                               setSelectedRequest(request);
//                               setIsActive(true);
//                               setActionType('approve');
//                             }} 
//                             className="fa-solid fa-check tw-text-green-500 tw-text-lg tw-mx-2 tw-cursor-pointer hover:tw-opacity-80"
//                             title="Approve"
//                           ></i>
//                           <i 
//                             onClick={() => {
//                               setSelectedRequest(request);
//                               setIsActive(true);
//                               setActionType('reject');
//                             }} 
//                             className="fa-solid fa-xmark tw-text-red-500 tw-text-lg tw-mx-2 tw-cursor-pointer hover:tw-opacity-80"
//                             title="Reject"
//                           ></i>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td 
//                         colSpan="5" 
//                         className={`tw-text-center tw-py-8 ${darkMode ? 'dark:tw-text-gray-300' : ''}`}
//                       >
//                         No pending booking requests
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






import React, { useState, useEffect, useContext } from 'react';
import styles from './UpdateReq.module.css';
import { useTranslation } from 'react-i18next';
import Spinner from '../Spinner/Spinner';
import { darkModeContext } from '../../Context/DarkModeContext';
import toast, { Toaster } from 'react-hot-toast';

export default function UpdateReq() {
  const [isActive, setIsActive] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [paidAmount, setPaidAmount] = useState('');
  const [comment, setComment] = useState('');
  const { t } = useTranslation("updatedReq");
  const { darkMode } = useContext(darkModeContext);

  const rawToken = localStorage.getItem('token');
  const token = rawToken?.startsWith("Bearer ") ? rawToken : `Bearer ${rawToken}`;

  useEffect(() => {
    const fetchPendingBookings = async () => {
      try {
        const response = await fetch('https://ugmproject.vercel.app/api/v1/booking/pendingBookings', {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch booking requests');
        }

        const data = await response.json();
        console.log("API data:", data);

        const pendingBookings = Array.isArray(data?.bookings) 
          ? data.bookings.filter(booking => booking.status === 'pending') 
          : [];
        
        setBookingRequests(pendingBookings);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (token) {
      fetchPendingBookings();
    } else {
      setError('Authentication token not found');
      setLoading(false);
    }
  }, [token]);

  const handleStatusUpdate = async (bookingId, actionType) => {
    try {
      let status, requestBody;
      
      if (actionType === 'approve') {
        status = 'approved';
        requestBody = { status };
      } else if (actionType === 'partial') {
        status = 'partiallyApproved';
        requestBody = { 
          status,
          comment: comment || undefined
        };
      } else if (actionType === 'reject') {
        status = 'rejected';
        requestBody = { 
          status,
          rejectionReason: comment || "Booking rejected by admin"
        };
      }
      
      console.log(`Updating booking ${bookingId} to status: ${status}`, requestBody);
      
      const response = await fetch(`https://ugmproject.vercel.app/api/v1/booking/updateStatus/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Failed to update status to ${status}`;
        
        if (errorMessage.includes('no available seats') || errorMessage.includes('Failed to update status to approved')) {
          toast.error('No available seats for this trip', {
            position: 'top-center',
            style: {
              background: darkMode ? '#1f2937' : '#fff',
              color: darkMode ? '#fff' : '#000',
              boxShadow: darkMode ? '0 4px 10px rgba(0, 0, 0, 0.3)' : '0 4px 10px rgba(0, 0, 0, 0.1)',
            }
          });
        } else {
          throw new Error(errorMessage);
        }
        return;
      }

      setBookingRequests(prev => prev.filter(booking => booking._id !== bookingId));
      setIsActive(false);
      setPaidAmount('');
      setComment('');
      
      toast.success(`Booking ${status} successfully`, {
        position: 'top-center',
        style: {
          background: darkMode ? '#1f2937' : '#fff',
          color: darkMode ? '#fff' : '#000',
          boxShadow: darkMode ? '0 4px 10px rgba(0, 0, 0, 0.3)' : '0 4px 10px rgba(0, 0, 0, 0.1)',
        }
      });
      
    } catch (err) {
      console.error("Error updating status:", {
        message: err.message,
        stack: err.stack,
      });
      setError(`Failed to ${actionType} booking: ${err.message}`);
    }
  };

  if (loading) return (
    <div className={`tw-flex tw-items-center tw-justify-center tw-h-[80vh] ${darkMode ? 'dark:tw-bg-gray-900' : ''}`}>
      <Spinner />
    </div>
  );
  
  if (error) return (
    <div className={`tw-text-center tw-py-5 tw-h-[80vh] ${darkMode ? 'dark:tw-bg-gray-900 dark:tw-text-white' : ''}`}>
      Error: {error}
    </div>
  );

  return (
    <div className={`tw-min-h-[80vh] ${darkMode ? 'dark:tw-bg-gray-900 dark:tw-text-white' : ''}`}>
      {/* Toaster Component */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: darkMode ? '#1f2937' : '#fff',
            color: darkMode ? '#fff' : '#000',
            boxShadow: darkMode ? '0 4px 10px rgba(0, 0, 0, 0.3)' : '0 4px 10px rgba(0, 0, 0, 0.1)',
          },
        }}
      />

      {/* Confirmation Popup */}
      {isActive && (
        <div 
          onClick={() => {
            setIsActive(false);
            setPaidAmount('');
            setComment('');
          }} 
          className="tw-fixed tw-inset-0 tw-flex tw-justify-center tw-items-center tw-z-[9999] tw-bg-black/60"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className={`tw-p-6 tw-rounded-2xl ${styles.popupWidth} ${
              darkMode ? 'dark:tw-bg-gray-800 dark:tw-text-white' : 'tw-bg-white'
            }`}
          >
            <h3 className='tw-text-lg tw-font-semibold tw-mb-4'>
              {actionType === 'approve' ? (
                <i className="fa-solid fa-circle-check tw-text-green-500 tw-me-2"></i>
              ) : actionType === 'partial' ? (
                <i className="fa-solid fa-percent tw-text-blue-500 tw-me-2"></i>
              ) : (
                <i className="fa-solid fa-ban tw-text-red-500 tw-me-2"></i>
              )}
              {actionType === 'approve' 
                ? t('updateRequest.popups.approve.title') 
                : actionType === 'partial'
                ? 'Partial Approval'
                : t('updateRequest.popups.reject.title')}
            </h3>
            
            {(actionType === 'partial' || actionType === 'reject') && (
              <div className="tw-mb-4">
                <label className="tw-block tw-mb-2">
                  {actionType === 'partial' ? 'Comment (Optional)' : 'Rejection Reason'}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className={`tw-w-full tw-p-2 tw-border tw-rounded ${
                    darkMode ? 'dark:tw-bg-gray-700 dark:tw-border-gray-600' : 'tw-border-gray-300'
                  }`}
                  rows="3"
                  placeholder={actionType === 'partial' ? 'Add any comments...' : 'Enter rejection reason...'}
                />
              </div>
            )}
            
            {actionType === 'approve' && (
              <p className={`tw-mb-4 ${darkMode ? 'dark:tw-text-gray-300' : 'tw-text-gray-600'}`}>
                {t('updateRequest.popups.approve.message')}
              </p>
            )}
            
            {actionType === 'reject' && (
              <p className={`tw-mb-4 ${darkMode ? 'dark:tw-text-gray-300' : 'tw-text-gray-600'}`}>
                {t('updateRequest.popups.reject.message')}
              </p>
            )}
            
            <div className="tw-flex tw-justify-end tw-gap-3">
              <button 
                onClick={() => {
                  setIsActive(false);
                  setPaidAmount('');
                  setComment('');
                }} 
                className={`tw-border tw-border-gray-400 tw-text-gray-600 dark:tw-text-gray-300 dark:tw-border-gray-600 tw-rounded-md tw-px-4 tw-py-2 hover:tw-bg-gray-200 dark:hover:tw-bg-gray-700`}
              >
                {t('updateRequest.buttons.cancel')}
              </button>
              <button 
                onClick={() => {
                  handleStatusUpdate(selectedRequest._id, actionType);
                }} 
                className={`tw-border-0 tw-rounded-md tw-px-4 tw-py-2 tw-text-white ${
                  actionType === 'approve' 
                    ? 'tw-bg-green-500 hover:tw-bg-green-600' 
                    : actionType === 'partial'
                    ? 'tw-bg-blue-500 hover:tw-bg-blue-600'
                    : 'tw-bg-red-500 hover:tw-bg-red-600'
                }`}
              >
                {t('updateRequest.buttons.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Preview Popup */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)} 
          className="tw-fixed tw-inset-0 tw-flex tw-justify-center tw-items-center tw-z-[9999] tw-bg-black/60 tw-p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className={`tw-flex tw-flex-col tw-p-4 tw-rounded-2xl tw-shadow-lg tw-max-w-full tw-max-h-[90vh] ${
              darkMode ? 'dark:tw-bg-gray-800' : 'tw-bg-white'
            }`}
          >
            <div className="tw-flex-1 tw-overflow-auto tw-flex tw-justify-center tw-items-center">
              <img 
                src={selectedImage} 
                alt="Proof" 
                className="tw-max-w-full tw-max-h-[70vh] tw-object-contain tw-rounded-lg" 
              />
            </div>
            <div className="tw-mt-4 tw-text-right">
              <button 
                onClick={() => setSelectedImage(null)} 
                className="tw-bg-gray-300 dark:tw-bg-gray-600 tw-text-black dark:tw-text-white tw-rounded-md tw-px-4 tw-py-2 hover:tw-bg-gray-400 dark:hover:tw-bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="tw-container-fluid tw-px-4 tw-py-6">
        <div className="tw-row tw-flex tw-justify-center">
          <div className={`tw-w-full tw-rounded-2xl tw-p-6 tw-relative ${styles.shad} ${
            darkMode ? 'dark:tw-bg-gray-800 dark:tw-text-white' : 'tw-bg-white'
          }`}>
            <h3 className={`tw-text-xl md:tw-text-2xl tw-font-semibold tw-mb-6 ${
              darkMode ? 'dark:tw-text-white' : ''
            }`}>
              {t('updateRequest.requestDetails')}
            </h3>
            
            <div className="tw-overflow-auto" style={{ maxHeight: 'calc(80vh - 200px)' }}>
              <table className={`tw-w-full ${darkMode ? 'dark:tw-bg-gray-800 dark:tw-text-white' : ''}`}>
                <thead className={darkMode ? 'dark:tw-bg-gray-700' : 'tw-bg-gray-100'}>
                  <tr>
                    <th className="tw-px-4 tw-py-3 tw-sticky tw-top-0 tw-z-10 tw-bg-inherit">{t('updateRequest.tableHeaders.id')}</th>
                    <th className="tw-px-4 tw-py-3 tw-sticky tw-top-0 tw-z-10 tw-bg-inherit">{t('updateRequest.tableHeaders.tripName')}</th>
                    <th className="tw-px-4 tw-py-3 tw-sticky tw-top-0 tw-z-10 tw-bg-inherit">{t('updateRequest.tableHeaders.user')}</th>
                    <th className="tw-px-4 tw-py-3 tw-sticky tw-top-0 tw-z-10 tw-bg-inherit">{t('updateRequest.tableHeaders.screenshot')}</th>
                    <th className="tw-px-4 tw-py-3 tw-sticky tw-top-0 tw-z-10 tw-bg-inherit">{t('updateRequest.tableHeaders.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingRequests.length > 0 ? (
                    bookingRequests.map((request, index) => (
                      <tr 
                        key={request._id}
                        className={`${darkMode ? 'dark:tw-bg-gray-800 dark:hover:tw-bg-gray-700 dark:tw-border-gray-700' : 'tw-border-t hover:tw-bg-gray-50'}`}
                      >
                        <td className="tw-px-4 tw-py-3">{index + 1}</td>
                        <td className="tw-px-4 tw-py-3">{request.eventName || 'N/A'}</td>
                        <td className="tw-px-4 tw-py-3">{request.user?.userName || 'N/A'}</td>
                        <td className="tw-px-4 tw-py-3">
                          {request.screenshot && (
                            <span 
                              onClick={() => setSelectedImage(request.screenshot)} 
                              className={`tw-text-blue-500 dark:tw-text-blue-400 hover:tw-underline tw-cursor-pointer`}
                            >
                              {t('updateRequest.viewScreenshot')}
                            </span>
                          )}
                        </td>
                        <td className="tw-px-4 tw-py-3">
                          <i 
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsActive(true);
                              setActionType('approve');
                            }} 
                            className="fa-solid fa-circle-check tw-text-green-500 tw-text-xl tw-mx-2 tw-cursor-pointer hover:tw-scale-110 tw-transition-transform"
                            title="Approve Full Payment"
                          ></i>
                          <i 
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsActive(true);
                              setActionType('partial');
                            }} 
                            className="fa-solid fa-percent tw-text-blue-500 tw-text-xl tw-mx-2 tw-cursor-pointer hover:tw-scale-110 tw-transition-transform"
                            title="Partial Payment"
                          ></i>
                          <i 
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsActive(true);
                              setActionType('reject');
                            }} 
                            className="fa-solid fa-ban tw-text-red-500 tw-text-xl tw-mx-2 tw-cursor-pointer hover:tw-scale-110 tw-transition-transform"
                            title="Reject"
                          ></i>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td 
                        colSpan="5" 
                        className={`tw-text-center tw-py-8 ${darkMode ? 'dark:tw-text-gray-300' : ''}`}
                      >
                        No pending booking requests
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}