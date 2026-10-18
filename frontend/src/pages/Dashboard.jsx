import { summaryStats, bookings } from '../data/sampleData'
import StatusBadge from '../components/StatusBadge'

const cards = [
  { label: 'Total Classrooms', value: summaryStats.totalClassrooms, hint: 'Across all buildings' },
  { label: 'Available Classrooms', value: summaryStats.availableClassrooms, hint: 'Ready to book' },
  { label: 'Pending Bookings', value: summaryStats.pendingBookings, hint: 'Waiting for approval' },
  { label: 'Approved Bookings', value: summaryStats.approvedBookings, hint: 'Confirmed this week' },
]

function Dashboard() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-4 text-base font-semibold text-navy-900">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.label}
              className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-navy-900">{card.value}</p>
              <p className="mt-1 text-xs text-slate-400">{card.hint}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm">
        <div className="border-b border-navy-100 px-5 py-4">
          <h2 className="text-base font-semibold text-navy-900">Recent Bookings</h2>
          <p className="text-sm text-slate-500">Sample requests from faculty members</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-navy-50 text-navy-800">
              <tr>
                <th className="px-5 py-3 font-semibold">Room name</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Time</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="border-t border-navy-100">
                  <td className="px-5 py-3 font-medium text-navy-900">{booking.room}</td>
                  <td className="px-5 py-3 text-slate-600">{booking.date}</td>
                  <td className="px-5 py-3 text-slate-600">{booking.time}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
