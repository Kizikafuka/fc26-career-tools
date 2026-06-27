import { useState } from 'react'
import { useSquadData } from '../../hooks/useSquadData'
import OverviewTab from './tabs/OverviewTab'
import DevelopmentTab from './tabs/DevelopmentTab'
import CompareTab from './tabs/CompareTab'
import ProfileTab from './tabs/ProfileTab'
import ContractsTab from './tabs/ContractsTab'
import DepthTab from './tabs/DepthTab'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'development', label: 'Development' },
  { id: 'profile', label: 'Player Profile' },
  { id: 'compare', label: 'Compare' },
  { id: 'contracts', label: 'Contracts' },
  { id: 'depth', label: 'Squad Depth' },
]

export default function SquadPage() {
  const { players, fileName, error, loadCSV, reset } = useSquadData()
  const [activeTab, setActiveTab] = useState('overview')
  const [showPotential, setShowPotential] = useState(false)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (file) loadCSV(file)
  }

  if (!players.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Squad Attributes</h1>
          <p className="text-base-content/60">Upload CSV hasil export dari Live Editor</p>
        </div>
        {error && (
          <div className="alert alert-error max-w-md">
            <span>{error}</span>
          </div>
        )}
        <label className="btn btn-primary btn-lg gap-2 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload CSV
          <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
        </label>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary">Squad Attributes</h1>
          <p className="text-base-content/60 text-sm mt-1">{fileName} · {players.length} players</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Potential Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-base-content/60">Show Potential</span>
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-sm"
              checked={showPotential}
              onChange={e => setShowPotential(e.target.checked)}
            />
          </label>
          <button className="btn btn-ghost btn-sm" onClick={reset}>
            Change File
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-bordered mb-6">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab tab-bordered ${activeTab === t.id ? 'tab-active text-primary font-semibold' : 'text-base-content/60'}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab players={players} showPotential={showPotential} />}
      {activeTab === 'development' && <DevelopmentTab players={players} showPotential={showPotential} />}
      {activeTab === 'profile' && <ProfileTab players={players} showPotential={showPotential} />}
      {activeTab === 'compare' && <CompareTab players={players} showPotential={showPotential} />}
      {activeTab === 'contracts' && <ContractsTab players={players} />}
      {activeTab === 'depth' && <DepthTab players={players} />}
    </div>
  )
}