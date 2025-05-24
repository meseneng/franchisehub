import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function LoginPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data?.session?.user || null
      setUser(user)

      if (user) {
        router.push('/')
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null
      setUser(user)

      if (user) {
        router.push('/')
      }
    })
  }, [])

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <main style={{ padding: 50 }}>
      <h1>Halaman Login</h1>
      {!user ? (
        <>
          <p>Kamu belum login</p>
          <button onClick={loginWithGoogle}>Login dengan Google</button>
        </>
      ) : (
        <>
          <p>Sudah login sebagai: {user.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </main>
  )
}
