import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './WalletManagement.module.css';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function WalletManagement() {
  const { t, i18n } = useTranslation("walletManagement");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [operation, setOperation] = useState('add');
  const [description, setDescription] = useState('');
  const [updatedUserId, setUpdatedUserId] = useState(null);
  const [historyUser, setHistoryUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [pageRange] = useState(6);

  const isRTL = i18n.language === 'ar';

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(
        'https://ugmproject.vercel.app/api/v1/user/gitAllUsers',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.users)
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      toast.error(t('walletManagement.errors.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
      setCurrentPage(1);
    } else {
      const filtered = users.filter(user =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, users]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getPageRange = () => {
    let start = Math.max(1, currentPage - Math.floor(pageRange / 2));
    let end = Math.min(totalPages, start + pageRange - 1);
    
    if (end - start + 1 < pageRange) {
      start = Math.max(1, end - pageRange + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleTransaction = async () => {
    const token = localStorage.getItem('token');
    if (!selectedUser || !amount || !operation || isNaN(amount)) {
      toast.error(t('walletManagement.errors.fillFields'));
      return;
    }

    const currentBalance = selectedUser.wallet || 0;
    const newBalance =
      operation === 'remove'
        ? currentBalance - parseFloat(amount)
        : currentBalance + parseFloat(amount);

    if (newBalance < 0) {
      toast.error(t('walletManagement.errors.insufficientBalance'));
      return;
    }

    setProcessing(true);
    try {
      await axios.put(
        `https://ugmproject.vercel.app/api/v1/user/updateWallet/${selectedUser._id}`,
        {
          amount: parseFloat(amount),
          operation,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id
            ? { ...user, wallet: newBalance }
            : user
        )
      );

      setUpdatedUserId(selectedUser._id);
      setTimeout(() => setUpdatedUserId(null), 3000);

      toast.success(t('walletManagement.errors.transactionSuccess'));
      setAmount('');
      setDescription('');
      setSelectedUser(null);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.err ||
        t('walletManagement.errors.transactionFailed');
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div 
      className={`tw-container-fluid ${styles.walletContainer} tw-text-white tw-p-4`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="tw-row tw-flex tw-justify-center">
        <div className={`tw-w-full tw-mt-4 tw-rounded-2xl tw-p-3 tw-relative ${styles.shad} tw-max-w-[1800px]`}>
          <div className="tw-flex tw-flex-col tw-mb-4 tw-w-full">
            <h3
  className={`tw-text-xl md:tw-text-2xl tw-font-semibold tw-text-black dark:tw-text-white tw-mb-3 ${isRTL ? 'tw-text-right' : 'tw-text-left'}`}
>
  {t('walletManagement.title')}
</h3>
            <div className="tw-relative tw-w-full">
              <input
                type="text"
                placeholder={t('walletManagement.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="tw-w-full tw-bg-white dark:tw-bg-gray-700 tw-text-gray-800 dark:tw-text-gray-200 tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-md tw-px-4 tw-py-2 tw-pl-10 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-yellow-400 dark:focus:tw-ring-yellow-500"
              />
              <i className={`fa-solid fa-search tw-absolute ${isRTL ? 'tw-right-3' : 'tw-left-3'} tw-top-3 tw-text-gray-400`}></i>
            </div>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ maxHeight: '80vh' }}>
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="tw-overflow-x-auto">
                <table className="tw-w-full tw-text-sm tw-border tw-rounded-lg tw-overflow-hidden tw-bg-white dark:tw-bg-gray-900 tw-text-black dark:tw-text-white">
                  <thead className="tw-bg-gray-100 dark:tw-bg-gray-800">
                    <tr>
                      <th className="tw-px-2 tw-py-2 sm:tw-px-4">{t('walletManagement.tableHeaders.index')}</th>
                      <th className="tw-px-2 tw-py-2 sm:tw-px-4">{t('walletManagement.tableHeaders.name')}</th>
                      <th className="tw-px-2 tw-py-2 sm:tw-px-4">{t('walletManagement.tableHeaders.balance')}</th>
                      <th className="tw-px-2 tw-py-2 sm:tw-px-4">{t('walletManagement.tableHeaders.manage')}</th>
                      <th className="tw-px-2 tw-py-2 sm:tw-px-4">{t('walletManagement.tableHeaders.history')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length > 0 ? (
                      currentUsers.map((user, index) => (
                        <tr
                          key={user._id}
                          className={`tw-border-t tw-border-gray-200 dark:tw-border-gray-700 ${
                            updatedUserId === user._id ? 'tw-bg-green-100 dark:tw-bg-green-900 tw-transition-all' : ''
                          }`}
                        >
                          <td className="tw-px-2 tw-py-2 sm:tw-px-4">{indexOfFirstUser + index + 1}</td>
                          <td className="tw-px-2 tw-py-2 sm:tw-px-4">
                            {user.userName}
                            {updatedUserId === user._id && (
                              <span className="tw-text-green-500 tw-text-xs tw-ml-2">
                                {t('walletManagement.updated')}
                              </span>
                            )}
                          </td>
                          <td className="tw-px-2 tw-py-2 sm:tw-px-4">{user.wallet || 0} EGP</td>
                          <td className="tw-px-2 tw-py-2 sm:tw-px-4">
                            <button
                              className="tw-bg-yellow-500 tw-text-white dark:tw-bg-transparent dark:tw-text-yellow-400 dark:tw-border dark:tw-border-yellow-400 tw-px-2 tw-py-1 tw-rounded hover:tw-bg-yellow-400 hover:tw-text-black tw-text-xs sm:tw-text-sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              {t('walletManagement.manageButton')}
                            </button>
                          </td>
                          <td className="tw-px-2 tw-py-2 sm:tw-px-4">
                            <button
                              className="tw-bg-blue-500 tw-text-white tw-px-2 tw-py-1 tw-rounded hover:tw-bg-blue-600 tw-text-xs sm:tw-text-sm"
                              onClick={() => setHistoryUser(user)}
                            >
                              {t('walletManagement.historyButton')}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="tw-px-4 tw-py-6 tw-text-center">
                          {t('walletManagement.noUsers')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="tw-flex tw-justify-center tw-mt-4">
                  <nav>
                    <ul className="tw-flex tw-list-none tw-p-0 tw-m-0 tw-flex-wrap tw-justify-center">
                      <li className={`tw-mx-1 tw-my-1 ${currentPage === 1 ? 'tw-opacity-50 tw-cursor-not-allowed' : ''}`}>
                        <button
                          className="tw-px-3 tw-py-1 tw-rounded tw-border tw-border-gray-300 tw-bg-white dark:tw-bg-gray-800 tw-text-black dark:tw-text-white"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          {t('walletManagement.pagination.previous')}
                        </button>
                      </li>

                      {getPageRange().map((number) => (
                        <li key={number} className="tw-mx-1 tw-my-1">
                          <button
                            className={`tw-px-3 tw-py-1 tw-rounded tw-border ${
                              currentPage === number
                                ? 'tw-bg-yellow-500 tw-border-yellow-500 tw-text-white'
                                : 'tw-border-gray-300 tw-bg-white dark:tw-bg-gray-800 tw-text-black dark:tw-text-white'
                            }`}
                            onClick={() => handlePageChange(number)}
                          >
                            {number}
                          </button>
                        </li>
                      ))}

                      <li className={`tw-mx-1 tw-my-1 ${currentPage === totalPages ? 'tw-opacity-50 tw-cursor-not-allowed' : ''}`}>
                        <button
                          className="tw-px-3 tw-py-1 tw-rounded tw-border tw-border-gray-300 tw-bg-white dark:tw-bg-gray-800 tw-text-black dark:tw-text-white"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          {t('walletManagement.pagination.next')}
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>

        {selectedUser && (
          <div
            onClick={() => setSelectedUser(null)}
            className="tw-fixed tw-inset-0 tw-flex tw-justify-center tw-items-center tw-z-[9999] tw-bg-black/60"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="tw-bg-white dark:tw-bg-gray-900 tw-text-black dark:tw-text-white tw-p-6 tw-rounded-2xl tw-w-full tw-max-w-md tw-mx-4"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <h4 className="tw-mb-4 tw-font-semibold tw-text-lg">
                <i className="fa-solid fa-wallet tw-text-yellow-400"></i> {t('walletManagement.modal.title', { userName: selectedUser.userName })}
              </h4>
              <div className="tw-mb-4">
                <label className="tw-block tw-mb-1">{t('walletManagement.modal.amountLabel')}</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="tw-w-full tw-bg-white dark:tw-bg-gray-800 tw-text-black dark:tw-text-white tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-md tw-px-3 tw-py-2"
                />
              </div>
              <div className="tw-mb-4">
                <label className="tw-block tw-mb-1">{t('walletManagement.modal.operationLabel')}</label>
                <select
                  className="tw-w-full tw-bg-white dark:tw-bg-gray-800 tw-text-black dark:tw-text-white tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-md tw-px-3 tw-py-2"
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                >
                  <option value="add">{t('walletManagement.modal.operationOptions.add')}</option>
                  <option value="remove">{t('walletManagement.modal.operationOptions.remove')}</option>
                </select>
              </div>
              <div className="tw-mb-4">
                <label className="tw-block tw-mb-1">{t('walletManagement.modal.descriptionLabel')}</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="tw-w-full tw-bg-white dark:tw-bg-gray-800 tw-text-black dark:tw-text-white tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-md tw-px-3 tw-py-2"
                />
              </div>
              <div className={`tw-flex tw-justify-end tw-flex-wrap tw-gap-2 ${isRTL ? 'tw-flex-row-reverse' : ''}`}>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="tw-border tw-border-gray-400 tw-text-gray-600 tw-rounded-md tw-px-4 tw-py-2 hover:tw-bg-gray-200 tw-flex-1 sm:tw-flex-none"
                >
                  {t('walletManagement.modal.cancelButton')}
                </button>
                <button
                  onClick={handleTransaction}
                  disabled={processing}
                  className="tw-bg-yellow-400 tw-text-black tw-rounded-md tw-px-4 tw-py-2 hover:tw-bg-yellow-500 tw-flex tw-items-center tw-justify-center tw-min-w-[100px] tw-flex-1 sm:tw-flex-none"
                >
                  {processing ? (
                    <span className="tw-flex tw-items-center">
                      <span className="tw-animate-spin tw-rounded-full tw-h-4 tw-w-4 tw-border-t-2 tw-border-b-2 tw-border-yellow-600 tw-mr-2"></span>
                      {t('walletManagement.modal.processing')}
                    </span>
                  ) : (
                    t('walletManagement.modal.confirmButton')
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {historyUser && (
          <div
            onClick={() => setHistoryUser(null)}
            className="tw-fixed tw-inset-0 tw-flex tw-justify-center tw-items-center tw-z-[9999] tw-bg-black/60"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="tw-bg-white dark:tw-bg-gray-900 tw-text-black dark:tw-text-white tw-p-6 tw-rounded-2xl tw-w-full tw-max-w-3xl tw-overflow-y-auto tw-max-h-[90vh] tw-mx-4"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
<h4 className="tw-text-lg tw-font-semibold tw-mb-4">
  {t('walletManagement.historyModal.title', { userName: historyUser.userName })}
</h4>
              {historyUser.walletHistory?.length > 0 ? (
                <div className="tw-overflow-x-auto">
                  <table className="tw-w-full tw-text-sm tw-border tw-rounded tw-overflow-hidden tw-bg-white dark:tw-bg-gray-800">
                    <thead>
                      <tr>
                        <th className="tw-px-2 tw-py-2 sm:tw-px-4">{t('walletManagement.historyModal.headers.operation')}</th>
                        <th className="tw-px-2 tw-py-2 sm:tw-px-4">{t('walletManagement.historyModal.headers.amount')}</th>
                        <th className="tw-px-2 tw-py-2 sm:tw-px-4">{t('walletManagement.historyModal.headers.description')}</th>
                        <th className="tw-px-2 tw-py-2 sm:tw-px-4">{t('walletManagement.historyModal.headers.admin')}</th>
                        <th className="tw-px-2 tw-py-2 sm:tw-px-4">{t('walletManagement.historyModal.headers.date')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyUser.walletHistory.map((item, idx) => (
                        <tr key={item._id || idx} className="tw-border-t">
                          <td className="tw-px-2 tw-py-2 sm:tw-px-4">{t(`${item.operation}`)}</td>
                          <td className="tw-px-2 tw-py-2 sm:tw-px-4">{item.amount} EGP</td>
                          <td className="tw-px-2 tw-py-2 sm:tw-px-4">{item.description || '-'}</td>
                          <td className="tw-px-2 tw-py-2 sm:tw-px-4">{item.performedBy?.adminName || '-'}</td>
                          <td className="tw-px-2 tw-py-2 sm:tw-px-4">
                            {new Date(item.createdAt).toLocaleString(i18n.language, {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>{t('walletManagement.historyModal.noTransactions')}</p>
              )}
              <div className={`tw-text-right tw-mt-4 ${isRTL ? 'tw-text-left' : ''}`}>
                <button
                  onClick={() => setHistoryUser(null)}
                  className="tw-bg-gray-300 tw-text-black tw-rounded-md tw-px-4 tw-py-2 hover:tw-bg-gray-400"
                >
                  {t('walletManagement.historyModal.closeButton')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}