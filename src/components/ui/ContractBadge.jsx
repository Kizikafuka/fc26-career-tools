export default function ContractBadge({ year }) {
  const color = year <= 2027 ? 'text-error' :
    year === 2028 ? 'text-warning' :
    'text-success'

  return <span className={`font-bold ${color}`}>{year}</span>
}