// pages/add-listing.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';

export default function AddListing() {
  const router = useRouter();
  const [form, setForm] = useState({
    franchise_listing: '',
    description: '',
    category: '',
    investment_start: 0,
    investment_end: 0,
    location: '',
    contact: '',
    operation_model: 'autopilot',
    is_active: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    const { error } = await supabase.from('franchise_listings').insert([
      {
        ...form,
        user_id: userId,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      alert('Gagal menambahkan listing: ' + error.message);
    } else {
      alert('Berhasil menambahkan listing!');
      router.push('/my-listings');
    }
  };

  return (
    <div>
      <h1>Tambah Franchise</h1>
      <form onSubmit={handleSubmit}>
        <input name="franchise_listing" placeholder="Nama Franchise" onChange={handleChange} required />
        <input name="description" placeholder="Deskripsi" onChange={handleChange} required />
        <input name="category" placeholder="Kategori" onChange={handleChange} required />
        <input name="investment_start" type="number" placeholder="Investasi Awal" onChange={handleChange} required />
        <input name="investment_end" type="number" placeholder="Investasi Maksimal" onChange={handleChange} required />
        <input name="location" placeholder="Lokasi" onChange={handleChange} required />
        <input name="contact" placeholder="Kontak" onChange={handleChange} required />
        <select name="operation_model" onChange={handleChange}>
          <option value="autopilot">Autopilot</option>
          <option value="semi-autopilot">Semi-Autopilot</option>
        </select>
        <label>
          Aktif?
          <input type="checkbox" name="is_active" onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
        </label>
        <button type="submit">Simpan</button>
      </form>
    </div>
  );
}
