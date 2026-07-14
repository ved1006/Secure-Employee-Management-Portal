import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar } from 'lucide-react';

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Get dynamic title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard Overview';
    if (path.startsWith('/employees')) return 'Employee Directory';
    if (path.startsWith('/departments')) return 'Departments & Teams';
    return 'Management Console';
  };

  // Get dynamic greeting
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
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          {getPageTitle()}
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          {getGreeting()}, <span className="text-slate-600 font-semibold">{user?.username}</span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Date block */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-1.5 shadow-sm">
          <Calendar className="h-4 w-4 text-indigo-500" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
