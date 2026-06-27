import { useState } from 'react'
import PosBadge from '../../../components/ui/PosBadge'

function avg(...vals) {
  const valid = vals.filter(v => v > 0)
  if (!valid.length) return 0
  return Math.round(valid.reduce((s, v) => s + v, 0) / valid.length)
}

function calcStats(p) {
  return {
    PAC: avg(p.acceleration, p.sprint_speed),
    SHO: avg(p.finishing, p.shot_power, p.long_shots, p.volleys, p.penalties),
    PAS: avg(p.vision, p.short_passing, p.long_passing, p.crossing),
    DRI: avg(p.agility, p.dribbling, p.ball_control, p.composure),
    DEF: avg(p.interceptions, p.marking, p.standing_tackle, p.sliding_tackle),
    PHY: avg(p.jumping, p.stamina, p.strength, p.aggression),
  }
}

function calcGKStats(p) {
  return {
    DIV: p.gk_diving,
    HAN: p.gk_handling,
    KIC: p.gk_kicking,
    REF: p.gk_reflexes,
    SPD: p.gk_speed || 0,
    POS: p.gk_positioning,
  }
}

function cardTheme(ovr) {
  if (ovr >= 75) return {
    bg: 'from-yellow-800 via-yellow-600 to-yellow-400',
    border: 'border-yellow-400',
    statColor: 'text-yellow-900',
    nameColor: 'text-yellow-900',
    ovrColor: 'text-yellow-900',
    shine: 'from-yellow-300/30',
  }
  if (ovr >= 65) return {
    bg: 'from-slate-600 via-slate-400 to-slate-300',
    border: 'border-slate-300',
    statColor: 'text-slate-900',
    nameColor: 'text-slate-900',
    ovrColor: 'text-slate-900',
    shine: 'from-slate-200/30',
  }
  return {
    bg: 'from-orange-900 via-orange-700 to-orange-500',
    border: 'border-orange-500',
    statColor: 'text-orange-100',
    nameColor: 'text-orange-100',
    ovrColor: 'text-orange-100',
    shine: 'from-orange-400/30',
  }
}

function posAvatar(posGroup) {
  const icons = {
    GK: '🧤',
    DEF: '🛡️',
    MID: '⚙️',
    ATT: '⚡',
  }
  return icons[posGroup] || '⚽'
}

function UTCard({ player, showPotential }) {
  const theme = cardTheme(player.overall)
  const stats = player.posGroup === 'GK' ? calcGKStats(player) : calcStats(player)

  return (
    <div className="hover-3d w-56 mx-auto cursor-pointer select-none">
      <div className={`relative rounded-2xl border-2 ${theme.border} bg-gradient-to-b ${theme.bg} p-4 shadow-2xl overflow-hidden`}>
        {/* Shine overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.shine} to-transparent pointer-events-none`} />

        {/* OVR + POS */}
        <div className="flex flex-col items-start mb-2 relative z-10">
          <span className={`text-4xl font-black leading-none ${theme.ovrColor}`}>{player.overall}</span>
          <span className={`text-sm font-bold uppercase tracking-widest ${theme.nameColor} opacity-80`}>{player.pos}</span>
          {showPotential && (
            <span className={`text-xs font-semibold ${theme.nameColor} opacity-60 mt-0.5`}>POT {player.potential}</span>
          )}
        </div>

        {/* Avatar */}
        <div className="flex justify-center my-3 relative z-10">
          <div className={`w-24 h-24 rounded-xl bg-black/20 border ${theme.border} flex items-center justify-center text-5xl`}>
            {posAvatar(player.posGroup)}
          </div>
        </div>

        {/* Name */}
        <div className={`text-center font-black text-base uppercase tracking-wide ${theme.nameColor} mb-3 relative z-10 truncate`}>
          {player.name.split(' ').slice(-1)[0]}
        </div>

        {/* Divider */}
        <div className={`border-t ${theme.border} opacity-40 mb-3`} />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-x-2 gap-y-1 relative z-10">
          {Object.entries(stats).map(([key, val]) => (
            <div key={key} className="flex flex-col items-center">
              <span className={`text-lg font-black leading-none ${theme.statColor}`}>{val}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.statColor} opacity-70`}>{key}</span>
            </div>
          ))}
        </div>
      </div>
      {/* 8 divs for 3D effect */}
      <div /><div /><div /><div />
      <div /><div /><div /><div />
    </div>
  )
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

function AttrTable({ pa, pb }) {
  return (
    <div className="bg-base-200 rounded-xl border border-base-300 overflow-hidden">
      {ATTR_GROUPS.map(group => (
        <div key={group.title}>
          <div className="px-4 py-2 bg-base-300 text-xs font-bold uppercase tracking-wider text-base-content/50">
            {group.title}
          </div>
          {group.attrs.map(([label, key]) => {
            const av = pa[key] || 0
            const bv = pb[key] || 0
            const aWins = av > bv
            const bWins = bv > av
            const maxVal = 99
            return (
              <div key={key} className="grid grid-cols-[1fr_40px_80px_40px_1fr] items-center px-4 py-1.5 border-b border-base-300/50 last:border-0">
                {/* Bar A */}
                <div className="flex justify-end pr-2">
                  <div className="w-full max-w-[120px] h-1.5 bg-base-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(av / maxVal) * 100}%` }}
                    />
                  </div>
                </div>
                {/* Val A */}
                <div className={`text-center text-sm font-bold ${aWins ? 'text-primary' : 'text-base-content/50'}`}>
                  {av}
                </div>
                {/* Label */}
                <div className="text-center text-xs text-base-content/50">{label}</div>
                {/* Val B */}
                <div className={`text-center text-sm font-bold ${bWins ? 'text-error' : 'text-base-content/50'}`}>
                  {bv}
                </div>
                {/* Bar B */}
                <div className="flex justify-start pl-2">
                  <div className="w-full max-w-[120px] h-1.5 bg-base-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-error rounded-full"
                      style={{ width: `${(bv / maxVal) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default function CompareTab({ players, showPotential }) {
  const sorted = [...players].sort((a, b) => {
  if (a.pos1 !== b.pos1) return a.pos1 - b.pos1
  return b.overall - a.overall
})
  const [idA, setIdA] = useState(sorted[0]?.id)
  const [idB, setIdB] = useState(sorted[1]?.id)

  const pa = players.find(p => p.id === idA)
  const pb = players.find(p => p.id === idB)

  return (
    <div className="space-y-6">
      {/* Selectors */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-base-content/60 font-medium">Player A</span>
          <select
            className="select select-sm bg-base-200 border-primary min-w-[200px]"
            value={idA}
            onChange={e => setIdA(e.target.value)}
          >
            {sorted.map(p => (
              <option key={p.id} value={p.id}>{p.name} · {p.pos} · {p.overall}</option>
            ))}
          </select>
        </div>
        <span className="text-base-content/30 font-bold text-lg">vs</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-base-content/60 font-medium">Player B</span>
          <select
            className="select select-sm bg-base-200 border-error min-w-[200px]"
            value={idB}
            onChange={e => setIdB(e.target.value)}
          >
            {sorted.map(p => (
              <option key={p.id} value={p.id}>{p.name} · {p.pos} · {p.overall}</option>
            ))}
          </select>
        </div>
      </div>

      {pa && pb && (
        <>
          {/* Cards */}
          <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto">
            <UTCard player={pa} showPotential={showPotential} />
            <UTCard player={pb} showPotential={showPotential} />
          </div>

          {/* Attr Table */}
          <AttrTable pa={pa} pb={pb} />
        </>
      )}
    </div>
  )
}