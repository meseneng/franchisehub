// pages/add-listing.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient'; // ✅ gunakan dari folder lib

export default function AddListing() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    franchise_listing: '',
    description: '',
    category: '',
    investment_start: '',
    investment_end: '',
    location: '',
    operation_model: 'autopilot', // default
    is_active: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      alert('Harus login untuk menambahkan listing.');
      return;
    }

    const { error } = await supabase.from('franchise_listings').insert({
      user_id: user.id,
      franchise_listing: formData.franchise_listing,
      description: formData.description,
      category: formData.category,
      investment_start: parseInt(formData.investment_start),
      investment_end: parseInt(formData.investment_end),
      location: formData.location,
      operation_model: formData.operation_model,
      is_active: formData.is_active,
    });

    if (error) {
      console.error('Gagal insert:', error);
      alert('Gagal menambahkan listing.');
    } else {
      alert('Listing berhasil ditambahkan!');
      router.push('/my-listings');
    }
  };

  return (
    <div>
      <h1>Tambah Franchise Baru</h1>
      <form onSubmit={handleSubmit}>
        <input name="franchise_listing" placeholder="Nama Usaha" onChange={handleChange} required />
        <textarea name="description" placeholder="Deskripsi" onChange={handleChange} required />
        <input name="category" placeholder="Kategori" onChange={handleChange} required />
        <input name="investment_start" placeholder="Investasi Awal" type="number" onChange={handleChange} required />
        <input name="investment_end" placeholder="Investasi Maksimal" type="number" onChange={handleChange} required />
        <input name="location" placeholder="Lokasi" onChange={handleChange} required />
        <button type="submit">Simpan</button>
      </form>
    </div>
  );
}
