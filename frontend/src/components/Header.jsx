import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Menu } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;

    if (path === '/') return 'Dashboard Overview';
    if (path.startsWith('/employees')) return 'Employee Directory';
    if (path.startsWith('/departments')) return 'Departments & Teams';
    if (path.startsWith('/users')) return 'User Management';

    return 'Management Console';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';

    return 'Good evening';
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 md:px-8 flex items-center justify-between shrink-0">

      {/* Left side */}
      <div className="flex items-center min-w-0">

        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 mr-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="min-w-0">

          <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight truncate">
            {getPageTitle()}
          </h1>

          <p className="text-xs text-slate-400 font-medium truncate">
            {getGreeting()},{' '}
            <span className="text-slate-600 font-semibold">
              {user?.username}
            </span>
          </p>

        </div>

      </div>

      {/* Date */}
      <div className="flex items-center gap-4 ml-3 shrink-0">

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-1.5 shadow-sm">

          <Calendar className="h-4 w-4 text-indigo-500" />

          <span>{formattedDate}</span>

        </div>

      </div>

    </header>
  );
};

export default Header;