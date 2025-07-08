import React, { useContext, useEffect, useState } from 'react';
import styles from './ServantList.module.css';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import { darkModeContext } from '../../Context/DarkModeContext';
import { useTranslation } from 'react-i18next';

export default function ServantList() {
  const { t } = useTranslation('servantList');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCohort, setSelectedCohort] = useState('');
  const { darkMode } = useContext(darkModeContext);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [loading, setLoading] = useState(true);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const getData = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const res = await axios.get('https://ugmproject.vercel.app/api/v1/served/getAllServeds', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseData = res.data.served || [];
      setData(responseData);
      setFilteredData(responseData);
    } catch (error) {
      toast.error('حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

 const deleteServant = async (id) => {
  const token = localStorage.getItem('token');
  console.log("Deleting ID:", id); 
  console.log("Using Token:", token); 

  try {
    const response = await axios.delete(
      `https://ugmproject.vercel.app/api/v1/served/deleteServed/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log("Delete Response:", response.data);
    toast.success(t('deleteSuccess'));
    getData();
    return response.data; 
  } catch (error) {
    console.error("Full Error:", error);
    console.error("Error Response:", error.response?.data);
    toast.error(error.response?.data?.message || t('deleteError'));
    throw error; 
  }
};

  const handleDelete = (person) => {
    setSelectedUser(person);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    await deleteServant(selectedUser._id);
    setShowConfirm(false);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    let result = [...data];
    if (selectedCohort) {
      result = result.filter(servant => servant.cohort === selectedCohort);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(servant =>
        servant.fullName?.toLowerCase().includes(term)
      );
    }
    setFilteredData(result);
  }, [searchTerm, selectedCohort, data]);

  const navigate = useNavigate();
  const handleEdit = (id, person) => {
    navigate(`ServantDetails/${id}`, { state: { person } });
  };

  return (
    <>
      <div className={`${darkMode ? 'tw-dark' : ''}`}>
        <div className="container-fluid dark:tw-bg-gray-800 py-4">
          <div className="container" style={{ minHeight: '80vh' }}>
            <div className="row">
              <Toaster position="top-center" />
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                <h1 className='text-center mainColor dark:tw-text-indigo-600 mt-5 fw-bolder'>{t('title')}</h1>
                <p className="text-center mb-4 fs-4 tw-text-gray-600 dark:tw-text-white text-sm">
                  {t('description.part1')}<br />
                  {t('description.part2')}
                </p>

                <div className="col">
                  <div className={`${styles.searching} mb-5 px-2 d-Myflex align-items-center rounded-4 py-4 dark:tw-bg-gray-900`}>
                    <input
                      type="text"
                      placeholder={t('searchPlaceholder')}
                      className='w-input border border-0 pyt-3 me-2 rounded-2'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select
                      className='pyt-3 w-Drop me-3 my-2 border border-0 rounded-2'
                      value={selectedCohort}
                      onChange={(e) => setSelectedCohort(e.target.value)}
                    >
                      <option value="">{t('allCohorts')}</option>
                      <option value="1st_University">{t('cohortOptions.1st_University')}</option>
                      <option value="2nd_University">{t('cohortOptions.2nd_University')}</option>
                      <option value="3rd_University">{t('cohortOptions.3rd_University')}</option>
                      <option value="4th_University">{t('cohortOptions.4th_University')}</option>
                      <option value="1_Graduate">{t('cohortOptions.1_Graduate')}</option>
                      <option value="2_Graduate">{t('cohortOptions.2_Graduate')}</option>
                      <option value="3_Graduate">{t('cohortOptions.3_Graduate')}</option>
                      <option value="4_Graduate">{t('cohortOptions.4_Graduate')}</option>
                      <option value="5_Graduate">{t('cohortOptions.5_Graduate')}</option>
                    </select>

                    <button
                      className={`${styles.myButton} bg-main dark:tw-bg-indigo-600 btn text-white w-myBtn py-3`}
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCohort('');
                      }}
                    >
                      {t('resetFilters')}
                    </button>
                  </div>

                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">{t('Loading')}</p>
                    </div>
                  ) : (
                    <div className="tw-w-full tw-overflow-x-auto tw-overflow-y-visible">
                      <table className="table table-striped tw-w-full">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>{t('tableHeaders.name')}</th>
                            <th>{t('tableHeaders.cohort')}</th>
                            <th>{t('tableHeaders.details')}</th>
                            <th>{t('tableHeaders.delete')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredData.map((person, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{person.firstName} {person.secName} {person.familyName}</td>
                              <td>{person.cohort}</td>
                              <td>
                                <i
                                  className="fa-solid fa-pen-to-square text-success ms-3 crsr"
                                  onClick={() => handleEdit(person._id, person)}
                                ></i>
                              </td>
                              <td>
                                <i
                                  className="fa-solid fa-trash text-danger ms-3 crsr"
                                  onClick={() => handleDelete(person)}
                                ></i>
                              </td>
                            </tr>
                          ))}
                          {filteredData.length === 0 && (
                            <tr>
                              <td colSpan="5" className="text-center py-5 text-muted">{t('noResults')}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="tw-fixed tw-inset-0 tw-z-[9999] tw-flex tw-items-center tw-justify-center tw-bg-black/60 tw-px-4">
          <div className={`tw-w-full tw-max-w-md tw-rounded-xl tw-shadow-xl tw-p-6 tw-text-center
            ${darkMode ? 'tw-bg-gray-800 tw-text-white' : 'tw-bg-white tw-text-gray-900'}`}>

            <div className="tw-mb-4">
              <div className="tw-w-16 tw-h-16 tw-mx-auto tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-red-100">
                <i className="fa-solid fa-triangle-exclamation tw-text-red-600 tw-text-3xl"></i>
              </div>
              <h2 className="tw-text-2xl tw-font-bold tw-mt-4 tw-text-red-600">Delete Confirmation</h2>
            </div>

            <p className="tw-mb-2">
              Are you sure you want to delete
              <strong> {selectedUser?.firstName} {selectedUser?.secName} {selectedUser?.familyName}</strong>?
            </p>
            <p className="tw-text-sm tw-text-red-500 tw-mb-6">This action cannot be undone.</p>

            <div className="tw-flex tw-justify-center tw-gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className={`tw-px-5 tw-py-2 tw-rounded-lg tw-text-sm tw-font-semibold tw-transition
                  ${darkMode
                    ? 'tw-bg-gray-700 hover:tw-bg-gray-600 tw-text-white'
                    : 'tw-bg-gray-200 hover:tw-bg-gray-300 tw-text-gray-900'}`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="tw-px-5 tw-py-2 tw-rounded-lg tw-bg-red-600 hover:tw-bg-red-700 tw-text-white tw-font-semibold tw-text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
