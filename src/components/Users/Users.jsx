import React, { useEffect, useState } from 'react';
import styles from './Users.module.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Users() {
  const { t } = useTranslation('users');
  const [isActive, setIsActive] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const USERS_PER_PAGE = 10;

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    try {
      const usersResponse = await axios.get(
        'https://ugmproject.vercel.app/api/v1/user/gitAllUsers',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (role === 'SuperAdmin') {
        const adminsResponse = await axios.get(
          'https://ugmproject.vercel.app/api/v1/user/gitAllAdmins',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            
          }
        );
        

        const adminUsers = adminsResponse.data.admins || [];
        const allUsers = [
          ...adminUsers,
          ...usersResponse.data.users.filter(
            (user) => !adminUsers.find((admin) => admin._id === user._id)
          ),
        ];
        setUsers(allUsers);
      } else {
        const nonAdmins = usersResponse.data.users.filter((user) => user.role !== 'Admin');
        setUsers(nonAdmins);
      }
    } catch (error) {
      toast.error(t('errorLoadingUsers'));
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'SuperAdmin') {
      toast.error(t('notAuthorized'));
      return;
    }

    try {
      const newRole = selectedUser.role === 'Admin' ? 'User' : 'Admin';

      await axios.put(
        `https://ugmproject.vercel.app/api/v1/user/updatedRole/${selectedUser._id}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(t('roleUpdated'));
      setIsActive(false);
      setSelectedUser(null);
      fetchData();
    } catch (error) {
      const message =
        error.response?.status === 403
          ? t('notAuthorized')
          : error.response?.data?.message || t('errorUpdatingRole');
      toast.error(message);
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteUser = async () => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (role !== 'SuperAdmin') {
      toast.error(t('notAuthorized'));
      setSelectedUserToDelete(null);
      return;
    }

    try {
      await axios.delete(
        `https://ugmproject.vercel.app/api/v1/user/delete/${selectedUserToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(t('userDeleted'));
      setSelectedUserToDelete(null);
      fetchData();
    } catch (error) {
      toast.error(t('errorDeletingUser'));
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {isActive && selectedUser && (
        <div
          onClick={() => setIsActive(false)}
          className="layer position-fixed top-0 start-0 d-flex justify-content-center align-items-center"
          style={{
            height: '100vh',
            width: '100vw',
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`popUp bg-white position-absolute p-4 rounded-4 ${styles.popupWidth}`}
            style={{ maxWidth: '95%', width: '500px' }}
          >
            <h3 className="pt-4">
              <i className="fa-solid fa-user-shield mainColor"></i> {t('changeRole.title')}
            </h3>
            <p className="text-muted">
              {t('changeRole.message', {
                userName: selectedUser.userName,
                currentRole: selectedUser.role,
                newRole: selectedUser.role === 'Admin' ? 'User' : 'Admin'
              })}
            </p>
            <div className="btns mb-4 d-flex justify-content-end flex-wrap gap-2">
              <button onClick={() => setIsActive(false)} className="btn btn-outline-dark">
                {t('changeRole.cancel')}
              </button>
              <button
                onClick={handleRoleChange}
                className="border-0 rounded-2 p-2 p-md-3 bg-main text-white"
              >
                {t('changeRole.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedUserToDelete && (
        <div
          onClick={() => setSelectedUserToDelete(null)}
          className="layer position-fixed top-0 start-0 d-flex justify-content-center align-items-center"
          style={{
            height: '100vh',
            width: '100vw',
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`popUp bg-white position-absolute p-4 rounded-4 ${styles.popupWidth}`}
            style={{ maxWidth: '95%', width: '500px' }}
          >
            <h3 className="pt-4">
              <i className="fa-solid fa-trash mainColor"></i> {t('deleteUser.title')}
            </h3>
            <p className="text-muted">
              {t('deleteUser.message', { userName: selectedUserToDelete.userName })}
            </p>
            <div className="btns mb-4 d-flex justify-content-end flex-wrap gap-2">
              <button
                onClick={() => setSelectedUserToDelete(null)}
                className="btn btn-outline-dark"
              >
                {t('deleteUser.cancel')}
              </button>
              <button
                onClick={handleDeleteUser}
                className="border-0 rounded-2 p-2 p-md-3 bg-danger text-white"
              >
                {t('deleteUser.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid px-3 px-md-4 px-lg-5">
        <div className="row d-flex justify-content-center">
          <div className={`col-12 ${styles.shad} mt-4 rounded-2 p-3 position-relative`}>
            <h3>{t('usersManagement')}</h3>

            <div className="row">
              <div className="col-12 col-md-6 col-lg-4">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="form-control mb-3 w-100"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">{t('loading')}</span>
                </div>
              </div>
            ) : currentUsers.length === 0 ? (
              <div className="text-center my-5 text-muted fs-5">{t('noUsersFound')}</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>{t('columns.number')}</th>
                      <th>{t('columns.name')}</th>
                      <th>{t('columns.role')}</th>
                      <th>{t('columns.update')}</th>
                      <th>{t('columns.delete')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user, index) => (
                      <tr key={user._id}>
                        <td>{indexOfFirstUser + index + 1}</td>
                        <td>{user.userName}</td>
                        <td>
                          <span
                            className={`badge ${
                              user.role === 'Admin' ? 'bg-success' : 'bg-secondary'
                            } py-1`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-link text-success p-0"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsActive(true);
                            }}
                            aria-label={t('columns.update')}
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-link text-danger p-0"
                            onClick={() => setSelectedUserToDelete(user)}
                            aria-label={t('columns.delete')}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <nav>
                  <ul className="pagination flex-wrap">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <li
                        key={index}
                        className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                      >
                        <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}