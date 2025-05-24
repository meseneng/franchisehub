import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ListingPage() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from('franchise_listings')
        .select('id, franchise_listing, description, category, location, investment_start, investment_end, operation_model, image')
        .eq('is_active', true)

      if (error) {
        console.error('Gagal memuat data:', error.message)
      } else {
        setListings(data || [])
      }

      setLoading(false)
    }

    fetchListings()
  }, [])

  return (
    <main style={{ padding: 50 }}>
      <h1>Daftar Franchise Aktif</h1>
      {loading ? (
        <p>Memuat data...</p>
      ) : listings.length === 0 ? (
        <p>Tidak ada listing aktif.</p>
      ) : (
        <ul>
          {listings.map((item) => (
            <li key={item.id} style={{ marginBottom: 30 }}>
              <h2>{item.franchise_listing}</h2>
              <p><strong>Kategori:</strong> {item.category}</p>
              <p><strong>Lokasi:</strong> {item.location}</p>
              <p><strong>Investasi:</strong> Rp{item.investment_start.toLocaleString()} – Rp{item.investment_end.toLocaleString()}</p>
              <img src={item.image} alt={item.franchise_listing} width={300} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
