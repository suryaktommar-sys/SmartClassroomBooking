
import { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';

function Bookings() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    user = {};
  }

  const isAdmin = user.role === 'admin';

  const [bookings, setBookings] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    classroom_id: '',
    booking_date: '',
    start_time: '',
    end_time: ''
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Could not load bookings');
      }

      setBookings(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const response = await fetch(`${API_URL}/api/classrooms`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Could not load classrooms');
      }

      setClassrooms(result.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchClassrooms();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setSubmitting(true);

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          classroom_id: Number(formData.classroom_id),
          booking_date: formData.booking_date,
          start_time: formData.start_time,
          end_time: formData.end_time
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Booking request failed');
      }

      setSuccess(result.message || 'Booking request submitted.');
      setFormData({
        classroom_id: '',
        booking_date: '',
        start_time: '',
        end_time: ''
      });

      await fetchBookings();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, status) => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Could not update booking');
      }

      setSuccess(result.message);
      await fetchBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch(
        `${API_URL}/api/bookings/${id}/cancel`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Could not cancel booking');
      }

      setSuccess(result.message);
      await fetchBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN');
  };

  const formatTime = (time) => {
    if (!time) return '-';

    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));

    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-navy-900">
          Booking Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create and manage classroom booking requests.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <section className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-navy-900">
          Create Booking Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Select Classroom
              </label>

              <select
                name="classroom_id"
                value={formData.classroom_id}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 p-3"
              >
                <option value="">Choose classroom</option>

                {classrooms.map((room) => (
                  <option
                    key={room.classroom_id}
                    value={room.classroom_id}
                  >
                    {room.room_name} - Capacity {room.capacity}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Booking Date
              </label>

              <input
                type="date"
                name="booking_date"
                value={formData.booking_date}
                onChange={handleChange}
                min={new Date().toLocaleDateString('en-CA')}
                required
                className="w-full rounded-lg border border-slate-300 p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Start Time
              </label>

              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                End Time
              </label>

              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 p-3"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={submitting || classrooms.length === 0}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Booking Request'}
          </button>

        </form>
      </section>

      <section className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm">

        <div className="border-b border-navy-100 px-5 py-4">
          <h2 className="text-base font-semibold text-navy-900">
            {isAdmin ? 'All Booking Requests' : 'My Booking Requests'}
          </h2>

          <p className="text-sm text-slate-500">
            {bookings.length} booking(s) found
          </p>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-500">
            Loading bookings...
          </p>
        ) : bookings.length === 0 ? (
          <p className="p-8 text-center text-slate-500">
            No booking requests found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">

              <thead className="bg-navy-50 text-navy-800">
                <tr>
                  <th className="px-5 py-3">Room</th>

                  {isAdmin && (
                    <th className="px-5 py-3">Faculty</th>
                  )}

                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Start Time</th>
                  <th className="px-5 py-3">End Time</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.booking_id}
                    className="border-t border-navy-100"
                  >
                    <td className="px-5 py-3 font-medium text-navy-900">
                      {booking.room_name}
                    </td>

                    {isAdmin && (
                      <td className="px-5 py-3 text-slate-600">
                        {booking.user_name}
                      </td>
                    )}

                    <td className="px-5 py-3 text-slate-600">
                      {formatDate(booking.booking_date)}
                    </td>

                    <td className="px-5 py-3 text-slate-600">
                      {formatTime(booking.start_time)}
                    </td>

                    <td className="px-5 py-3 text-slate-600">
                      {formatTime(booking.end_time)}
                    </td>

                    <td className="px-5 py-3">
                      <StatusBadge status={booking.status} />
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-2">

                        {isAdmin && booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(
                                booking.booking_id,
                                'approved'
                              )}
                              className="font-medium text-green-600 hover:text-green-800"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() => updateStatus(
                                booking.booking_id,
                                'rejected'
                              )}
                              className="font-medium text-red-600 hover:text-red-800"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {!isAdmin && booking.status === 'pending' && (
                          <button
                            onClick={() => cancelBooking(booking.booking_id)}
                            className="font-medium text-red-600 hover:text-red-800"
                          >
                            Cancel
                          </button>
                        )}

                        {booking.status !== 'pending' && (
                          <span className="text-slate-400">No action</span>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </section>
    </div>
  );
}

export default Bookings;
