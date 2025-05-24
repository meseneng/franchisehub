import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getSessionAndUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const currentUser = sessionData?.session?.user
      setUser(currentUser)

      if (!currentUser) {
        router.push('/login')
        return
      }

      // Ambil data dari tabel 'users'
      const { data: profileData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      console.log('Supabase error:', error)
      console.log('Supabase data:', profileData)

      if (error || !profileData) {
        setLoading(false)
        return
      }

      setProfile(profileData)
      setLoading(false)
    }

    getSessionAndUser()
  }, [router])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (!profile) {
    return <p>Gagal memuat data. Silakan login ulang.</p>
  }

  const tanggal = new Date(profile.joined_at).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <main style={{ padding: 50 }}>
      <h1>Dashboard FranchiseHub</h1>
      <p>Selamat datang, <strong>{user?.email}</strong></p>
      <p>Role: <strong>{profile.role}</strong></p>
      <p>Status Verifikasi: <strong>{profile.is_verified ? 'Terverifikasi' : 'Belum'}</strong></p>
      <p>Bergabung sejak: <strong>{tanggal}</strong></p>
      <button onClick={logout}>Logout</button>
    </main>
  )
}
