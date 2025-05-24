import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const sessionUser = sessionData?.session?.user

      if (!sessionUser) {
        router.push('/login')
        return
      }

      // Ambil data user dari tabel `users`
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionUser.id)
        .single()

      if (error || !userData) {
        console.error(error)
        setUser(null)
      } else {
        setUser(userData)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <p>Loading...</p>

  if (!user) return <p>Gagal memuat data. Silakan login ulang.</p>

  return (
    <main style={{ padding: 50 }}>
      <h1>Dashboard FranchiseHub</h1>
      <p>
        Selamat datang, <strong>{user.email}</strong>
      </p>
      <p>
        Role: <strong>{user.role}</strong>
      </p>
      <p>
        Status Verifikasi:{' '}
        <strong>{user.is_verified ? 'Terverifikasi' : 'Belum'}</strong>
      </p>
      <p>
        Bergabung sejak:{' '}
        <strong>
          {new Date(user.joined_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </strong>
      </p>
      <button onClick={logout}>Logout</button>
    </main>
  )
}
