const FIFA_REF = { d: 151366, t: new Date(1997, 2, 18).getTime() }

export function fifaAge(d) {
  const b = new Date(FIFA_REF.t + (d - FIFA_REF.d) * 86400000)
  const n = new Date()
  let a = n.getFullYear() - b.getFullYear()
  if (n.getMonth() < b.getMonth() ||
    (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--
  return a
}

export function fifaDateObj(d) {
  return new Date(FIFA_REF.t + (d - FIFA_REF.d) * 86400000)
}

export const POS = {
  0: 'GK', 2: 'RWB', 3: 'RB', 4: 'LWB', 5: 'CB', 6: 'LCB', 7: 'LB',
  8: 'CDM', 9: 'CDM', 10: 'CDM', 11: 'RM', 12: 'CM', 13: 'CM', 14: 'CM',
  15: 'LM', 16: 'LM', 17: 'CAM', 18: 'CAM', 19: 'RF', 20: 'CF', 21: 'LF',
  22: 'RW', 23: 'ST', 24: 'ST', 25: 'ST', 26: 'RW', 27: 'LW'
}

export const PGRP = {
  0: 'GK',
  2: 'DEF', 3: 'DEF', 4: 'DEF', 5: 'DEF', 6: 'DEF', 7: 'DEF',
  8: 'MID', 9: 'MID', 10: 'MID', 11: 'MID', 12: 'MID', 13: 'MID',
  14: 'MID', 15: 'MID', 16: 'MID', 17: 'MID', 18: 'MID',
  19: 'ATT', 20: 'ATT', 21: 'ATT', 22: 'ATT', 23: 'ATT',
  24: 'ATT', 25: 'ATT', 26: 'ATT', 27: 'ATT'
}

export const NAT = {
  14: 'England', 15: 'Montenegro', 18: 'France', 27: 'Italy',
  34: 'Netherlands', 37: 'Poland', 38: 'Portugal', 46: 'Sweden',
  48: 'Turkey', 51: 'Serbia', 52: 'Argentina', 54: 'Brazil',
  56: 'Colombia', 60: 'Uruguay', 70: 'Canada', 95: 'USA', 219: 'Kosovo'
}

function n(v) { const p = parseInt(v, 10); return isNaN(p) ? 0 : p }

export function mapPlayer(r) {
  const pos1 = n(r.preferred_pos1)
  const birthdate = n(r.birthdate)
  return {
    id: r.playerid,
    name: r.known_as || `${r.firstname} ${r.surname}`.trim(),
    overall: n(r.overall),
    potential: n(r.potential),
    height: n(r.height),
    weight: n(r.weight),
    birthdate,
    age: fifaAge(birthdate),
    nationality: NAT[n(r.nationality)] || 'Unknown',
    foot: n(r.preferred_foot) === 2 ? 'Left' : 'Right',
    pos1,
    pos: POS[pos1] || '?',
    posGroup: PGRP[pos1] || 'ATT',
    contract: n(r.contract_until),
    growth: n(r.potential) - n(r.overall),
    skillMoves: n(r.skill_moves),
    weakFoot: n(r.weak_foot),
    // GK
    gk_diving: n(r.gk_diving),
    gk_handling: n(r.gk_handling),
    gk_kicking: n(r.gk_kicking),
    gk_reflexes: n(r.gk_reflexes),
    gk_speed: n(r.gk_speed) || Math.round((n(r.acceleration) + n(r.sprint_speed)) / 2),
    gk_positioning: n(r.gk_positioning),
    // Physical
    acceleration: n(r.acceleration),
    sprint_speed: n(r.sprint_speed),
    agility: n(r.agility),
    reactions: n(r.reactions),
    balance: n(r.balance),
    jumping: n(r.jumping),
    stamina: n(r.stamina),
    strength: n(r.strength),
    aggression: n(r.aggression),
    // Attacking
    finishing: n(r.finishing),
    shot_power: n(r.shot_power),
    long_shots: n(r.long_shots),
    volleys: n(r.volleys),
    penalties: n(r.penalties),
    heading_accuracy: n(r.heading_accuracy),
    positioning: n(r.positioning),
    // Passing
    vision: n(r.vision),
    short_passing: n(r.short_passing),
    long_passing: n(r.long_passing),
    crossing: n(r.crossing),
    fk_accuracy: n(r.fk_accuracy),
    curve: n(r.curve),
    // Dribbling
    dribbling: n(r.dribbling),
    ball_control: n(r.ball_control),
    composure: n(r.composure),
    // Defending
    interceptions: n(r.interceptions),
    marking: n(r.marking),
    standing_tackle: n(r.standing_tackle),
    sliding_tackle: n(r.sliding_tackle),
  }
}