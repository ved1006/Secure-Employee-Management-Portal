import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Plus,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    leaveType: 'SICK',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const response = await api.get('/leaves/my');

      setLeaves(response.data);
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
      setError(
        error.response?.data?.message ||
        'Failed to load your leave requests.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!formData.startDate || !formData.endDate || !formData.reason) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.startDate > formData.endDate) {
      setError('Start date cannot be after end date.');
      return;
    }

    try {
      setSubmitting(true);

      await api.post('/leaves', formData);

      setSuccess('Leave request submitted successfully.');

      setFormData({
        leaveType: 'SICK',
        startDate: '',
        endDate: '',
        reason: ''
      });

      setShowModal(false);

      await fetchLeaves();

    } catch (error) {
      console.error('Leave request error:', error);

      setError(
        error.response?.data?.message ||
        error.response?.data ||
        'Failed to submit leave request.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';

      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border border-rose-200';

      default:
        return 'bg-amber-50 text-amber-700 border border-amber-200';
    }
  };

  const pendingCount = leaves.filter(
    (leave) => leave.status === 'PENDING'
  ).length;

  const approvedCount = leaves.filter(
    (leave) => leave.status === 'APPROVED'
  ).length;

  const rejectedCount = leaves.filter(
    (leave) => leave.status === 'REJECTED'
  ).length;

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            My Leaves
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            View and manage your leave requests
          </p>
        </div>

        <button
          onClick={() => {
            setError('');
            setSuccess('');
            setShowModal(true);
          }}
          className="
            flex items-center gap-2
            px-4 py-2.5
            rounded-xl
            bg-indigo-600
            text-white
            font-semibold
            text-sm
            hover:bg-indigo-700
            transition-colors
            shadow-lg shadow-indigo-600/20
          "
        >
          <Plus className="h-4 w-4" />
          Request Leave
        </button>

      </div>

      {/* Success */}
      {success && (
        <div className="
          mb-6
          p-4
          rounded-xl
          bg-emerald-50
          border border-emerald-200
          text-emerald-700
          text-sm
          font-medium
        ">
          {success}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        <StatCard
          title="Pending"
          value={pendingCount}
          icon={Clock}
          iconClass="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Approved"
          value={approvedCount}
          icon={CheckCircle2}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Rejected"
          value={rejectedCount}
          icon={XCircle}
          iconClass="bg-rose-50 text-rose-600"
        />

      </div>

      {/* Leave Table */}
      <div className="
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-sm
        overflow-hidden
      ">

        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">
            Leave History
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            All your submitted leave requests
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="
              animate-spin
              rounded-full
              h-8
              w-8
              border-b-2
              border-indigo-600
            " />
          </div>
        ) : leaves.length === 0 ? (

          <div className="text-center py-16">

            <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-3 text-slate-500 font-medium">
              No leave requests yet
            </p>

            <p className="text-sm text-slate-400 mt-1">
              Submit your first leave request.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                    Leave Type
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                    Dates
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                    Reason
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                    Status
                  </th>
                </tr>

              </thead>

              <tbody>

                {leaves.map((leave) => (

                  <tr
                    key={leave.id}
                    className="border-t border-slate-100 hover:bg-slate-50/50"
                  >

                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-700">
                        {leave.leaveType}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {leave.startDate} → {leave.endDate}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs">
                      {leave.reason}
                    </td>

                    <td className="px-6 py-4">

                      <span className={`
                        inline-flex
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-bold
                        ${getStatusClass(leave.status)}
                      `}>
                        {leave.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* Request Leave Modal */}
      {showModal && (

        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-slate-950/60
            backdrop-blur-sm
            p-4
          "
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !submitting) {
              setShowModal(false);
            }
          }}
        >

          <div className="
            w-full max-w-lg
            bg-white
            rounded-2xl
            shadow-2xl
            border border-slate-200
            overflow-hidden
          ">

            {/* Modal Header */}
            <div className="
              flex items-center justify-between
              px-6 py-5
              border-b border-slate-100
            ">

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Request Leave
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Submit a new leave request for approval
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                disabled={submitting}
                className="
                  h-9 w-9
                  flex items-center justify-center
                  rounded-lg
                  text-slate-400
                  hover:bg-slate-100
                  hover:text-slate-600
                "
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {error && (
                <div className="
                  p-3
                  rounded-xl
                  bg-rose-50
                  border border-rose-200
                  text-rose-700
                  text-sm
                  font-medium
                ">
                  {error}
                </div>
              )}

              {/* Leave Type */}
              <div>

                <label className="
                  block
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  tracking-wider
                  mb-2
                ">
                  Leave Type
                </label>

                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  disabled={submitting}
                  className="
                    w-full
                    px-4 py-2.5
                    rounded-xl
                    border border-slate-200
                    bg-white
                    text-slate-700
                    focus:outline-none
                    focus:ring-2
                    focus:ring-indigo-500/20
                    focus:border-indigo-500
                  "
                >
                  <option value="SICK">Sick Leave</option>
                  <option value="CASUAL">Casual Leave</option>
                  <option value="PAID">Paid Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>

              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="
                    block
                    text-xs
                    font-bold
                    text-slate-500
                    uppercase
                    tracking-wider
                    mb-2
                  ">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    disabled={submitting}
                    className="
                      w-full
                      px-4 py-2.5
                      rounded-xl
                      border border-slate-200
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500/20
                      focus:border-indigo-500
                    "
                  />

                </div>

                <div>

                  <label className="
                    block
                    text-xs
                    font-bold
                    text-slate-500
                    uppercase
                    tracking-wider
                    mb-2
                  ">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={submitting}
                    className="
                      w-full
                      px-4 py-2.5
                      rounded-xl
                      border border-slate-200
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500/20
                      focus:border-indigo-500
                    "
                  />

                </div>

              </div>

              {/* Reason */}
              <div>

                <label className="
                  block
                  text-xs
                  font-bold
                  text-slate-500
                  uppercase
                  tracking-wider
                  mb-2
                ">
                  Reason
                </label>

                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  disabled={submitting}
                  rows="4"
                  placeholder="Enter the reason for your leave..."
                  className="
                    w-full
                    px-4 py-3
                    rounded-xl
                    border border-slate-200
                    resize-none
                    focus:outline-none
                    focus:ring-2
                    focus:ring-indigo-500/20
                    focus:border-indigo-500
                  "
                />

              </div>

              {/* Buttons */}
              <div className="
                flex justify-end
                gap-3
                pt-3
                border-t border-slate-100
              ">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="
                    px-4 py-2.5
                    rounded-xl
                    border border-slate-200
                    text-slate-600
                    hover:bg-slate-50
                    font-semibold text-sm
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    px-5 py-2.5
                    rounded-xl
                    bg-indigo-600
                    text-white
                    hover:bg-indigo-700
                    font-semibold text-sm
                    disabled:opacity-50
                  "
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconClass
}) => {
  return (
    <div className="
      bg-white
      rounded-2xl
      border border-slate-200
      shadow-sm
      p-6
      flex items-center justify-between
    ">

      <div>
        <p className="
          text-xs
          font-bold
          text-slate-400
          uppercase
          tracking-wider
        ">
          {title}
        </p>

        <p className="
          text-3xl
          font-bold
          text-slate-800
          mt-2
        ">
          {value}
        </p>
      </div>

      <div className={`
        h-12 w-12
        rounded-xl
        flex items-center justify-center
        ${iconClass}
      `}>
        <Icon className="h-6 w-6" />
      </div>

    </div>
  );
};

export default MyLeaves;