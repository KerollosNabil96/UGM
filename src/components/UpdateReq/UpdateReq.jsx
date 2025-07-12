import React, { useState, useEffect } from 'react';
import styles from './UpdateReq.module.css';
import { useTranslation } from 'react-i18next';

export default function UpdateReq() {
  const [isActive, setIsActive] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { t } = useTranslation("updatedReq");

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

        // Filter to only show bookings with 'pending' status
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
      // Determine the correct status value
      const status = actionType === 'approve' ? 'approved' : 'rejected';
      
      console.log(`Updating booking ${bookingId} to status: ${status}`);
      
      const response = await fetch(`https://ugmproject.vercel.app/api/v1/booking/updateStatus/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status,
          // Include rejection reason if needed
          ...(actionType === 'reject' && { rejectionReason: "Booking rejected by admin" })
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to update status to ${status}`);
      }

      // Remove the booking from the list regardless of approval/rejection
      setBookingRequests(prev => prev.filter(booking => booking._id !== bookingId));
      setIsActive(false);
      
    } catch (err) {
      console.error("Error updating status:", {
        message: err.message,
        stack: err.stack,
      });
      setError(`Failed to ${actionType} booking: ${err.message}`);
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-center py-5 text-danger">Error: {error}</div>;

  return (
    <>
      {/* Confirmation Popup */}
      {isActive && (
        <div 
          onClick={() => setIsActive(false)} 
          className="layer position-fixed top-0 start-0 d-flex justify-content-center align-items-center" 
          style={{ height: '100vh', width: '100vw', zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div onClick={(e) => e.stopPropagation()} className={`popUp bg-white position-absolute p-4 rounded-4 ${styles.popupWidth}`}>
            <h3 className='pt-4'>
              {actionType === 'approve' ? (
                <i className="fa-solid fa-circle-check text-success me-2"></i>
              ) : (
                <i className="fa-solid fa-circle-xmark text-danger me-2"></i>
              )}
              {actionType === 'approve' 
                ? t('updateRequest.popups.approve.title') 
                : t('updateRequest.popups.reject.title')}
            </h3>
            <p className='text-muted'>
              {actionType === 'approve' 
                ? t('updateRequest.popups.approve.message') 
                : t('updateRequest.popups.reject.message')}
            </p>
            <div className="btns mb-4 d-flex justify-content-end">
              <button onClick={() => setIsActive(false)} className='btn btn-outline-dark'>
                {t('updateRequest.buttons.cancel')}
              </button>
              <button 
                onClick={() => handleStatusUpdate(selectedRequest._id, actionType)} 
                className={`border-0 rounded-2 p-3 mx-2 text-white ${
                  actionType === 'approve' ? 'bg-success' : 'bg-danger'
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
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 9999 }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white p-3 rounded-4 shadow" 
            style={{ maxWidth: '90%', maxHeight: '90%' }}
          >
            <img 
              src={selectedImage} 
              alt="Proof" 
              className="img-fluid rounded-3" 
              style={{ maxHeight: '70vh' }} 
            />
            <div className="text-end mt-2">
              <button onClick={() => setSelectedImage(null)} className="btn btn-danger">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="container-fluid">
        <div className="row d-flex justify-content-center">
          <div className={`col-12 ${styles.shad} mt-4 rounded-2 p-3 position-relative`}>
            <h3>{t('updateRequest.requestDetails')}</h3>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">{t('updateRequest.tableHeaders.id')}</th>
                  <th scope="col">{t('updateRequest.tableHeaders.tripName')}</th>
                  <th scope="col">{t('updateRequest.tableHeaders.user')}</th>
                  <th scope="col">{t('updateRequest.tableHeaders.screenshot')}</th>
                  <th scope="col">{t('updateRequest.tableHeaders.action')}</th>
                </tr>
              </thead>
              <tbody>
                {bookingRequests.length > 0 ? (
                  bookingRequests.map((request, index) => (
                    <tr key={request._id}>
                      <th scope="row">{index + 1}</th>
                      <td>{request.eventName || 'N/A'}</td>
                      <td>{request.user?.userName || 'N/A'}</td>
                      <td>
                        {request.screenshot && (
                          <span 
                            onClick={() => setSelectedImage(request.screenshot)} 
                            className="text-primary text-decoration-underline"
                            style={{ cursor: 'pointer' }}
                          >
                            {t('updateRequest.viewScreenshot')}
                          </span>
                        )}
                      </td>
                      <td>
                        <i 
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsActive(true);
                            setActionType('approve');
                          }} 
                          className="fa-solid fa-check text-success fs-4 me-2 crsr"
                          title="Approve"
                        ></i>
                        <i 
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsActive(true);
                            setActionType('reject');
                          }} 
                          className="fa-solid fa-xmark text-danger fs-4 crsr"
                          title="Reject"
                        ></i>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No pending booking requests</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}