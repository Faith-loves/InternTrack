import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button, EmptyState, Input, Select, Table, TableSkeleton, useToast } from '../components'
import { getApiErrorMessage } from '../services/api'
import { applicationService } from '../services/applicationService'
import { applicationSourceOptions, formatDate, formatSalary, getStatusLabel, getStatusTone, statusOptions } from '../utils/applications'
import { isDemoSession } from '../utils/authStorage'
import { demoApplications } from '../utils/demoData'
import { getSavedFilters, saveFilter } from '../utils/savedFilters'

function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [source, setSource] = useState('all')
  const [deadline, setDeadline] = useState('all')
  const [savedFilters, setSavedFilters] = useState(() => getSavedFilters())
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDemo, setIsDemo] = useState(() => isDemoSession())
  const [success] = useState(() => {
    const message = sessionStorage.getItem('successMessage')
    sessionStorage.removeItem('successMessage')
    return message || ''
  })
  const { showToast } = useToast()

  useEffect(() => {
    if (success) {
      showToast(success)
    }
  }, [showToast, success])

  useEffect(() => {
    async function fetchApplications() {
      if (isDemoSession()) {
        setIsDemo(true)
        setApplications(demoApplications)
        setLoading(false)
        return
      }

      try {
        const { data } = await applicationService.getAll()
        setApplications(data)
      } catch (err) {
        const message = getApiErrorMessage(err, 'Failed to load applications')
        setError(message)
        showToast(message, 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [showToast])

  const visibleApplications = isDemo ? demoApplications : applications.length ? applications : demoApplications
  const isShowingDemoData = isDemo || applications.length === 0

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    const filtered = visibleApplications.filter((application) => {
      const matchesSearch =
        application.companyName.toLowerCase().includes(normalizedSearch) ||
        application.jobTitle.toLowerCase().includes(normalizedSearch)
      const matchesStatus = status === 'all' || application.status === status
      const matchesSource = source === 'all' || application.applicationSource === source
      const matchesDeadline = deadline === 'all' || (
        deadline === 'upcoming' &&
        application.applicationDeadline &&
        new Date(application.applicationDeadline) >= new Date()
      ) || (
        deadline === 'overdue' &&
        application.applicationDeadline &&
        new Date(application.applicationDeadline) < new Date()
      )

      return matchesSearch && matchesStatus && matchesSource && matchesDeadline
    })

    return filtered.sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === 'status') return a.status.localeCompare(b.status)
      if (sortBy === 'company') return a.companyName.localeCompare(b.companyName)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [deadline, search, sortBy, source, status, visibleApplications])

  const pageSize = 6
  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginatedApplications = filteredApplications.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function handleSearchChange(event) {
    setSearch(event.target.value)
    setPage(1)
  }

  function handleStatusChange(event) {
    setStatus(event.target.value)
    setPage(1)
  }

  function handleSaveFilter() {
    const name = `Filter ${savedFilters.length + 1}`
    const nextFilters = saveFilter({ name, search, status, source, deadline, sortBy })
    setSavedFilters(nextFilters)
    showToast('Filter saved')
  }

  function applySavedFilter(filter) {
    setSearch(filter.search)
    setStatus(filter.status)
    setSource(filter.source)
    setDeadline(filter.deadline)
    setSortBy(filter.sortBy)
    setPage(1)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Applications</h2>
          <p className="mt-1 text-sm text-slate-500">Track every role, deadline, and application stage.</p>
        </div>
        <Link to="/applications/add">
          <Button className="w-full sm:w-auto">Add application</Button>
        </Link>
      </div>

      {isShowingDemoData && !loading && !error && (
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">{isDemo ? 'Recruiter demo applications are showing from the same data used on the dashboard.' : 'Demo applications are showing so the product does not feel empty.'}</p>
          <p className="mt-1 text-sm text-emerald-700">{isDemo ? 'Offers, interviews, deadlines, recruiter contacts, and follow-ups stay synchronized across the demo.' : 'Add your first real application and these examples will disappear automatically.'}</p>
        </div>
      )}

      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-[1fr_180px_180px_180px_180px]">
        <Input
          id="applicationSearch"
          label="Search"
          placeholder="Search by company or role"
          value={search}
          onChange={handleSearchChange}
        />
        <Select
          id="statusFilter"
          label="Status filter"
          value={status}
          onChange={handleStatusChange}
          options={[{ value: 'all', label: 'All statuses' }, ...statusOptions]}
        />
        <Select
          id="sourceFilter"
          label="Source"
          value={source}
          onChange={(event) => {
            setSource(event.target.value)
            setPage(1)
          }}
          options={[{ value: 'all', label: 'All sources' }, ...applicationSourceOptions.filter((option) => option.value)]}
        />
        <Select
          id="deadlineFilter"
          label="Deadline"
          value={deadline}
          onChange={(event) => {
            setDeadline(event.target.value)
            setPage(1)
          }}
          options={[
            { value: 'all', label: 'All deadlines' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'overdue', label: 'Overdue' },
          ]}
        />
        <Select
          id="sortBy"
          label="Sort by"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          options={[
            { value: 'newest', label: 'Newest first' },
            { value: 'oldest', label: 'Oldest first' },
            { value: 'status', label: 'Status' },
            { value: 'company', label: 'Company' },
          ]}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {savedFilters.map((filter) => (
            <Button key={filter.name} variant="secondary" onClick={() => applySavedFilter(filter)}>
              {filter.name}
            </Button>
          ))}
        </div>
        <Button variant="secondary" onClick={handleSaveFilter}>Save current filter</Button>
      </div>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <EmptyState title="Could not load applications" message={error} />
      ) : filteredApplications.length > 0 ? (
        <>
          <Table
            columns={['Role', 'Company', 'Status', 'Deadline', 'Source', 'Salary', 'Action']}
            rows={paginatedApplications}
            renderRow={(row) => (
              <tr key={row._id}>
                <td className="px-4 py-3 font-medium text-slate-950">{row.jobTitle}</td>
                <td className="px-4 py-3">{row.companyName}</td>
                <td className="px-4 py-3">
                  <Badge tone={getStatusTone(row.status)}>{getStatusLabel(row.status)}</Badge>
                </td>
                <td className="px-4 py-3">{formatDate(row.applicationDeadline)}</td>
                <td className="px-4 py-3">{row.applicationSource || 'Not set'}</td>
                <td className="px-4 py-3">{formatSalary(row)}</td>
                <td className="px-4 py-3">
                  {isShowingDemoData ? (
                    <span className="font-semibold text-slate-400">Demo</span>
                  ) : (
                    <Link className="font-semibold text-emerald-700" to={`/applications/${row._id}`}>
                      View
                    </Link>
                  )}
                </td>
              </tr>
            )}
          />
          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Page {currentPage} of {totalPages} - {filteredApplications.length} applications
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={currentPage === 1} onClick={() => setPage((value) => value - 1)}>
                Previous
              </Button>
              <Button variant="secondary" disabled={currentPage === totalPages} onClick={() => setPage((value) => value + 1)}>
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <EmptyState title="No applications found" message="Try a different search term or status filter." />
      )}
    </div>
  )
}

export default ApplicationsPage
