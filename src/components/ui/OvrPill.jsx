export default function OvrPill({ value, showPotential = false, potential }) {
  const color = value >= 85 ? 'text-success' :
    value >= 80 ? 'text-primary' :
    value >= 75 ? 'text-base-content' :
    'text-base-content/50'

  return (
    <span className={`font-bold ${color}`}>
      {value}
      {showPotential && potential !== undefined && (
        <span className="text-xs text-base-content/40 ml-1">/ {potential}</span>
      )}
    </span>
  )
}