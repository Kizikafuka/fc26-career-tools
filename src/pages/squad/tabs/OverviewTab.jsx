import { useState } from 'react'
import PosBadge from '../../../components/ui/PosBadge'
import OvrPill from '../../../components/ui/OvrPill'
import ContractBadge from '../../../components/ui/ContractBadge'

const COLS = [
  { key: 'name', label: 'Name' },
  { key: 'pos', label: 'Pos' },
  { key: 'overall', label: 'OVR' },
  { key: 'potential', label: 'POT' },
  { key: 'growth', label: '▲' },
  { key: 'age', label: 'Age' },
  { key: 'nationality', label: 'Nation' },
  { key: 'foot', label: 'Foot' },
  { key: 'contract', label: 'Contract' },
]

export default function OverviewTab({ players, showPotential }) {
  const [search, setSearch] = useState('')
  const [posFilter, setPosFilter] = useState('All')
  const [footFilter, setFootFilter] = useState('All')
  const [sort, setSort] = useState({ col: 'overall', dir: 'desc' })

  const avgOvr = (players.reduce((s, p) => s + p.overall, 0) / players.length).toFixed(1)
  const avgAge = (players.reduce((s, p) => s + p.age, 0) / players.length).toFixed(1)
  const expiring = players.filter(p => p.contract <= 2027).length

  // Filter
  let list = [...players]
  if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  if (posFilter !== 'All') list = list.filter(p => p.posGroup === posFilter)
  if (footFilter !== 'All') list = list.filter(p => p.foot === footFilter)

  // Sort
list.sort((a, b) => {
  const key = sort.col === 'pos' ? 'pos1' : sort.col
  const av = a[key], bv = b[key]
  if (typeof av === 'string') return sort.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
  return sort.dir === 'asc' ? av - bv : bv - av
})

  const handleSort = (col) => {
    setSort(prev => ({
      col,
      dir: prev.col === col ? (prev.dir === 'asc' ? 'desc' : 'asc') : 'desc'
    }))
  }

  const sortIcon = (col) => {
    if (sort.col !== col) return null
    return sort.dir === 'asc' ? ' ▲' : ' ▼'
  }

  return (
    <div className="space-y-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Squad Size', value: players.length, sub: 'players' },
          { label: 'Avg OVR', value: avgOvr, sub: 'overall rating', accent: true },
          { label: 'Avg Age', value: avgAge, sub: 'years old' },
          { label: 'Expiring ≤2027', value: expiring, sub: 'contracts', danger: true },
        ].map(({ label, value, sub, accent, danger }) => (
          <div key={label} className="bg-base-200 rounded-xl p-4 border border-base-300">
            <div className="text-xs font-semibold text-base-content/40 uppercase tracking-wider">{label}</div>
            <div className={`text-4xl font-black mt-1 ${accent ? 'text-primary' : danger ? 'text-error' : 'text-base-content'}`}>
              {value}
            </div>
            <div className="text-xs text-base-content/40 mt-1">{sub}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-base-200 rounded-xl border border-base-300 p-3 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="🔍 Search by name..."
          className="input input-sm bg-base-100 border-base-300 flex-1 min-w-[180px]"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="select select-sm bg-base-100 border-base-300" value={posFilter} onChange={e => setPosFilter(e.target.value)}>
          <option value="All">All Positions</option>
          <option value="GK">GK</option>
          <option value="DEF">DEF</option>
          <option value="MID">MID</option>
          <option value="ATT">ATT</option>
        </select>
        <select className="select select-sm bg-base-100 border-base-300" value={footFilter} onChange={e => setFootFilter(e.target.value)}>
          <option value="All">Both Feet</option>
          <option value="Right">Right</option>
          <option value="Left">Left</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-base-200 rounded-xl border border-base-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr className="bg-base-300">
                {COLS.map(c => (
                  <th
                    key={c.key}
                    className="cursor-pointer hover:text-primary text-xs uppercase tracking-wider select-none"
                    onClick={() => handleSort(c.key)}
                  >
                    {c.label}{sortIcon(c.key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr><td colSpan={9} className="text-center text-base-content/40 py-8">No players match filters</td></tr>
              ) : list.map(p => (
                <tr key={p.id} className="hover:bg-base-300 transition-colors">
                  <td className="font-semibold">{p.name}</td>
                  <td><PosBadge pos={p.pos} posGroup={p.posGroup} /></td>
                  <td><OvrPill value={p.overall} /></td>
                  <td>
                    {showPotential
                      ? <span className="text-base-content/60">{p.potential}</span>
                      : <span className="text-base-content/20">—</span>
                    }
                  </td>
                  <td>
                    {showPotential
                      ? <span className={`font-bold ${p.growth >= 5 ? 'text-success' : p.growth >= 1 ? 'text-primary' : 'text-base-content/40'}`}>
                          +{p.growth}
                        </span>
                      : <span className="text-base-content/20">—</span>
                    }
                  </td>
                  <td>{p.age}</td>
                  <td className="text-base-content/60">{p.nationality}</td>
                  <td className="text-base-content/60 text-xs">{p.foot}</td>
                  <td><ContractBadge year={p.contract} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}