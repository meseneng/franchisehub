import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null)
    })
  }, [])

  return (
    <main style={{ padding: 50 }}>
      <h1>Halo dari FranchiseHub!</h1>
      <p>Ini halaman utama sederhana. Siap online!</p>

      {user && (
        <p style={{ marginTop: 20 }}>
          Kamu login sebagai: <strong>{user.email}</strong>
        </p>
      )}
    </main>
  )
}
