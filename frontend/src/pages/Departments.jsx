import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import Modal from '../components/Modal';
import { 
  FolderTree, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Briefcase,
  AlertCircle,
  Loader
} from 'lucide-react';

const Departments = () => {
  const location = useLocation();
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [deptName, setDeptName] = useState('');
  const [selectedDept, setSelectedDept] = useState(null);
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
      const [deptRes, empRes] = await Promise.all([
        api.get('/departments'),
        api.get('/employees')
      ]);
      setDepartments(deptRes.data || []);
      setEmployees(empRes.data || []);
    } catch (err) {
      setError('Failed to fetch departments. Please check backend server status.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMemberCount = (deptName) => {
    return employees.filter(emp => emp.departmentName === deptName).length;
  };

  // Add Department
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!deptName.trim()) {
      setFormError('Department name is required.');
      return;
    }

    setActionLoading(true);
    try {
      const response = await api.post('/departments', { deptName });
      setDepartments([...departments, response.data]);
      setIsAddModalOpen(false);
      setDeptName('');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add department.');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (dept) => {
    setSelectedDept(dept);
    setDeptName(dept.deptName);
    setIsEditModalOpen(true);
    setFormError('');
  };

  // Update Department
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!deptName.trim()) {
      setFormError('Department name is required.');
      return;
    }

    setActionLoading(true);
    try {
      const response = await api.put(`/departments/${selectedDept.deptId}`, { deptName });
      
      // Update local state
      setDepartments(departments.map(d => d.deptId === selectedDept.deptId ? response.data : d));
      setIsEditModalOpen(false);
      setDeptName('');
      setSelectedDept(null);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update department.');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (dept) => {
    setSelectedDept(dept);
    setIsDeleteModalOpen(true);
    setFormError('');
  };

  // Delete Department
  const handleDeleteSubmit = async () => {
    const memberCount = getMemberCount(selectedDept.deptName);
    if (memberCount > 0) {
      setFormError(`Cannot delete department. There are ${memberCount} employees currently assigned to it.`);
      return;
    }

    setActionLoading(true);
    try {
      await api.delete(`/departments/${selectedDept.deptId}`);
      setDepartments(departments.filter(d => d.deptId !== selectedDept.deptId));
      setIsDeleteModalOpen(false);
      setSelectedDept(null);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to delete department. It may have active constraints.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter departments based on search query
  const filteredDepartments = departments.filter(d => 
    d.deptName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center">
        <Loader className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-sm font-semibold text-slate-500">Loading department structures...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header card with actions */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Departments Directory</h2>
          <p className="text-xs text-slate-400">Organize and manage employee teams and departments</p>
        </div>
        <button
          onClick={() => {
            setDeptName('');
            setFormError('');
            setIsAddModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer self-start md:self-auto active:scale-[0.98]"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add Department</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-2xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Filter and search bar */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="h-4.5 w-4.5" />
        </div>
        <input
          type="text"
          placeholder="Search departments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
        />
      </div>

      {/* Grid List */}
      {filteredDepartments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => {
            const count = getMemberCount(dept.deptName);
            return (
              <div 
                key={dept.deptId} 
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-48 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <FolderTree className="h-5 w-5" />
                    </div>
                    {/* Quick action buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(dept)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Edit Department"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(dept)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Delete Department"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                    {dept.deptName}
                  </h3>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-slate-300" />
                    <span>{count} {count === 1 ? 'Member' : 'Members'}</span>
                  </div>
                  <span className="text-[10px] text-slate-300">ID: {dept.deptId}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
          <p className="text-slate-400 font-medium">No departments found.</p>
        </div>
      )}

      {/* Add Department Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Department"
      >
        <form onSubmit={handleAddSubmit} className="space-y-5">
          {formError && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-bold rounded-xl flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Department Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Engineering, Human Resources"
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              className="block w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
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
              {actionLoading ? 'Saving...' : 'Add Team'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Department Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDept(null);
        }} 
        title="Edit Department"
      >
        <form onSubmit={handleEditSubmit} className="space-y-5">
          {formError && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-bold rounded-xl flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Department Name
            </label>
            <input
              type="text"
              required
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              className="block w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedDept(null);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
            >
              {actionLoading ? 'Saving...' : 'Update Name'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Department Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDept(null);
        }} 
        title="Delete Department"
      >
        <div className="space-y-5">
          {formError ? (
            <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-bold rounded-xl flex items-start gap-2">
              <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          ) : (
            <div className="text-slate-600 text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-slate-800">"{selectedDept?.deptName}"</span>? This action is permanent and cannot be undone.
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedDept(null);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              {formError ? 'Close' : 'Cancel'}
            </button>
            {!formError && (
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-all shadow-md shadow-rose-600/10 cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Delete Team'}
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Departments;
