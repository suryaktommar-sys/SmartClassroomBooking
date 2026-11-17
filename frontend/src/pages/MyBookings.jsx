
import { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';

function MyBookings() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    user = {};
  }

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Could not load bookings');
      }

      // Show only the logged-in user's bookings.
      const myData = (result.data || []).filter(
        booking => Number(booking.user_id) === Number(user.userId)
      );

      setBookings(myData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const cancelBooking = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking?'
    );

    if (!confirmed) return;

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
      await fetchMyBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';

    const dateString = typeof date === 'string'
      ? date.slice(0, 10)
      : new Date(date).toLocaleDateString('en-CA');

    const [year, month, day] = dateString.split('-');

    return `${day}/${month}/${year}`;
  };

  const formatTime = (time) => {
    if (!time) return '-';

    const [hours, minutes] = time.split(':');
    const date = new Date();

    date.setHours(Number(hours), Number(minutes), 0);

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
          My Bookings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View and manage your classroom booking history.
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

      <section className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm">

        <div className="border-b border-navy-100 px-5 py-4">
          <h2 className="text-base font-semibold text-navy-900">
            Booking History
          </h2>

          <p className="text-sm text-slate-500">
            {bookings.length} booking(s) found
          </p>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-500">
            Loading your bookings...
          </p>
        ) : bookings.length === 0 ? (
          <p className="p-8 text-center text-slate-500">
            You have not made any bookings yet.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="min-w-full text-left text-sm">

              <thead className="bg-navy-50 text-navy-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">
                    Room Name
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Date
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Start Time
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    End Time
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Action
                  </th>
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
                      {booking.status === 'pending' ? (
                        <button
                          onClick={() => cancelBooking(booking.booking_id)}
                          className="font-medium text-red-600 hover:text-red-800"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-slate-400">
                          No action
                        </span>
                      )}
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

export default MyBookings;
