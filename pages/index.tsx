import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

type UserData = {
  id: string
  email: string
  role: string
  is_verified: boolean
  joined_at: string
}

export default function Home() {
  const [sessionUser, setSessionUser] = useState<any>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user
      setSessionUser(user)

      if (!user) {
        router.push('/login')
        return
      }

      const { data: userDetails, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Gagal fetch user data:', error)
      } else {
        setUserData(userDetails)
      }
    })
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!sessionUser || !userData) return <p>Loading...</p>

  return (
    <main style={{ padding: 50 }}>
      <h1>Halo dari FranchiseHub!</h1>
      <p>Ini halaman utama sederhana. Siap online!</p>
      <p>Kamu login sebagai: <strong>{userData.email}</strong></p>
      <p>Role: {userData.role}</p>
      <p>Verified: {userData.is_verified ? 'Ya' : 'Belum'}</p>
      <p>Bergabung sejak: {new Date(userData.joined_at).toLocaleString()}</p>
      <button onClick={logout}>Logout</button>
    </main>
  )
}
