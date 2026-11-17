
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Save authentication details
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      navigate('/')

    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-navy-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        <p className="text-sm font-semibold uppercase tracking-wide text-navy-500">
          Smart Classroom Booking
        </p>

        <h1 className="mt-2 text-2xl font-bold text-navy-900">
          Faculty / Admin Login
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Sign in to access your classroom booking dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <label className="block text-sm font-medium text-navy-900">
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="mt-1 w-full rounded-lg border border-navy-100 px-3 py-2 text-sm outline-none focus:border-navy-500"
            />
          </label>

          <label className="block text-sm font-medium text-navy-900">
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="mt-1 w-full rounded-lg border border-navy-100 px-3 py-2 text-sm outline-none focus:border-navy-500"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {message && (
          <p className="mt-4 text-sm text-red-600">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-navy-700 hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login
