import { useState } from 'react'
import { fifaDateObj } from '../../../utils/playerMapper'

function avg(...vals) {
  const valid = vals.filter(v => v > 0)
  if (!valid.length) return 0
  return Math.round(valid.reduce((s, v) => s + v, 0) / valid.length)
}

function calcStats(p) {
  if (p.posGroup === 'GK') {
    return [
      { key: 'DIV', val: p.gk_diving },
      { key: 'HAN', val: p.gk_handling },
      { key: 'KIC', val: p.gk_kicking },
      { key: 'REF', val: p.gk_reflexes },
      { key: 'SPD', val: p.gk_speed || 0 },
      { key: 'POS', val: p.gk_positioning },
    ]
  }
  return [
    { key: 'PAC', val: avg(p.acceleration, p.sprint_speed) },
    { key: 'SHO', val: avg(p.finishing, p.shot_power, p.long_shots, p.volleys, p.penalties) },
    { key: 'PAS', val: avg(p.vision, p.short_passing, p.long_passing, p.crossing) },
    { key: 'DRI', val: avg(p.agility, p.dribbling, p.ball_control, p.composure) },
    { key: 'DEF', val: avg(p.interceptions, p.marking, p.standing_tackle, p.sliding_tackle) },
    { key: 'PHY', val: avg(p.jumping, p.stamina, p.strength, p.aggression) },
  ]
}

function cardTheme(ovr) {
  if (ovr >= 75) return {
    bg: 'from-yellow-800 via-yellow-600 to-yellow-400',
    border: 'border-yellow-400',
    textColor: 'text-yellow-900',
    shine: 'from-yellow-300/30',
  }
  if (ovr >= 65) return {
    bg: 'from-slate-600 via-slate-400 to-slate-300',
    border: 'border-slate-300',
    textColor: 'text-slate-900',
    shine: 'from-slate-200/30',
  }
  return {
    bg: 'from-orange-900 via-orange-700 to-orange-500',
    border: 'border-orange-500',
    textColor: 'text-orange-100',
    shine: 'from-orange-400/30',
  }
}

function posAvatar(posGroup) {
  const icons = { GK: '🧤', DEF: '🛡️', MID: '⚙️', ATT: '⚡' }
  return icons[posGroup] || '⚽'
}

function statBarColor(val) {
  if (val >= 80) return 'bg-success'
  if (val >= 65) return 'bg-primary'
  if (val >= 50) return 'bg-warning'
  return 'bg-error'
}

const ATTR_GROUPS = [
  {
    title: 'Physical',
    attrs: [
      ['Acceleration', 'acceleration'],
      ['Sprint Speed', 'sprint_speed'],
      ['Jumping', 'jumping'],
      ['Stamina', 'stamina'],
      ['Strength', 'strength'],
      ['Aggression', 'aggression'],
    ]
  },
  {
    title: 'Attacking',
    attrs: [
      ['Finishing', 'finishing'],
      ['Shot Power', 'shot_power'],
      ['Long Shots', 'long_shots'],
      ['Volleys', 'volleys'],
      ['Heading', 'heading_accuracy'],
      ['Penalties', 'penalties'],
    ]
  },
  {
    title: 'Passing',
    attrs: [
      ['Vision', 'vision'],
      ['Short Pass', 'short_passing'],
      ['Long Pass', 'long_passing'],
      ['Crossing', 'crossing'],
      ['FK Accuracy', 'fk_accuracy'],
      ['Curve', 'curve'],
    ]
  },
  {
    title: 'Dribbling',
    attrs: [
      ['Dribbling', 'dribbling'],
      ['Ball Control', 'ball_control'],
      ['Agility', 'agility'],
      ['Composure', 'composure'],
      ['Balance', 'balance'],
      ['Reactions', 'reactions'],
    ]
  },
  {
    title: 'Defending',
    attrs: [
      ['Interceptions', 'interceptions'],
      ['Marking', 'marking'],
      ['Stand. Tackle', 'standing_tackle'],
      ['Slid. Tackle', 'sliding_tackle'],
    ]
  },
  {
    title: 'GK',
    attrs: [
      ['Diving', 'gk_diving'],
      ['Handling', 'gk_handling'],
      ['Kicking', 'gk_kicking'],
      ['Reflexes', 'gk_reflexes'],
      ['Speed', 'gk_speed'],
      ['Positioning', 'gk_positioning'],
    ]
  },
]

export default function ProfileTab({ players, showPotential }) {
  const sorted = [...players].sort((a, b) => {
    if (a.pos1 !== b.pos1) return a.pos1 - b.pos1
    return b.overall - a.overall
  })
  const [selectedId, setSelectedId] = useState(sorted[0]?.id)
  const p = players.find(x => x.id === selectedId)

  if (!p) return null

  const theme = cardTheme(p.overall)
  const stats = calcStats(p)
  const bdObj = fifaDateObj(p.birthdate)
  const contractColor = p.contract <= 2027 ? 'text-error' : p.contract === 2028 ? 'text-warning' : 'text-success'

  return (
    <div className="space-y-6">
      {/* Selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-base-content/60 font-medium">Select Player</span>
        <select
          className="select select-sm bg-base-200 border-base-300 min-w-[240px]"
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
        >
          {sorted.map(pl => (
            <option key={pl.id} value={pl.id}>
              {pl.name} · {pl.pos} · {pl.overall}
            </option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

        {/* LEFT — UT Card + Meta */}
        <div className="space-y-4">
          {/* UT Card */}
          <div className="hover-3d w-56 mx-auto cursor-pointer select-none">
            <div className={`relative rounded-2xl border-2 ${theme.border} bg-gradient-to-b ${theme.bg} p-4 shadow-2xl overflow-hidden`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.shine} to-transparent pointer-events-none`} />

              {/* OVR + POS */}
              <div className="flex flex-col items-start mb-2 relative z-10">
                <span className={`text-4xl font-black leading-none ${theme.textColor}`}>{p.overall}</span>
                <span className={`text-sm font-bold uppercase tracking-widest ${theme.textColor} opacity-80`}>{p.pos}</span>
                {showPotential && (
                  <span className={`text-xs font-semibold ${theme.textColor} opacity-60 mt-0.5`}>POT {p.potential}</span>
                )}
              </div>

              {/* Avatar */}
              <div className="flex justify-center my-3 relative z-10">
                <div className={`w-24 h-24 rounded-xl bg-black/20 border ${theme.border} flex items-center justify-center text-5xl`}>
                  {posAvatar(p.posGroup)}
                </div>
              </div>

              {/* Name */}
              <div className={`text-center font-black text-base uppercase tracking-wide ${theme.textColor} mb-3 relative z-10 truncate`}>
                {p.name.split(' ').slice(-1)[0]}
              </div>

              <div className={`border-t ${theme.border} opacity-40 mb-3`} />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-x-2 gap-y-1 relative z-10">
                {stats.map(({ key, val }) => (
                  <div key={key} className="flex flex-col items-center">
                    <span className={`text-lg font-black leading-none ${theme.textColor}`}>{val}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.textColor} opacity-70`}>{key}</span>
                  </div>
                ))}
              </div>
            </div>
            <div /><div /><div /><div />
            <div /><div /><div /><div />
          </div>

          {/* Meta Info */}
          <div className="bg-base-200 rounded-xl border border-base-300 p-4 space-y-2">
            <h3 className="font-bold text-base mb-3 text-primary">{p.name}</h3>
            {[
              ['Age', p.age],
              ['Born', bdObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })],
              ['Nationality', p.nationality],
              ['Height', `${p.height} cm`],
              ['Weight', `${p.weight} kg`],
              ['Preferred Foot', p.foot],
              ['Skill Moves', '★'.repeat(p.skillMoves)],
              ['Weak Foot', '★'.repeat(p.weakFoot)],
              ['Contract', <span className={contractColor}>{p.contract}</span>],
              ...(showPotential ? [['Potential', p.potential], ['Growth', `+${p.growth}`]] : []),
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center text-sm border-b border-base-300/50 pb-1.5 last:border-0 last:pb-0">
                <span className="text-base-content/50">{label}</span>
                <span className="font-semibold">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Stats bars + Attr detail */}
        <div className="space-y-4">
          {/* 6 Stats Progress Bars */}
          <div className="bg-base-200 rounded-xl border border-base-300 p-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/50 mb-4">Stats Overview</h3>
            <div className="space-y-3">
              {stats.map(({ key, val }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs font-bold w-8 text-base-content/60">{key}</span>
                  <div className="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${statBarColor(val)}`}
                      style={{ width: `${(val / 99) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-black w-8 text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Attribute Detail */}
          <div className="bg-base-200 rounded-xl border border-base-300 overflow-hidden">
            <div className="px-4 py-3 border-b border-base-300">
              <h3 className="font-bold text-sm uppercase tracking-wider text-base-content/50">Detailed Attributes</h3>
            </div>
            <div className="divide-y divide-base-300/50">
              {ATTR_GROUPS.map(group => (
                <div key={group.title} className="p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-base-content/40 mb-3">{group.title}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {group.attrs.map(([label, key]) => {
                      const val = p[key] || 0
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-xs text-base-content/50 w-28 text-right shrink-0">{label}</span>
                          <div className="flex-1 h-1.5 bg-base-300 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${statBarColor(val)}`}
                              style={{ width: `${(val / 99) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold w-6 text-right">{val}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}