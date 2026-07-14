import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Users, 
  FolderTree, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Loader
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalPayroll: 0,
    averageSalary: 0,
  });
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        const [empResponse, deptResponse] = await Promise.all([
          api.get('/employees'),
          api.get('/departments')
        ]);

        const employees = empResponse.data || [];
        const departments = deptResponse.data || [];

        // Compute metrics
        const totalEmployees = employees.length;
        const totalDepartments = departments.length;
        const totalPayroll = employees.reduce((acc, curr) => acc + curr.salary, 0);
        const averageSalary = totalEmployees > 0 ? (totalPayroll / totalEmployees) : 0;

        setStats({
          totalEmployees,
          totalDepartments,
          totalPayroll,
          averageSalary
        });

        // Set recent employees (take top 5)
        setRecentEmployees(employees.slice(-5).reverse());
      } catch (err) {
        setError('Could not retrieve dashboard statistics. Ensure your backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <Loader className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-sm font-semibold text-slate-500">Assembling metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Notification banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl text-sm font-semibold shadow-sm">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Employees */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-350 hover:-translate-y-0.5">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Employees</p>
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{stats.totalEmployees}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Total Departments */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-350 hover:-translate-y-0.5">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Departments</p>
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{stats.totalDepartments}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
            <FolderTree className="h-6 w-6" />
          </div>
        </div>

        {/* Total Payroll */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-350 hover:-translate-y-0.5">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Payroll</p>
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{formatCurrency(stats.totalPayroll)}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 transition-colors group-hover:bg-sky-600 group-hover:text-white">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* Avg Salary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-350 hover:-translate-y-0.5">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Salary</p>
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{formatCurrency(stats.averageSalary)}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 transition-colors group-hover:bg-violet-600 group-hover:text-white">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Additions List */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-slate-800 text-lg">Newly Added Staff</h4>
              <p className="text-xs text-slate-400">Recently onboarded employees</p>
            </div>
            <button 
              onClick={() => navigate('/employees')}
              className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Salary</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 text-slate-700">
                {recentEmployees.length > 0 ? (
                  recentEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/55 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-800">{emp.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {emp.departmentName || 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{formatCurrency(emp.salary)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-10 text-center text-sm text-slate-400 font-medium">
                      No employees registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div>
              <h4 className="font-extrabold text-slate-800 text-lg">Quick Actions</h4>
              <p className="text-xs text-slate-400">Perform quick database actions</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/employees', { state: { openAddModal: true } })}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-indigo-50 border border-indigo-100/50 hover:bg-indigo-100 text-indigo-900 transition-colors font-bold text-sm text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/10">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span>Add New Employee</span>
                </div>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => navigate('/departments', { state: { openAddModal: true } })}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-100/50 hover:bg-emerald-100 text-emerald-900 transition-colors font-bold text-sm text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/10">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span>Add Department</span>
                </div>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
