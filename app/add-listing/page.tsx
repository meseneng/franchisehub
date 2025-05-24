'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AddListingPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    franchise_listing: '',
    description: '',
    category: '',
    location: '',
    investment_start: 0,
    investment_end: 0,
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Ambil user ID login
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      alert('Gagal mengambil user.')
      return
    }

    // Upload logo
    let logoUrl = ''
    if (logoFile) {
      const { data, error } = await supabase.storage
        .from('franchisehub')
        .upload(`logos/${Date.now()}-${logoFile.name}`, logoFile)
      if (data) {
        logoUrl = supabase.storage.from('franchisehub').getPublicUrl(data.path).data.publicUrl
      }
    }

    // Upload image
    let imageUrl = ''
    if (imageFile) {
      const { data, error } = await supabase.storage
        .from('franchisehub')
        .upload(`images/${Date.now()}-${imageFile.name}`, imageFile)
      if (data) {
        imageUrl = supabase.storage.from('franchisehub').getPublicUrl(data.path).data.publicUrl
      }
    }

    // Insert data ke tabel franchise_listings
    const { error: insertError } = await supabase.from('franchise_listings').insert([
      {
        ...form,
        user_id: user.id,
        logo: logoUrl,
        image: imageUrl,
        is_paid: false,
        is_active: false,
        is_verified: false,
        total_investment: 0,
        view_count: 0,
        published_at: null,
        expires_at: null,
      },
    ])

    setLoading(false)

    if (insertError) {
      alert('Gagal menambahkan listing: ' + insertError.message)
    } else {
      alert('Berhasil ditambahkan! Menunggu verifikasi admin.')
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Tambah Listing Franchise</h1>
      <form onSubmit={handleSubmit}>
        <input name="franchise_listing" placeholder="Nama Franchise" onChange={handleChange} required />
        <input name="category" placeholder="Kategori" onChange={handleChange} required />
        <input name="location" placeholder="Lokasi" onChange={handleChange} required />
        <input type="number" name="investment_start" placeholder="Investasi Minimum" onChange={handleChange} required />
        <input type="number" name="investment_end" placeholder="Investasi Maksimum" onChange={handleChange} required />
        <textarea name="description" placeholder="Deskripsi" onChange={handleChange} required />
        <br />
        <label>Logo Franchise:</label>
        <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
        <br />
        <label>Gambar Franchise:</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        <br /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Menambahkan...' : 'Tambah Listing'}
        </button>
      </form>
    </div>
  )
}
