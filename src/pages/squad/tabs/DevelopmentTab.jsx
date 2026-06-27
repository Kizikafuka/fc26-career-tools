import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import PosBadge from '../../../components/ui/PosBadge'
import OvrPill from '../../../components/ui/OvrPill'
import ContractBadge from '../../../components/ui/ContractBadge'

export default function DevelopmentTab({ players, showPotential }) {
  const top15 = [...players]
    .sort((a, b) => b.growth - a.growth)
    .slice(0, 15)

  const u25 = [...players]
    .filter(p => p.age < 25)
    .sort((a, b) => b.growth - a.growth)

  const vets = [...players]
    .filter(p => p.age >= 28 && p.growth === 0)
    .sort((a, b) => b.overall - a.overall)

  const growthColor = (g) => g >= 5 ? '#16AD6E' : g >= 1 ? '#169593' : '#94a3b8'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-base-200 rounded-xl border border-base-300 p-4">
          <h2 className="text-base font-bold mb-4">
            Top 15 by Growth Potential
            {!showPotential && <span className="text-xs text-base-content/40 font-normal ml-2">(potential hidden)</span>}
          </h2>
          {showPotential ? (
            <ResponsiveContainer width="100%" height={380}>
              <BarChart
                data={top15.map(p => ({ name: p.name, growth: p.growth, ovr: p.overall, pot: p.potential }))}
                layout="vertical"
                margin={{ left: 100, right: 20 }}
              >
                <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={95} />
                <Tooltip
                  formatter={(val, _, props) => [`+${val} (${props.payload.ovr}→${props.payload.pot})`, 'Growth']}
                  contentStyle={{ background: '#1A293E', border: '1px solid #1B465E', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="growth" radius={[0, 4, 4, 0]} barSize={14}>
                  {top15.map((p, i) => (
                    <Cell key={i} fill={growthColor(p.growth)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[380px] text-base-content/30 text-sm">
              Enable "Show Potential" to see growth chart
            </div>
          )}
        </div>

        {/* Tables */}
        <div className="space-y-4">
          {/* Under 25 */}
          <div className="bg-base-200 rounded-xl border border-base-300 overflow-hidden">
            <div className="px-4 py-3 border-b border-base-300">
              <h2 className="text-base font-bold">Under-25 Players</h2>
            </div>
            {u25.length === 0 ? (
              <div className="text-center text-base-content/40 py-6 text-sm">No players under 25</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr className="bg-base-300">
                      <th className="text-xs uppercase tracking-wider">Name</th>
                      <th className="text-xs uppercase tracking-wider">Pos</th>
                      <th className="text-xs uppercase tracking-wider">Age</th>
                      <th className="text-xs uppercase tracking-wider">OVR</th>
                      {showPotential && <th className="text-xs uppercase tracking-wider">POT</th>}
                      {showPotential && <th className="text-xs uppercase tracking-wider">▲</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {u25.map(p => (
                      <tr key={p.id} className="hover:bg-base-300 transition-colors">
                        <td className="font-semibold">{p.name}</td>
                        <td><PosBadge pos={p.pos} posGroup={p.posGroup} /></td>
                        <td>{p.age}</td>
                        <td><OvrPill value={p.overall} /></td>
                        {showPotential && <td className="text-base-content/60">{p.potential}</td>}
                        {showPotential && (
                          <td>
                            <span className={`font-bold ${p.growth >= 5 ? 'text-success' : p.growth >= 1 ? 'text-primary' : 'text-base-content/40'}`}>
                              +{p.growth}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Veterans */}
          <div className="bg-base-200 rounded-xl border border-base-300 overflow-hidden">
            <div className="px-4 py-3 border-b border-base-300">
              <h2 className="text-base font-bold">Veterans <span className="text-base-content/40 font-normal text-sm">(28+ · No Growth)</span></h2>
            </div>
            {vets.length === 0 ? (
              <div className="text-center text-base-content/40 py-6 text-sm">No veterans with zero growth</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr className="bg-base-300">
                      <th className="text-xs uppercase tracking-wider">Name</th>
                      <th className="text-xs uppercase tracking-wider">Pos</th>
                      <th className="text-xs uppercase tracking-wider">Age</th>
                      <th className="text-xs uppercase tracking-wider">OVR</th>
                      <th className="text-xs uppercase tracking-wider">Contract</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vets.map(p => (
                      <tr key={p.id} className="hover:bg-base-300 transition-colors">
                        <td className="font-semibold">{p.name}</td>
                        <td><PosBadge pos={p.pos} posGroup={p.posGroup} /></td>
                        <td>{p.age}</td>
                        <td><OvrPill value={p.overall} /></td>
                        <td><ContractBadge year={p.contract} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}