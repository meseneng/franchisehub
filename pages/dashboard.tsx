import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const currentUser = data?.session?.user
      if (!currentUser) {
        router.push('/login')
        return
      }
      setUser(currentUser)

      // Ambil data tambahan dari tabel `users`
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      setProfile(profileData)
    })
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user || !profile) return <p>Loading...</p>

  return (
    <main style={{ padding: 50 }}>
      <h1>Dashboard FranchiseHub</h1>
      <p>Selamat datang, <strong>{profile.email}</strong></p>
      <p>Role kamu: <strong>{profile.role}</strong></p>
      <p>Status verifikasi: <strong>{profile.is_verified ? 'Terverifikasi' : 'Belum'}</strong></p>
      <p>Bergabung sejak: <strong>{new Date(profile.joined_at).toLocaleString()}</strong></p>
      <br />
      <button onClick={logout}>Logout</button>
    </main>
  )
}
