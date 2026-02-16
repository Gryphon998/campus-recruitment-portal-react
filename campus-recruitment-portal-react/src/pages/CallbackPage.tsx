import { useEffect } from 'react'
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth'

function CallbackPage() {
  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const user = await getCurrentUser()
        const session = await fetchAuthSession()

        console.log('登录成功，当前用户:', user)
        console.log('当前会话信息:', session)
      } catch (error) {
        console.error('登录状态确认失败:', error)
      }
    }

    void verifyLogin()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <p className="text-base font-medium text-slate-700">正在加载个人资料...</p>
    </div>
  )
}

export default CallbackPage
