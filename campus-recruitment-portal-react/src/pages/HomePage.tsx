import { useEffect, useState } from 'react'
import { getCurrentUser, signInWithRedirect } from '@aws-amplify/auth'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const checkSignedInUser = async () => {
      try {
        await getCurrentUser()
        navigate('/auth/callback', { replace: true })
      } catch {
        // No signed-in user, stay on login page.
      }
    }

    void checkSignedInUser()
  }, [navigate])

  const handleGoogleLogin = async () => {
    setErrorMessage('')

    try {
      await signInWithRedirect({ provider: 'Google' })
    } catch (error) {
      console.error('Google login redirect failed:', error)
      const message = error instanceof Error ? error.message : 'Google login redirect failed.'
      if (message.includes('There is already a signed in user')) {
        navigate('/auth/callback', { replace: true })
        return
      }

      setErrorMessage(`${message} Please check Cognito callback URL settings.`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100 px-6 py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-white/70 bg-white/90 p-10 text-center shadow-xl backdrop-blur">
        <p className="mb-2 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700">
          Campus Recruitment Portal
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-800">Continue with Google</h1>
        <p className="mt-3 text-sm text-slate-600">
          After sign-in, you will be redirected to callback page and Amplify will process the OAuth
          code.
        </p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 48 48"
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.5 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.9 6.1C12.4 13.2 17.7 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.5 24.5c0-1.6-.1-3-.4-4.5H24v8.5h12.7c-.5 2.8-2.1 5.2-4.5 6.8l7 5.4c4.1-3.8 6.5-9.4 6.5-16.2z"
            />
            <path
              fill="#FBBC05"
              d="M10.5 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.7l7.9-6.1z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.3 0 11.6-2.1 15.4-5.8l-7-5.4c-2 1.4-4.6 2.2-8.4 2.2-6.3 0-11.6-3.7-13.5-9.9l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
            />
          </svg>
          Sign in with Google
        </button>

        {errorMessage ? <p className="mt-4 text-sm text-red-600">{errorMessage}</p> : null}
      </div>
    </div>
  )
}

export default HomePage
