import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';
import { 
  Users, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  DollarSign, 
  Briefcase,
  AlertCircle,
  Loader,
  Filter
} from 'lucide-react';

const Employees = () => {
  const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [salary, setSalary] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [formError, setFormError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // Open add modal if redirected with openAddModal state
    if (location.state?.openAddModal) {
      setIsAddModalOpen(true);
    }
  }, [location.state]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [empRes, deptRes] = await Promise.all([
        api.get('/employees'),
        api.get('/departments')
      ]);
      setEmployees(empRes.data || []);
      setDepartments(deptRes.data || []);
    } catch (err) {
      setError('Could not retrieve employee list. Please check the backend connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add Employee
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !salary || !departmentId) {
      setFormError('All fields are required.');
      return;
    }

    if (isNaN(salary) || parseFloat(salary) <= 0) {
      setFormError('Please enter a valid salary amount.');
      return;
    }

    setActionLoading(true);
    try {
      const response = await api.post('/employees', {
        name,
        salary: parseFloat(salary),
        departmentId: parseInt(departmentId)
      });
      // Refresh list to pull correct department association
      await fetchData();
      setIsAddModalOpen(false);
      resetForm();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add employee.');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (emp) => {
    setSelectedEmp(emp);
    setName(emp.name);
    setSalary(emp.salary);
    
    // Find matching department ID based on departmentName
    const matchedDept = departments.find(d => d.deptName === emp.departmentName);
    setDepartmentId(matchedDept ? matchedDept.deptId : '');
    
    setIsEditModalOpen(true);
    setFormError('');
  };

  // Update Employee
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !salary || !departmentId) {
      setFormError('All fields are required.');
      return;
    }

    if (isNaN(salary) || parseFloat(salary) <= 0) {
      setFormError('Please enter a valid salary amount.');
      return;
    }

    setActionLoading(true);
    try {
      await api.put(`/employees/${selectedEmp.id}`, {
        name,
        salary: parseFloat(salary),
        departmentId: parseInt(departmentId)
      });
      // Refresh list to pull updated data
      await fetchData();
      setIsEditModalOpen(false);
      resetForm();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update employee.');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (emp) => {
    setSelectedEmp(emp);
    setIsDeleteModalOpen(true);
    setFormError('');
  };

  // Delete Employee
  const handleDeleteSubmit = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/employees/${selectedEmp.id}`);
      setEmployees(employees.filter(e => e.id !== selectedEmp.id));
      setIsDeleteModalOpen(false);
      setSelectedEmp(null);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to delete employee.');
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setSalary('');
    setDepartmentId('');
    setSelectedEmp(null);
    setFormError('');
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || emp.departmentName === deptFilter;
    return matchesSearch && matchesDept;
  });

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <Loader className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-sm font-semibold text-slate-500">Loading directory listings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header board */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Employee Directory</h2>
          <p className="text-xs text-slate-400">View, search, and manage corporate employee information</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            if (departments.length === 0) {
              setError('You must create a department first before adding employees.');
              return;
            }
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer self-start md:self-auto active:scale-[0.98]"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add Employee</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search employee by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
          />
        </div>

        {/* Filter select */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400 hidden md:block" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="block w-full md:w-56 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-sm cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            {departments.map(d => (
              <option key={d.deptId} value={d.deptName}>{d.deptName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100 text-slate-700">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-400">#{emp.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{emp.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        <Briefcase className="h-3 w-3 shrink-0" />
                        {emp.departmentName || 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                      <span className="inline-flex items-center text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {formatCurrency(emp.salary)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(emp)}
                          className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors cursor-pointer"
                          title="Edit Employee"
                        >
                          <Edit2 className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(emp)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors cursor-pointer"
                          title="Delete Employee"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-400 font-medium">
                    No employees matching the search filters were found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Employee">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {formError && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-bold rounded-xl flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Salary (USD / Annual)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <DollarSign className="h-4.5 w-4.5" />
              </div>
              <input
                type="number"
                required
                min="0"
                placeholder="75000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Assigned Department
            </label>
            <select
              required
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="block w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-sm cursor-pointer"
            >
              <option value="" disabled>Select a department...</option>
              {departments.map(d => (
                <option key={d.deptId} value={d.deptId}>{d.deptName}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
            >
              {actionLoading ? 'Saving...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Employee Details">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {formError && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-bold rounded-xl flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Salary (USD / Annual)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <DollarSign className="h-4.5 w-4.5" />
              </div>
              <input
                type="number"
                required
                min="0"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Assigned Department
            </label>
            <select
              required
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="block w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-sm cursor-pointer"
            >
              <option value="" disabled>Select a department...</option>
              {departments.map(d => (
                <option key={d.deptId} value={d.deptId}>{d.deptName}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
            >
              {actionLoading ? 'Saving...' : 'Update Employee'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Employee Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedEmp(null);
        }} 
        title="Delete Employee Record"
      >
        <div className="space-y-5">
          {formError && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-bold rounded-xl flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="text-slate-600 text-sm leading-relaxed">
            Are you sure you want to remove <span className="font-bold text-slate-800">"{selectedEmp?.name}"</span> from the staff registry? This cannot be undone.
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedEmp(null);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteSubmit}
              disabled={actionLoading}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-all shadow-md shadow-rose-600/10 cursor-pointer disabled:opacity-50"
            >
              {actionLoading ? 'Deleting...' : 'Delete Employee'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Employees;
