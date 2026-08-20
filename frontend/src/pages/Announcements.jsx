import React, { useEffect, useState } from 'react';
import {
  Megaphone,
  CalendarDays,
  Plus,
  Trash2
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Announcements = () => {

  const { user } = useAuth();

  const canManage =
    user?.role === 'ADMIN' ||
    user?.role === 'HR';

  // -----------------------------
  // State
  // -----------------------------

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // -----------------------------
  // Fetch announcements
  // -----------------------------

  useEffect(() => {

    const fetchAnnouncements = async () => {

      try {

        const response = await api.get('/announcements');

        setAnnouncements(response.data);

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data?.message ||
          'Failed to load announcements.'
        );

      } finally {

        setLoading(false);

      }
    };

    fetchAnnouncements();

  }, []);

  // -----------------------------
  // Create announcement
  // -----------------------------

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {

      setError('Title and content are required.');

      return;
    }

    try {

      setSubmitting(true);
      setError('');

      const response = await api.post(
        '/announcements',
        {
          title: formData.title,
          content: formData.content
        }
      );

      // Add newly created announcement
      // to the top of the list
      setAnnouncements((prev) => [
        response.data,
        ...prev
      ]);

      // Reset form
      setFormData({
        title: '',
        content: ''
      });

      // Close modal
      setShowModal(false);

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message ||
        'Failed to create announcement.'
      );

    } finally {

      setSubmitting(false);

    }
  };

const handleDelete = async (id) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this announcement?'
  );

  if (!confirmed) return;

  try {
    await api.delete(`/announcements/${id}`);

    setAnnouncements((prev) =>
      prev.filter((announcement) => announcement.id !== id)
    );

  } catch (err) {
    console.error(err);

    setError(
      err.response?.data?.message ||
      'Failed to delete announcement.'
    );
  }
};

  // -----------------------------
  // Format date
  // -----------------------------

  const formatDate = (date) => {

    return new Date(date).toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }
    );

  };

  // -----------------------------
  // Loading
  // -----------------------------

  if (loading) {

    return (
      <div className="flex items-center justify-center py-20">

        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>

      </div>
    );

  }

  // -----------------------------
  // Page
  // -----------------------------

  return (

    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>

          <h1 className="text-2xl font-bold text-slate-800">
            Announcements
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Important updates and notices from your organization
          </p>

        </div>

        {/* Only ADMIN / HR */}

        {canManage && (

          <button
            onClick={() => {
              setShowModal(true);
              setError('');
            }}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              bg-indigo-600
              text-white
              font-semibold
              text-sm
              shadow-sm
              hover:bg-indigo-700
              transition-colors
            "
          >

            <Plus className="h-4 w-4" />

            New Announcement

          </button>

        )}

      </div>


      {/* Error */}

      {error && !showModal && (

        <div className="
          p-4
          rounded-xl
          bg-rose-50
          border
          border-rose-100
          text-rose-700
          text-sm
          font-semibold
        ">
          {error}
        </div>

      )}


      {/* Empty state */}

      {announcements.length === 0 && (

        <div className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-10
          text-center
        ">

          <div className="
            mx-auto
            h-14
            w-14
            rounded-2xl
            bg-indigo-50
            flex
            items-center
            justify-center
          ">

            <Megaphone className="h-7 w-7 text-indigo-600" />

          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-800">
            No announcements
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            There are no active announcements at the moment.
          </p>

        </div>

      )}


      {/* Announcement Cards */}

      <div className="space-y-4">

        {announcements.map((announcement) => (

          <div
            key={announcement.id}
            className="
              bg-white
              rounded-2xl
              border
              border-slate-200
              shadow-sm
              p-6
              hover:shadow-md
              transition-shadow
            "
          >

            <div className="flex items-start gap-4">

              <div className="
                shrink-0
                h-11
                w-11
                rounded-xl
                bg-indigo-50
                flex
                items-center
                justify-center
              ">

                <Megaphone className="h-5 w-5 text-indigo-600" />

              </div>

<div className="min-w-0 flex-1">

  {/* TITLE + ACTIONS */}
  <div className="flex items-start justify-between gap-4">

    <div className="min-w-0 flex-1">

      {/* TITLE */}
      <h2 className="text-lg font-bold text-slate-800">
        {announcement.title}
      </h2>

      {/* DATE */}
      <div className="
        flex
        items-center
        gap-1.5
        mt-1.5
        text-xs
        font-semibold
        text-slate-400
      ">
        <CalendarDays className="h-4 w-4" />

        {formatDate(announcement.createdAt)}
      </div>

    </div>

    {/* DELETE — ADMIN ONLY */}
    {user?.role === 'ADMIN' && (
      <button
        onClick={() => handleDelete(announcement.id)}
        className="
          shrink-0
          p-2
          rounded-lg
          text-rose-500
          hover:bg-rose-50
          hover:text-rose-600
          transition-colors
        "
        title="Delete announcement"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    )}

  </div>

  {/* CONTENT */}
  <p className="
    mt-3
    text-sm
    leading-6
    text-slate-600
    whitespace-pre-line
  ">
    {announcement.content}
  </p>

</div>

            </div>

          </div>

        ))}

      </div>


      {/* CREATE MODAL */}

      {showModal && (

        <div className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-slate-900/50
          backdrop-blur-sm
          p-4
        ">

          <div className="
            w-full
            max-w-lg
            rounded-2xl
            bg-white
            shadow-2xl
          ">

            {/* Modal Header */}

            <div className="
              flex
              items-center
              justify-between
              px-6
              py-5
              border-b
              border-slate-100
            ">

              <div>

                <h2 className="text-lg font-bold text-slate-800">
                  Create Announcement
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  Share an update with the entire organization.
                </p>

              </div>

              <button
                onClick={() => setShowModal(false)}
                className="
                  text-slate-400
                  hover:text-slate-700
                  text-xl
                "
              >
                ×
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* Modal error */}

              {error && (

                <div className="
                  rounded-lg
                  bg-rose-50
                  border
                  border-rose-200
                  px-4
                  py-3
                  text-sm
                  text-rose-700
                ">
                  {error}
                </div>

              )}


              {/* Title */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  mb-2
                ">
                  Title
                </label>

                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value
                    })
                  }
                  placeholder="e.g. Office Holiday"
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-slate-200
                    outline-none
                    focus:ring-2
                    focus:ring-indigo-500/20
                    focus:border-indigo-500
                    text-sm
                  "
                />

              </div>


              {/* Content */}

              <div>

                <label className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  mb-2
                ">
                  Content
                </label>

                <textarea
                  rows="5"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: e.target.value
                    })
                  }
                  placeholder="Write your announcement..."
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-slate-200
                    outline-none
                    resize-none
                    focus:ring-2
                    focus:ring-indigo-500/20
                    focus:border-indigo-500
                    text-sm
                  "
                />

              </div>


              {/* Buttons */}

              <div className="
                flex
                justify-end
                gap-3
                pt-2
              ">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="
                    px-4
                    py-2.5
                    rounded-xl
                    border
                    border-slate-200
                    text-slate-600
                    font-semibold
                    text-sm
                    hover:bg-slate-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    bg-indigo-600
                    text-white
                    font-semibold
                    text-sm
                    hover:bg-indigo-700
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {submitting ? 'Publishing...' : 'Publish'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Announcements;