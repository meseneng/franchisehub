import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const currentUser = data?.session?.user
      if (!currentUser) {
        router.push('/login')
        return
      }

      setUser(currentUser)

      // Ambil data dari tabel users (custom)
      const { data: profileData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (error) {
        console.error('Gagal ambil data profil:', error.message)
      } else {
        setProfile(profileData)
      }

      setLoading(false)
    })
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <p>Loading...</p>
  if (!user || !profile) return <p>Gagal memuat data. Silakan login ulang.</p>

  return (
    <main style={{ padding: 50 }}>
      <h1>Dashboard FranchiseHub</h1>
      <p>Selamat datang, <strong>{user.email}</strong></p>
      <p>Role: <strong>{profile.role}</strong></p>
      <p>Status Verifikasi: <strong>{profile.is_verified ? 'Terverifikasi' : 'Belum'}</strong></p>
      <p>Bergabung sejak: <strong>{new Date(profile.joined_at).toLocaleString()}</strong></p>

      <button onClick={logout} style={{ marginTop: 20 }}>Logout</button>
    </main>
  )
}
