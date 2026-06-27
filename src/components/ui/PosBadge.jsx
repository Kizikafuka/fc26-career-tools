const config = {
  GK: 'badge-warning',
  DEF: 'badge-success',
  MID: 'badge-info',
  ATT: 'badge-error',
}

export default function PosBadge({ pos, posGroup }) {
  return (
    <span className={`badge badge-sm font-bold ${config[posGroup] || 'badge-ghost'}`}>
      {pos}
    </span>
  )
}