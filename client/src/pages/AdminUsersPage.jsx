import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchUsers } from '../services/adminService';
import Spinner from '../components/Spinner';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await fetchUsers();
        setUsers(data);
      } catch (error) {
        toast.error('Unable to load users');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <div>
      <h3>Registered Patients</h3>
      {loading ? <Spinner /> : (
        <div className="table-responsive mt-3">
          <table className="table table-hover">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Registered</th></tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
