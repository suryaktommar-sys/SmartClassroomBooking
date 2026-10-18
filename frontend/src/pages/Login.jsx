import { Link } from 'react-router-dom'

function Login() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-navy-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-navy-500">Smart Classroom Booking</p>
        <h1 className="mt-2 text-2xl font-bold text-navy-900">Faculty / Admin Login</h1>
        <p className="mt-2 text-sm text-slate-500">
          This is a sample login screen. Real authentication will be added later.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <label className="block text-sm font-medium text-navy-900">
            Email
            <input
              type="email"
              defaultValue="faculty@college.edu"
              className="mt-1 w-full rounded-lg border border-navy-100 px-3 py-2 text-sm outline-none focus:border-navy-500"
            />
          </label>
          <label className="block text-sm font-medium text-navy-900">
            Password
            <input
              type="password"
              defaultValue="password"
              className="mt-1 w-full rounded-lg border border-navy-100 px-3 py-2 text-sm outline-none focus:border-navy-500"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Sign in (sample)
          </button>
        </form>

        <Link to="/" className="mt-6 inline-block text-sm font-medium text-navy-700 hover:underline">
          Continue to dashboard
        </Link>
      </div>
    </div>
  )
}

export default Login
