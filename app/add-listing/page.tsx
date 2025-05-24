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
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name.includes('investment') ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user) throw new Error('Gagal ambil user login.')
      const userId = userData.user.id

      let logoUrl = ''
      if (logoFile) {
        const { data, error } = await supabase.storage
          .from('franchisehub')
          .upload(`logos/${Date.now()}-${logoFile.name}`, logoFile)
        if (error) throw new Error('Upload logo gagal.')
        logoUrl = supabase.storage.from('franchisehub').getPublicUrl(data.path).data.publicUrl
      }

      let imageUrl = ''
      if (imageFile) {
        const { data, error } = await supabase.storage
          .from('franchisehub')
          .upload(`images/${Date.now()}-${imageFile.name}`, imageFile)
        if (error) throw new Error('Upload gambar gagal.')
        imageUrl = supabase.storage.from('franchisehub').getPublicUrl(data.path).data.publicUrl
      }

      const newData = {
        ...form,
        user_id: userId,
        logo: logoUrl,
        image: imageUrl,
        is_paid: false,
        is_active: false,
        is_verified: false,
        total_investment: 0,
        view_count: 0,
        published_at: null,
        expires_at: null,
      }

      const { error: insertError } = await supabase.from('franchise_listings').insert([newData])

      if (insertError) {
        console.error('Insert Error:', insertError)
        console.log('Data yang dikirim:', newData)
        setErrorMsg(JSON.stringify(insertError, null, 2)) // TAMPILKAN ERROR DI HALAMAN
        return
      }

      router.push('/dashboard')
    } catch (err: any) {
      console.error('Unexpected Error:', err)
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Tambah Franchise Baru [DEBUG MODE LIVE]</h1>

      {errorMsg && (
        <pre style={{ background: '#fee', padding: '1rem', color: 'red', whiteSpace: 'pre-wrap' }}>
          <strong>Error:</strong><br />
          {errorMsg}
        </pre>
      )}

      <form onSubmit={handleSubmit}>
        <input name="franchise_listing" placeholder="Nama Usaha" onChange={handleChange} required />
        <input name="description" placeholder="Deskripsi" onChange={handleChange} required />
        <input name="category" placeholder="Kategori" onChange={handleChange} required />
        <input type="number" name="investment_start" placeholder="Investasi Awal" onChange={handleChange} required />
        <input type="number" name="investment_end" placeholder="Investasi Maksimal" onChange={handleChange} required />
        <input name="location" placeholder="Lokasi" onChange={handleChange} required />
        <br /><br />
        <label>Logo Franchise:</label>
        <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
        <br />
        <label>Gambar Franchise:</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        <br /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  )
}
