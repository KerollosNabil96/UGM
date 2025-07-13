// import React, { useContext, useEffect, useState } from 'react';
// import styles from './Events.module.css';
// import { darkModeContext } from '../../Context/DarkModeContext';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useTranslation } from 'react-i18next';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { FiRotateCcw } from 'react-icons/fi';
// import { Link } from 'react-router-dom';

// export default function Events() {
//   const { darkMode } = useContext(darkModeContext);
//   const { t } = useTranslation('events');
//   const { i18n } = useTranslation();
//   const isRTL = i18n.language === 'ar';

//   const [events, setEvents] = useState([]);
//   const [filteredEvents, setFilteredEvents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);

//   const token = localStorage.getItem('token') || null;
//   const role = localStorage.getItem('role') || '';

//   const eventsPerPage = 6;

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get('https://ugmproject.vercel.app/api/v1/event/getAllEvents', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log(res.data)
//         setEvents(res.data.events);
//         setFilteredEvents(res.data.events);
//       } catch (error) {
//         console.error('Error fetching events:', error);
//         toast.error('Failed to load events');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, [token]);

//   useEffect(() => {
//     const term = searchTerm.toLowerCase();
//     const filtered = events.filter(event => {
//       const matchesSearch = event.eventName.toLowerCase().includes(term);
//       const matchesCategory = selectedCategory === 'all' || event.category.toLowerCase() === selectedCategory;
//       return matchesSearch && matchesCategory;
//     });
//     setFilteredEvents(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, selectedCategory, events]);

//   const indexOfLastEvent = currentPage * eventsPerPage;
//   const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
//   const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
//   const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleDelete = async (eventId) => {
//     try {
//       await axios.delete(`https://ugmproject.vercel.app/api/v1/event/deleteEvent/${eventId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const updatedEvents = events.filter((e) => e._id !== eventId);
//       setEvents(updatedEvents);
//       setFilteredEvents(updatedEvents);
//       toast.success('Event deleted successfully!');
//     } catch (error) {
//       toast.error('Failed to delete event!');
//     } finally {
//       setShowModal(false);
//       setSelectedEvent(null);
//     }
//   };

//   const confirmDelete = (event) => {
//     setSelectedEvent(event);
//     setShowModal(true);
//   };

//   const getImageUrl = (imageUrl) => {
//     if (!imageUrl) return '/default-event-image.jpg';

//     if (imageUrl.includes('cloudinary.com')) {
//       return imageUrl;
//     }

//     if (imageUrl.startsWith('UgmMemoryUploads/')) {
//       return `https://res.cloudinary.com/djmr1aded/image/upload/${imageUrl}`;
//     }

//     if (imageUrl.startsWith('data:image')) {
//       return imageUrl;
//     }

//     return '/default-event-image.jpg';
//   };

//   return (
//     <>
//       <div className={`${darkMode ? 'tw-dark' : ''}`}>
// <div className="container-fluid dark:tw-bg-gray-800 tw-min-h-[80vh]">
//           <motion.div
//             initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 1 }}
//           >
//             <div className="container">
//               <div className="row">
//                 <h1 className="my-5 fw-bold mainColor dark:tw-text-indigo-600  text-center">
//                   {t('events.title')}
//                 </h1>

//                 <div className={`${styles.searching} d-flex align-items-center gap-3 flex-wrap rounded-4 py-4 dark:tw-bg-gray-900`}>
//   <input
//     type="text"
//     value={searchTerm}
//     onChange={(e) => setSearchTerm(e.target.value)}
//     placeholder={t('events.search.placeholder')}
//     className="form-control py-3 px-3 rounded-2"
//     style={{ flex: 2, minWidth: '200px' }}
//   />

//                 <select
//     value={selectedCategory}
//     onChange={(e) => setSelectedCategory(e.target.value)}
//     className="form-select py-3 px-3 tw-text-gray-700 dark:tw-bg-gray-800 dark:tw-text-white rounded-2 border-0"
//     style={{ flex: 1, minWidth: '150px' }}
//   >
//     <option value="all">{t('events.search.categories.all')}</option>
//     <option value="trip">{t('events.search.categories.trip')}</option>
//     <option value="event">{t('events.search.categories.events')}</option>
//   </select>
//                  <motion.button
//     whileHover={{ scale: 1.05, backgroundColor: '#5f78ff' }}
//     transition={{ duration: 0.3 }}
//     onClick={() => {
//       setSearchTerm('');
//       setSelectedCategory('all');
//       setFilteredEvents(events);
//       setCurrentPage(1);
//     }}
//     className="btn bg-main dark:tw-bg-indigo-600 text-white py-3 px-4 rounded-2 d-flex align-items-center gap-2"
//     style={{ flexShrink: 0 }}
//   >
//     <FiRotateCcw size={18} />
//     {t('events.search.button')}
//   </motion.button>
//                 </div>

//                 <div className="row">
//                   {loading ? (
//                     <div className="d-flex justify-content-center align-items-center my-5">
//                       <div className="spinner"></div>
//                     </div>
//                   ) : currentEvents.length === 0 ? (
//               <div className="fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-p-4">
//   <div className="tw-max-w-md tw-w-full tw-mx-auto tw-bg-gray-100 dark:tw-bg-gray-900 tw-rounded-lg tw-shadow-md tw-p-6 tw-text-center">
//     <h4 className="tw-text-lg tw-font-semibold tw-text-gray-700 dark:tw-text-white mb-2">
//       No events found.
//     </h4>
//     <p className="tw-text-gray-600 dark:tw-text-gray-300">
//       Try changing your search or category filter, or wait for upcoming events ✨
//     </p>
//   </div>
// </div>

//                   ) : (
//                     <AnimatePresence>
//                       {currentEvents.map((event) => (
//                         <motion.div
//                           key={event._id}
//                           initial={{ opacity: 0, scale: 0.9 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           exit={{ opacity: 0, scale: 0.9 }}
//                           whileHover={{ scale: 1.03 }}
//                           transition={{ duration: 0.3 }}
//                           className="col-lg-4 col-md-6 my-4"
//                         >
//                           <div className="card dark:tw-bg-gray-900 shadow" style={{ height: '630px', position: 'relative' }}>
//                             {token && ['Admin', 'SuperAdmin'].includes(role) && (
//                               <motion.button
//                                 whileHover={{ scale: 1.2, rotate: 90 }}
//                                 transition={{ type: 'spring', stiffness: 300 }}
//                                 onClick={() => confirmDelete(event)}
//                                 style={{
//                                   position: 'absolute',
//                                   top: '10px',
//                                   right: '10px',
//                                   backgroundColor: 'red',
//                                   color: 'white',
//                                   borderRadius: '50%',
//                                   width: '32px',
//                                   height: '32px',
//                                   border: 'none',
//                                   fontSize: '20px',
//                                   cursor: 'pointer',
//                                   zIndex: 10,
//                                   display: 'flex',
//                                   alignItems: 'center',
//                                   justifyContent: 'center'
//                                 }}
//                                 title="Delete Event"
//                               >
//                                 &times;
//                               </motion.button>
//                             )}

//                             <img
//                               src={getImageUrl(event.images[0])}
//                               className="card-img-top w-100"
//                               style={{ height: '360px', objectFit: 'cover' }}
//                               alt={event.eventName}
//                               onError={(e) => {
//                                 e.target.onerror = null;
//                                 e.target.src = '/default-event-image.jpg';
//                               }}
//                             />
//                             <div className="card-body">
//                               <h5 className="card-title mainColor dark:tw-text-indigo-600">{event.eventName}</h5>
//                               <p className="card-text dark:tw-text-white">{event.shortDescription}</p>
//                               <div className={`${styles.parent} ${isRTL ? styles.pad2 : styles.pad} parent`}>
//                                 <div className="card-end d-flex justify-content-between w-100">
//                                   <span className="tw-text-gray-500 dark:tw-text-white my-2">
//                                     {new Date(event.date).toLocaleDateString('en-GB')}
//                                   </span>
//                                   <Link
//                                     to={`/event/${event._id}`}
//                                     className="bg-main text-white dark:tw-bg-indigo-600 tw-px-7 py-2 rounded-3"
//                                   >
//                                     View
//                                   </Link>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </motion.div>
//                       ))}
//                     </AnimatePresence>
//                   )}
//                 </div>

//                 {!loading && totalPages > 1 && (
//                   <div className="d-flex justify-content-center align-items-center my-4 gap-2 flex-wrap">
//                     {Array.from({ length: totalPages }, (_, i) => (
//                       <button
//                         key={i}
//                         onClick={() => handlePageChange(i + 1)}
//                         className={`btn ${currentPage === i + 1
//                           ? 'bg-main text-white dark:tw-bg-indigo-600'
//                           : 'btn-outline-primary'} px-3 py-2 rounded-3`}
//                       >
//                         {i + 1}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {showModal && selectedEvent && (
//         <div className="modal-backdrop">
//           <div className="modal-box">
//             <h4 className="text-danger fw-bold">⚠️ Delete Event</h4>
//             <p>Are you sure you want to delete <b>{selectedEvent.eventName}</b>?</p>
//             <p className="text-danger">This action cannot be undone.</p>
//             <div className="d-flex justify-content-end gap-2 mt-4">
//               <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
//               <button onClick={() => handleDelete(selectedEvent._id)} className="btn btn-danger">Delete</button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         .modal-backdrop {
//           position: fixed;
//           top: 0; left: 0;
//           width: 100%; height: 100%;
//           background: rgba(0, 0, 0, 0.4);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           z-index: 9999;
//         }
//         .modal-box {
//           background: white;
//           padding: 30px;
//           border-radius: 12px;
//           width: 100%;
//           max-width: 400px;
//           box-shadow: 0 0 20px rgba(0,0,0,0.1);
//         }
//         .spinner {
//           width: 60px;
//           height: 60px;
//           border: 6px solid #ddd;
//           border-top: 6px solid #4f46e5;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </>
//   );
// }




import React, { useContext, useEffect, useState } from 'react';
import styles from './Events.module.css';
import { darkModeContext } from '../../Context/DarkModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiRotateCcw } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Events() {
  const { darkMode } = useContext(darkModeContext);
  const { t } = useTranslation('events');
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingEventId, setLoadingEventId] = useState(null);

  const token = localStorage.getItem('token') || null;
  const role = localStorage.getItem('role') || '';

  const eventsPerPage = 6;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://ugmproject.vercel.app/api/v1/event/getAllEvents', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data.events);
        setFilteredEvents(res.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [token]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = events.filter(event => {
      const matchesSearch = event.eventName.toLowerCase().includes(term);
      const matchesCategory = selectedCategory === 'all' || event.category.toLowerCase() === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, events]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`https://ugmproject.vercel.app/api/v1/event/deleteEvent/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedEvents = events.filter((e) => e._id !== eventId);
      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents);
      toast.success('Event deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete event!');
    } finally {
      setShowModal(false);
      setSelectedEvent(null);
    }
  };

  const confirmDelete = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/default-event-image.jpg';

    if (imageUrl.includes('cloudinary.com')) {
      return imageUrl;
    }

    if (imageUrl.startsWith('UgmMemoryUploads/')) {
      return `https://res.cloudinary.com/djmr1aded/image/upload/${imageUrl}`;
    }

    if (imageUrl.startsWith('data:image')) {
      return imageUrl;
    }

    return '/default-event-image.jpg';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`${darkMode ? 'tw-dark' : ''}`}
    >
      <div className="container-fluid dark:tw-bg-gray-800 tw-min-h-[80vh]">
        <div className="container">
          <div className="row">
            <h1 className="my-5 fw-bold mainColor dark:tw-text-indigo-600 text-center">
              {t('events.title')}
            </h1>

            <div className={`${styles.searching} d-flex align-items-center gap-3 flex-wrap rounded-4 py-4 dark:tw-bg-gray-900`}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('events.search.placeholder')}
                className="form-control py-3 px-3 rounded-2"
                style={{ flex: 2, minWidth: '200px' }}
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select py-3 px-3 tw-text-gray-700 dark:tw-bg-gray-800 dark:tw-text-white rounded-2 border-0"
                style={{ flex: 1, minWidth: '150px' }}
              >
                <option value="all">{t('events.search.categories.all')}</option>
                <option value="trip">{t('events.search.categories.trip')}</option>
                <option value="event">{t('events.search.categories.events')}</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#5f78ff' }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setFilteredEvents(events);
                  setCurrentPage(1);
                }}
                className="btn bg-main dark:tw-bg-indigo-600 text-white py-3 px-4 rounded-2 d-flex align-items-center gap-2"
                style={{ flexShrink: 0 }}
              >
                <FiRotateCcw size={18} />
                {t('events.search.button')}
              </motion.button>
            </div>

            <div className="row">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '300px' }}>
                  <div className="tw-w-12 tw-h-12 tw-border-4 tw-border-blue-500 tw-border-t-transparent tw-rounded-full tw-animate-spin"></div>
                </div>
              ) : currentEvents.length === 0 ? (
                <div className="fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-p-4">
                  <div className="tw-max-w-md tw-w-full tw-mx-auto tw-bg-gray-100 dark:tw-bg-gray-900 tw-rounded-lg tw-shadow-md tw-p-6 tw-text-center">
                    <h4 className="tw-text-lg tw-font-semibold tw-text-gray-700 dark:tw-text-white mb-2">
                      No events found.
                    </h4>
                    <p className="tw-text-gray-600 dark:tw-text-gray-300">
                      Try changing your search or category filter, or wait for upcoming events ✨
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {currentEvents.map((event) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                      className="col-lg-4 col-md-6 my-4"
                    >
                      <div className="card dark:tw-bg-gray-900 shadow" style={{ height: '630px', position: 'relative' }}>
                        {token && ['Admin', 'SuperAdmin'].includes(role) && (
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: 90 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            onClick={() => confirmDelete(event)}
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              backgroundColor: 'red',
                              color: 'white',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              border: 'none',
                              fontSize: '20px',
                              cursor: 'pointer',
                              zIndex: 10,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Delete Event"
                          >
                            &times;
                          </motion.button>
                        )}

                        <img
                          src={getImageUrl(event.images[0])}
                          className="card-img-top w-100"
                          style={{ height: '360px', objectFit: 'cover' }}
                          alt={event.eventName}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-event-image.jpg';
                          }}
                        />
                        <div className="card-body">
                          <h5 className="card-title mainColor dark:tw-text-indigo-600">{event.eventName}</h5>
                          <p className="card-text dark:tw-text-white">{event.shortDescription}</p>
                          <div className={`${styles.parent} ${isRTL ? styles.pad2 : styles.pad} parent`}>
                            <div className="card-end d-flex justify-content-between w-100">
                              <span className="tw-text-gray-500 dark:tw-text-white my-2">
                                {new Date(event.date).toLocaleDateString('en-GB')}
                              </span>
                              <AnimatePresence mode="wait">
                                <motion.div
                                  key={event._id}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Link
                                    to={`/event/${event._id}`}
                                    className="bg-main text-white dark:tw-bg-indigo-600 tw-px-7 py-2 rounded-3"
                                    onClick={() => setLoadingEventId(event._id)}
                                  >
                                    {loadingEventId === event._id ? (
                                      <div className="tw-inline-block tw-w-4 tw-h-4 tw-border-2 tw-border-white tw-border-t-transparent tw-rounded-full tw-animate-spin"></div>
                                    ) : (
                                      'View'
                                    )}
                                  </Link>
                                </motion.div>
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {!loading && totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center my-4 gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`btn ${currentPage === i + 1
                      ? 'bg-main text-white dark:tw-bg-indigo-600'
                      : 'btn-outline-primary'} px-3 py-2 rounded-3`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Delete Confirmation */}
      <AnimatePresence>
        {showModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50 tw-p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className={`tw-relative tw-max-w-md tw-w-full tw-rounded-lg tw-shadow-lg tw-p-6 ${darkMode ? 'tw-bg-gray-800' : 'tw-bg-white'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="tw-absolute tw-top-4 tw-right-4 tw-text-gray-500 hover:tw-text-gray-700 dark:hover:tw-text-gray-300"
              >
                <svg className="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="tw-text-center">
                <div className="tw-mx-auto tw-flex tw-items-center tw-justify-center tw-h-12 tw-w-12 tw-rounded-full tw-bg-red-100 dark:tw-bg-red-900/50">
                  <svg className="tw-h-6 tw-w-6 tw-text-red-600 dark:tw-text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className={`tw-mt-3 tw-text-lg tw-font-medium ${darkMode ? 'tw-text-white' : 'tw-text-gray-900'}`}>
                  Delete Event
                </h3>
                <div className={`tw-mt-2 tw-text-sm ${darkMode ? 'tw-text-gray-300' : 'tw-text-gray-500'}`}>
                  <p>Are you sure you want to delete <b>{selectedEvent.eventName}</b>?</p>
                  <p className="tw-text-red-500 dark:tw-text-red-400">This action cannot be undone.</p>
                </div>
              </div>

              <div className="tw-mt-5 tw-flex tw-justify-center tw-gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`tw-px-4 tw-py-2 tw-rounded-md tw-border tw-border-gray-300 tw-text-sm tw-font-medium ${darkMode ? 'tw-text-gray-300 tw-bg-gray-700 hover:tw-bg-gray-600' : 'tw-text-gray-700 tw-bg-white hover:tw-bg-gray-50'}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(selectedEvent._id)}
                  className="tw-px-4 tw-py-2 tw-rounded-md tw-border tw-border-transparent tw-text-sm tw-font-medium tw-text-white tw-bg-red-600 hover:tw-bg-red-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-red-500"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add this CSS to your Events.module.css or global CSS */}
      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-box {
          background: ${darkMode ? '#1f2937' : 'white'};
          padding: 2rem;
          border-radius: 0.5rem;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          color: ${darkMode ? 'white' : 'inherit'};
        }
      `}</style>
    </motion.div>
  );
}