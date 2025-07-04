import React, { useContext, useState, useEffect } from 'react';
import styles from './Memories.module.css';
import { darkModeContext } from '../../Context/DarkModeContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Memories() {
  const { darkMode } = useContext(darkModeContext);
  const { t } = useTranslation('memory');
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [memories, setMemories] = useState([]);
  const [filteredMemories, setFilteredMemories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [years, setYears] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const memoriesPerPage = 6;

  // Delete modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);

  // Token and role from localStorage
  const token = localStorage.getItem('token') || null;
  const role = localStorage.getItem('role') || '';

  useEffect(() => {
    setAuthenticated(!!token);

    if (token) {
      axios.get('https://ugmproject.vercel.app/api/v1/memory/getAllMemories', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        let allMemories = response.data.memories;

        allMemories = allMemories.sort((a, b) => new Date(b.date) - new Date(a.date));
        console.log(allMemories);

        setMemories(allMemories);
        setFilteredMemories(allMemories);

        const uniqueYears = [
          ...new Set(allMemories.map(m => new Date(m.date).getFullYear()))
        ].sort((a,b) => b - a);

        setYears(uniqueYears);
      })
      .catch(error => {
        console.error("❌ Error fetching memories:", error);
        toast.error('Failed to load memories');
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = memories.filter(memory => {
      const memoryYear = new Date(memory.date).getFullYear().toString();
      const matchesName = memory.memoryTitle.toLowerCase().includes(term);
      const matchesYear = selectedYear === 'all' || memoryYear === selectedYear;
      return matchesName && matchesYear;
    });

    // Sort filtered memories descending by date
    const sortedFiltered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredMemories(sortedFiltered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [searchTerm, selectedYear, memories]);

  // Pagination calculations
  const indexOfLastMemory = currentPage * memoriesPerPage;
  const indexOfFirstMemory = indexOfLastMemory - memoriesPerPage;
  const currentMemories = filteredMemories.slice(indexOfFirstMemory, indexOfLastMemory);
  const totalPages = Math.ceil(filteredMemories.length / memoriesPerPage);

  // Change page handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Delete memory handler
  const handleDelete = async (memoryId) => {
    try {
      await axios.delete(`https://ugmproject.vercel.app/api/v1/memory/deleteMemory/${memoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedMemories = memories.filter(m => m._id !== memoryId);
      setMemories(updatedMemories);
      setFilteredMemories(updatedMemories);
      toast.success('Memory deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete memory!');
      console.error(error);
    } finally {
      setShowModal(false);
      setSelectedMemory(null);
    }
  };

  // Open delete confirm modal
  const confirmDelete = (memory) => {
    setSelectedMemory(memory);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className={darkMode ? 'tw-dark' : ''}>
        <div className={`tw-fixed tw-inset-0 ${darkMode ? 'tw-bg-gray-800' : 'tw-bg-white'} tw-flex tw-items-center tw-justify-center`}>
          <Spinner />
        </div>
      </div>
    );
  }

  if (!authenticated) return <Navigate to="/signin" replace />;

  return (
    <>
      <div className={`${darkMode ? 'tw-dark' : ''}`}>
        <div className="container-fluid dark:tw-bg-gray-800" style={{ minHeight: filteredMemories.length === 0 ? '80vh' : 'auto' }}>
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="container">
              <div className="row">
                <h1 className='mt-5 fw-bold mainColor dark:tw-text-indigo-600 text-center tw-text-3xl'>
                  {t('pageTitle')}
                </h1>

                <p className={`tw-text-center fs-4 tw-mb-6 tw-text-lg ${darkMode ? 'tw-text-white' : 'tw-text-gray-400'}`}>
                  {t('memoriesParagraph')}
                </p>

                <div className={`${styles.searching} d-flex align-items-center flex-wrap gap-3 rounded-4 py-4 px-4 dark:tw-bg-gray-900 tw-mb-8`}>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className='border-0 tw-py-3 tw-px-4 rounded-2 dark:tw-bg-gray-700 dark:tw-text-white focus:tw-ring-2 focus:tw-ring-indigo-500'
                    style={{ flexGrow: 3, minWidth: '300px' }}
                  />

                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className='tw-py-3 tw-px-4 border-0 rounded-2 dark:tw-bg-gray-700 dark:tw-text-white focus:tw-ring-2 focus:tw-ring-indigo-500'
                    style={{ flexGrow: 1, minWidth: '150px' }}
                  >
                    <option value="all">{t('allDates')}</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>

                  <button
                    className='bg-main hover:tw-bg-indigo-700 tw-transition-colors btn text-white tw-px-5 tw-py-3 dark:tw-bg-indigo-600 dark:hover:tw-bg-indigo-700 tw-rounded-3'
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedYear('all');
                    }}
                    style={{ flexGrow: 1, minWidth: '120px' }}
                  >
                    {t('resetFilter')}
                  </button>
                </div>

                <div className="row tw-mt-4">
                  {currentMemories.length === 0 ? (
                    <div className="tw-max-w-md tw-mx-auto mt-4 tw-bg-gray-100 dark:tw-bg-gray-900 tw-rounded-lg tw-shadow-md tw-p-6 tw-text-center">
                      <h4 className="tw-text-lg tw-font-semibold tw-text-gray-700 dark:tw-text-white mb-2">
                        {t('noMemories')}
                      </h4>
                      <p className="tw-text-gray-600 dark:tw-text-gray-300">
                        {t('noMemoriesDescription')}
                      </p>
                    </div>
                  ) : (
                    currentMemories.map((memory, index) => (
                      <div key={memory._id || index} className="col-lg-4 col-md-6 my-4">
                        <motion.div
                          className="card position-relative dark:tw-bg-gray-900 tw-h-[600px] tw-overflow-hidden tw-shadow-lg hover:tw-shadow-xl tw-transition-shadow"
                          whileHover={{ y: -5 }}
                        >
                          {/* Delete button only for Admin and SuperAdmin */}
                          {token && ['Admin', 'SuperAdmin'].includes(role) && (
                            <motion.button
                              whileHover={{ scale: 1.2, rotate: 90 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                              onClick={() => confirmDelete(memory)}
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
                              title="Delete Memory"
                            >
                              &times;
                            </motion.button>
                          )}

                          <img
                            src={memory.mainImage}
                            className="card-img-top tw-w-full tw-h-[450px] tw-object-cover"
                            alt={memory.memoryTitle}
                          />
                          <div className="card-body tw-p-5">
                            <h5 className="card-title mainColor dark:tw-text-indigo-600 tw-text-xl tw-font-semibold">
                              {memory.memoryTitle}
                            </h5>
                            <div className={`${styles.parent} ${isRTL ? styles.pad2 : styles.pad}`}>
                              <div className="card-end d-flex justify-content-between tw-mt-4">
                                <div className="card-date tw-flex tw-items-center">
                                  <span className="tw-text-gray-500 dark:tw-text-white">
                                    {new Date(memory.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="card-btn">
                                  <button
                                    className="bg-main hover:tw-bg-indigo-700 rounded-3 tw-transition-colors text-white tw-w-full tw-px-7 dark:tw-bg-indigo-600 dark:hover:tw-bg-indigo-700 tw-py-2"
                                    onClick={() => navigate(`/memory/${memory._id}`)}
                                  >
                                    {t('viewButton')}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination Buttons */}
                {totalPages > 1 && (
                  <div className="pagination-container tw-flex tw-justify-center tw-gap-2 tw-mb-10 tw-mt-6">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`tw-rounded tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-cursor-pointer
                          ${currentPage === i + 1 ? 'tw-bg-[#4B0082] tw-text-white' : 'tw-bg-gray-300 dark:tw-bg-gray-700 tw-text-black dark:tw-text-white'}
                        `}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && selectedMemory && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h4 className="text-danger fw-bold">⚠️ {t('deleteMemoryTitle')}</h4>
            <p>{t('deleteMemoryConfirm')} <b>{selectedMemory.memoryTitle}</b>?</p>
            <p className="text-danger">{t('deleteMemoryWarning')}</p>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">{t('cancel')}</button>
              <button onClick={() => handleDelete(selectedMemory._id)} className="btn btn-danger">{t('delete')}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal-box {
          background: white;
          padding: 30px;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  );
}
