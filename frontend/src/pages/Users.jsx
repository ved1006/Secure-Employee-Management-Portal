import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';

const Users = () => {

  // Users data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Role management
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  // =========================
  // FETCH USERS
  // =========================

  useEffect(() => {

    const fetchUsers = async () => {
      try {

        const response = await api.get('/users');

        setUsers(response.data);

      } catch (err) {

        console.error(err);
        setError('Failed to load users.');

      } finally {

        setLoading(false);

      }
    };

    fetchUsers();

  }, []);

  // =========================
  // OPEN ROLE MODAL
  // =========================

  const handleManageRole = (user) => {

    setSelectedUser(user);
    setSelectedRole(user.role);

    setActionError('');
    setIsRoleModalOpen(true);

  };

  // =========================
  // UPDATE ROLE
  // =========================

  const handleRoleUpdate = async (e) => {

    e.preventDefault();

    if (!selectedUser) return;

    setActionLoading(true);
    setActionError('');

    try {

      await api.put(
        `/users/${selectedUser.id}/role`,
        {
          role: selectedRole
        }
      );

      // Refresh users after update
      const response = await api.get('/users');

      setUsers(response.data);

      // Close modal
      setIsRoleModalOpen(false);
      setSelectedUser(null);

    } catch (error) {

      console.error(error);

      setActionError(
        error.response?.data?.message ||
        'Failed to update user role.'
      );

    } finally {

      setActionLoading(false);

    }
  };

  const handleStatusUpdate = async () => {
  if (!selectedUser) return;

  setActionLoading(true);
  setActionError('');

  try {
    await api.put(
      `/users/${selectedUser.id}/status`,
      null,
      {
        params: {
          enabled: !selectedUser.enabled
        }
      }
    );

    const response = await api.get('/users');
    setUsers(response.data);

    const updatedUser = response.data.find(
      user => user.id === selectedUser.id
    );

    setSelectedUser(updatedUser);

  } catch (error) {
    console.error(error);

    setActionError(
      error.response?.data?.message ||
      'Failed to update account status.'
    );
  } finally {
    setActionLoading(false);
  }
};

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="p-6 text-sm font-semibold text-slate-500">
        Loading users...
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="p-6 text-sm font-semibold text-rose-600">
        {error}
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-6">

      {/* Page Header */}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          User Management
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Manage system users, roles and account status
        </p>
      </div>


      {/* Users Table */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-slate-50 border-b border-slate-200">

              <tr>

                <th className="text-left px-6 py-4 font-bold text-slate-500 uppercase text-xs">
                  Username
                </th>

                <th className="text-left px-6 py-4 font-bold text-slate-500 uppercase text-xs">
                  Email
                </th>

                <th className="text-left px-6 py-4 font-bold text-slate-500 uppercase text-xs">
                  Role
                </th>

                <th className="text-left px-6 py-4 font-bold text-slate-500 uppercase text-xs">
                  Status
                </th>

                <th className="text-right px-6 py-4 font-bold text-slate-500 uppercase text-xs">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {users.map((user) => (

                <tr
                  key={user.id}
                  className="hover:bg-slate-50 transition-colors"
                >

                  {/* Username */}

                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {user.username}
                  </td>


                  {/* Email */}

                  <td className="px-6 py-4 text-slate-500">
                    {user.email}
                  </td>


                  {/* Role */}

                  <td className="px-6 py-4">

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">

                      {user.role}

                    </span>

                  </td>


                  {/* Status */}

                  <td className="px-6 py-4">

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.enabled
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >

                      {user.enabled
                        ? 'Active'
                        : 'Disabled'}

                    </span>

                  </td>


                  {/* Actions */}

                  <td className="px-6 py-4 text-right">

                    <button
                      onClick={() => handleManageRole(user)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors"
                    >
                      Manage
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* ROLE MODAL */}

      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => {

          if (!actionLoading) {
            setIsRoleModalOpen(false);
          }

        }}
        title="Manage User"
      >

        <form
          onSubmit={handleRoleUpdate}
          className="space-y-5"
        >

          {/* Selected user */}

          {selectedUser && (

            <div className="bg-slate-50 rounded-xl p-4">

              <p className="text-sm font-bold text-slate-800">
                {selectedUser.username}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                {selectedUser.email}
              </p>

            </div>

          )}


          {/* Error */}

          {actionError && (

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold">

              {actionError}

            </div>

          )}


          {/* Role */}

          <div>
  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
    Role
  </label>

  <select
    value={selectedRole}
    onChange={(e) => setSelectedRole(e.target.value)}
    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
  >
    <option value="EMPLOYEE">
      Employee
    </option>

    <option value="HR">
      HR
    </option>

    <option value="ADMIN">
      Admin
    </option>
  </select>
</div>

{/* Account Status */}
<div className="border-t border-slate-100 pt-5">

  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
    Account Status
  </p>

  <p className="text-sm text-slate-600 mb-3">
    This controls whether the user can log in.
  </p>

  <button
    type="button"
    onClick={handleStatusUpdate}
    disabled={actionLoading}
    className={`px-4 py-2.5 rounded-xl font-semibold text-sm border transition-colors ${
      selectedUser?.enabled
        ? 'text-rose-600 border-rose-200 hover:bg-rose-50'
        : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
    }`}
  >
    {selectedUser?.enabled
      ? 'Disable Account'
      : 'Enable Account'}
  </button>

</div>


          {/* Buttons */}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">

            <button
              type="button"
              onClick={() =>
                setIsRoleModalOpen(false)
              }
              disabled={actionLoading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm disabled:opacity-50"
            >

              {actionLoading
                ? 'Updating...'
                : 'Update Role'}

            </button>

          </div>

        </form>

      </Modal>

    </div>
  );
};

export default Users;