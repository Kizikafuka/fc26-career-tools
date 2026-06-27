export function buildSquad(players, formation) {
  const slots = formation.map(slot => ({ ...slot, t1: null, t2: null, youth: null }))
  const assignedT1 = new Set()
  const assignedT2 = new Set()
  const assignedYouth = new Set()

  const sorted = [...players].sort((a, b) => b.overall - a.overall)

  // Assign T1
  slots.forEach(slot => {
    let player = null
    for (const pos of slot.pos1s) {
      player = sorted.find(p => !assignedT1.has(p.id) && p.pos1 === pos)
      if (player) break
    }
    if (!player) {
      const fallbackGroup = slot.pos1s[0] <= 0 ? 'GK' :
        slot.pos1s[0] <= 7 ? 'DEF' :
        slot.pos1s[0] <= 18 ? 'MID' : 'ATT'
      player = sorted.find(p => !assignedT1.has(p.id) && p.posGroup === fallbackGroup)
    }
    if (player) {
      slot.t1 = player
      assignedT1.add(player.id)
    }
  })

  // Assign T2
  slots.forEach(slot => {
    let player = null
    for (const pos of slot.pos1s) {
      player = sorted.find(p => !assignedT1.has(p.id) && !assignedT2.has(p.id) && p.pos1 === pos)
      if (player) break
    }
    if (!player) {
      const fallbackGroup = slot.pos1s[0] <= 0 ? 'GK' :
        slot.pos1s[0] <= 7 ? 'DEF' :
        slot.pos1s[0] <= 18 ? 'MID' : 'ATT'
      player = sorted.find(p => !assignedT1.has(p.id) && !assignedT2.has(p.id) && p.posGroup === fallbackGroup)
    }
    if (player) {
      slot.t2 = player
      assignedT2.add(player.id)
    }
  })

  // Assign Youth (age < 21)
  slots.forEach(slot => {
    let player = null
    for (const pos of slot.pos1s) {
      player = sorted.find(p =>
        !assignedT1.has(p.id) &&
        !assignedT2.has(p.id) &&
        !assignedYouth.has(p.id) &&
        p.age < 21 &&
        p.pos1 === pos
      )
      if (player) break
    }
    if (player) {
      slot.youth = player
      assignedYouth.add(player.id)
    }
  })

  return slots
}

export function depthStatus(slot) {
  const count = [slot.t1, slot.t2, slot.youth].filter(Boolean).length
  if (count >= 3) return { color: 'bg-success', label: 'Deep' }
  if (count === 2) return { color: 'bg-warning', label: 'Thin' }
  if (count === 1) return { color: 'bg-error', label: 'Weak' }
  return { color: 'bg-base-content/20', label: 'Empty' }
}