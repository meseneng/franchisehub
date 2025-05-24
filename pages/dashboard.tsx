import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const currentUser = sessionData?.session?.user

      if (!currentUser) {
        router.push('/login')
        return
      }

      setUser(currentUser)

      const { data: profileData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (error || !profileData) {
        setLoading(false)
        return
      }

      setProfile(profileData)
      setLoading(false)
    }

    fetchData()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <p>Loading...</p>
  if (!profile) return <p>Gagal memuat data. Silakan login ulang.</p>

  return (
    <main style={{ padding: 50 }}>
      <h1>Dashboard FranchiseHub</h1>
      <p>Selamat datang, <strong>{user.email}</strong></p>
      <p>Role: <strong>{profile.role}</strong></p>
      <p>Status Verifikasi: <strong>{profile.is_verified ? 'Terverifikasi' : 'Belum'}</strong></p>
      <p>
        Bergabung sejak:{' '}
        <strong>
          {new Date(profile.joined_at).toLocaleDateString('id-ID', {
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
