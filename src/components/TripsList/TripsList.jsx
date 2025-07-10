// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { 
//   FaUsers, 
//   FaCalendarAlt, 
//   FaTicketAlt, 
//   FaBus, 
//   FaSearch, 
//   FaRegClock, 
//   FaUserClock 
// } from 'react-icons/fa';
// import { MdEventAvailable, MdEventBusy } from 'react-icons/md';
// import { RiUserFill } from 'react-icons/ri';
// import styles from './TripsList.module.css';

// export default function TripsList() {
//   const [events, setEvents] = useState([]);
//   const [filteredEvents, setFilteredEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     const fetchEvents = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(
//           'https://ugmproject.vercel.app/api/v1/event/getAllEventsReserveds',
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log(res.data)
//         setEvents(res.data.events);
//         setFilteredEvents(res.data.events);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching events:', err);
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   useEffect(() => {
//     const results = events.filter(event =>
//       event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       event.date.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredEvents(results);
//   }, [searchTerm, events]);

//   const handleSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });

//     const sortedEvents = [...filteredEvents].sort((a, b) => {
//       if (a[key] < b[key]) {
//         return direction === 'asc' ? -1 : 1;
//       }
//       if (a[key] > b[key]) {
//         return direction === 'asc' ? 1 : -1;
//       }
//       return 0;
//     });

//     setFilteredEvents(sortedEvents);
//   };

//   const getAvailabilityStatus = (event) => {
//     const available = event.capacity - event.reservedCount;
//     if (available <= 0) return 'full';
//     if (available <= event.capacity * 0.2) return 'limited';
//     return 'available';
//   };

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleString('ar-EG', {
//       day: 'numeric',
//       month: 'numeric',
//       year: 'numeric',
//       hour: 'numeric',
//       minute: 'numeric',
//       hour12: true
//     });
//   };

//   return (
//     <div className="tw-min-h-screen tw-bg-gray-50 dark:tw-bg-gray-900 tw-p-4 md:tw-p-8">
//       {selectedEvent && (
//         <div
//           onClick={() => setSelectedEvent(null)}
//           className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50 tw-p-4"
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-xl tw-w-full tw-max-w-4xl tw-max-h-[90vh] tw-overflow-y-auto"
//           >
//             <div className="tw-p-6">
//               <div className="tw-flex tw-justify-between tw-items-start tw-mb-6">
//                 <div>
//                   <h3 className="tw-text-2xl tw-font-bold tw-flex tw-items-center tw-gap-2">
//                     <FaUsers className="tw-text-blue-600" />
//                     {selectedEvent.eventName}
//                   </h3>
//                   <div className="tw-flex tw-items-center tw-gap-4 tw-mt-2 tw-text-gray-600 dark:tw-text-gray-300">
//                     <span className="tw-flex tw-items-center tw-gap-1">
//                       <FaCalendarAlt />
//                       {formatDate(selectedEvent.date)}
//                     </span>
//                     <span className="tw-flex tw-items-center tw-gap-1">
//                       <FaTicketAlt />
//                       {selectedEvent.price} EGP
//                     </span>
//                     {selectedEvent.needsBus && (
//                       <span className="tw-flex tw-items-center tw-gap-1 tw-text-orange-500">
//                         <FaBus />
//                         Bus required
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <div className="tw-bg-blue-100 dark:tw-bg-blue-900 tw-p-2 tw-rounded-lg">
//                   <span className="tw-text-blue-800 dark:tw-text-blue-200 tw-font-medium">
//                     {selectedEvent.reservedCount} / {selectedEvent.capacity}
//                   </span>
//                 </div>
//               </div>

//               {selectedEvent.images?.length > 0 && (
//                 <div className="tw-mb-6">
//                   <h4 className="tw-text-lg tw-font-semibold tw-mb-2">Event Images</h4>
//                   <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-2">
//                     {selectedEvent.images.map((img, index) => (
//                       <img
//                         key={index}
//                         src={img}
//                         alt={`Event ${index + 1}`}
//                         className="tw-rounded-lg tw-object-cover tw-h-32 tw-w-full"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="tw-mb-6">
//                 <h4 className="tw-text-lg tw-font-semibold tw-mb-4 tw-flex tw-items-center tw-gap-2">
//                   <RiUserFill className="tw-text-blue-600" />
//                   Registered Participants ({selectedEvent.reservedUsers.length})
//                 </h4>

//                 {selectedEvent.reservedUsers.length > 0 ? (
//                   <div className="tw-overflow-x-auto">
//                     <table className="tw-min-w-full tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
//                       <thead className="tw-bg-gray-50 dark:tw-bg-gray-700">
//                         <tr>
//                           <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
//                             #
//                           </th>
//                           <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
//                             Name
//                           </th>
//                           <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
//                             Email
//                           </th>
//                           <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
//                             Phone
//                           </th>
//                           <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
//                             <div className="tw-flex tw-items-center tw-gap-1">
//                               <FaUserClock />
//                               Reservation Time
//                             </div>
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="tw-bg-white dark:tw-bg-gray-800 tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
//                         {selectedEvent.reservedUsers.map((user, index) => (
//                           <tr key={user._id} className="hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700">
//                             <td className="tw-px-4 tw-py-3 tw-whitespace-nowrap">{index + 1}</td>
//                             <td className="tw-px-4 tw-py-3 tw-whitespace-nowrap">{user.userName}</td>
//                             <td className="tw-px-4 tw-py-3 tw-whitespace-nowrap">{user.email}</td>
//                             <td className="tw-px-4 tw-py-3 tw-whitespace-nowrap">{user.phone}</td>
//                             <td className="tw-px-4 tw-py-3 tw-whitespace-nowrap">
//                               <div className="tw-flex tw-items-center tw-gap-1">
//                                 <FaRegClock className="tw-text-gray-400" />
//                                 {formatDateTime(user.reservationDate || user.createdAt)}
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div className="tw-text-center tw-py-8 tw-text-gray-500 dark:tw-text-gray-400">
//                     <MdEventBusy className="tw-text-4xl tw-mx-auto tw-mb-2" />
//                     <p>No participants registered yet</p>
//                   </div>
//                 )}
//               </div>

//               <div className="tw-flex tw-justify-end">
//                 <button
//                   onClick={() => setSelectedEvent(null)}
//                   className="tw-px-4 tw-py-2 tw-bg-gray-300 dark:tw-bg-gray-700 hover:tw-bg-gray-400 dark:hover:tw-bg-gray-600 tw-text-black dark:tw-text-white tw-rounded-lg tw-transition tw-duration-200"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="tw-max-w-7xl tw-mx-auto">
//         <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-start md:tw-items-center tw-mb-6 tw-gap-4">
//           <h2 className="tw-text-2xl md:tw-text-3xl tw-font-bold dark:tw-text-white">
//             Events Management Dashboard
//           </h2>
          
//           <div className="tw-relative tw-w-full md:tw-w-64">
//             <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
//               <FaSearch className="tw-text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search events..."
//               className="tw-pl-10 tw-pr-4 tw-py-2 tw-w-full tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg tw-bg-white dark:tw-bg-gray-800 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         {loading ? (
//           <div className="tw-flex tw-justify-center tw-items-center tw-py-12">
//             <div className="tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-t-2 tw-border-b-2 tw-border-blue-500"></div>
//           </div>
//         ) : filteredEvents.length === 0 ? (
//           <div className="tw-text-center tw-py-12 tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow">
//             <MdEventBusy className="tw-text-5xl tw-mx-auto tw-text-gray-400 tw-mb-4" />
//             <h3 className="tw-text-xl tw-font-medium tw-text-gray-600 dark:tw-text-gray-300">
//               {searchTerm ? 'No events match your search' : 'No events available'}
//             </h3>
//             {searchTerm && (
//               <button
//                 onClick={() => setSearchTerm('')}
//                 className="tw-mt-4 tw-px-4 tw-py-2 tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-rounded-lg tw-transition"
//               >
//                 Clear search
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow tw-overflow-hidden">
//             <div className="tw-overflow-x-auto">
//               <table className="tw-min-w-full tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
//                 <thead className="tw-bg-gray-50 dark:tw-bg-gray-700">
//                   <tr>
//                     <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider tw-cursor-pointer" onClick={() => handleSort('eventName')}>
//                       Event
//                       {sortConfig.key === 'eventName' && (
//                         <span className="tw-ml-1">
//                           {sortConfig.direction === 'asc' ? '↑' : '↓'}
//                         </span>
//                       )}
//                     </th>
//                     <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider tw-cursor-pointer" onClick={() => handleSort('date')}>
//                       Date
//                       {sortConfig.key === 'date' && (
//                         <span className="tw-ml-1">
//                           {sortConfig.direction === 'asc' ? '↑' : '↓'}
//                         </span>
//                       )}
//                     </th>
//                     <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
//                       Capacity
//                     </th>
//                     <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider tw-cursor-pointer" onClick={() => handleSort('reservedCount')}>
//                       Registered
//                       {sortConfig.key === 'reservedCount' && (
//                         <span className="tw-ml-1">
//                           {sortConfig.direction === 'asc' ? '↑' : '↓'}
//                         </span>
//                       )}
//                     </th>
//                     <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
//                       Status
//                     </th>
//                     <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="tw-bg-white dark:tw-bg-gray-800 tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
//                   {filteredEvents.map((event) => (
//                     <tr key={event._id} className="hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700">
//                       <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
//                         <div className="tw-font-medium dark:tw-text-white">{event.eventName}</div>
//                         <div className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">
//                           {event.price} EGP
//                         </div>
//                       </td>
//                       <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
//                         <div className="tw-flex tw-items-center tw-gap-2">
//                           <FaCalendarAlt className="tw-text-gray-400" />
//                           {formatDate(event.date)}
//                         </div>
//                       </td>
//                       <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
//                         {event.capacity}
//                       </td>
//                       <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
//                         <div className="tw-flex tw-items-center tw-gap-2">
//                           <RiUserFill className="tw-text-blue-500" />
//                           {event.reservedCount}
//                         </div>
//                       </td>
//                       <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
//                         <span className={`tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium ${
//                           getAvailabilityStatus(event) === 'full'
//                             ? 'tw-bg-red-100 tw-text-red-800 dark:tw-bg-red-900 dark:tw-text-red-200'
//                             : getAvailabilityStatus(event) === 'limited'
//                             ? 'tw-bg-yellow-100 tw-text-yellow-800 dark:tw-bg-yellow-900 dark:tw-text-yellow-200'
//                             : 'tw-bg-green-100 tw-text-green-800 dark:tw-bg-green-900 dark:tw-text-green-200'
//                         }`}>
//                           {getAvailabilityStatus(event) === 'full'
//                             ? 'Fully Booked'
//                             : getAvailabilityStatus(event) === 'limited'
//                             ? 'Limited Spots'
//                             : 'Available'}
//                         </span>
//                       </td>
//                       <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
//                         <button
//                           onClick={() => setSelectedEvent(event)}
//                           className="tw-px-3 tw-py-1 tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-rounded-lg tw-transition tw-duration-200 tw-flex tw-items-center tw-gap-1"
//                         >
//                           <FaUsers />
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }






















import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaTicketAlt, 
  FaBus, 
  FaSearch, 
  FaRegClock, 
  FaUserClock,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaWallet,
  FaCheckCircle,
  FaTimesCircle,
  FaClock
} from 'react-icons/fa';
import { MdEventAvailable, MdEventBusy } from 'react-icons/md';
import { RiUserFill } from 'react-icons/ri';

export default function TripsList() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eventSortConfig, setEventSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [userSortConfig, setUserSortConfig] = useState({ 
    key: 'createdAt', 
    direction: 'desc',
    type: 'date' 
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          'https://ugmproject.vercel.app/api/v1/event/getAllEventsReserveds',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvents(res.data.events);
        setFilteredEvents(res.data.events);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const fetchEventDetails = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
      setEventLoading(true);
      setError(null);
      const res = await axios.get(
        `https://ugmproject.vercel.app/api/v1/event/getEventReservedsById/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedEvent(res.data.event);
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError('Failed to load event details. Please try again.');
    } finally {
      setEventLoading(false);
    }
  };

  useEffect(() => {
    const results = events.filter(event =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.date.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(results);
  }, [searchTerm, events]);

  const handleEventSort = (key) => {
    let direction = 'asc';
    if (eventSortConfig.key === key && eventSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setEventSortConfig({ key, direction });

    const sortedEvents = [...filteredEvents].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredEvents(sortedEvents);
  };

  const handleUserSort = (key, type = 'string') => {
    let direction = 'desc';
    if (userSortConfig.key === key && userSortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setUserSortConfig({ key, direction, type });
  };

  const sortUsers = (users) => {
    if (!users || !Array.isArray(users)) return [];
    
    return [...users].sort((a, b) => {
      // Handle bookingInfo if it exists
      const aBooking = a.bookingInfo || {};
      const bBooking = b.bookingInfo || {};
      
      let aValue, bValue;
      
      if (userSortConfig.key === 'createdAt') {
        aValue = aBooking.createdAt || a.createdAt || selectedEvent?.date;
        bValue = bBooking.createdAt || b.createdAt || selectedEvent?.date;
      } else if (userSortConfig.key === 'userName') {
        aValue = a.userName?.toLowerCase() || '';
        bValue = b.userName?.toLowerCase() || '';
      } else if (userSortConfig.key === 'phone') {
        aValue = a.phone || '';
        bValue = b.phone || '';
      } else if (userSortConfig.key === 'status') {
        aValue = aBooking.status || '';
        bValue = bBooking.status || '';
      } else if (userSortConfig.key === 'paymentMethod') {
        aValue = aBooking.paymentMethod || '';
        bValue = bBooking.paymentMethod || '';
      } else {
        aValue = a[userSortConfig.key] || '';
        bValue = b[userSortConfig.key] || '';
      }
      
      if (!aValue || !bValue) return 0;
      
      if (userSortConfig.type === 'date') {
        const aDate = new Date(aValue).getTime();
        const bDate = new Date(bValue).getTime();
        return userSortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
      } else {
        if (aValue < bValue) return userSortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return userSortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
    });
  };

  const getAvailabilityStatus = (event) => {
    const available = event.capacity - event.reservedCount;
    if (available <= 0) return 'full';
    if (available <= event.capacity * 0.2) return 'limited';
    return 'available';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'N/A';
    }
  };

  const renderSortIcon = (key, currentConfig) => {
    if (currentConfig.key !== key) return <FaSort className="tw-ml-1 tw-text-gray-400" />;
    return currentConfig.direction === 'asc' 
      ? <FaSortUp className="tw-ml-1" /> 
      : <FaSortDown className="tw-ml-1" />;
  };

  const handleViewEvent = (eventId) => {
    fetchEventDetails(eventId);
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="tw-text-green-500" />;
      case 'rejected':
        return <FaTimesCircle className="tw-text-red-500" />;
      case 'pending':
        return <FaClock className="tw-text-yellow-500" />;
      default:
        return <FaClock className="tw-text-gray-400" />;
    }
  };

  const renderPaymentMethod = (method) => {
    switch (method) {
      case 'wallet':
        return (
          <span className="tw-flex tw-items-center tw-gap-1">
            <FaWallet className="tw-text-purple-500" />
            Wallet
          </span>
        );
      case 'cash':
        return 'Cash';
      case 'card':
        return 'Credit Card';
      default:
        return method || 'N/A';
    }
  };

  return (
    <div className="tw-min-h-screen tw-bg-gray-50 dark:tw-bg-gray-900 tw-p-4 md:tw-p-8">
      {error && (
        <div className="tw-fixed tw-top-4 tw-right-4 tw-z-50">
          <div className="tw-bg-red-100 tw-border-l-4 tw-border-red-500 tw-text-red-700 tw-p-4 tw-rounded tw-shadow-lg tw-max-w-md">
            <div className="tw-flex tw-justify-between">
              <div className="tw-flex tw-items-center">
                <span className="tw-font-bold">Error</span>
              </div>
              <button onClick={() => setError(null)} className="tw-font-bold tw-text-xl">&times;</button>
            </div>
            <p className="tw-mt-2">{error}</p>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div
          onClick={() => setSelectedEvent(null)}
          className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50 tw-p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-xl tw-w-full tw-max-w-4xl tw-max-h-[90vh] tw-overflow-y-auto"
          >
            <div className="tw-p-6">
              {eventLoading ? (
                <div className="tw-flex tw-justify-center tw-items-center tw-py-12">
                  <div className="tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-t-2 tw-border-b-2 tw-border-blue-500"></div>
                </div>
              ) : (
                <>
                  <div className="tw-flex tw-justify-between tw-items-start tw-mb-6">
                    <div>
                      <h3 className="tw-text-2xl tw-font-bold tw-flex tw-items-center tw-gap-2">
                        <FaUsers className="tw-text-blue-600" />
                        {selectedEvent.eventName}
                      </h3>
                      <div className="tw-flex tw-items-center tw-gap-4 tw-mt-2 tw-text-gray-600 dark:tw-text-gray-300">
                        <span className="tw-flex tw-items-center tw-gap-1">
                          <FaCalendarAlt />
                          {formatDate(selectedEvent.date)}
                        </span>
                        <span className="tw-flex tw-items-center tw-gap-1">
                          <FaTicketAlt />
                          {selectedEvent.price} EGP
                        </span>
                        {selectedEvent.needsBus && (
                          <span className="tw-flex tw-items-center tw-gap-1 tw-text-orange-500">
                            <FaBus />
                            Bus required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="tw-bg-blue-100 dark:tw-bg-blue-900 tw-p-2 tw-rounded-lg">
                      <span className="tw-text-blue-800 dark:tw-text-blue-200 tw-font-medium">
                        {selectedEvent.reservedCount} / {selectedEvent.capacity}
                      </span>
                    </div>
                  </div>

                  {selectedEvent.images?.length > 0 && (
                    <div className="tw-mb-6">
                      <h4 className="tw-text-lg tw-font-semibold tw-mb-2">Event Images</h4>
                      <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-2">
                        {selectedEvent.images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Event ${index + 1}`}
                            className="tw-rounded-lg tw-object-cover tw-h-32 tw-w-full"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="tw-mb-6">
                    <h4 className="tw-text-lg tw-font-semibold tw-mb-4 tw-flex tw-items-center tw-gap-2">
                      <RiUserFill className="tw-text-blue-600" />
                      Registered Participants ({selectedEvent.reservedUsers?.length || 0})
                    </h4>

                    {selectedEvent.reservedUsers?.length > 0 ? (
                      <div className="tw-overflow-x-auto">
                        <table className="tw-min-w-full tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
                          <thead className="tw-bg-gray-50 dark:tw-bg-gray-700">
                            <tr>
                              <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                                #
                              </th>
                              <th 
                                className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider tw-cursor-pointer"
                                onClick={() => handleUserSort('userName', 'string')}
                              >
                                <div className="tw-flex tw-items-center">
                                  Name
                                  {renderSortIcon('userName', userSortConfig)}
                                </div>
                              </th>
                              <th 
                                className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider tw-cursor-pointer"
                                onClick={() => handleUserSort('phone', 'string')}
                              >
                                <div className="tw-flex tw-items-center">
                                  Phone
                                  {renderSortIcon('phone', userSortConfig)}
                                </div>
                              </th>
                              <th 
                                className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider tw-cursor-pointer"
                                onClick={() => handleUserSort('createdAt', 'date')}
                              >
                                <div className="tw-flex tw-items-center">
                                  <FaUserClock className="tw-mr-1" />
                                  Reservation Time
                                  {renderSortIcon('createdAt', userSortConfig)}
                                </div>
                              </th>
                              <th 
                                className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider tw-cursor-pointer"
                                onClick={() => handleUserSort('paymentMethod', 'string')}
                              >
                                <div className="tw-flex tw-items-center">
                                  Payment
                                  {renderSortIcon('paymentMethod', userSortConfig)}
                                </div>
                              </th>
                              <th 
                                className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider tw-cursor-pointer"
                                onClick={() => handleUserSort('status', 'string')}
                              >
                                <div className="tw-flex tw-items-center">
                                  Status
                                  {renderSortIcon('status', userSortConfig)}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="tw-bg-white dark:tw-bg-gray-800 tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
                            {sortUsers(selectedEvent.reservedUsers).map((user, index) => (
                              <tr key={user._id || index} className="hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700">
                                <td className="tw-px-4 tw-py-3 tw-whitespace-nowrap">{index + 1}</td>
                                <td className="tw-px-4 tw-py-3 tw-whitespace-nowrap">{user.userName}</td>
                                <td className="tw-px-4 tw-py-3 tw-whitespace-nowrap">{user.phone}</td>
                                <td className="tw-px-4 tw-py-3 tw-whitespace-nowrap">
                                  <div className="tw-flex tw-items-center tw-gap-1">
                                    <FaRegClock className="tw-text-gray-400" />
                                    {formatDateTime(
                                      user.bookingInfo?.createdAt || 
                                      user.createdAt || 
                                      selectedEvent.date
                                    )}
                                  </div>
                                </td>
                                <td className="tw-px-4 tw-py-3 tw-whitespace-nowrap">
                                  {renderPaymentMethod(user.bookingInfo?.paymentMethod)}
                                </td>
                                <td className="tw-px-4 tw-py-3 tw-whitespace-nowrap">
                                  <div className="tw-flex tw-items-center tw-gap-1 tw-capitalize">
                                    {renderStatusIcon(user.bookingInfo?.status)}
                                    {user.bookingInfo?.status || 'pending'}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="tw-text-center tw-py-8 tw-text-gray-500 dark:tw-text-gray-400">
                        <MdEventBusy className="tw-text-4xl tw-mx-auto tw-mb-2" />
                        <p>No participants registered yet</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="tw-flex tw-justify-end">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="tw-px-4 tw-py-2 tw-bg-gray-300 dark:tw-bg-gray-700 hover:tw-bg-gray-400 dark:hover:tw-bg-gray-600 tw-text-black dark:tw-text-white tw-rounded-lg tw-transition tw-duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="tw-max-w-7xl tw-mx-auto">
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-start md:tw-items-center tw-mb-6 tw-gap-4">
          <h2 className="tw-text-2xl md:tw-text-3xl tw-font-bold dark:tw-text-white">
            Events Management Dashboard
          </h2>
          
          <div className="tw-relative tw-w-full md:tw-w-64">
            <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
              <FaSearch className="tw-text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              className="tw-pl-10 tw-pr-4 tw-py-2 tw-w-full tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg tw-bg-white dark:tw-bg-gray-800 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="tw-flex tw-justify-center tw-items-center tw-py-12">
            <div className="tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-t-2 tw-border-b-2 tw-border-blue-500"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="tw-text-center tw-py-12 tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow">
            <MdEventBusy className="tw-text-5xl tw-mx-auto tw-text-gray-400 tw-mb-4" />
            <h3 className="tw-text-xl tw-font-medium tw-text-gray-600 dark:tw-text-gray-300">
              {searchTerm ? 'No events match your search' : 'No events available'}
            </h3>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="tw-mt-4 tw-px-4 tw-py-2 tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-rounded-lg tw-transition"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow tw-overflow-hidden">
            <div className="tw-overflow-x-auto">
              <table className="tw-min-w-full tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
                <thead className="tw-bg-gray-50 dark:tw-bg-gray-700">
                  <tr>
                    <th 
                      className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider tw-cursor-pointer"
                      onClick={() => handleEventSort('eventName')}
                    >
                      <div className="tw-flex tw-items-center">
                        Event
                        {renderSortIcon('eventName', eventSortConfig)}
                      </div>
                    </th>
                    <th 
                      className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider tw-cursor-pointer"
                      onClick={() => handleEventSort('date')}
                    >
                      <div className="tw-flex tw-items-center">
                        Date
                        {renderSortIcon('date', eventSortConfig)}
                      </div>
                    </th>
                    <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                      Capacity
                    </th>
                    <th 
                      className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider tw-cursor-pointer"
                      onClick={() => handleEventSort('reservedCount')}
                    >
                      <div className="tw-flex tw-items-center">
                        Registered
                        {renderSortIcon('reservedCount', eventSortConfig)}
                      </div>
                    </th>
                    <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                      Status
                    </th>
                    <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="tw-bg-white dark:tw-bg-gray-800 tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
                  {filteredEvents.map((event) => (
                    <tr key={event._id} className="hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700">
                      <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                        <div className="tw-font-medium dark:tw-text-white">{event.eventName}</div>
                        <div className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">
                          {event.price} EGP
                        </div>
                      </td>
                      <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                        <div className="tw-flex tw-items-center tw-gap-2">
                          <FaCalendarAlt className="tw-text-gray-400" />
                          {formatDate(event.date)}
                        </div>
                      </td>
                      <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                        {event.capacity}
                      </td>
                      <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                        <div className="tw-flex tw-items-center tw-gap-2">
                          <RiUserFill className="tw-text-blue-500" />
                          {event.reservedCount}
                        </div>
                      </td>
                      <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                        <span className={`tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium ${
                          getAvailabilityStatus(event) === 'full'
                            ? 'tw-bg-red-100 tw-text-red-800 dark:tw-bg-red-900 dark:tw-text-red-200'
                            : getAvailabilityStatus(event) === 'limited'
                            ? 'tw-bg-yellow-100 tw-text-yellow-800 dark:tw-bg-yellow-900 dark:tw-text-yellow-200'
                            : 'tw-bg-green-100 tw-text-green-800 dark:tw-bg-green-900 dark:tw-text-green-200'
                        }`}>
                          {getAvailabilityStatus(event) === 'full'
                            ? 'Fully Booked'
                            : getAvailabilityStatus(event) === 'limited'
                            ? 'Limited Spots'
                            : 'Available'}
                        </span>
                      </td>
                      <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                        <button
                          onClick={() => handleViewEvent(event._id)}
                          className="tw-px-3 tw-py-1 tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-rounded-lg tw-transition tw-duration-200 tw-flex tw-items-center tw-gap-1"
                          disabled={eventLoading}
                        >
                          {eventLoading && selectedEvent?._id === event._id ? (
                            <span className="tw-inline-block tw-h-4 tw-w-4 tw-border-2 tw-border-white tw-border-t-transparent tw-rounded-full tw-animate-spin"></span>
                          ) : (
                            <>
                              <FaUsers />
                              View
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}