const styles = {
  Available: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Occupied: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Maintenance: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  Approved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Rejected: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] || 'bg-slate-100 text-slate-600'}`}
    >
      {status}
    </span>
  )
}

export default StatusBadge
