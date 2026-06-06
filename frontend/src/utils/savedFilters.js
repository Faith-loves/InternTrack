const key = 'savedApplicationFilters'

export function getSavedFilters() {
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : []
}

export function saveFilter(filter) {
  const filters = getSavedFilters()
  const nextFilters = [filter, ...filters.filter((item) => item.name !== filter.name)].slice(0, 8)
  localStorage.setItem(key, JSON.stringify(nextFilters))
  return nextFilters
}
