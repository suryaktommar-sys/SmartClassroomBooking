import { bookings } from '../data/sampleData'
import StatusBadge from '../components/StatusBadge'

function Bookings() {
  return (
    <section className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm">
      <div className="border-b border-navy-100 px-5 py-4">
        <h2 className="text-base font-semibold text-navy-900">Booking Requests</h2>
        <p className="text-sm text-slate-500">Admins can later approve or reject these requests</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-navy-50 text-navy-800">
            <tr>
              <th className="px-5 py-3 font-semibold">Room name</th>
              <th className="px-5 py-3 font-semibold">Faculty</th>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Time</th>
              <th className="px-5 py-3 font-semibold">Purpose</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-navy-100">
                <td className="px-5 py-3 font-medium text-navy-900">{booking.room}</td>
                <td className="px-5 py-3 text-slate-600">{booking.faculty}</td>
                <td className="px-5 py-3 text-slate-600">{booking.date}</td>
                <td className="px-5 py-3 text-slate-600">{booking.time}</td>
                <td className="px-5 py-3 text-slate-600">{booking.purpose}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={booking.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Bookings
