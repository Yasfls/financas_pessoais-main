export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateFormat('pt-BR').format(date);
};

export const formatDateToInput = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export const getTipoClass = (tipo) => {
  return tipo === 'Receita' 
    ? 'text-green-600 bg-green-50' 
    : 'text-red-600 bg-red-50';
};

export const getTipoIcon = (tipo) => {
  return tipo === 'Receita' ? '↑' : '↓';
};