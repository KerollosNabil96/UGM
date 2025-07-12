import React, { useState, useEffect } from 'react';
import styles from './UpdateReq.module.css';
import { useTranslation } from 'react-i18next';

export default function UpdateReq() {
  const [isActive, setIsActive] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
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
        if (!response.ok) throw new Error('Failed to fetch booking requests');

        const data = await response.json();
        console.log("API data:", data);

        setBookingRequests(Array.isArray(data?.bookings) ? data.bookings : []);
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

const handleApprove = async (bookingId) => {
  try {
    console.log("جاري إرسال طلب الموافقة...");
    const response = await fetch(`https://ugmproject.vercel.app/api/v1/booking/updateStatus/${bookingId}`, {
      method: 'PATCH',
      mode: 'cors',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: "approved" })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "فشل في تحديث الحالة");
    }

    const result = await response.json();
    console.log("تمت الموافقة بنجاح:", result);
    setBookingRequests(prev => prev.filter(booking => booking._id !== bookingId));
    setIsActive(false);
  } catch (err) {
    console.error("تفاصيل الخطأ:", {
      message: err.message,
      stack: err.stack,
    });
    setError("تعذر الاتصال بالخادم. يرجى التحقق من الإنترنت أو المحاولة لاحقًا.");
  }
};

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-center py-5 text-danger">Error: {error}</div>;

  return (
    <>
      {/* ✅ Popup for Approval */}
      {isActive && (
        <div 
          onClick={() => setIsActive(false)} 
          className="layer position-fixed top-0 start-0 d-flex justify-content-center align-items-center" 
          style={{ height: '100vh', width: '100vw', zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          {isApproved && selectedRequest && (
            <div onClick={(e) => e.stopPropagation()} className={`popUp bg-white position-absolute p-4 rounded-4 ${styles.popupWidth}`}>
              <h3 className='pt-4'>
                <i className="fa-solid fa-circle-check text-success"></i> {t('updateRequest.popups.approve.title')}
              </h3>
              <p className='text-muted'>{t('updateRequest.popups.approve.message')}</p>
              <div className="btns mb-4 d-flex justify-content-end">
                <button onClick={() => setIsActive(false)} className='btn btn-outline-dark'>
                  {t('updateRequest.buttons.cancel')}
                </button>
                <button 
                  onClick={() => handleApprove(selectedRequest._id)} 
                  className='border-0 rounded-2 p-3 bg-main text-white mx-2'
                >
                  {t('updateRequest.buttons.confirm')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ✅ Popup for Screenshot Image */}
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

      {/* ✅ Main Table */}
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
                            setIsApproved(true);
                          }} 
                          className="fa-solid fa-check text-success fs-4 me-2 crsr"
                          title="Approve"
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
