import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  CalendarDays,
  Check,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  Search
} from 'lucide-react';

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/leaves');

      setLeaves(response.data);
    } catch (error) {
      console.error('Failed to fetch leave requests:', error);

      setError(
        error.response?.data?.message ||
        error.response?.data ||
        'Failed to load leave requests.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      setError('');
      setSuccess('');

      await api.put(`/leaves/${id}/approve`);

      setSuccess('Leave request approved successfully.');

      await fetchLeaves();
    } catch (error) {
      console.error('Approve leave error:', error);

      setError(
        error.response?.data?.message ||
        error.response?.data ||
        'Failed to approve leave request.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(id);
      setError('');
      setSuccess('');

      await api.put(`/leaves/${id}/reject`);

      setSuccess('Leave request rejected successfully.');

      await fetchLeaves();
    } catch (error) {
      console.error('Reject leave error:', error);

      setError(
        error.response?.data?.message ||
        error.response?.data ||
        'Failed to reject leave request.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const matchesFilter =
      activeFilter === 'ALL' ||
      leave.status === activeFilter;

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      leave.employeeName?.toLowerCase().includes(search) ||
      leave.leaveType?.toLowerCase().includes(search) ||
      leave.reason?.toLowerCase().includes(search);

    return matchesFilter && matchesSearch;
  });

  const allCount = leaves.length;

  const pendingCount = leaves.filter(
    (leave) => leave.status === 'PENDING'
  ).length;

  const approvedCount = leaves.filter(
    (leave) => leave.status === 'APPROVED'
  ).length;

  const rejectedCount = leaves.filter(
    (leave) => leave.status === 'REJECTED'
  ).length;

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

  const getLeaveTypeLabel = (type) => {
    switch (type) {
      case 'SICK':
        return 'Sick Leave';

      case 'CASUAL':
        return 'Casual Leave';

      case 'ANNUAL':
        return 'Annual Leave';

      case 'OTHER':
        return 'Other';

      default:
        return type;
    }
  };

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Leave Requests
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Review and manage employee leave requests
          </p>
        </div>

        <div className="
          flex items-center gap-2
          px-4 py-2.5
          rounded-xl
          bg-amber-50
          border border-amber-200
          text-amber-700
          text-sm
          font-semibold
        ">
          <Clock className="h-4 w-4" />
          {pendingCount} Pending
        </div>

      </div>

      {/* Messages */}

      {error && (
        <div className="
          mb-6
          p-4
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

        <StatCard
          title="All Requests"
          value={allCount}
          icon={CalendarDays}
          iconClass="bg-indigo-50 text-indigo-600"
        />

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

      {/* Main Card */}

      <div className="
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-sm
        overflow-hidden
      ">

        {/* Filters */}

        <div className="
          px-6 py-5
          border-b border-slate-100
          flex flex-col lg:flex-row
          gap-4
          lg:items-center
          lg:justify-between
        ">

          <div className="flex gap-2 flex-wrap">

            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(
              (filter) => (

                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`
                    px-4 py-2
                    rounded-lg
                    text-xs
                    font-bold
                    transition-colors
                    ${
                      activeFilter === filter
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }
                  `}
                >
                  {filter}
                </button>

              )
            )}

          </div>

          {/* Search */}

          <div className="relative w-full lg:w-72">

            <Search className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              h-4 w-4
              text-slate-400
            " />

            <input
              type="text"
              placeholder="Search employee or leave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full
                pl-10 pr-4 py-2.5
                rounded-xl
                border border-slate-200
                text-sm
                text-slate-700
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500/20
                focus:border-indigo-500
              "
            />

          </div>

        </div>

        {/* Table */}

        {loading ? (

          <div className="flex justify-center py-16">

            <div className="
              animate-spin
              rounded-full
              h-8 w-8
              border-b-2
              border-indigo-600
            " />

          </div>

        ) : filteredLeaves.length === 0 ? (

          <div className="text-center py-16">

            <CalendarDays className="
              mx-auto
              h-10 w-10
              text-slate-300
            " />

            <p className="
              mt-3
              text-slate-500
              font-medium
            ">
              No leave requests found
            </p>

            <p className="
              text-sm
              text-slate-400
              mt-1
            ">
              There are no requests matching your filters.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="
                    text-left
                    px-6 py-4
                    text-xs
                    font-bold
                    text-slate-400
                    uppercase
                    tracking-wider
                  ">
                    Employee
                  </th>

                  <th className="
                    text-left
                    px-6 py-4
                    text-xs
                    font-bold
                    text-slate-400
                    uppercase
                    tracking-wider
                  ">
                    Leave Type
                  </th>

                  <th className="
                    text-left
                    px-6 py-4
                    text-xs
                    font-bold
                    text-slate-400
                    uppercase
                    tracking-wider
                  ">
                    Dates
                  </th>

                  <th className="
                    text-left
                    px-6 py-4
                    text-xs
                    font-bold
                    text-slate-400
                    uppercase
                    tracking-wider
                  ">
                    Reason
                  </th>

                  <th className="
                    text-left
                    px-6 py-4
                    text-xs
                    font-bold
                    text-slate-400
                    uppercase
                    tracking-wider
                  ">
                    Status
                  </th>

                  <th className="
                    text-right
                    px-6 py-4
                    text-xs
                    font-bold
                    text-slate-400
                    uppercase
                    tracking-wider
                  ">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredLeaves.map((leave) => (

                  <tr
                    key={leave.id}
                    className="
                      border-t
                      border-slate-100
                      hover:bg-slate-50/50
                    "
                  >

                    {/* Employee */}

                    <td className="px-6 py-4">

                      <div className="
                        flex
                        items-center
                        gap-3
                      ">

                        <div className="
                          h-9 w-9
                          rounded-full
                          bg-indigo-50
                          text-indigo-600
                          flex
                          items-center
                          justify-center
                          font-bold
                          text-sm
                        ">
                          {leave.employeeName
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <span className="
                          font-semibold
                          text-slate-700
                        ">
                          {leave.employeeName}
                        </span>

                      </div>

                    </td>

                    {/* Type */}

                    <td className="
                      px-6 py-4
                      text-sm
                      text-slate-600
                    ">
                      {getLeaveTypeLabel(leave.leaveType)}
                    </td>

                    {/* Dates */}

                    <td className="
                      px-6 py-4
                      text-sm
                      text-slate-600
                      whitespace-nowrap
                    ">
                      {leave.startDate} → {leave.endDate}
                    </td>

                    {/* Reason */}

                    <td className="
                      px-6 py-4
                      text-sm
                      text-slate-500
                      max-w-xs
                    ">
                      <div
                        className="truncate max-w-[220px]"
                        title={leave.reason}
                      >
                        {leave.reason}
                      </div>
                    </td>

                    {/* Status */}

                    <td className="px-6 py-4">

                      <span className={`
                        inline-flex
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-bold
                        ${getStatusClass(leave.status)}
                      `}>
                        {leave.status}
                      </span>

                    </td>

                    {/* Action */}

                    <td className="
                      px-6 py-4
                      text-right
                    ">

                      {leave.status === 'PENDING' ? (

                        <div className="
                          flex
                          justify-end
                          gap-2
                        ">

                          <button
                            onClick={() =>
                              handleApprove(leave.id)
                            }
                            disabled={
                              actionLoading === leave.id
                            }
                            title="Approve"
                            className="
                              h-9 w-9
                              flex
                              items-center
                              justify-center
                              rounded-lg
                              bg-emerald-50
                              text-emerald-600
                              border
                              border-emerald-200
                              hover:bg-emerald-100
                              transition-colors
                              disabled:opacity-50
                            "
                          >

                            <Check className="h-4 w-4" />

                          </button>

                          <button
                            onClick={() =>
                              handleReject(leave.id)
                            }
                            disabled={
                              actionLoading === leave.id
                            }
                            title="Reject"
                            className="
                              h-9 w-9
                              flex
                              items-center
                              justify-center
                              rounded-lg
                              bg-rose-50
                              text-rose-600
                              border
                              border-rose-200
                              hover:bg-rose-100
                              transition-colors
                              disabled:opacity-50
                            "
                          >

                            <X className="h-4 w-4" />

                          </button>

                        </div>

                      ) : (

                        <span className="
                          text-xs
                          text-slate-400
                          font-medium
                        ">
                          Reviewed
                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

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
      flex
      items-center
      justify-between
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
        flex
        items-center
        justify-center
        ${iconClass}
      `}>

        <Icon className="h-6 w-6" />

      </div>

    </div>
  );
};

export default LeaveRequests;