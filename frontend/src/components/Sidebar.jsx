import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FolderTree,
  LogOut,
  Shield,
  Briefcase,
  LockKeyhole,
  X,
  Eye,
  EyeOff,
  Megaphone,
  CalendarDays
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  // Change password modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard
    },
    {
  name: 'Announcements',
  path: '/announcements',
  icon: Megaphone
},

...(user?.role === 'EMPLOYEE'
  ? [
      {
        name: 'My Leaves',
        path: '/my-leaves',
        icon: CalendarDays
      }
    ]
  : []),

    ...(user?.role === 'ADMIN' || user?.role === 'HR'
      ? [
          {
            name: 'Employees',
            path: '/employees',
            icon: Users
          },
          {
            name: 'Departments',
            path: '/departments',
            icon: FolderTree
          },
           {
        name: 'Leave Requests',
        path: '/leave-requests',
        icon: CalendarDays
      }
        ]
      : []),

    ...(user?.role === 'ADMIN'
      ? [
          {
            name: 'User Management',
            path: '/users',
            icon: Shield
          }
        ]
      : [])
  ];

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-rose-100 text-rose-800 border border-rose-200';

      case 'HR':
        return 'bg-amber-100 text-amber-800 border border-amber-200';

      default:
        return 'bg-blue-100 text-blue-800 border border-blue-200';
    }
  };

  const openPasswordModal = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    setPasswordError('');
    setPasswordSuccess('');
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    if (passwordLoading) return;

    setIsPasswordModalOpen(false);
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear old error while user is typing
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setPasswordError('');
    setPasswordSuccess('');

    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = passwordData;

    // Frontend validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        'New password must be different from current password.'
      );
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      });

      setPasswordSuccess(
        response.data || 'Password changed successfully.'
      );

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (error) {
      console.error('Change password error:', error);

      setPasswordError(
        error.response?.data?.message ||
        error.response?.data ||
        'Failed to change password. Please try again.'
      );

    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <aside
  className={`
    fixed md:static
    inset-y-0 left-0
    z-50
    w-64
    bg-slate-900
    text-slate-100
    flex flex-col
    h-screen md:h-full
    border-r border-slate-800
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
  `}
>

        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-2 shrink-0">
          <Briefcase className="h-6 w-6 text-indigo-400" />

          <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent">
            StaffManager
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">

          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200 group
                ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-medium'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }
              `}
            >
              <item.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-105" />

              <span>{item.name}</span>
            </NavLink>
          ))}

        </nav>

        {/* User section */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 shrink-0">

          {/* User information */}
          <div className="flex items-center gap-3 mb-3">

            <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-lg">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div className="min-w-0 flex-1">

              <p className="text-sm font-semibold text-slate-200 truncate">
                {user?.email || 'User'}
              </p>

              <span
                className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getRoleBadgeClass(
                  user?.role
                )}`}
              >
                {user?.role || 'EMPLOYEE'}
              </span>

            </div>
          </div>

          {/* Change Password */}
          <button
            onClick={openPasswordModal}
            className="
              w-full flex items-center justify-center gap-2
              px-4 py-2.5 mb-2 rounded-xl
              border border-rose-500/20
              text-rose-400
              bg-rose-500/5
              hover:bg-rose-500/10
              hover:border-rose-500/30
              transition-all duration-200
              font-medium text-sm
              cursor-pointer
            "
          >
            <LockKeyhole className="h-4 w-4" />

            <span>Change Password</span>
          </button>

          {/* Sign Out */}
          <button
            onClick={logout}
            className="
              w-full flex items-center justify-center gap-2
              px-4 py-2.5 rounded-xl
              border border-slate-800
              text-slate-400
              hover:text-rose-400
              hover:bg-rose-500/5
              hover:border-rose-500/10
              transition-all duration-200
              font-medium text-sm
              cursor-pointer
            "
          >
            <LogOut className="h-4 w-4" />

            <span>Sign Out</span>
          </button>

        </div>

      </aside>

      {/* ========================================================= */}
      {/* CHANGE PASSWORD MODAL */}
      {/* ========================================================= */}

      {isPasswordModalOpen && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-slate-950/60 backdrop-blur-sm
            p-4
          "
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closePasswordModal();
            }
          }}
        >

          <div
            className="
              w-full max-w-md
              bg-white
              rounded-2xl
              shadow-2xl
              border border-slate-200
              overflow-hidden
            "
          >

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Change Password
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Update your account password securely
                </p>
              </div>

              <button
                onClick={closePasswordModal}
                disabled={passwordLoading}
                className="
                  h-9 w-9
                  flex items-center justify-center
                  rounded-lg
                  text-slate-400
                  hover:bg-slate-100
                  hover:text-slate-600
                  transition-colors
                "
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handlePasswordSubmit}
              className="p-6 space-y-5"
            >

              {/* Error */}
              {passwordError && (
                <div className="
                  p-3
                  rounded-xl
                  bg-rose-50
                  border border-rose-200
                  text-rose-700
                  text-sm
                  font-medium
                ">
                  {passwordError}
                </div>
              )}

              {/* Success */}
              {passwordSuccess && (
                <div className="
                  p-3
                  rounded-xl
                  bg-emerald-50
                  border border-emerald-200
                  text-emerald-700
                  text-sm
                  font-medium
                ">
                  {passwordSuccess}
                </div>
              )}

              {/* Current Password */}
              <PasswordField
                label="Current Password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                showPassword={showCurrentPassword}
                setShowPassword={setShowCurrentPassword}
                disabled={passwordLoading}
              />

              {/* New Password */}
              <PasswordField
                label="New Password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                showPassword={showNewPassword}
                setShowPassword={setShowNewPassword}
                disabled={passwordLoading}
              />

              {/* Confirm Password */}
              <PasswordField
                label="Confirm New Password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
                disabled={passwordLoading}
              />

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">

                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={passwordLoading}
                  className="
                    px-4 py-2.5
                    rounded-xl
                    border border-slate-200
                    text-slate-600
                    hover:bg-slate-50
                    font-semibold text-sm
                    transition-colors
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="
                    px-4 py-2.5
                    rounded-xl
                    bg-indigo-600
                    text-white
                    hover:bg-indigo-700
                    font-semibold text-sm
                    transition-colors
                    disabled:opacity-50
                  "
                >
                  {passwordLoading
                    ? 'Updating...'
                    : 'Update Password'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}
    </>
  );
};


/*
 * Reusable password input
 */
const PasswordField = ({
  label,
  name,
  value,
  onChange,
  showPassword,
  setShowPassword,
  disabled
}) => {
  return (
    <div>

      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        {label}
      </label>

      <div className="relative">

        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="
            w-full
            px-4 py-2.5 pr-11
            rounded-xl
            border border-slate-200
            bg-white
            text-slate-700
            placeholder:text-slate-300
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-500/20
            focus:border-indigo-500
            disabled:bg-slate-50
          "
          placeholder={`Enter ${label.toLowerCase()}`}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="
            absolute right-3 top-1/2
            -translate-y-1/2
            text-slate-400
            hover:text-slate-600
          "
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>

      </div>

    </div>
  );
};

export default Sidebar;