import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { darkModeContext } from '../../Context/DarkModeContext';

export default function Messages() {
  const { darkMode } = useContext(darkModeContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 2;

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('https://ugmproject.vercel.app/api/v1/contact/getAllMessage', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(data.getAllMessage || []);
    } catch (err) {
      toast.error('Failed to fetch messages.');
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://ugmproject.vercel.app/api/v1/contact/deleteMessage/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Message deleted successfully.');
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      toast.error('Failed to delete message.');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const totalPages = Math.ceil(messages.length / messagesPerPage);
  const indexOfLast = currentPage * messagesPerPage;
  const indexOfFirst = indexOfLast - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <div
        className="container my-5 d-flex flex-column justify-content-between dark:tw-bg-gray-800 py-4 px-2 rounded-3"
        style={{ minHeight: '70vh' }}
      >
        <div>
          <h2 className="mb-4 text-center fw-bold mainColor dark:tw-text-indigo-600">All Messages</h2>

          {messages.length === 0 ? (
            <div className="d-flex justify-content-center">
              <div className="border rounded-4 p-4 shadow-sm tw-bg-white dark:tw-bg-gray-900 text-center w-100" style={{ maxWidth: '500px' }}>
                <h5 className="fw-bold mb-2 dark:tw-text-white">📭 No messages yet</h5>
                <p className=" dark:tw-text-white">When users send messages, they will show up here.</p>
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {currentMessages.map((msg) => (
                <div key={msg._id} className="col-md-12">
                  <div
                    className="border rounded-4 p-4 shadow-sm position-relative tw-bg-white dark:tw-bg-gray-900 dark:tw-text-white"
                    style={{ overflowX: 'hidden' }}
                  >
                    <h5 className="fw-bold mb-2">{msg.userName}</h5>
                    <p className="mb-1"><strong>📞 Phone:</strong> {msg.phone}</p>
                    <p
                      className="mb-1"
                      style={{
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                        maxHeight: '120px',
                        overflowY: 'auto',
                        paddingRight: '4px',
                      }}
                    >
                      <strong>📨 Message:</strong> {msg.message}
                    </p>
                    <p className="text-muted mb-3 dark:tw-text-gray-400">
                      <strong>🕒 Sent:</strong> {format(new Date(msg.createdAt), 'PPpp')}
                    </p>
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="btn btn-danger position-absolute top-0 end-0 m-3 btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {messages.length > 0 && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                </li>
                {[...Array(totalPages).keys()].map((n) => (
                  <li
                    key={n + 1}
                    className={`page-item ${currentPage === n + 1 ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => handlePageChange(n + 1)}>
                      {n + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
