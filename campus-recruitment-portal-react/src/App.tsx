import { useMemo } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Amplify } from 'aws-amplify'
import HomePage from './pages/HomePage'
import CallbackPage from './pages/CallbackPage'

function App() {
  const amplifyConfigured = useMemo(() => {
    const region = import.meta.env.VITE_AWS_REGION
    const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID
    const userPoolClientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN

    if (!region || !userPoolId || !userPoolClientId || !cognitoDomain) {
      console.warn('Amplify Auth 未完成配置，请检查 VITE_ 环境变量。')
      return false
    }

    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
          userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
          loginWith: {
            oauth: {
              domain: import.meta.env.VITE_COGNITO_DOMAIN,
              scopes: ['email', 'openid', 'profile'],
              redirectSignIn: ['http://localhost:3000/auth/callback'],
              redirectSignOut: ['http://localhost:3000/'],
              responseType: 'code'
            }
          }
        }
      }
    })

    return true
  }, [])

  return (
    <BrowserRouter>
      {!amplifyConfigured ? (
        <div className="min-h-screen bg-slate-100 px-6 py-16">
          <div className="mx-auto max-w-2xl rounded-xl border border-amber-300 bg-amber-50 p-6 text-amber-900 shadow-sm">
            <h1 className="text-xl font-semibold">Amplify 手动配置缺失</h1>
            <p className="mt-3 text-sm">
              请在 .env 中配置以下变量：
              VITE_AWS_REGION、VITE_COGNITO_USER_POOL_ID、VITE_COGNITO_USER_POOL_CLIENT_ID、VITE_COGNITO_DOMAIN。
            </p>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/callback" element={<CallbackPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App
