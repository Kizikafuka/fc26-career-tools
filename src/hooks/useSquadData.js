import { useState, useCallback } from 'react'
import { parseCSV } from '../utils/csvParser'
import { mapPlayer } from '../utils/playerMapper'

export function useSquadData() {
  const [players, setPlayers] = useState([])
  const [fileName, setFileName] = useState(null)
  const [error, setError] = useState(null)

  const loadCSV = useCallback((file) => {
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const rows = parseCSV(e.target.result)
        const mapped = rows.map(mapPlayer)
        setPlayers(mapped)
        setFileName(file.name)
      } catch (err) {
        setError('Failed to parse CSV. Pastikan format file benar.')
      }
    }
    reader.readAsText(file)
  }, [])

  const reset = useCallback(() => {
    setPlayers([])
    setFileName(null)
    setError(null)
  }, [])

  return { players, fileName, error, loadCSV, reset }
}