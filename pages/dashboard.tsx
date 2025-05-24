import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const sessionUser = sessionData?.session?.user
      setUser(sessionUser)

      if (sessionUser) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', sessionUser.id)
          .single()

        if (error) console.error('Gagal ambil data user:', error)
        else setUserData(data)
      }
    }

    fetchUser()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login')
  }

  if (!user) {
    return (
      <main style={{ padding: 50 }}>
        <h1>Halo dari FranchiseHub!</h1>
        <p>Ini halaman utama sederhana. Siap online!</p>
        <p>Kamu belum login. Silakan login dulu di <a href="/login">halaman login</a>.</p>
      </main>
    )
  }

  return (
    <main style={{ padding: 50 }}>
      <h1>Halo dari FranchiseHub!</h1>
      <p>Ini halaman utama sederhana. Siap online!</p>
      <p>Kamu login sebagai: <strong>{user.email}</strong></p>

      {userData && (
        <>
          <p>Peran: <strong>{userData.role}</strong></p>
          <button onClick={() => router.push('/dashboard')}>Go to Dashboard</button>
        </>
      )}

      <br />
      <button onClick={logout}>Logout</button>
    </main>
  )
}
