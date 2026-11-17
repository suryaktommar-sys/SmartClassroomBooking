
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
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
    setSuccess(false)
    setLoading(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
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
        throw new Error(data.message || 'Registration failed')
      }

      setSuccess(true)
      setMessage('Account created successfully! Redirecting to login...')

      setTimeout(() => {
        navigate('/login')
      }, 1500)

    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-navy-900 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        <p className="text-sm font-semibold uppercase tracking-wide text-navy-500">
          Smart Classroom Booking
        </p>

        <h1 className="mt-2 text-2xl font-bold text-navy-900">
          Create Faculty Account
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Register to access the Smart Classroom Booking System.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <label className="block text-sm font-medium text-navy-900">
            Full Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="mt-1 w-full rounded-lg border border-navy-100 px-3 py-2.5 text-sm outline-none focus:border-navy-500"
            />
          </label>

          <label className="block text-sm font-medium text-navy-900">
            Email Address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="mt-1 w-full rounded-lg border border-navy-100 px-3 py-2.5 text-sm outline-none focus:border-navy-500"
            />
          </label>

          <label className="block text-sm font-medium text-navy-900">
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              minLength={8}
              required
              className="mt-1 w-full rounded-lg border border-navy-100 px-3 py-2.5 text-sm outline-none focus:border-navy-500"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

        </form>

        {message && (
          <p className={`mt-4 text-sm ${success ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-navy-700 hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register
