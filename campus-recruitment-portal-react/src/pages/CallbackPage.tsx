import { useEffect, useState } from 'react'
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth'
import axios from 'axios'

type UploadUrlResponse = {
  uploadUrl?: string
  url?: string
}

function CallbackPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const user = await getCurrentUser()
        const session = await fetchAuthSession()
        console.log('Login success, current user:', user)
        console.log('Current session:', session)
      } catch (error) {
        console.error('Failed to verify login status:', error)
      }
    }

    void verifyLogin()
  }, [])

  const handleUploadResume = async () => {
    if (!selectedFile) {
      setErrorMessage('Please choose a resume file first.')
      return
    }

    if (selectedFile.type !== 'application/pdf') {
      setErrorMessage('Please upload a PDF file.')
      return
    }

    setIsUploading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const session = await fetchAuthSession()
      const token = session.tokens?.accessToken?.toString() ?? session.tokens?.idToken?.toString()

      if (!token) {
        throw new Error('No auth token found in session')
      }

      const params = new URLSearchParams({
        fileName: selectedFile.name,
        contentType: 'application/pdf',
      })

      const responseFromBackend = await axios.get<UploadUrlResponse>(
        `http://localhost:8080/api/candidates/resume/upload-url?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const uploadUrl = responseFromBackend.data.uploadUrl ?? responseFromBackend.data.url
      if (!uploadUrl) {
        throw new Error('Response does not include uploadUrl')
      }

      await axios.create().put(uploadUrl, selectedFile);

      setSuccessMessage('Resume uploaded successfully.')
    } catch (error) {
      console.error('Resume upload failed:', error)
      const message = error instanceof Error ? error.message : 'Upload failed. Please try again.'
      setErrorMessage(message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-xl bg-white p-6 shadow">
        <p className="text-base font-medium text-slate-700">Upload your resume (PDF)</p>

        <input
          type="file"
          accept=".pdf"
          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-700"
        />

        {selectedFile ? <p className="text-sm text-slate-600">Selected: {selectedFile.name}</p> : null}

        <button
          type="button"
          onClick={handleUploadResume}
          disabled={isUploading || !selectedFile}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isUploading ? 'Uploading...' : 'Upload Resume'}
        </button>

        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
        {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}
      </div>
    </div>
  )
}

export default CallbackPage
