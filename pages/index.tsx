import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const currentUser = sessionData?.session?.user
      setUser(currentUser)

      if (!currentUser) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('email, role, is_verified, joined_at') // <-- Tambahkan joined_at di sini
        .eq('id', currentUser.id)
        .single()

      if (error) {
        console.error('Gagal fetch data user:', error.message)
        setProfile(null)
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    fetchUser()
  }, [])

  if (loading) return <p>Loading...</p>
  if (!user || !profile) return <p>Gagal memuat data. Silakan login ulang.</p>

  return (
    <main style={{ padding: 50 }}>
      <h1>Dashboard FranchiseHub</h1>
      <p>Selamat datang, <strong>{user.email}</strong></p>
      <p>Role: <strong>{profile.role}</strong></p>
      <p>Status Verifikasi: <strong>{profile.is_verified ? 'Sudah' : 'Belum'}</strong></p>
      <p>Bergabung sejak: <strong>{profile.joined_at}</strong></p>
      <button onClick={async () => {
        await supabase.auth.signOut()
        location.reload()
      }}>Logout</button>
    </main>
  )
}
