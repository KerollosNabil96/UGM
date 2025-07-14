import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaSearch, 
  FaRegClock, 
  FaWallet,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';
import { MdEventBusy } from 'react-icons/md';
import Spinner from '../Spinner/Spinner';

export default function TripsList() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ 
    key: 'eventName', 
    direction: 'asc',
    type: 'string' 
  });
  const [deletingId, setDeletingId] = useState(null);

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
      console.log(res.data.event)
      setSelectedEvent(res.data.event);
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError('Failed to load event details. Please try again.');
    } finally {
      setEventLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId, eventId, userName) => {
    const token = localStorage.getItem('token');
    try {
      setDeletingId(bookingId);
      setError(null);
      
      await axios.delete(
        `https://ugmproject.vercel.app/api/v1/booking/deleteBooking/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            eventId,
            userName
          }
        }
      );

      // Refresh the event details after deletion
      await fetchEventDetails(eventId);
      
      // Update the main events list
      const updatedEvents = events.map(event => {
        if (event._id === eventId) {
          return {
            ...event,
            reservedCount: event.reservedCount - 1
          };
        }
        return event;
      });
      
      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents);
      
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError('Failed to delete booking. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const results = events.filter(event =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.date.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(results);
  }, [searchTerm, events]);

  const handleSort = (key, type = 'string') => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction, type });
  };

  const sortEvents = (eventsToSort) => {
    if (!eventsToSort || !Array.isArray(eventsToSort)) return [];
    
    return [...eventsToSort].sort((a, b) => {
      let aValue, bValue;
      
      if (sortConfig.key === 'eventName') {
        aValue = a.eventName?.toLowerCase() || '';
        bValue = b.eventName?.toLowerCase() || '';
      } else if (sortConfig.key === 'date') {
        aValue = a.date || '';
        bValue = b.date || '';
      } else if (sortConfig.key === 'reservedCount') {
        aValue = a.reservedCount || 0;
        bValue = b.reservedCount || 0;
      } else {
        aValue = a[sortConfig.key] || '';
        bValue = b[sortConfig.key] || '';
      }
      
      if (!aValue || !bValue) return 0;
      
      if (sortConfig.type === 'date') {
        const aDate = new Date(aValue).getTime();
        const bDate = new Date(bValue).getTime();
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
      } else {
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      }
    });
  };

  const renderSortIcon = (key, currentConfig) => {
    if (currentConfig.key !== key) return <FaSort className="tw-ml-1 tw-text-gray-400" />;
    return currentConfig.direction === 'asc' 
      ? <FaSortUp className="tw-ml-1" /> 
      : <FaSortDown className="tw-ml-1" />;
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

  const getAvailabilityStatus = (event) => {
    const available = event.capacity - event.reservedCount;
    if (available <= 0) return 'full';
    if (available <= event.capacity * 0.2) return 'limited';
    return 'available';
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
                          <FaWallet />
                          {selectedEvent.price} EGP
                        </span>
                      </div>
                    </div>
                    <div className="tw-bg-blue-100 dark:tw-bg-blue-900 tw-px-2 tw-py-1 tw-rounded-lg">
                      <span className="tw-text-blue-800 dark:tw-text-blue-200 tw-font-medium">
                        {selectedEvent.reservedCount} / {selectedEvent.capacity}
                      </span>
                    </div>
                  </div>

                  <div className="tw-mb-4">
                    <h4 className="tw-text-base tw-font-semibold tw-mb-2 dark:tw-text-white">
                      Registered Participants ({selectedEvent.reservedUsers?.length || 0})
                    </h4>

                    {selectedEvent.reservedUsers?.length > 0 ? (
                      <div className="tw-overflow-x-auto">
                        <table className="tw-min-w-full tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
                          <thead className="tw-bg-gray-50 dark:tw-bg-gray-700">
                            <tr>
                              <th className="tw-px-4 tw-py-2 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                                #
                              </th>
                              <th className="tw-px-4 tw-py-2 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                                User
                              </th>
                              <th className="tw-px-4 tw-py-2 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                                Phone
                              </th>
                              <th className="tw-px-4 tw-py-2 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                                Booking Date
                              </th>
                              <th className="tw-px-4 tw-py-2 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                                Payment
                              </th>
                              <th className="tw-px-4 tw-py-2 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                                Status
                              </th>
                              <th className="tw-px-4 tw-py-2 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="tw-bg-white dark:tw-bg-gray-800 tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
                            {selectedEvent.reservedUsers.map((user, index) => (
                              <tr key={user._id || index} className="hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700">
                                <td className="tw-px-4 tw-py-2 tw-whitespace-nowrap dark:tw-text-white">
                                  {index + 1}
                                </td>
                                <td className="tw-px-4 tw-py-2 tw-whitespace-nowrap dark:tw-text-white">
                                  {user.userName}
                                </td>
                                <td className="tw-px-4 tw-py-2 tw-whitespace-nowrap dark:tw-text-white">
                                  {user.phone}
                                </td>
                                <td className="tw-px-4 tw-py-2 tw-whitespace-nowrap dark:tw-text-white">
                                  <div className="tw-flex tw-items-center tw-gap-1">
                                    <FaRegClock className="tw-text-gray-400" />
                                    {formatDateTime(user.bookingInfo?.createdAt)}
                                  </div>
                                </td>
                                <td className="tw-px-4 tw-py-2 tw-whitespace-nowrap dark:tw-text-white">
                                  {renderPaymentMethod(user.bookingInfo?.paymentMethod)}
                                </td>
                                <td className="tw-px-4 tw-py-2 tw-whitespace-nowrap dark:tw-text-white">
                                  <div className="tw-flex tw-items-center tw-gap-1">
                                    {renderStatusIcon(user.bookingInfo?.status)}
                                    {user.bookingInfo?.status || 'pending'}
                                  </div>
                                </td>
                                <td className="tw-px-4 tw-py-2 tw-whitespace-nowrap">
                                  <button
                                    onClick={() => handleDeleteBooking(
                                      user.bookingInfo?.bookingId,
                                      selectedEvent._id,
                                      user.userName
                                    )}
                                    className="tw-px-3 tw-py-1 tw-bg-red-600 hover:tw-bg-red-700 tw-text-white tw-rounded-lg tw-transition tw-duration-200 tw-flex tw-items-center tw-gap-1"
                                    disabled={deletingId === user.bookingInfo?._id}
                                  >
                                    {deletingId === user.bookingInfo?._id ? (
                                      <span className="tw-inline-block tw-h-4 tw-w-4 tw-border-2 tw-border-white tw-border-t-transparent tw-rounded-full tw-animate-spin"></span>
                                    ) : (
                                      <>
                                        <FaTrash />
                                        Delete
                                      </>
                                    )}
                                  </button>
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
            Trips Management
          </h2>

          <div className="tw-relative tw-w-full md:tw-w-64">
            <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
              <FaSearch className="tw-text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search trips..."
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
              {searchTerm ? 'No trips match your search' : 'No trips available'}
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
                      onClick={() => handleSort('eventName', 'string')}
                    >
                      <div className="tw-flex tw-items-center">
                        Trip Name
                        {renderSortIcon('eventName', sortConfig)}
                      </div>
                    </th>
                    <th 
                      className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider tw-cursor-pointer"
                      onClick={() => handleSort('date', 'date')}
                    >
                      <div className="tw-flex tw-items-center">
                        Date
                        {renderSortIcon('date', sortConfig)}
                      </div>
                    </th>
                    <th className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider">
                      Capacity
                    </th>
                    <th 
                      className="tw-px-6 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-300 tw-uppercase tw-tracking-wider tw-cursor-pointer"
                      onClick={() => handleSort('reservedCount', 'number')}
                    >
                      <div className="tw-flex tw-items-center">
                        Registered
                        {renderSortIcon('reservedCount', sortConfig)}
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
                  {sortEvents(filteredEvents).map((event) => (
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
                          <FaUsers className="tw-text-blue-500" />
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
                          onClick={() => fetchEventDetails(event._id)}
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























