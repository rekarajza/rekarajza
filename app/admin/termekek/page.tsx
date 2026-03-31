'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  file_url: string | null;
  active: boolean;
  created_at: string;
};

const empty = { name: '', description: '', price: 3500, image_url: '', file_url: '', active: true };

export default function Termekek() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [downloadFile, setDownloadFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const imageRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    setProducts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setImageFile(null);
    setDownloadFile(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description ?? '', price: p.price, image_url: p.image_url ?? '', file_url: p.file_url ?? '', active: p.active });
    setImageFile(null);
    setDownloadFile(null);
    setError('');
    setShowForm(true);
  };

  const uploadFile = async (file: File, bucket: string, folder: string) => {
    const ext = file.name.split('.').pop();
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;
    if (bucket === 'product-images') {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    }
    return path;
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { setError('Név és ár kötelező.'); return; }
    setSaving(true);
    setError('');
    try {
      let image_url = form.image_url;
      let file_url = form.file_url;

      if (imageFile) {
        image_url = await uploadFile(imageFile, 'product-images', 'thumbnails') as string;
      }
      if (downloadFile) {
        file_url = await uploadFile(downloadFile, 'product-files', 'downloads') as string;
      }

      const payload = { name: form.name, description: form.description, price: form.price, image_url, file_url, active: form.active };

      if (editing) {
        await supabase.from('products').update(payload).eq('id', editing.id);
      } else {
        await supabase.from('products').insert(payload);
      }

      setShowForm(false);
      load();
    } catch (e: any) {
      setError(e.message ?? 'Hiba történt.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Biztosan törlöd ezt a terméket?')) return;
    await supabase.from('products').delete().eq('id', id);
    load();
  };

  const toggleActive = async (p: Product) => {
    await supabase.from('products').update({ active: !p.active }).eq('id', p.id);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl">Termékek</h1>
        <button onClick={openNew} className="bg-fern text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-fern/80 transition-colors">
          + Új termék
        </button>
      </div>

      {loading ? (
        <p className="text-dark/50">Betöltés...</p>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-dark/40">Még nincsenek termékek.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-5">
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="w-16 h-16 object-cover rounded-xl" />
              ) : (
                <div className="w-16 h-16 bg-fennel rounded-xl flex items-center justify-center text-dark/30 text-xs">Nincs kép</div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-dark">{p.name}</p>
                <p className="text-sm text-dark/50">{p.price.toLocaleString('hu-HU')} Ft · {p.file_url ? 'Fájl feltöltve' : 'Nincs fájl'}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleActive(p)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${p.active ? 'bg-fern/20 text-fern' : 'bg-dark/10 text-dark/40'}`}
                >
                  {p.active ? 'Aktív' : 'Rejtett'}
                </button>
                <button onClick={() => openEdit(p)} className="text-sm text-dark/50 hover:text-dark transition-colors">Szerkesztés</button>
                <button onClick={() => handleDelete(p.id)} className="text-sm text-peony hover:text-peony/70 transition-colors">Törlés</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-dark/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-6">{editing ? 'Termék szerkesztése' : 'Új termék'}</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-dark/60 block mb-1">Név *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-fennel rounded-xl px-4 py-2 text-sm outline-none focus:border-fern"
                />
              </div>
              <div>
                <label className="text-sm text-dark/60 block mb-1">Leírás</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-fennel rounded-xl px-4 py-2 text-sm outline-none focus:border-fern resize-none"
                />
              </div>
              <div>
                <label className="text-sm text-dark/60 block mb-1">Ár (Ft) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                  className="w-full border border-fennel rounded-xl px-4 py-2 text-sm outline-none focus:border-fern"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-dark block mb-2">Borítókép (ez jelenik meg a boltban)</label>
                {form.image_url && !imageFile && (
                  <img src={form.image_url} alt="" className="w-24 h-24 object-cover rounded-xl mb-3" />
                )}
                {imageFile && (
                  <p className="text-xs text-fern mb-2">Kiválasztva: {imageFile.name}</p>
                )}
                <button
                  type="button"
                  onClick={() => imageRef.current?.click()}
                  className="w-full border-2 border-dashed border-fennel hover:border-fern rounded-xl py-4 text-sm text-dark/60 hover:text-fern transition-colors"
                >
                  🖼 Kattints a kép kiválasztásához
                </button>
                <input ref={imageRef} type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} className="hidden" />
              </div>
              <div>
                <label className="text-sm font-semibold text-dark block mb-2">Letölthető fájl (amit a vevő megkap)</label>
                {form.file_url && !downloadFile && (
                  <p className="text-xs text-fern mb-2">✓ Fájl már feltöltve</p>
                )}
                {downloadFile && (
                  <p className="text-xs text-fern mb-2">Kiválasztva: {downloadFile.name}</p>
                )}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-fennel hover:border-fern rounded-xl py-4 text-sm text-dark/60 hover:text-fern transition-colors"
                >
                  📎 Kattints a fájl kiválasztásához (JPG / PDF)
                </button>
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.pdf,.png,.zip" onChange={e => setDownloadFile(e.target.files?.[0] ?? null)} className="hidden" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={form.active}
                  onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="active" className="text-sm text-dark/60">Aktív (látható a boltban)</label>
              </div>
            </div>

            {error && <p className="text-peony text-sm mt-4">{error}</p>}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-fern text-white py-2 rounded-xl text-sm font-semibold hover:bg-fern/80 transition-colors disabled:opacity-50"
              >
                {saving ? 'Mentés...' : 'Mentés'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-fennel text-dark/60 py-2 rounded-xl text-sm font-semibold hover:bg-fennel/30 transition-colors"
              >
                Mégse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
