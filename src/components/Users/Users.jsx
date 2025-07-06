import React, { useEffect, useState } from 'react';
import styles from './Users.module.css';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Users() {
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

        const adminUsers = adminsResponse.data.users || [];
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
      toast.error('Error loading users');
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
      toast.error('Not authorized');
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

      toast.success('Role updated successfully');
      setIsActive(false);
      setSelectedUser(null);
      fetchData();
    } catch (error) {
      const message =
        error.response?.status === 403
          ? 'Not authorized'
          : error.response?.data?.message || 'Error updating role';
      toast.error(message);
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteUser = async () => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (role !== 'SuperAdmin') {
      toast.error('Not authorized');
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
      toast.success('User deleted successfully');
      setSelectedUserToDelete(null);
      fetchData();
    } catch (error) {
      toast.error('Error deleting user');
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
          >
            <h3 className="pt-4">
              <i className="fa-solid fa-user-shield mainColor"></i> Change User Role
            </h3>
            <p className="text-muted">
              Are you sure you want to change <strong>{selectedUser.userName}</strong>'s role from{' '}
              <strong>{selectedUser.role}</strong> to{' '}
              <strong>{selectedUser.role === 'Admin' ? 'User' : 'Admin'}</strong>?
            </p>
            <div className="btns mb-4 d-flex justify-content-end">
              <button onClick={() => setIsActive(false)} className="btn btn-outline-dark">
                Cancel
              </button>
              <button
                onClick={handleRoleChange}
                className="border-0 rounded-2 p-3 bg-main text-white mx-2"
              >
                Confirm change
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
          >
            <h3 className="pt-4">
              <i className="fa-solid fa-trash mainColor"></i> Delete User
            </h3>
            <p className="text-muted">
              Are you sure you want to delete <strong>{selectedUserToDelete.userName}</strong>?
            </p>
            <div className="btns mb-4 d-flex justify-content-end">
              <button
                onClick={() => setSelectedUserToDelete(null)}
                className="btn btn-outline-dark"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="border-0 rounded-2 p-3 bg-danger text-white mx-2"
              >
                Confirm delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="row d-flex justify-content-center">
          <div className={`col-12 ${styles.shad} mt-4 rounded-2 p-3 position-relative`}>
            <h3>Users Management</h3>

            <input
              type="text"
              placeholder="Search by name..."
              className="form-control mb-3"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />

            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : currentUsers.length === 0 ? (
              <div className="text-center my-5 text-muted fs-5">No users found.</div>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={user._id}>
                      <th>{indexOfFirstUser + index + 1}</th>
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
                        <i
                          className="fa-solid fa-pen-to-square text-success ms-3 crsr"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedUser(user);
                            setIsActive(true);
                          }}
                        ></i>
                      </td>
                      <td>
                        <i
                          className="fa-solid fa-trash text-danger ms-3 crsr"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedUserToDelete(user)}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <nav>
                  <ul className="pagination">
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
