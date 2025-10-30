import api from './api';

const categoriaService = {
  async getAll(tipo = null) {
    const params = tipo ? { tipo } : {};
    const response = await api.get('/Categorias', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/Categorias/${id}`);
    return response.data;
  },

  async create(categoria) {
    const response = await api.post('/Categorias', categoria);
    return response.data;
  },

  async update(id, categoria) {
    const response = await api.put(`/Categorias/${id}`, categoria);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/Categorias/${id}`);
    return response.data;
  },
};

export default categoriaService;