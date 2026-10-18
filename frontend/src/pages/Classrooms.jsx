
import { useEffect, useState } from 'react'
import StatusBadge from '../components/StatusBadge'

function Classrooms() {
  const [classrooms, setClassrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/classrooms')

        if (!response.ok) {
          throw new Error('Failed to fetch classrooms')
        }

        const result = await response.json()
        setClassrooms(result.data)
      } catch (err) {
        setError('Could not load classrooms. Please check that the backend is running.')
      } finally {
        setLoading(false)
      }
    }

    fetchClassrooms()
  }, [])

  if (loading) {
    return <p className="p-5 text-slate-600">Loading classrooms...</p>
  }

  if (error) {
    return <p className="p-5 text-red-600">{error}</p>
  }

  return (
    <section className="overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm">
      <div className="border-b border-navy-100 px-5 py-4">
        <h2 className="text-base font-semibold text-navy-900">
          Classroom Management
        </h2>
        <p className="text-sm text-slate-500">
          Showing classrooms from the database
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-navy-50 text-navy-800">
            <tr>
              <th className="px-5 py-3 font-semibold">Room name</th>
              <th className="px-5 py-3 font-semibold">Building / Location</th>
              <th className="px-5 py-3 font-semibold">Capacity</th>
            </tr>
          </thead>

          <tbody>
            {classrooms.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-6 text-center text-slate-500">
                  No classrooms found.
                </td>
              </tr>
            ) : (
              classrooms.map((room) => (
                <tr key={room.classroom_id} className="border-t border-navy-100">
                  <td className="px-5 py-3 font-medium text-navy-900">
                    {room.room_name}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {room.location || 'Not specified'}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {room.capacity}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Classrooms
