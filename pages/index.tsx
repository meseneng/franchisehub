import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const currentUser = data?.session?.user
      setUser(currentUser)

      if (!currentUser) {
        router.push('/login')
        return
      }

      // Ambil data user dari tabel public.users
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (error || !profile) {
        console.error('Gagal ambil data user:', error)
        setUserData(null)
      } else {
        setUserData(profile)
      }

      setLoading(false)
    })
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <p>Loading...</p>
  if (!userData) return <p>Gagal memuat data. Silakan login ulang.</p>

  return (
    <main style={{ padding: 50 }}>
      <h1>Dashboard FranchiseHub</h1>
      <p>Selamat datang, <strong>{user.email}</strong></p>
      <p>Role: <strong>{userData.role}</strong></p>
      <p>Status Verifikasi: <strong>{userData.is_verified ? 'Terverifikasi' : 'Belum'}</strong></p>
      <p>
        Bergabung sejak:{' '}
        <strong>
          {userData.joined_at
            ? new Date(userData.joined_at).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Tanggal tidak tersedia'}
        </strong>
      </p>
      <button onClick={logout}>Logout</button>
    </main>
  )
}
