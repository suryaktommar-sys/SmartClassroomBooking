
import { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';

function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  const [stats, setStats] = useState({
    totalClassrooms: 0,
    availableClassrooms: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    recentBookings: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${API_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Could not load dashboard');
        }

        setStats(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    user = {};
  }

  const cards = [
    {
      label: 'Total Classrooms',
      value: stats.totalClassrooms,
      hint: 'Across all buildings'
    },
    {
      label: 'Available Classrooms',
      value: stats.availableClassrooms,
      hint: 'Available right now'
    },
    {
      label: 'Pending Bookings',
      value: stats.pendingBookings,
      hint: 'Waiting for approval'
    },
    {
      label: 'Approved Bookings',
      value: stats.approvedBookings,
      hint: 'Confirmed bookings'
    }
  ];

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

      <section>
        <h2 className="mb-4 text-base font-semibold text-navy-900">
          Overview
        </h2>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="p-6 text-center text-slate-500">
            Loading dashboard...
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <article
                key={card.label}
                className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>

                <p className="mt-2 text-3xl font-bold text-navy-900">
                  {card.value}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {card.hint}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm">

        <div className="border-b border-navy-100 px-5 py-4">
          <h2 className="text-base font-semibold text-navy-900">
            Recent Bookings
          </h2>

          <p className="text-sm text-slate-500">
            {user.role === 'admin'
              ? 'Recent requests from all faculty members'
              : 'Your recent booking requests'}
          </p>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-500">
            Loading bookings...
          </p>
        ) : stats.recentBookings.length === 0 ? (
          <p className="p-8 text-center text-slate-500">
            No recent bookings found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">

              <thead className="bg-navy-50 text-navy-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Room Name</th>
                  {user.role === 'admin' && (
                    <th className="px-5 py-3 font-semibold">Faculty</th>
                  )}
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Time</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {stats.recentBookings.map((booking) => (
                  <tr
                    key={booking.booking_id}
                    className="border-t border-navy-100"
                  >
                    <td className="px-5 py-3 font-medium text-navy-900">
                      {booking.room_name}
                    </td>

                    {user.role === 'admin' && (
                      <td className="px-5 py-3 text-slate-600">
                        {booking.user_name}
                      </td>
                    )}

                    <td className="px-5 py-3 text-slate-600">
                      {formatDate(booking.booking_date)}
                    </td>

                    <td className="px-5 py-3 text-slate-600">
                      {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </td>

                    <td className="px-5 py-3">
                      <StatusBadge status={booking.status} />
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

export default Dashboard;
