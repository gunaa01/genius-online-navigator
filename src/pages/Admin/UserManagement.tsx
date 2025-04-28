import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/apiFetch';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  created_at?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/api/admin/users')
      .then(async res => {
        if (!res.ok) {
          setError('Failed to fetch users');
          return;
        }
        setUsers(await res.json());
      });
  }, []);

  return (
    <div>
      <h3>User Management</h3>
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.role || 'user'}</td>
              <td>{user.created_at}</td>
              <td>
                {/* Add buttons for promote/demote/ban actions here */}
                <button>Ban</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
