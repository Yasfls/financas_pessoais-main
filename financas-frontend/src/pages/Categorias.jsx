import React, { useState, useEffect } from 'react';
import categoriaService from '../services/categoriaService';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({ nome: '', tipo: 'Despesa', descricao: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoriaParaDeletar, setCategoriaParaDeletar] = useState(null);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await categoriaService.getAll();
      setCategorias(data);
    } catch (err) {
      setError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (cat = null) => {
    if (cat) {
      setFormData({ nome: cat.nome || '', tipo: cat.tipo || 'Despesa', descricao: cat.descricao || '' });
      setEditandoId(cat.id);
    } else {
      setFormData({ nome: '', tipo: 'Despesa', descricao: '' });
      setEditandoId(null);
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const fecharModal = () => {
    setShowModal(false);
    setFormData({ nome: '', tipo: 'Despesa', descricao: '' });
    setEditandoId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const max = name === 'descricao' ? 200 : 50;
    setFormData(p => ({ ...p, [name]: value.slice(0, max) }));
  };

  const validar = () => {
    const nome = formData.nome.trim();
    if (!nome || nome.length < 2) {
      setError('Nome deve ter pelo menos 2 caracteres');
      return false;
    }
    if (!['Receita', 'Despesa'].includes(formData.tipo)) {
      setError('Tipo inválido');
      return false;
    }
    return true;
  };

  const salvar = async () => {
    if (!validar()) return;
    try {
      setError('');
      const dados = { nome: formData.nome.trim(), tipo: formData.tipo, descricao: formData.descricao.trim() };
      if (editandoId) {
        await categoriaService.update(editandoId, dados);
        setSuccess('Atualizado!');
      } else {
        await categoriaService.create(dados);
        setSuccess('Criado!');
      }
      await carregarCategorias();
      setTimeout(() => { fecharModal(); setSuccess(''); }, 1500);
    } catch (err) {
      setError(err.response?.status === 401 ? 'Sessão expirada' : 'Erro ao salvar');
    }
  };

  const deletar = async () => {
    if (!categoriaParaDeletar) return;
    try {
      await categoriaService.delete(categoriaParaDeletar.id);
      setSuccess('Excluído!');
      await carregarCategorias();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Erro ao excluir');
    } finally {
      setCategoriaParaDeletar(null);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return <div style={s.load}>Carregando...</div>;

  return (
    <div style={s.c}>
      <div style={s.h}>
        <div><h1 style={s.t}>📂 Categorias</h1></div>
        <button onClick={() => abrirModal()} style={s.bN}>➕ Nova</button>
      </div>

      {error && <div style={s.aE}>⚠️ {error}</div>}
      {success && <div style={s.aS}>✅ {success}</div>}

      <div style={s.g}>
        {categorias.length === 0 ? (
          <div style={s.em}>
            <p style={s.emI}>📋</p>
            <p>Nenhuma categoria</p>
            <button onClick={() => abrirModal()} style={s.bN}>Criar</button>
          </div>
        ) : (
          categorias.map(cat => (
            <div key={cat.id} style={s.cd}>
              <div style={s.cdH}>
                <span style={s.ico}>{cat.tipo === 'Receita' ? '💰' : '💸'}</span>
                <div style={{flex:1}}>
                  <h3 style={s.cdT}>{cat.nome}</h3>
                  <span style={{...s.badge, backgroundColor: cat.tipo === 'Receita' ? '#10b98120' : '#ef444420', color: cat.tipo === 'Receita' ? '#10b981' : '#ef4444'}}>
                    {cat.tipo}
                  </span>
                </div>
              </div>
              {cat.descricao && <p style={s.desc}>{cat.descricao}</p>}
              <div style={s.act}>
                <button onClick={() => abrirModal(cat)} style={s.bE}>✏️</button>
                <button onClick={() => { setCategoriaParaDeletar(cat); setShowDeleteConfirm(true); }} style={s.bD}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div style={s.over} onClick={fecharModal}>
          <div style={s.mod} onClick={e => e.stopPropagation()}>
            <div style={s.mH}>
              <h2>{editandoId ? 'Editar' : 'Nova'}</h2>
              <button onClick={fecharModal} style={s.bC}>✕</button>
            </div>
            <div style={s.form}>
              <div style={s.fg}>
                <label style={s.lbl}>Nome *</label>
                <input name="nome" value={formData.nome} onChange={handleChange} maxLength={50} style={s.inp} placeholder="Ex: Alimentação"/>
                <small>{formData.nome.length}/50</small>
              </div>
              <div style={s.fg}>
                <label style={s.lbl}>Tipo *</label>
                <select name="tipo" value={formData.tipo} onChange={handleChange} style={s.sel}>
                  <option value="Despesa">💸 Despesa</option>
                  <option value="Receita">💰 Receita</option>
                </select>
              </div>
              <div style={s.fg}>
                <label style={s.lbl}>Descrição</label>
                <textarea name="descricao" value={formData.descricao} onChange={handleChange} maxLength={200} style={s.txt} rows={3}/>
                <small>{formData.descricao.length}/200</small>
              </div>
              <div style={s.mA}>
                <button onClick={fecharModal} style={s.bCan}>Cancelar</button>
                <button onClick={salvar} style={s.bSv}>{editandoId ? 'Atualizar' : 'Criar'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div style={s.over} onClick={() => { setCategoriaParaDeletar(null); setShowDeleteConfirm(false); }}>
          <div style={s.conf} onClick={e => e.stopPropagation()}>
            <div style={s.cI}>⚠️</div>
            <h2>Confirmar?</h2>
            <p>Excluir <strong>{categoriaParaDeletar?.nome}</strong>?</p>
            <div style={s.cA}>
              <button onClick={() => { setCategoriaParaDeletar(null); setShowDeleteConfirm(false); }} style={s.bCan}>Cancelar</button>
              <button onClick={deletar} style={s.bD}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  c: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
  h: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' },
  t: { fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: 0 },
  bN: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  load: { textAlign: 'center', padding: '50px', color: '#6b7280', fontSize: '18px' },
  aE: { backgroundColor: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fee2e2' },
  aS: { backgroundColor: '#f0fdf4', color: '#166534', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #bbf7d0' },
  g: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  em: { gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', backgroundColor: '#f9fafb', borderRadius: '12px' },
  emI: { fontSize: '64px', margin: '0 0 15px 0' },
  cd: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' },
  cdH: { display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' },
  ico: { fontSize: '32px' },
  cdT: { fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' },
  badge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  desc: { color: '#6b7280', fontSize: '14px', marginBottom: '15px' },
  act: { display: 'flex', gap: '10px', borderTop: '1px solid #e5e7eb', paddingTop: '15px' },
  bE: { flex: 1, backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' },
  bD: { flex: 1, backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' },
  over: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  mod: { backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' },
  mH: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #e5e7eb' },
  bC: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' },
  form: { padding: '20px' },
  fg: { marginBottom: '20px' },
  lbl: { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' },
  inp: { width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  sel: { width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: 'white' },
  txt: { width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' },
  mA: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '25px' },
  bCan: { backgroundColor: '#f3f4f6', color: '#374151', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
  bSv: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
  conf: { backgroundColor: 'white', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '400px', textAlign: 'center' },
  cI: { fontSize: '48px', marginBottom: '15px' },
  cA: { display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }
};

export default Categorias;