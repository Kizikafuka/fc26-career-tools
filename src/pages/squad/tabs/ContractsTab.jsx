import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import PosBadge from '../../../components/ui/PosBadge'
import OvrPill from '../../../components/ui/OvrPill'

const URGENCY = [
  {
    key: 'expiring',
    label: 'Expiring Soon',
    sub: 'Contract ≤ 2027',
    filter: p => p.contract <= 2027,
    color: 'text-error',
    badgeClass: 'badge-error',
    borderClass: 'border-error/30',
    bgClass: 'bg-error/5',
    barColor: '#ef4444',
  },
  {
    key: 'renew',
    label: 'Renew Soon',
    sub: 'Contract 2028',
    filter: p => p.contract === 2028,
    color: 'text-warning',
    badgeClass: 'badge-warning',
    borderClass: 'border-warning/30',
    bgClass: 'bg-warning/5',
    barColor: '#f59e0b',
  },
  {
    key: 'secure',
    label: 'Secure',
    sub: 'Contract 2029+',
    filter: p => p.contract >= 2029,
    color: 'text-success',
    badgeClass: 'badge-success',
    borderClass: 'border-success/30',
    bgClass: 'bg-success/5',
    barColor: '#16AD6E',
  },
]

export default function ContractsTab({ players }) {
  // Timeline chart data
  const years = [...new Set(players.map(p => p.contract))].sort()
  const chartData = years.map(y => ({
    year: y,
    count: players.filter(p => p.contract === y).length,
    color: y <= 2027 ? '#ef4444' : y === 2028 ? '#f59e0b' : '#16AD6E',
  }))

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {URGENCY.map(u => {
          const group = players.filter(u.filter)
          return (
            <div key={u.key} className={`bg-base-200 rounded-xl border ${u.borderClass} ${u.bgClass} p-4`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`badge badge-sm ${u.badgeClass}`}>{u.sub}</span>
              </div>
              <div className={`text-4xl font-black ${u.color}`}>{group.length}</div>
              <div className="text-sm text-base-content/50 mt-1">{u.label}</div>
            </div>
          )
        })}
      </div>

      {/* Timeline Chart */}
      <div className="bg-base-200 rounded-xl border border-base-300 p-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/50 mb-4">
          Contract Timeline
        </h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fontWeight: 700 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(val) => [`${val} players`, 'Count']}
              contentStyle={{
                background: '#1A293E',
                border: '1px solid #1B465E',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={48}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Urgency Groups */}
      <div className="space-y-4">
        {URGENCY.map(u => {
          const group = players
            .filter(u.filter)
            .sort((a, b) => b.overall - a.overall)

          if (!group.length) return null

          return (
            <div key={u.key} className={`bg-base-200 rounded-xl border ${u.borderClass} overflow-hidden`}>
              <div className={`px-4 py-3 border-b ${u.borderClass} flex items-center gap-3`}>
                <span className={`badge ${u.badgeClass}`}>{u.sub}</span>
                <span className="font-bold">{u.label}</span>
                <span className="text-base-content/40 text-sm">{group.length} player{group.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr className="bg-base-300">
                      <th className="text-xs uppercase tracking-wider">Name</th>
                      <th className="text-xs uppercase tracking-wider">Pos</th>
                      <th className="text-xs uppercase tracking-wider">OVR</th>
                      <th className="text-xs uppercase tracking-wider">Age</th>
                      <th className="text-xs uppercase tracking-wider">Contract</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.map(p => (
                      <tr key={p.id} className="hover:bg-base-300 transition-colors">
                        <td className="font-semibold">{p.name}</td>
                        <td><PosBadge pos={p.pos} posGroup={p.posGroup} /></td>
                        <td><OvrPill value={p.overall} /></td>
                        <td>{p.age}</td>
                        <td>
                          <span className={
                            p.contract <= 2027 ? 'text-error font-bold' :
                            p.contract === 2028 ? 'text-warning font-bold' :
                            'text-success font-bold'
                          }>
                            {p.contract}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}