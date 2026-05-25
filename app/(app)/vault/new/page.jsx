'use client'
import { useState } from 'react'
import { addVocab } from '@/lib/vocab'
import { useTheme } from '@/lib/ThemeContext'

const CATEGORIES = ['general', 'tech', 'english', 'ekonomi', 'sains', 'lainnya']
const CAT_COLORS = {
  tech: '#667eea', english: '#4facfe', ekonomi: '#43e97b',
  sains: '#fa709a', lainnya: '#a18cd1', general: '#f093fb'
}

function theme(dark) {
  return {
    bgBase:      dark ? '#0f0f17' : '#f7f8fc',
    bgCard:      dark ? '#1a1a2e' : '#ffffff',
    bgInput:     dark ? '#16162a' : '#fafafe',
    bgPill:      dark ? '#252540' : '#f0f0f8',
    border:      dark ? '#2a2a45' : '#eeeff5',
    textPrimary: dark ? '#e8e8f5' : '#1a1a2e',
    textSub:     dark ? '#a8a8c8' : '#555570',
    textMuted:   dark ? '#5a5a7a' : '#a0a0b8',
  }
}

export default function NewVocabPage() {
  const { dark } = useTheme()
  const c = theme(dark)

  const [form, setForm] = useState({ term: '', definition: '', example: '', category: 'general' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.term || !form.definition) { setError('Kata dan definisi wajib diisi.'); return }
    setLoading(true)
    try { await addVocab(form); window.location.href = '/vault' }
    catch (err) { setError(err.message); setLoading(false) }
  }

  const inp = {
    width: '100%', padding: '11px 13px', fontSize: '14px',
    border: `2px solid ${c.border}`, borderRadius: '11px',
    background: c.bgInput, color: c.textPrimary,
    boxSizing: 'border-box', marginBottom: '16px',
    fontFamily: 'inherit', transition: 'border-color 0.2s'
  }

  return (
    <div style={{ minHeight: '100vh', background: c.bgBase, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', transition: 'background 0.3s' }}>
      <div style={{ width: '100%', maxWidth: '500px', background: c.bgCard, borderRadius: '22px', border: `1.5px solid ${c.border}`, padding: '38px', boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.07)', transition: 'background 0.3s' }}>

        <div style={{ marginBottom: '28px' }}>
          <button onClick={() => window.location.href = '/vault'} style={{ background: 'none', border: 'none', fontSize: '13px', color: c.textMuted, cursor: 'pointer', padding: 0, marginBottom: '14px' }}>
            ← Kembali ke Vault
          </button>
          <h1 style={{ fontSize: '21px', fontWeight: '800', color: c.textPrimary, margin: '0 0 4px' }}>Tambah Kata Baru</h1>
          <p style={{ fontSize: '13px', color: c.textMuted, margin: 0 }}>Tulis definisi dengan bahasamu sendiri</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: c.textSub, marginBottom: '6px' }}>Kata / Istilah *</label>
          <input name="term" value={form.term} onChange={handleChange} placeholder="contoh: Rekursi, Inflasi, API..." style={inp}
            onFocus={e => e.target.style.borderColor = '#667eea'}
            onBlur={e => e.target.style.borderColor = c.border} />

          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: c.textSub, marginBottom: '6px' }}>Definisi *</label>
          <textarea name="definition" value={form.definition} onChange={handleChange} placeholder="Jelaskan dengan bahasamu sendiri..." style={{ ...inp, resize: 'vertical', minHeight: '88px' }}
            onFocus={e => e.target.style.borderColor = '#667eea'}
            onBlur={e => e.target.style.borderColor = c.border} />

          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: c.textSub, marginBottom: '6px' }}>
            Contoh kalimat <span style={{ color: c.textMuted, fontWeight: '400' }}>(opsional)</span>
          </label>
          <textarea name="example" value={form.example} onChange={handleChange} placeholder="Contoh penggunaan..." style={{ ...inp, minHeight: '62px', resize: 'vertical' }}
            onFocus={e => e.target.style.borderColor = '#667eea'}
            onBlur={e => e.target.style.borderColor = c.border} />

          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: c.textSub, marginBottom: '10px' }}>Kategori</label>
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '22px' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} type="button" onClick={() => setForm(prev => ({ ...prev, category: cat }))} className="btn-press" style={{ padding: '6px 14px', fontSize: '13px', fontWeight: '600', borderRadius: '99px', cursor: 'pointer', border: 'none', background: form.category === cat ? CAT_COLORS[cat] : c.bgPill, color: form.category === cat ? '#fff' : c.textMuted, boxShadow: form.category === cat ? `0 2px 8px ${CAT_COLORS[cat]}55` : 'none', transition: 'all 0.2s' }}>
                {cat}
              </button>
            ))}
          </div>

          {error && <div style={{ background: dark ? '#2a1520' : '#fff0f5', border: '1px solid #ffcdd6', borderRadius: '10px', padding: '10px 13px', fontSize: '13px', color: '#e53e3e', marginBottom: '14px' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '9px' }}>
            <button type="button" onClick={() => window.location.href = '/vault'} className="btn-press" style={{ padding: '11px 18px', fontSize: '14px', background: c.bgPill, color: c.textSub, border: `1.5px solid ${c.border}`, borderRadius: '11px', cursor: 'pointer' }}>
              Batal
            </button>
            <button type="submit" disabled={loading} className="btn-press" style={{ flex: 1, padding: '11px', fontSize: '14px', fontWeight: '700', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', borderRadius: '11px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 15px rgba(102,126,234,0.3)' }}>
              {loading ? 'Menyimpan...' : 'Simpan Kata →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}