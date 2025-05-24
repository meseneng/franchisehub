import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function MyListingsPage() {
  const [user, setUser] = useState<any>(null)
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Ambil session & user login
    const getUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/login')
        return
      }

      setUser(session.user)

      // Fetch listing milik user ini
      const { data, error } = await supabase
        .from('franchise_listings')
        .select('id, franchise_listing, category, location, is_active')
        .eq('user_id', session.user.id)

      if (error) {
        console.error('Error fetching listings:', error.message)
      } else {
        setListings(data || [])
      }

      setLoading(false)
    }

    getUserData()
  }, [router])

  return (
    <main style={{ padding: 50 }}>
      <h1>Listing Saya</h1>
      {loading ? (
        <p>Memuat...</p>
      ) : listings.length === 0 ? (
        <p>Kamu belum membuat listing franchise.</p>
      ) : (
        <ul>
          {listings.map((item) => (
            <li key={item.id} style={{ marginBottom: 20 }}>
              <strong>{item.franchise_listing}</strong> – {item.category} ({item.location})<br />
              Status: {item.is_active ? 'Aktif' : 'Nonaktif'}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
