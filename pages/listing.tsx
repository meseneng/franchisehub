import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ListingPage() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from('franchise_listings')
        .select('*')
        .eq('is_active', true)

      if (error) {
        console.error('Gagal memuat data:', error.message)
      } else {
        setListings(data)
      }

      setLoading(false)
    }

    fetchListings()
  }, [])

  return (
    <main style={{ padding: 50 }}>
      <h1>Daftar Franchise Aktif</h1>
      {loading ? (
        <p>Loading data...</p>
      ) : listings.length === 0 ? (
        <p>Tidak ada listing aktif saat ini.</p>
      ) : (
        <ul>
          {listings.map((listing) => (
            <li key={listing.id}>
              <strong>{listing.nama_usaha}</strong> <br />
              Kategori: {listing.kategori} <br />
              Lokasi: {listing.lokasi} <br />
              Minimal Investasi: Rp{listing.min_investasi.toLocaleString()} <br />
              Model: {listing.model_operasional}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
