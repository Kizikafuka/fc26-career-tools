import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { FORMATIONS, FORMATION_KEYS } from '../../../utils/formations'
import { buildSquad, depthStatus } from '../../../utils/squadBuilder'
import PosBadge from '../../../components/ui/PosBadge'
import OvrPill from '../../../components/ui/OvrPill'

// ─── Draggable Player Chip ───
function DraggableChip({ player, role, slotId }) {
  const id = `${slotId}__${role}`
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, data: { player, role, slotId } })

  const roleStyle = {
    t1: 'border-primary/50 bg-primary/10',
    t2: 'border-secondary/50 bg-secondary/10',
    youth: 'border-accent/50 bg-accent/10',
  }
  const roleBadge = { t1: 'badge-primary', t2: 'badge-secondary', youth: 'badge-accent' }
  const roleLabel = { t1: 'T1', t2: 'T2', youth: 'YTH' }

  if (!player) {
    return <DroppableEmpty slotId={slotId} role={role} />
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border cursor-grab active:cursor-grabbing transition-opacity ${roleStyle[role]} ${isDragging ? 'opacity-30' : 'opacity-100'}`}
    >
      <span className={`badge badge-xs ${roleBadge[role]}`}>{roleLabel[role]}</span>
      <span className="text-xs font-semibold truncate max-w-[80px]">{player.name.split(' ').slice(-1)[0]}</span>
      <OvrPill value={player.overall} />
    </div>
  )
}

// ─── Droppable Empty Slot ───
function DroppableEmpty({ slotId, role }) {
  const id = `drop__${slotId}__${role}`
  const { setNodeRef, isOver } = useDroppable({ id, data: { slotId, role } })
  const roleBadge = { t1: 'badge-primary', t2: 'badge-secondary', youth: 'badge-accent' }
  const roleLabel = { t1: 'T1', t2: 'T2', youth: 'YTH' }

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border border-dashed transition-colors ${isOver ? 'border-primary bg-primary/20' : 'border-base-content/20 text-base-content/30'}`}
    >
      <span className={`badge badge-xs ${roleBadge[role]}`}>{roleLabel[role]}</span>
      <span className="text-xs">Drop here</span>
    </div>
  )
}

// ─── Pitch Slot ───
function PitchSlot({ slot }) {
  const status = depthStatus(slot)

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1.5 mb-1">
        <div className={`w-2 h-2 rounded-full ${status.color}`} title={status.label} />
        <span className="text-xs font-black uppercase tracking-wider text-base-content/70">{slot.label}</span>
      </div>
      <div className="bg-base-300/60 rounded-xl border border-base-300 p-2 w-36 space-y-1.5 backdrop-blur-sm">
        <DraggableChip player={slot.t1} role="t1" slotId={slot.id} />
        <DraggableChip player={slot.t2} role="t2" slotId={slot.id} />
        <DraggableChip player={slot.youth} role="youth" slotId={slot.id} />
      </div>
    </div>
  )
}

// ─── Pitch ───
function Pitch({ slots }) {
  const rows = [...new Set(slots.map(s => s.row))].sort((a, b) => b - a)

  return (
    <div
      className="relative rounded-2xl overflow-hidden border-2 border-success/30"
      style={{ background: 'linear-gradient(180deg, #14532d 0%, #166534 25%, #15803d 50%, #166534 75%, #14532d 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-white/20" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
        <div className="absolute top-4 left-1/4 right-1/4 h-16 border border-white/20" />
        <div className="absolute bottom-4 left-1/4 right-1/4 h-16 border border-white/20" />
      </div>
      <div className="relative z-10 py-6 px-4 space-y-4">
        {rows.map(row => {
          const rowSlots = slots.filter(s => s.row === row)
          return (
            <div key={row} className="flex justify-center gap-3 flex-wrap">
              {rowSlots.map(slot => (
                <PitchSlot key={slot.id} slot={slot} />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Bench Panel ───
function BenchPanel({ players }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'drop__bench__bench' })

  return (
    <div
      ref={setNodeRef}
      className={`bg-base-200 rounded-xl border overflow-hidden w-56 shrink-0 transition-colors ${isOver ? 'border-primary' : 'border-base-300'}`}
    >
      <div className="px-3 py-2.5 border-b border-base-300">
        <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/50">
          Bench ({players.length})
        </h3>
      </div>
      <div className="overflow-y-auto max-h-[600px] divide-y divide-base-300/50 min-h-[60px]">
        {players.length === 0 ? (
          <div className="text-center text-base-content/30 text-xs py-6">All players assigned</div>
        ) : players.map(p => (
          <BenchChip key={p.id} player={p} />
        ))}
      </div>
    </div>
  )
}

// ─── Bench Chip ───
function BenchChip({ player }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bench__${player.id}`,
    data: { player, role: null, slotId: 'bench' }
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-2 px-3 py-2 cursor-grab active:cursor-grabbing hover:bg-base-300 transition-colors ${isDragging ? 'opacity-30' : ''}`}
    >
      <PosBadge pos={player.pos} posGroup={player.posGroup} />
      <span className="text-xs font-semibold flex-1 truncate">{player.name}</span>
      <OvrPill value={player.overall} />
    </div>
  )
}

// ─── Drag Overlay Chip ───
function OverlayChip({ player }) {
  if (!player) return null
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-base-100 border border-primary rounded-lg shadow-xl text-xs font-semibold opacity-90">
      <PosBadge pos={player.pos} posGroup={player.posGroup} />
      <span>{player.name}</span>
      <OvrPill value={player.overall} />
    </div>
  )
}

// ─── Main DepthTab ───
export default function DepthTab({ players }) {
  const [formation, setFormation] = useState('4-3-3')
  const [slots, setSlots] = useState(null)
  const [activeData, setActiveData] = useState(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const currentFormation = FORMATIONS[formation]
  const builtSlots = slots || buildSquad(players, currentFormation)

  const assignedIds = new Set(
    builtSlots.flatMap(s => [s.t1?.id, s.t2?.id, s.youth?.id].filter(Boolean))
  )
  const benchPlayers = players
    .filter(p => !assignedIds.has(p.id))
    .sort((a, b) => {
      if (a.pos1 !== b.pos1) return a.pos1 - b.pos1
      return b.overall - a.overall
    })

  const handleFormationChange = (f) => {
    setFormation(f)
    setSlots(null)
  }

  const handleDragStart = ({ active }) => {
    setActiveData(active.data.current)
  }

  const handleDragEnd = ({ active, over }) => {
    setActiveData(null)
    if (!over) return

    const fromData = active.data.current
    const toId = over.id

    if (!toId.startsWith('drop__')) return
    const [, toSlotId, toRole] = toId.split('__')

    const newSlots = builtSlots.map(s => ({ ...s }))
    const fromSlot = newSlots.find(s => s.id === fromData.slotId)

    // Drop ke bench → remove dari slot aja
    if (toSlotId === 'bench') {
      if (fromSlot && fromData.role) {
        fromSlot[fromData.role] = null
      }
      setSlots(newSlots)
      return
    }

    const toSlot = newSlots.find(s => s.id === toSlotId)
    if (!toSlot) return

    const draggedPlayer = fromData.player
    const targetPlayer = toSlot[toRole]

    toSlot[toRole] = draggedPlayer

    if (fromSlot && fromData.role) {
      fromSlot[fromData.role] = targetPlayer || null
    }

    setSlots(newSlots)
  }

  const depthSummary = builtSlots.map(s => depthStatus(s))
  const deepCount = depthSummary.filter(s => s.label === 'Deep').length
  const thinCount = depthSummary.filter(s => s.label === 'Thin').length
  const weakCount = depthSummary.filter(s => s.label === 'Weak').length

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-base-content/60 font-medium">Formation</span>
          <select
            className="select select-sm bg-base-200 border-base-300 min-w-[140px]"
            value={formation}
            onChange={e => handleFormationChange(e.target.value)}
          >
            {FORMATION_KEYS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setSlots(null)}>
          Reset to Auto
        </button>
      </div>

      {/* Depth Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Deep', count: deepCount, color: 'text-success', border: 'border-success/30', bg: 'bg-success/5' },
          { label: 'Thin', count: thinCount, color: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/5' },
          { label: 'Weak', count: weakCount, color: 'text-error', border: 'border-error/30', bg: 'bg-error/5' },
        ].map(({ label, count, color, border, bg }) => (
          <div key={label} className={`bg-base-200 rounded-xl border ${border} ${bg} p-4 text-center`}>
            <div className={`text-3xl font-black ${color}`}>{count}</div>
            <div className="text-sm text-base-content/50 mt-1">{label} positions</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-base-content/50 flex-wrap">
        <span className="font-bold">Depth:</span>
        {[
          { color: 'bg-success', label: 'Deep (3)' },
          { color: 'bg-warning', label: 'Thin (2)' },
          { color: 'bg-error', label: 'Weak (1)' },
          { color: 'bg-base-content/20', label: 'Empty' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span>{label}</span>
          </div>
        ))}
        <span>|</span>
        <span className="badge badge-primary badge-xs">T1</span><span>Starter</span>
        <span className="badge badge-secondary badge-xs">T2</span><span>Rotation</span>
        <span className="badge badge-accent badge-xs">YTH</span><span>Youth</span>
      </div>

      {/* Pitch + Bench */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <Pitch slots={builtSlots} />
          </div>
          <BenchPanel players={benchPlayers} />
        </div>

        <DragOverlay>
          {activeData?.player ? <OverlayChip player={activeData.player} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}