import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function DashboardPage() {
  const [sessionUser, setSessionUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUserData = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      const currentUser = sessionData?.session?.user
      if (!currentUser) {
        router.push('/login')
        return
      }
      setSessionUser(currentUser)

      // Ambil data dari public.users
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (error) {
        console.error(error)
        setLoading(false)
        return
      }

      setUserData(data)
      setLoading(false)
    }

    getUserData()
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
      <p>Selamat datang, <strong>{sessionUser.email}</strong></p>
      <p>Role: <strong>{userData.role}</strong></p>
      <p>Status Verifikasi: <strong>{userData.is_verified ? 'Terverifikasi' : 'Belum'}</strong></p>
      <p>Bergabung sejak: <strong>{new Date(userData.joined_at).toLocaleString('id-ID')}</strong></p>
      <button onClick={logout}>Logout</button>
    </main>
  )
}
