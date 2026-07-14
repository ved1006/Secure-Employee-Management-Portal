import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FolderTree, 
  LogOut,
  Shield,
  Briefcase
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Departments', path: '/departments', icon: FolderTree },
  ];

  // Helper to format role names
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

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-full border-r border-slate-800">
      {/* Brand logo header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-2">
        <Briefcase className="h-6 w-6 text-indigo-400" />
        <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent">
          StaffManager
        </span>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
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

      {/* User profile footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-lg">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-200 truncate">{user?.username || 'User'}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getRoleBadgeClass(user?.role)}`}>
                {user?.role || 'Employee'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 hover:border-rose-500/10 transition-all duration-200 font-medium text-sm cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
