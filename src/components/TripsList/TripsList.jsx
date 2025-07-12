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
import Spinner from '../Spinner/Spinner';

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
  const [currentPage, setCurrentPage] = useState(1);
  const EVENTS_PER_PAGE = 6;

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
      console.log(res.data)
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
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, events]);

  // Pagination logic
  const indexOfLastEvent = currentPage * EVENTS_PER_PAGE;
  const indexOfFirstEvent = indexOfLastEvent - EVENTS_PER_PAGE;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
          <span className="tw-flex tw-items-center tw-gap-1 dark:tw-text-white">
            <FaWallet className="tw-text-purple-500" />
            Wallet
          </span>
        );
      case 'cash':
        return <span className="dark:tw-text-white">Cash</span>;
      case 'card':
        return <span className="dark:tw-text-white">Credit Card</span>;
      default:
        return <span className="dark:tw-text-white">{method || 'N/A'}</span>;
    }
  };

  if (loading) {
    return (
      <div className="tw-min-h-[80vh] tw-flex tw-items-center tw-justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="tw-min-h-[80vh] tw-bg-gray-50 dark:tw-bg-gray-900 tw-p-3 md:tw-p-6">
      {error && (
        <div className="tw-fixed tw-top-4 tw-right-4 tw-z-50">
          <div className="tw-bg-red-100 tw-border-l-4 tw-border-red-500 tw-text-red-700 tw-p-3 tw-rounded tw-shadow-md tw-max-w-md">
            <div className="tw-flex tw-justify-between">
              <div className="tw-font-bold">Error</div>
              <button onClick={() => setError(null)} className="tw-font-bold tw-text-xl">&times;</button>
            </div>
            <p className="tw-mt-1">{error}</p>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div
          onClick={() => setSelectedEvent(null)}
          className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50 tw-p-3"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow-md tw-w-full tw-max-w-4xl tw-max-h-[90vh] tw-overflow-y-auto"
          >
            <div className="tw-p-4">
              {eventLoading ? (
                <div className="tw-min-h-[60vh] tw-flex tw-items-center tw-justify-center">
                  <Spinner />
                </div>
              ) : (
                <>
                  <div className="tw-flex tw-justify-between tw-items-start tw-mb-4">
                    <div>
                      <h3 className="tw-text-xl tw-font-bold tw-flex tw-items-center tw-gap-2 dark:tw-text-white">
                        <FaUsers className="tw-text-blue-600" />
                        {selectedEvent.eventName}
                      </h3>
                      <div className="tw-flex tw-items-center tw-gap-3 tw-mt-1 tw-text-gray-600 dark:tw-text-gray-300">
                        <span className="tw-flex tw-items-center tw-gap-1 dark:tw-text-white">
                          <FaCalendarAlt />
                          {formatDate(selectedEvent.date)}
                        </span>
                        <span className="tw-flex tw-items-center tw-gap-1 dark:tw-text-white">
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
                    <div className="tw-bg-blue-100 dark:tw-bg-blue-900 tw-px-2 tw-py-1 tw-rounded-lg">
                      <span className="tw-text-blue-800 dark:tw-text-blue-200 tw-font-medium">
                        {selectedEvent.reservedCount} / {selectedEvent.capacity}
                      </span>
                    </div>
                  </div>

                  {selectedEvent.images?.length > 0 && (
                    <div className="tw-mb-4">
                      <h4 className="tw-text-base tw-font-semibold tw-mb-2 dark:tw-text-white">Event Images</h4>
                      <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-2">
                        {selectedEvent.images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Event ${index + 1}`}
                            className="tw-rounded-md tw-object-cover tw-h-24 tw-w-full"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="tw-mb-4">
                    <h4 className="tw-text-base tw-font-semibold tw-mb-2 tw-flex tw-items-center tw-gap-2 dark:tw-text-white">
                      <RiUserFill className="tw-text-blue-600" />
                      Registered Participants ({selectedEvent.reservedUsers?.length || 0})
                    </h4>

                    {selectedEvent.reservedUsers?.length > 0 ? (
                      <div className="tw-overflow-x-auto">
                        <table className="tw-min-w-full tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700 text-sm">
                          <thead className="tw-bg-gray-50 dark:tw-bg-gray-700">
                            <tr>
                              <th className="tw-px-3 tw-py-2 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase">#</th>
                              <th className="tw-px-3 tw-py-2 tw-text-left tw-cursor-pointer" onClick={() => handleUserSort('userName', 'string')}>
                                <div className="tw-flex tw-items-center">Name {renderSortIcon('userName', userSortConfig)}</div>
                              </th>
                              <th className="tw-px-3 tw-py-2 tw-text-left tw-cursor-pointer" onClick={() => handleUserSort('phone', 'string')}>
                                <div className="tw-flex tw-items-center">Phone {renderSortIcon('phone', userSortConfig)}</div>
                              </th>
                              <th className="tw-px-3 tw-py-2 tw-text-left tw-cursor-pointer" onClick={() => handleUserSort('createdAt', 'date')}>
                                <div className="tw-flex tw-items-center"><FaUserClock className="tw-mr-1" /> Time {renderSortIcon('createdAt', userSortConfig)}</div>
                              </th>
                              <th className="tw-px-3 tw-py-2 tw-text-left tw-cursor-pointer" onClick={() => handleUserSort('paymentMethod', 'string')}>
                                <div className="tw-flex tw-items-center">Payment {renderSortIcon('paymentMethod', userSortConfig)}</div>
                              </th>
                              <th className="tw-px-3 tw-py-2 tw-text-left tw-cursor-pointer" onClick={() => handleUserSort('status', 'string')}>
                                <div className="tw-flex tw-items-center">Status {renderSortIcon('status', userSortConfig)}</div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="tw-bg-white dark:tw-bg-gray-800">
                            {sortUsers(selectedEvent.reservedUsers).map((user, index) => (
                              <tr key={user._id || index} className="hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700">
                                <td className="tw-px-3 tw-py-2 dark:tw-text-white">{index + 1}</td>
                                <td className="tw-px-3 tw-py-2 dark:tw-text-white">{user.userName}</td>
                                <td className="tw-px-3 tw-py-2 dark:tw-text-white">{user.phone}</td>
                                <td className="tw-px-3 tw-py-2 dark:tw-text-white">
                                  <div className="tw-flex tw-items-center tw-gap-1">
                                    <FaRegClock className="tw-text-gray-400" />
                                    {formatDateTime(user.bookingInfo?.createdAt || user.createdAt || selectedEvent.date)}
                                  </div>
                                </td>
                                <td className="tw-px-3 tw-py-2 dark:tw-text-white">
                                  {renderPaymentMethod(user.bookingInfo?.paymentMethod)}
                                </td>
                                <td className="tw-px-3 tw-py-2 dark:tw-text-white">
                                  <div className="tw-flex tw-items-center tw-gap-1">
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
                      <div className="tw-text-center tw-py-4 tw-text-gray-500 dark:tw-text-gray-400">
                        <MdEventBusy className="tw-text-3xl tw-mx-auto tw-mb-1" />
                        <p className="dark:tw-text-white">No participants registered yet</p>
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className="tw-flex tw-justify-end">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="tw-px-3 tw-py-1 tw-bg-gray-300 dark:tw-bg-gray-700 hover:tw-bg-gray-400 dark:hover:tw-bg-gray-600 tw-text-black dark:tw-text-white tw-rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="tw-max-w-7xl tw-mx-auto">
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-center tw-mb-4 tw-gap-3">
          <h2 className="tw-text-xl md:tw-text-2xl tw-font-bold dark:tw-text-white">
            Events Management
          </h2>

          <div className="tw-relative tw-w-full md:tw-w-64">
            <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
              <FaSearch className="tw-text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              className="tw-pl-10 tw-pr-4 tw-py-1.5 tw-w-full tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg tw-bg-white dark:tw-bg-gray-800 focus:tw-ring-2 focus:tw-ring-blue-500 dark:tw-text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="tw-text-center tw-py-12 tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow">
            <MdEventBusy className="tw-text-5xl tw-mx-auto tw-text-gray-400 tw-mb-4" />
            <h3 className="tw-text-xl tw-font-medium tw-text-gray-600 dark:tw-text-white">
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
          <>
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
                    {currentEvents.map((event) => (
                      <tr key={event._id} className="hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700">
                        <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                          <div className="tw-font-medium dark:tw-text-white">{event.eventName}</div>
                          <div className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-300">
                            {event.price} EGP
                          </div>
                        </td>
                        <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                          <div className="tw-flex tw-items-center tw-gap-2 dark:tw-text-white">
                            <FaCalendarAlt className="tw-text-gray-400 dark:tw-text-gray-300" />
                            {formatDate(event.date)}
                          </div>
                        </td>
                        <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap dark:tw-text-white">
                          {event.capacity}
                        </td>
                        <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                          <div className="tw-flex tw-items-center tw-gap-2 dark:tw-text-white">
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

            {totalPages > 1 && (
              <div className="tw-flex tw-justify-center tw-mt-6">
                <nav className="tw-inline-flex tw-rounded-md tw-shadow-sm">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="tw-px-3 tw-py-2 tw-rounded-l-md tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-bg-white dark:tw-bg-gray-800 tw-text-gray-500 dark:tw-text-gray-300 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700 disabled:tw-opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`tw-px-3 tw-py-2 tw-border-t tw-border-b tw-border-gray-300 dark:tw-border-gray-600 ${currentPage === page 
                        ? 'tw-bg-blue-500 tw-text-white' 
                        : 'tw-bg-white dark:tw-bg-gray-800 tw-text-gray-500 dark:tw-text-gray-300 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="tw-px-3 tw-py-2 tw-rounded-r-md tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-bg-white dark:tw-bg-gray-800 tw-text-gray-500 dark:tw-text-gray-300 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700 disabled:tw-opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}























// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { 
//   FaUsers, 
//   FaCalendarAlt, 
//   FaTicketAlt, 
//   FaBus, 
//   FaSearch, 
//   FaRegClock, 
//   FaUserClock,
//   FaSort,
//   FaSortUp,
//   FaSortDown,
//   FaWallet,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaClock,
//   FaTrash
// } from 'react-icons/fa';
// import { MdEventAvailable, MdEventBusy } from 'react-icons/md';
// import { RiUserFill } from 'react-icons/ri';

// export default function TripsList() {
//   const [events, setEvents] = useState([]);
//   const [filteredEvents, setFilteredEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [eventLoading, setEventLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [eventSortConfig, setEventSortConfig] = useState({ key: 'date', direction: 'asc' });
//   const [userSortConfig, setUserSortConfig] = useState({ 
//     key: 'createdAt', 
//     direction: 'desc',
//     type: 'date' 
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [removingUser, setRemovingUser] = useState(null);
//   const EVENTS_PER_PAGE = 6;

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     const fetchEvents = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const res = await axios.get(
//           'https://ugmproject.vercel.app/api/v1/event/getAllEventsReserveds',
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setEvents(res.data.events);
//         setFilteredEvents(res.data.events);
//       } catch (err) {
//         console.error('Error fetching events:', err);
//         setError('Failed to load events. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

// const fetchEventDetails = async (eventId) => {
//   const token = localStorage.getItem('token');
//   try {
//     setEventLoading(true);
//     setError(null);
//     const res = await axios.get(
//       `https://ugmproject.vercel.app/api/v1/event/getEventReservedsById/${eventId}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     console.log('Event details response:', res.data);
//     console.log('Reserved users data:', res.data.event.reservedUsers);

//     setSelectedEvent(res.data.event);
//   } catch (err) {
//     console.error('Error fetching event details:', err);
//     setError('Failed to load event details. Please try again.');
//   } finally {
//     setEventLoading(false);
//   }
// };


// const handleRemoveUser = async (userId, bookingId) => {
//   const token = localStorage.getItem('token');
//   try {
//     setRemovingUser(bookingId);
//     setError(null);
    
//     if (!selectedEvent) {
//       throw new Error('No event selected');
//     }

//     // Find the user to get their name
//     const userToDelete = selectedEvent.reservedUsers.find(u => 
//       (u._id === userId || (u.bookingInfo && u.bookingInfo._id === bookingId))
//     );

//     if (!userToDelete) {
//       throw new Error('User not found in event');
//     }

//     const requestData = {
//       eventId: selectedEvent._id,
//       eventName: selectedEvent.eventName,
//       price: selectedEvent.price,
//       userName: userToDelete.userName || 'User'
//     };

//     await axios.delete(
//       `https://ugmproject.vercel.app/api/v1/booking/deleteBooking/${bookingId}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//         data: requestData
//       }
//     );

//     // Refresh data 
//     await fetchEventDetails(selectedEvent._id);
//     const res = await axios.get(
//       'https://ugmproject.vercel.app/api/v1/event/getAllEventsReserveds',
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setEvents(res.data.events);
//     setFilteredEvents(res.data.events);

//   } catch (err) {
//     console.error('Error removing user:', err);
//     setError(err.response?.data?.message || 'Failed to remove user. Please try again.');
//   } finally {
//     setRemovingUser(null);
//   }
// };
//   useEffect(() => {
//     const results = events.filter(event =>
//       event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       event.date.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredEvents(results);
//     setCurrentPage(1);
//   }, [searchTerm, events]);

//   // Pagination logic
//   const indexOfLastEvent = currentPage * EVENTS_PER_PAGE;
//   const indexOfFirstEvent = indexOfLastEvent - EVENTS_PER_PAGE;
//   const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
//   const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleEventSort = (key) => {
//     let direction = 'asc';
//     if (eventSortConfig.key === key && eventSortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setEventSortConfig({ key, direction });

//     const sortedEvents = [...filteredEvents].sort((a, b) => {
//       if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
//       if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
//       return 0;
//     });

//     setFilteredEvents(sortedEvents);
//   };

//   const handleUserSort = (key, type = 'string') => {
//     let direction = 'desc';
//     if (userSortConfig.key === key && userSortConfig.direction === 'desc') {
//       direction = 'asc';
//     }
//     setUserSortConfig({ key, direction, type });
//   };

//   const sortUsers = (users) => {
//     if (!users || !Array.isArray(users)) return [];
    
//     return [...users].sort((a, b) => {
//       const aBooking = a.bookingInfo || {};
//       const bBooking = b.bookingInfo || {};
      
//       let aValue, bValue;
      
//       if (userSortConfig.key === 'createdAt') {
//         aValue = aBooking.createdAt || a.createdAt || selectedEvent?.date;
//         bValue = bBooking.createdAt || b.createdAt || selectedEvent?.date;
//       } else if (userSortConfig.key === 'userName') {
//         aValue = a.userName?.toLowerCase() || '';
//         bValue = b.userName?.toLowerCase() || '';
//       } else if (userSortConfig.key === 'phone') {
//         aValue = a.phone || '';
//         bValue = b.phone || '';
//       } else if (userSortConfig.key === 'status') {
//         aValue = aBooking.status || '';
//         bValue = bBooking.status || '';
//       } else if (userSortConfig.key === 'paymentMethod') {
//         aValue = aBooking.paymentMethod || '';
//         bValue = bBooking.paymentMethod || '';
//       } else {
//         aValue = a[userSortConfig.key] || '';
//         bValue = b[userSortConfig.key] || '';
//       }
      
//       if (!aValue || !bValue) return 0;
      
//       if (userSortConfig.type === 'date') {
//         const aDate = new Date(aValue).getTime();
//         const bDate = new Date(bValue).getTime();
//         return userSortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
//       } else {
//         if (aValue < bValue) return userSortConfig.direction === 'asc' ? -1 : 1;
//         if (aValue > bValue) return userSortConfig.direction === 'asc' ? 1 : -1;
//         return 0;
//       }
//     });
//   };

//   const getAvailabilityStatus = (event) => {
//     const available = event.capacity - event.reservedCount;
//     if (available <= 0) return 'full';
//     if (available <= event.capacity * 0.2) return 'limited';
//     return 'available';
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString('en-US', options);
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return 'N/A';
//       return date.toLocaleString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true
//       });
//     } catch (e) {
//       console.error('Error formatting date:', e);
//       return 'N/A';
//     }
//   };

//   const renderSortIcon = (key, currentConfig) => {
//     if (currentConfig.key !== key) return <FaSort className="tw-ml-1 tw-text-gray-400" />;
//     return currentConfig.direction === 'asc' 
//       ? <FaSortUp className="tw-ml-1" /> 
//       : <FaSortDown className="tw-ml-1" />;
//   };

//   const handleViewEvent = (eventId) => {
//     fetchEventDetails(eventId);
//   };

//   const renderStatusIcon = (status) => {
//     switch (status) {
//       case 'approved':
//         return <FaCheckCircle className="tw-text-green-500" />;
//       case 'rejected':
//         return <FaTimesCircle className="tw-text-red-500" />;
//       case 'pending':
//         return <FaClock className="tw-text-yellow-500" />;
//       default:
//         return <FaClock className="tw-text-gray-400" />;
//     }
//   };

//   const renderPaymentMethod = (method) => {
//     switch (method) {
//       case 'wallet':
//         return (
//           <span className="tw-flex tw-items-center tw-gap-1 dark:tw-text-white">
//             <FaWallet className="tw-text-purple-500" />
//             Wallet
//           </span>
//         );
//       case 'cash':
//         return <span className="dark:tw-text-white">Cash</span>;
//       case 'card':
//         return <span className="dark:tw-text-white">Credit Card</span>;
//       default:
//         return <span className="dark:tw-text-white">{method || 'N/A'}</span>;
//     }
//   };

//   return (
//     <div className="tw-min-h-[80vh] tw-bg-gray-50 dark:tw-bg-gray-900 tw-p-3 md:tw-p-6">
//       {error && (
//         <div className="tw-fixed tw-top-4 tw-right-4 tw-z-50">
//           <div className="tw-bg-red-100 tw-border-l-4 tw-border-red-500 tw-text-red-700 tw-p-3 tw-rounded tw-shadow-md tw-max-w-md">
//             <div className="tw-flex tw-justify-between">
//               <div className="tw-font-bold">Error</div>
//               <button onClick={() => setError(null)} className="tw-font-bold tw-text-xl">&times;</button>
//             </div>
//             <p className="tw-mt-1">{error}</p>
//           </div>
//         </div>
//       )}

//       {selectedEvent && (
//         <div
//           onClick={() => setSelectedEvent(null)}
//           className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50 tw-p-3"
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow-md tw-w-full tw-max-w-4xl tw-max-h-[90vh] tw-overflow-y-auto"
//           >
//             <div className="tw-p-4">
//               {eventLoading ? (
//                 <div className="tw-flex tw-justify-center tw-items-center tw-py-6">
//                   <div className="tw-animate-spin tw-rounded-full tw-h-10 tw-w-10 tw-border-t-2 tw-border-b-2 tw-border-blue-500"></div>
//                 </div>
//               ) : (
//                 <>
//                   <div className="tw-flex tw-justify-between tw-items-start tw-mb-4">
//                     <div>
//                       <h3 className="tw-text-xl tw-font-bold tw-flex tw-items-center tw-gap-2 dark:tw-text-white">
//                         <FaUsers className="tw-text-blue-600" />
//                         {selectedEvent.eventName}
//                       </h3>
//                       <div className="tw-flex tw-items-center tw-gap-3 tw-mt-1 tw-text-gray-600 dark:tw-text-gray-300">
//                         <span className="tw-flex tw-items-center tw-gap-1 dark:tw-text-white">
//                           <FaCalendarAlt />
//                           {formatDate(selectedEvent.date)}
//                         </span>
//                         <span className="tw-flex tw-items-center tw-gap-1 dark:tw-text-white">
//                           <FaTicketAlt />
//                           {selectedEvent.price} EGP
//                         </span>
//                         {selectedEvent.needsBus && (
//                           <span className="tw-flex tw-items-center tw-gap-1 tw-text-orange-500">
//                             <FaBus />
//                             Bus required
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <div className="tw-bg-blue-100 dark:tw-bg-blue-900 tw-px-2 tw-py-1 tw-rounded-lg">
//                       <span className="tw-text-blue-800 dark:tw-text-blue-200 tw-font-medium">
//                         {selectedEvent.reservedCount} / {selectedEvent.capacity}
//                       </span>
//                     </div>
//                   </div>

//                   {selectedEvent.images?.length > 0 && (
//                     <div className="tw-mb-4">
//                       <h4 className="tw-text-base tw-font-semibold tw-mb-2 dark:tw-text-white">Event Images</h4>
//                       <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-2">
//                         {selectedEvent.images.map((img, index) => (
//                           <img
//                             key={index}
//                             src={img}
//                             alt={`Event ${index + 1}`}
//                             className="tw-rounded-md tw-object-cover tw-h-24 tw-w-full"
//                           />
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   <div className="tw-mb-4">
//                     <h4 className="tw-text-base tw-font-semibold tw-mb-2 tw-flex tw-items-center tw-gap-2 dark:tw-text-white">
//                       <RiUserFill className="tw-text-blue-600" />
//                       Registered Participants ({selectedEvent.reservedUsers?.length || 0})
//                     </h4>

//                     {selectedEvent.reservedUsers?.length > 0 ? (
//                       <div className="tw-overflow-x-auto">
//                         <table className="tw-min-w-full tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700 text-sm">
//                           <thead className="tw-bg-gray-50 dark:tw-bg-gray-700">
//                             <tr>
//                               <th className="tw-px-3 tw-py-2 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase">#</th>
//                               <th className="tw-px-3 tw-py-2 tw-text-left tw-cursor-pointer" onClick={() => handleUserSort('userName', 'string')}>
//                                 <div className="tw-flex tw-items-center">Name {renderSortIcon('userName', userSortConfig)}</div>
//                               </th>
//                               <th className="tw-px-3 tw-py-2 tw-text-left tw-cursor-pointer" onClick={() => handleUserSort('phone', 'string')}>
//                                 <div className="tw-flex tw-items-center">Phone {renderSortIcon('phone', userSortConfig)}</div>
//                               </th>
//                               <th className="tw-px-3 tw-py-2 tw-text-left tw-cursor-pointer" onClick={() => handleUserSort('createdAt', 'date')}>
//                                 <div className="tw-flex tw-items-center"><FaUserClock className="tw-mr-1" /> Time {renderSortIcon('createdAt', userSortConfig)}</div>
//                               </th>
//                               <th className="tw-px-3 tw-py-2 tw-text-left tw-cursor-pointer" onClick={() => handleUserSort('paymentMethod', 'string')}>
//                                 <div className="tw-flex tw-items-center">Payment {renderSortIcon('paymentMethod', userSortConfig)}</div>
//                               </th>
//                               <th className="tw-px-3 tw-py-2 tw-text-left tw-cursor-pointer" onClick={() => handleUserSort('status', 'string')}>
//                                 <div className="tw-flex tw-items-center">Status {renderSortIcon('status', userSortConfig)}</div>
//                               </th>
//                               <th className="tw-px-3 tw-py-2 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase">Actions</th>
//                             </tr>
//                           </thead>
//                           <tbody className="tw-bg-white dark:tw-bg-gray-800">
//                             {sortUsers(selectedEvent.reservedUsers).map((user, index) => (
//                               <tr key={user._id || index} className="hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700">
//                                 <td className="tw-px-3 tw-py-2 dark:tw-text-white">{index + 1}</td>
//                                 <td className="tw-px-3 tw-py-2 dark:tw-text-white">{user.userName}</td>
//                                 <td className="tw-px-3 tw-py-2 dark:tw-text-white">{user.phone}</td>
//                                 <td className="tw-px-3 tw-py-2 dark:tw-text-white">
//                                   <div className="tw-flex tw-items-center tw-gap-1">
//                                     <FaRegClock className="tw-text-gray-400" />
//                                     {formatDateTime(user.bookingInfo?.createdAt || user.createdAt || selectedEvent.date)}
//                                   </div>
//                                 </td>
//                                 <td className="tw-px-3 tw-py-2 dark:tw-text-white">
//                                   {renderPaymentMethod(user.bookingInfo?.paymentMethod)}
//                                 </td>
//                                 <td className="tw-px-3 tw-py-2 dark:tw-text-white">
//                                   <div className="tw-flex tw-items-center tw-gap-1">
//                                     {renderStatusIcon(user.bookingInfo?.status)}
//                                     {user.bookingInfo?.status || 'pending'}
//                                   </div>
//                                 </td>
//   <td className="tw-px-3 tw-py-2 dark:tw-text-white">
//   {(() => {
//     // Try to find the booking ID from different possible locations
//     const bookingId = 
//       user.bookingInfo?._id || 
//       user._id || 
//       (typeof user === 'string' ? user : null);
    
//     if (bookingId) {
//       return (
//         <button
//           onClick={() => handleRemoveUser(user._id, bookingId)}
//           disabled={removingUser === bookingId}
//           className="tw-p-1 tw-text-red-500 hover:tw-text-red-700 tw-rounded tw-transition"
//           title="Remove user"
//         >
//           {removingUser === bookingId ? (
//             <span className="tw-inline-block tw-h-4 tw-w-4 tw-border-2 tw-border-red-500 tw-border-t-transparent tw-rounded-full tw-animate-spin"></span>
//           ) : (
//             <FaTrash />
//           )}
//         </button>
//       );
//     }
//     return (
//       <span 
//         className="tw-text-gray-400 dark:tw-text-gray-500 tw-cursor-help" 
//         title="No booking ID found"
//       >
//         N/A
//       </span>
//     );
//   })()}
// </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     ) : (
//                       <div className="tw-text-center tw-py-4 tw-text-gray-500 dark:tw-text-gray-400">
//                         <MdEventBusy className="tw-text-3xl tw-mx-auto tw-mb-1" />
//                         <p className="dark:tw-text-white">No participants registered yet</p>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               )}
//               <div className="tw-flex tw-justify-end">
//                 <button
//                   onClick={() => setSelectedEvent(null)}
//                   className="tw-px-3 tw-py-1 tw-bg-gray-300 dark:tw-bg-gray-700 hover:tw-bg-gray-400 dark:hover:tw-bg-gray-600 tw-text-black dark:tw-text-white tw-rounded-md"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="tw-max-w-7xl tw-mx-auto">
//         <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-center tw-mb-4 tw-gap-3">
//           <h2 className="tw-text-xl md:tw-text-2xl tw-font-bold dark:tw-text-white">
//             Events Management
//           </h2>

//           <div className="tw-relative tw-w-full md:tw-w-64">
//             <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
//               <FaSearch className="tw-text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search events..."
//               className="tw-pl-10 tw-pr-4 tw-py-1.5 tw-w-full tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-lg tw-bg-white dark:tw-bg-gray-800 focus:tw-ring-2 focus:tw-ring-blue-500 dark:tw-text-white"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         {loading ? (
//           <div className="tw-flex tw-justify-center tw-items-center tw-py-12">
//             <div className="tw-animate-spin tw-rounded-full tw-h-20 tw-w-20 tw-border-t-4 tw-border-b-4 tw-border-blue-500"></div>
//           </div>
//         ) : filteredEvents.length === 0 ? (
//           <div className="tw-text-center tw-py-12 tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow">
//             <MdEventBusy className="tw-text-5xl tw-mx-auto tw-text-gray-400 tw-mb-4" />
//             <h3 className="tw-text-xl tw-font-medium tw-text-gray-600 dark:tw-text-white">
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
//           <>
//             <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow tw-overflow-hidden">
//               <div className="tw-overflow-x-auto">
//                 <table className="tw-min-w-full tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
//                   <thead className="tw-bg-gray-50 dark:tw-bg-gray-700">
//                     <tr>
//                       <th 
//                         className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider tw-cursor-pointer"
//                         onClick={() => handleEventSort('eventName')}
//                       >
//                         <div className="tw-flex tw-items-center">
//                           Event
//                           {renderSortIcon('eventName', eventSortConfig)}
//                         </div>
//                       </th>
//                       <th 
//                         className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider tw-cursor-pointer"
//                         onClick={() => handleEventSort('date')}
//                       >
//                         <div className="tw-flex tw-items-center">
//                           Date
//                           {renderSortIcon('date', eventSortConfig)}
//                         </div>
//                       </th>
//                       <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
//                         Capacity
//                       </th>
//                       <th 
//                         className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider tw-cursor-pointer"
//                         onClick={() => handleEventSort('reservedCount')}
//                       >
//                         <div className="tw-flex tw-items-center">
//                           Registered
//                           {renderSortIcon('reservedCount', eventSortConfig)}
//                         </div>
//                       </th>
//                       <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
//                         Status
//                       </th>
//                       <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="tw-bg-white dark:tw-bg-gray-800 tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
//                     {currentEvents.map((event) => (
//                       <tr key={event._id} className="hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700">
//                         <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
//                           <div className="tw-font-medium dark:tw-text-white">{event.eventName}</div>
//                           <div className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-300">
//                             {event.price} EGP
//                           </div>
//                         </td>
//                         <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
//                           <div className="tw-flex tw-items-center tw-gap-2 dark:tw-text-white">
//                             <FaCalendarAlt className="tw-text-gray-400 dark:tw-text-gray-300" />
//                             {formatDate(event.date)}
//                           </div>
//                         </td>
//                         <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap dark:tw-text-white">
//                           {event.capacity}
//                         </td>
//                         <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
//                           <div className="tw-flex tw-items-center tw-gap-2 dark:tw-text-white">
//                             <RiUserFill className="tw-text-blue-500" />
//                             {event.reservedCount}
//                           </div>
//                         </td>
//                         <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
//                           <span className={`tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium ${
//                             getAvailabilityStatus(event) === 'full'
//                               ? 'tw-bg-red-100 tw-text-red-800 dark:tw-bg-red-900 dark:tw-text-red-200'
//                               : getAvailabilityStatus(event) === 'limited'
//                               ? 'tw-bg-yellow-100 tw-text-yellow-800 dark:tw-bg-yellow-900 dark:tw-text-yellow-200'
//                               : 'tw-bg-green-100 tw-text-green-800 dark:tw-bg-green-900 dark:tw-text-green-200'
//                           }`}>
//                             {getAvailabilityStatus(event) === 'full'
//                               ? 'Fully Booked'
//                               : getAvailabilityStatus(event) === 'limited'
//                               ? 'Limited Spots'
//                               : 'Available'}
//                           </span>
//                         </td>
//                         <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
//                           <button
//                             onClick={() => handleViewEvent(event._id)}
//                             className="tw-px-3 tw-py-1 tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-rounded-lg tw-transition tw-duration-200 tw-flex tw-items-center tw-gap-1"
//                             disabled={eventLoading}
//                           >
//                             {eventLoading && selectedEvent?._id === event._id ? (
//                               <span className="tw-inline-block tw-h-4 tw-w-4 tw-border-2 tw-border-white tw-border-t-transparent tw-rounded-full tw-animate-spin"></span>
//                             ) : (
//                               <>
//                                 <FaUsers />
//                                 View
//                               </>
//                             )}
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {totalPages > 1 && (
//               <div className="tw-flex tw-justify-center tw-mt-6">
//                 <nav className="tw-inline-flex tw-rounded-md tw-shadow-sm">
//                   <button
//                     onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
//                     disabled={currentPage === 1}
//                     className="tw-px-3 tw-py-2 tw-rounded-l-md tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-bg-white dark:tw-bg-gray-800 tw-text-gray-500 dark:tw-text-gray-300 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700 disabled:tw-opacity-50"
//                   >
//                     Previous
//                   </button>
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                     <button
//                       key={page}
//                       onClick={() => handlePageChange(page)}
//                       className={`tw-px-3 tw-py-2 tw-border-t tw-border-b tw-border-gray-300 dark:tw-border-gray-600 ${currentPage === page 
//                         ? 'tw-bg-blue-500 tw-text-white' 
//                         : 'tw-bg-white dark:tw-bg-gray-800 tw-text-gray-500 dark:tw-text-gray-300 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700'}`}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
//                     disabled={currentPage === totalPages}
//                     className="tw-px-3 tw-py-2 tw-rounded-r-md tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-bg-white dark:tw-bg-gray-800 tw-text-gray-500 dark:tw-text-gray-300 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700 disabled:tw-opacity-50"
//                   >
//                     Next
//                   </button>
//                 </nav>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }