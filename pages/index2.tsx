import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <main style={{ padding: 50 }}>
      <h1>Halo dari FranchiseHub!</h1>
      <p>Ini halaman utama sederhana. Siap online!</p>

      {user ? (
        <>
          <p style={{ marginTop: 20 }}>
            Kamu login sebagai: <strong>{user.email}</strong>
          </p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p style={{ marginTop: 20 }}>
          Kamu belum login. Silakan login dulu di <a href="/login">halaman login</a>.
        </p>
      )}
    </main>
  )
}
