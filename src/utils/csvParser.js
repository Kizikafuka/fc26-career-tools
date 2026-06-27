export function parseCSVLine(line) {
  const result = []
  let inQuote = false, cur = ''
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') { cur += '"'; i++ }
      else inQuote = !inQuote
    } else if (ch === ',' && !inQuote) {
      result.push(cur); cur = ''
    } else cur += ch
  }
  result.push(cur)
  return result
}

export function parseCSV(raw) {
  const lines = raw.trim().split('\n')
  const headers = parseCSVLine(lines[0])
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    const vals = parseCSVLine(lines[i])
    const obj = {}
    headers.forEach((h, j) => {
      obj[h.trim()] = vals[j] !== undefined ? vals[j].trim() : ''
    })
    rows.push(obj)
  }
  return rows
}