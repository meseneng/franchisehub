import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function LoginPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data?.session?.user
      setUser(currentUser)

      // Jika sudah login, langsung ke dashboard
      if (currentUser) {
        router.push('/dashboard')
      }
    })

    // Dengarkan perubahan login
    supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user
      setUser(currentUser)

      if (currentUser) {
        router.push('/dashboard')
      }
    })
  }, [])

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <main style={{ padding: 50 }}>
      <h1>Login ke FranchiseHub</h1>
      <p>Silakan login dengan Google untuk melanjutkan.</p>
      <button onClick={loginWithGoogle}>Login dengan Google</button>
    </main>
  )
}
