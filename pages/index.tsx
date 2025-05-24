import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUserData = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const sessionUser = sessionData?.session?.user

      if (!sessionUser) {
        setLoading(false)
        return
      }

      // Ambil data dari tabel `users`
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionUser.id)
        .single() // penting agar tidak loop

      if (error) {
        console.error('Gagal mengambil data user:', error)
      } else {
        setUser(data)
      }

      setLoading(false)
    }

    getUserData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.reload()
  }

  if (loading) return <p>Loading...</p>

  return (
    <main style={{ padding: 50 }}>
      <h1>Halo dari FranchiseHub!</h1>
      <p>Ini halaman utama sederhana. Siap online!</p>

      {!user ? (
        <p>
          Kamu belum login. Silakan login dulu di{' '}
          <a href="/login" style={{ color: 'blue' }}>halaman login</a>.
        </p>
      ) : (
        <>
          <p>
            Kamu login sebagai: <strong>{user.email}</strong>
          </p>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </main>
  )
}
