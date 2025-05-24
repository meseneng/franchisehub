import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient'; // ✅ PENTING: ini sudah benar

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      alert('Harus login terlebih dahulu.');
      return;
    }

    const { error } = await supabase.from('franchise_listings').insert([
      {
        user_id: user.id,
        franchise_listing: formData.franchise_listing,
        description: formData.description,
        category: formData.category,
        investment_start: parseInt(formData.investment_start),
        investment_end: parseInt(formData.investment_end),
        location: formData.location,
        operation_model: formData.operation_model,
        is_active: formData.is_active,
      },
    ]);

    if (error) {
      alert('Gagal menyimpan: ' + error.message);
    } else {
      router.push('/my-listings');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Tambah Franchise</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="franchise_listing" placeholder="Nama Usaha" required onChange={handleChange} /><br />
        <input type="text" name="description" placeholder="Deskripsi" required onChange={handleChange} /><br />
        <input type="text" name="category" placeholder="Kategori" required onChange={handleChange} /><br />
        <input type="number" name="investment_start" placeholder="Investasi Mulai" required onChange={handleChange} /><br />
        <input type="number" name="investment_end" placeholder="Investasi Maksimal" required onChange={handleChange} /><br />
        <input type="text" name="location" placeholder="Lokasi" required onChange={handleChange} /><br />
        
        <select name="operation_model" onChange={handleChange}>
          <option value="autopilot">Autopilot</option>
          <option value="semi-autopilot">Semi-Autopilot</option>
        </select><br />

        <button type="submit">Simpan</button>
      </form>
    </div>
  );
}
