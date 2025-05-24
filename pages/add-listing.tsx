'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AddListingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    franchise_listing: '',
    description: '',
    category: '',
    location: '',
    investment_start: 0,
    investment_end: 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.from('franchise_listings').insert([
      {
        ...form,
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

    if (error) {
      alert('Gagal menambahkan listing: ' + error.message)
    } else {
      alert('Berhasil ditambahkan! Menunggu verifikasi admin.')
      router.push('/dashboard')
    }
  }

  return (
    <div>
      <h1>Tambah Listing Franchise</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="franchise_listing"
          placeholder="Nama Franchise"
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Kategori"
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Lokasi"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="investment_start"
          placeholder="Investasi Minimum"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="investment_end"
          placeholder="Investasi Maksimum"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Deskripsi"
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Menambahkan...' : 'Tambah Listing'}
        </button>
      </form>
    </div>
  )
}
