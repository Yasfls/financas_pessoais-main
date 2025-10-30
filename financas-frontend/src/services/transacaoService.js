import api from './api';

const transacaoService = {
  async getAll(filters = {}) {
    const response = await api.get('/Transacoes', { params: filters });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/Transacoes/${id}`);
    return response.data;
  },

  async create(transacao) {
    const response = await api.post('/Transacoes', transacao);
    return response.data;
  },

  async update(id, transacao) {
    const response = await api.put(`/Transacoes/${id}`, transacao);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/Transacoes/${id}`);
    return response.data;
  },

  async getResumo(mes = null, ano = null) {
    const params = {};
    if (mes) params.mes = mes;
    if (ano) params.ano = ano;
    const response = await api.get('/Transacoes/resumo', { params });
    return response.data;
  },
};

export default transacaoService;