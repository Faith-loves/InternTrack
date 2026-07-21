import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Card, EmptyState, Input, Loader, Select, useToast } from '../components'
import { getApiErrorMessage } from '../services/api'
import { documentService } from '../services/documentService'
import { formatDate } from '../utils/applications'
import { useApplications } from '../hooks/useApplications'
import { isDemoSession } from '../utils/authStorage'
import { createDemoDocument, deleteDemoDocument, getDemoWorkspace } from '../utils/demoWorkspace'

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024

function DocumentsPage() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isDemo, setIsDemo] = useState(() => isDemoSession())
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm({ defaultValues: { documentType: 'CV' } })
  const { showToast } = useToast()
  const { data: applications = [] } = useApplications()
  const visibleApplications = isDemo ? getDemoWorkspace().applications : applications
  const visibleDocuments = documents

  async function refreshDocuments() {
    if (isDemoSession()) {
      setIsDemo(true)
      setDocuments(getDemoWorkspace().documents)
      setError('')
      setLoading(false)
      return
    }

    try {
      const { data } = await documentService.getAll()
      setDocuments(data)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load documents'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function fetchDocuments() {
      if (isDemo) {
        setDocuments(getDemoWorkspace().documents)
        setError('')
        setLoading(false)
        return
      }

      try {
        const { data } = await documentService.getAll()
        setDocuments(data)
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load documents'))
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [isDemo])

  async function onSubmit(values) {
    const file = values.document?.[0]

    try {
      if (isDemo) {
        const fileName = values.fileName.trim() || file?.name || 'Uploaded CV'
        const linkedApplication = visibleApplications.find((application) => application._id === values.linkedApplicationId)
        const workspace = createDemoDocument({
          fileName,
          documentType: values.documentType,
          cvType: values.documentType,
          linkedApplicationId: linkedApplication ? { companyName: linkedApplication.companyName, jobTitle: linkedApplication.jobTitle } : null,
        })
        setDocuments(workspace.documents)
        reset({ documentType: 'CV' })
        setSuccess('Document uploaded successfully')
        setError('')
        showToast('Document uploaded successfully')
        return
      }

      const uploadData = new FormData()
      uploadData.append('document', file)
      uploadData.append('fileName', values.fileName.trim())
      uploadData.append('documentType', values.documentType)
      uploadData.append('cvType', values.documentType)
      if (values.linkedApplicationId) {
        uploadData.append('linkedApplicationId', values.linkedApplicationId)
      }

      await documentService.upload(uploadData)
      reset({ documentType: 'CV' })
      setSuccess('Document uploaded successfully')
      setError('')
      showToast('Document uploaded successfully')
      refreshDocuments()
    } catch (err) {
      const message = getApiErrorMessage(err, 'Failed to upload document')
      setError(message)
      setSuccess('')
      showToast(message, 'error')
    }
  }

  async function handleDelete(id) {
    if (isDemo) {
      const workspace = deleteDemoDocument(id)
      setDocuments(workspace.documents)
      setSuccess('Document deleted successfully')
      setError('')
      showToast('Document deleted successfully')
      return
    }

    try {
      await documentService.remove(id)
      setSuccess('Document deleted successfully')
      setError('')
      showToast('Document deleted successfully')
      refreshDocuments()
    } catch (err) {
      const message = getApiErrorMessage(err, 'Failed to delete document')
      setError(message)
      setSuccess('')
      showToast(message, 'error')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Documents</h2>
        <p className="mt-1 text-sm text-slate-500">Upload CVs locally with Multer for now.</p>
      </div>

      <Card className="p-5">
        <h3 className="mb-4 text-lg font-semibold text-slate-950">Upload document</h3>
        <form className="grid gap-4 md:grid-cols-[1fr_220px]" onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="fileName"
            label="Document name"
            placeholder="Frontend Resume v3.pdf"
            error={errors.fileName?.message}
            {...register('fileName', { required: 'Document name is required' })}
          />
          <Select
            id="documentType"
            label="Type"
            options={[
              { value: 'CV', label: 'CV' },
              { value: 'Cover letter', label: 'Cover letter' },
              { value: 'Portfolio', label: 'Portfolio' },
              { value: 'Certificate', label: 'Certificate' },
              { value: 'Other', label: 'Other' },
            ]}
            {...register('documentType')}
          />
          <Select
            id="linkedApplicationId"
            label="Used for application"
            options={[
              { value: '', label: 'Not linked' },
              ...visibleApplications.map((application) => ({
                value: application._id,
                label: `${application.companyName} - ${application.jobTitle}`,
              })),
            ]}
            {...register('linkedApplicationId')}
          />
          <Input
            id="document"
            label="File"
            type="file"
            error={errors.document?.message}
            {...register('document', {
              onChange: (event) => {
                const file = event.target.files?.[0]
                if (file) setValue('fileName', file.name, { shouldDirty: true, shouldValidate: true })
              },
              validate: {
                required: (files) => files?.length > 0 || 'File is required',
                size: (files) => !files?.[0] || files[0].size <= MAX_UPLOAD_SIZE || 'File size must be 5MB or less',
              },
            })}
          />
          <div className="flex items-end">
            <Button type="submit" className="w-full md:w-auto">Upload</Button>
          </div>
        </form>
        {error && <p className="mt-4 text-sm font-medium text-rose-600">{error}</p>}
        {success && <p className="mt-4 text-sm font-medium text-emerald-700">{success}</p>}
      </Card>

      {loading ? (
        <Loader label="Loading documents" />
      ) : error ? (
        <EmptyState title="Could not load documents" message={error} />
      ) : visibleDocuments.length > 0 ? (
        <Card className="divide-y divide-slate-100">
          {visibleDocuments.map((document) => (
            <div key={document._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h3 className="break-words font-semibold text-slate-950">{document.fileName}</h3>
                <p className="mt-1 text-sm text-slate-500">Uploaded {formatDate(document.uploadedAt)}</p>
                {document.linkedApplicationId && (
                  <p className="mt-1 text-sm text-slate-500">Linked to application: {document.linkedApplicationId.companyName || document.linkedApplicationId}</p>
                )}
                {document.versionHistory?.length > 0 && (
                  <p className="mt-1 text-sm text-slate-500">{document.versionHistory.length} version saved</p>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <span className="w-fit rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  {isDemo ? 'Demo CV' : document.documentType || document.cvType || 'Document'}
                </span>
                <Button variant="danger" className="w-full sm:w-auto" onClick={() => handleDelete(document._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </Card>
      ) : (
        <EmptyState title="No documents yet" message="Upload a CV or cover letter to save it in the backend." />
      )}
    </div>
  )
}

export default DocumentsPage


