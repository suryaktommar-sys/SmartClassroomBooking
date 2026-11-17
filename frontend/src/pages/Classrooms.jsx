
import { useEffect, useState } from 'react';

function Classrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    room_name: '',
    capacity: '',
    location: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    user = {};
  }

  const isAdmin = user.role === 'admin';
  const token = localStorage.getItem('token');

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      setError('');

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData({ room_name: '', capacity: '', location: '' });
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const openEditForm = (room) => {
    setEditingId(room.classroom_id);
    setFormData({
      room_name: room.room_name,
      capacity: room.capacity,
      location: room.location || ''
    });
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.room_name.trim() || !formData.capacity) {
      setError('Room name and capacity are required.');
      return;
    }

    try {
      const url = editingId
        ? `${API_URL}/api/classrooms/${editingId}`
        : `${API_URL}/api/classrooms`;

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          room_name: formData.room_name,
          capacity: Number(formData.capacity),
          location: formData.location
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Operation failed');
      }

      setSuccess(result.message || 'Classroom saved successfully.');
      setShowForm(false);
      setEditingId(null);
      setFormData({ room_name: '', capacity: '', location: '' });

      await fetchClassrooms();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this classroom?'
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/api/classrooms/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Could not delete classroom');
      }

      setSuccess(result.message || 'Classroom deleted successfully.');
      await fetchClassrooms();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredClassrooms = classrooms.filter((room) => {
    const searchText = search.toLowerCase();

    return (
      room.room_name?.toLowerCase().includes(searchText) ||
      room.location?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Classroom Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage available classrooms.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={openAddForm}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            + Add Classroom
          </button>
        )}
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

      {showForm && isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-800">
            {editingId ? 'Edit Classroom' : 'Add New Classroom'}
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              name="room_name"
              placeholder="Room Name"
              value={formData.room_name}
              onChange={handleChange}
              maxLength={100}
              required
              className="rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
            />

            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              step="1"
              required
              className="rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
            />

            <input
              type="text"
              name="location"
              placeholder="Location / Block"
              value={formData.location}
              onChange={handleChange}
              maxLength={150}
              className="rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              {editingId ? 'Update Classroom' : 'Save Classroom'}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-300 px-5 py-2 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-800">
            All Classrooms ({filteredClassrooms.length})
          </h2>

          <input
            type="search"
            placeholder="Search room or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-500 sm:w-72"
          />
        </div>

        {loading ? (
          <p className="py-8 text-center text-slate-500">
            Loading classrooms...
          </p>
        ) : filteredClassrooms.length === 0 ? (
          <p className="py-8 text-center text-slate-500">
            No classrooms found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-3">Room Name</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Location</th>
                  {isAdmin && <th className="p-3">Actions</th>}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredClassrooms.map((room) => (
                  <tr key={room.classroom_id} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-800">
                      {room.room_name}
                    </td>
                    <td className="p-3 text-slate-600">
                      {room.capacity} Students
                    </td>
                    <td className="p-3 text-slate-600">
                      {room.location || 'Not specified'}
                    </td>

                    {isAdmin && (
                      <td className="p-3">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEditForm(room)}
                            className="font-medium text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(room.classroom_id)}
                            className="font-medium text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Classrooms;
