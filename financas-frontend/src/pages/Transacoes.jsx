import React, { useState, useEffect } from 'react';
import transacaoService from '../services/transacaoService';
import categoriaService from '../services/categoriaService';
import { formatCurrency } from '../utils/formatters';

const Transacoes = () => {
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    tipo: 'Despesa',
    categoriaId: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [transacaoParaDeletar, setTransacaoParaDeletar] = useState(null);
  const [filtros, setFiltros] = useState({
    tipo: '',
    categoriaId: '',
    dataInicio: '',
    dataFim: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError('');
      const [transacoesData, categoriasData] = await Promise.all([
        transacaoService.getAll(),
        categoriaService.getAll()
      ]);
      setTransacoes(transacoesData);
      setCategorias(categoriasData);
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (trans = null) => {
    if (trans) {
      setFormData({
        descricao: trans.descricao || '',
        valor: trans.valor.toString(),
        data: trans.data.split('T')[0],
        tipo: trans.tipo || 'Despesa',
        categoriaId: trans.categoriaId.toString()
      });
      setEditandoId(trans.id);
    } else {
      setFormData({
        descricao: '',
        valor: '',
        data: new Date().toISOString().split('T')[0],
        tipo: 'Despesa',
        categoriaId: categorias.length > 0 ? categorias[0].id.toString() : ''
      });
      setEditandoId(null);
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const fecharModal = () => {
    setShowModal(false);
    setFormData({
      descricao: '',
      valor: '',
      data: new Date().toISOString().split('T')[0],
      tipo: 'Despesa',
      categoriaId: ''
    });
    setEditandoId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'valor') {
      const numValue = value.replace(/[^\d.,]/g, '');
      setFormData(p => ({ ...p, [name]: numValue.slice(0, 15) }));
    } else if (name === 'descricao') {
      setFormData(p => ({ ...p, [name]: value.slice(0, 200) }));
    } else {
      setFormData(p => ({ ...p, [name]: value }));
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(p => ({ ...p, [name]: value }));
  };

  const validar = () => {
    const desc = formData.descricao.trim();
    if (!desc || desc.length < 2) {
      setError('Descrição deve ter pelo menos 2 caracteres');
      return false;
    }
    const valor = parseFloat(formData.valor.replace(',', '.'));
    if (isNaN(valor) || valor <= 0) {
      setError('Valor deve ser maior que zero');
      return false;
    }
    if (!formData.data) {
      setError('Data é obrigatória');
      return false;
    }
    if (!['Receita', 'Despesa'].includes(formData.tipo)) {
      setError('Tipo inválido');
      return false;
    }
    if (!formData.categoriaId) {
      setError('Categoria é obrigatória');
      return false;
    }
    return true;
  };

  const salvar = async () => {
    if (!validar()) return;
    try {
      setError('');
      const dados = {
        descricao: formData.descricao.trim(),
        valor: parseFloat(formData.valor.replace(',', '.')),
        data: formData.data,
        tipo: formData.tipo,
        categoriaId: parseInt(formData.categoriaId)
      };
      if (editandoId) {
        await transacaoService.update(editandoId, dados);
        setSuccess('Transação atualizada!');
      } else {
        await transacaoService.create(dados);
        setSuccess('Transação criada!');
      }
      await carregarDados();
      setTimeout(() => { fecharModal(); setSuccess(''); }, 1500);
    } catch (err) {
      setError(err.response?.status === 401 ? 'Sessão expirada' : 'Erro ao salvar');
    }
  };

  const deletar = async () => {
    if (!transacaoParaDeletar) return;
    try {
      await transacaoService.delete(transacaoParaDeletar.id);
      setSuccess('Transação excluída!');
      await carregarDados();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Erro ao excluir');
    } finally {
      setTransacaoParaDeletar(null);
      setShowDeleteConfirm(false);
    }
  };

  const limparFiltros = () => {
    setFiltros({ tipo: '', categoriaId: '', dataInicio: '', dataFim: '' });
  };

  const transacoesFiltradas = transacoes.filter(t => {
    if (filtros.tipo && t.tipo !== filtros.tipo) return false;
    if (filtros.categoriaId && t.categoriaId.toString() !== filtros.categoriaId) return false;
    if (filtros.dataInicio && t.data < filtros.dataInicio) return false;
    if (filtros.dataFim && t.data > filtros.dataFim) return false;
    return true;
  });

  const getNomeCategoria = (catId) => {
    const cat = categorias.find(c => c.id === catId);
    return cat ? cat.nome : 'Sem categoria';
  };

  const getTipoIcon = (tipo) => tipo === 'Receita' ? '💰' : '💸';

  if (loading) return <div style={s.load}>Carregando...</div>;

  return (
    <div style={s.c}>
      <div style={s.h}>
        <div>
          <h1 style={s.t}>💳 Transações</h1>
          <p style={s.sub}>Gerencie suas receitas e despesas</p>
        </div>
        <button onClick={() => abrirModal()} style={s.bN}>➕ Nova Transação</button>
      </div>

      {error && <div style={s.aE}>⚠️ {error}</div>}
      {success && <div style={s.aS}>✅ {success}</div>}

      <div style={s.filtros}>
        <h3 style={s.filtroTit}>🔍 Filtros</h3>
        <div style={s.filtroGrid}>
          <div>
            <label style={s.lbl}>Tipo</label>
            <select name="tipo" value={filtros.tipo} onChange={handleFiltroChange} style={s.sel}>
              <option value="">Todos</option>
              <option value="Receita">💰 Receita</option>
              <option value="Despesa">💸 Despesa</option>
            </select>
          </div>
          <div>
            <label style={s.lbl}>Categoria</label>
            <select name="categoriaId" value={filtros.categoriaId} onChange={handleFiltroChange} style={s.sel}>
              <option value="">Todas</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={s.lbl}>Data Início</label>
            <input type="date" name="dataInicio" value={filtros.dataInicio} onChange={handleFiltroChange} style={s.inp}/>
          </div>
          <div>
            <label style={s.lbl}>Data Fim</label>
            <input type="date" name="dataFim" value={filtros.dataFim} onChange={handleFiltroChange} style={s.inp}/>
          </div>
        </div>
        <button onClick={limparFiltros} style={s.bLimpar}>🔄 Limpar Filtros</button>
      </div>

      <div style={s.lista}>
        {transacoesFiltradas.length === 0 ? (
          <div style={s.em}>
            <p style={s.emI}>📋</p>
            <p>Nenhuma transação encontrada</p>
            <button onClick={() => abrirModal()} style={s.bN}>Criar Transação</button>
          </div>
        ) : (
          transacoesFiltradas.map(trans => (
            <div key={trans.id} style={{...s.item, borderLeft: `4px solid ${trans.tipo === 'Receita' ? '#10b981' : '#ef4444'}`}}>
              <div style={s.itemH}>
                <div style={s.itemInfo}>
                  <span style={s.itemIcon}>{getTipoIcon(trans.tipo)}</span>
                  <div>
                    <h3 style={s.itemTit}>{trans.descricao}</h3>
                    <p style={s.itemCat}>📂 {getNomeCategoria(trans.categoriaId)}</p>
                  </div>
                </div>
                <div style={s.itemValor}>
                  <span style={{...s.valor, color: trans.tipo === 'Receita' ? '#10b981' : '#ef4444'}}>
                    {trans.tipo === 'Receita' ? '+' : '-'} {formatCurrency(trans.valor)}
                  </span>
                  <span style={s.data}>📅 {new Date(trans.data).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              <div style={s.itemAct}>
                <button onClick={() => abrirModal(trans)} style={s.bE}>✏️ Editar</button>
                <button onClick={() => { setTransacaoParaDeletar(trans); setShowDeleteConfirm(true); }} style={s.bD}>🗑️ Excluir</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div style={s.over} onClick={fecharModal}>
          <div style={s.mod} onClick={e => e.stopPropagation()}>
            <div style={s.mH}>
              <h2>{editandoId ? '✏️ Editar Transação' : '➕ Nova Transação'}</h2>
              <button onClick={fecharModal} style={s.bC}>✕</button>
            </div>
            <div style={s.form}>
              <div style={s.fg}>
                <label style={s.lbl}>Descrição *</label>
                <input name="descricao" value={formData.descricao} onChange={handleChange} maxLength={200} style={s.inp} placeholder="Ex: Supermercado, Salário..."/>
                <small>{formData.descricao.length}/200</small>
              </div>
              <div style={s.fgRow}>
                <div style={s.fg}>
                  <label style={s.lbl}>Valor (R$) *</label>
                  <input name="valor" value={formData.valor} onChange={handleChange} style={s.inp} placeholder="0,00"/>
                </div>
                <div style={s.fg}>
                  <label style={s.lbl}>Data *</label>
                  <input type="date" name="data" value={formData.data} onChange={handleChange} style={s.inp}/>
                </div>
              </div>
              <div style={s.fgRow}>
                <div style={s.fg}>
                  <label style={s.lbl}>Tipo *</label>
                  <select name="tipo" value={formData.tipo} onChange={handleChange} style={s.sel}>
                    <option value="Despesa">💸 Despesa</option>
                    <option value="Receita">💰 Receita</option>
                  </select>
                </div>
                <div style={s.fg}>
                  <label style={s.lbl}>Categoria *</label>
                  <select name="categoriaId" value={formData.categoriaId} onChange={handleChange} style={s.sel}>
                    <option value="">Selecione...</option>
                    {categorias.filter(c => c.tipo === formData.tipo).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={s.mA}>
                <button onClick={fecharModal} style={s.bCan}>Cancelar</button>
                <button onClick={salvar} style={s.bSv}>{editandoId ? '💾 Atualizar' : '➕ Criar'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div style={s.over} onClick={() => { setTransacaoParaDeletar(null); setShowDeleteConfirm(false); }}>
          <div style={s.conf} onClick={e => e.stopPropagation()}>
            <div style={s.cI}>⚠️</div>
            <h2>Confirmar Exclusão?</h2>
            <p>Excluir transação <strong>{transacaoParaDeletar?.descricao}</strong>?</p>
            <p style={s.cW}>⚠️ Esta ação não pode ser desfeita!</p>
            <div style={s.cA}>
              <button onClick={() => { setTransacaoParaDeletar(null); setShowDeleteConfirm(false); }} style={s.bCan}>Cancelar</button>
              <button onClick={deletar} style={s.bD}>🗑️ Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  c: { padding: '20px', maxWidth: '1400px', margin: '0 auto' },
  h: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' },
  t: { fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: 0 },
  sub: { color: '#6b7280', margin: '5px 0 0 0', fontSize: '14px' },
  bN: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  load: { textAlign: 'center', padding: '50px', color: '#6b7280', fontSize: '18px' },
  aE: { backgroundColor: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #fee2e2' },
  aS: { backgroundColor: '#f0fdf4', color: '#166534', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #bbf7d0' },
  filtros: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' },
  filtroTit: { fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: '#1f2937' },
  filtroGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' },
  bLimpar: { backgroundColor: '#f3f4f6', color: '#374151', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' },
  lista: { display: 'flex', flexDirection: 'column', gap: '15px' },
  em: { textAlign: 'center', padding: '60px 20px', backgroundColor: '#f9fafb', borderRadius: '12px' },
  emI: { fontSize: '64px', margin: '0 0 15px 0' },
  item: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' },
  itemH: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', flexWrap: 'wrap', gap: '15px' },
  itemInfo: { display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1 },
  itemIcon: { fontSize: '32px' },
  itemTit: { fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 5px 0' },
  itemCat: { color: '#6b7280', fontSize: '14px', margin: 0 },
  itemValor: { textAlign: 'right' },
  valor: { fontSize: '24px', fontWeight: 'bold', display: 'block', marginBottom: '5px' },
  data: { fontSize: '14px', color: '#6b7280' },
  itemAct: { display: 'flex', gap: '10px', borderTop: '1px solid #e5e7eb', paddingTop: '15px' },
  bE: { flex: 1, backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  bD: { flex: 1, backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  over: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  mod: { backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' },
  mH: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #e5e7eb' },
  bC: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' },
  form: { padding: '20px' },
  fg: { marginBottom: '20px', flex: 1 },
  fgRow: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  lbl: { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' },
  inp: { width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  sel: { width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: 'white' },
  mA: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '25px' },
  bCan: { backgroundColor: '#f3f4f6', color: '#374151', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  bSv: { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  conf: { backgroundColor: 'white', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '400px', textAlign: 'center' },
  cI: { fontSize: '48px', marginBottom: '15px' },
  cW: { color: '#dc2626', fontSize: '14px', fontWeight: '600', marginTop: '10px' },
  cA: { display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }
};

export default Transacoes;