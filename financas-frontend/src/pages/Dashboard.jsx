import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import transacaoService from '../services/transacaoService';
import { formatCurrency } from '../utils/formatters';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';

const Dashboard = () => {
  const { user } = useAuth();
  const [resumo, setResumo] = useState({
    totalReceitas: 0,
    totalDespesas: 0,
    saldo: 0,
    quantidadeTransacoes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarResumo();
  }, []);

  const carregarResumo = async () => {
    try {
      setLoading(true);
      const data = await transacaoService.getResumoMensal();
      setResumo(data);
    } catch (error) {
      console.error('Erro ao carregar resumo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      
      <div className="ml-0 lg:ml-64 p-8 transition-all duration-300">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Dashboard Financeiro
          </h1>
          <p className="text-gray-600">
            Bem-vindo de volta, <span className="font-semibold">{user?.nome}</span>!
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card Receitas */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <ArrowUpCircle size={32} />
              </div>
              <TrendingUp size={24} className="opacity-80" />
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-2">Receitas</h3>
            <p className="text-4xl font-bold mb-2" style={{ color: '#1F2937' }}>
              {loading ? '...' : formatCurrency(resumo.totalReceitas)}
            </p>
            <p className="text-sm opacity-75" style={{ color: '#374151' }}>
              {resumo.quantidadeTransacoes} transações
            </p>
          </div>

          {/* Card Despesas */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <ArrowDownCircle size={32} />
              </div>
              <TrendingDown size={24} className="opacity-80" />
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-2">Despesas</h3>
            <p className="text-4xl font-bold mb-2" style={{ color: '#1F2937' }}>
              {loading ? '...' : formatCurrency(resumo.totalDespesas)}
            </p>
            <p className="text-sm opacity-75" style={{ color: '#374151' }}>
              0 transações
            </p>
          </div>

          {/* Card Saldo */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                <Wallet size={32} />
              </div>
              <DollarSign size={24} className="opacity-80" />
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-2">Saldo</h3>
            <p className="text-4xl font-bold mb-2" style={{ color: '#1F2937' }}>
              {loading ? '...' : formatCurrency(resumo.saldo)}
            </p>
            <p className="text-sm opacity-75" style={{ color: '#374151' }}>
              {resumo.saldo >= 0 ? 'Positivo' : 'Negativo'}
            </p>
          </div>
        </div>

        {/* Dicas de Economia */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
              <DollarSign className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Dicas de Economia</h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-gray-700">
              <span className="text-emerald-500 font-bold">✓</span>
              Registre todas as suas despesas diariamente
            </li>
            <li className="flex items-start gap-2 text-gray-700">
              <span className="text-emerald-500 font-bold">✓</span>
              Defina metas de economia mensais
            </li>
            <li className="flex items-start gap-2 text-gray-700">
              <span className="text-emerald-500 font-bold">✓</span>
              Evite compras por impulso
            </li>
            <li className="flex items-start gap-2 text-gray-700">
              <span className="text-emerald-500 font-bold">✓</span>
              Revise seus gastos semanalmente
            </li>
          </ul>
        </div>

        {/* Status Financeiro */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Status Financeiro</h2>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border-l-4 border-emerald-500">
            <p className="font-semibold text-emerald-700 mb-2">✓ Situação Positiva</p>
            <p className="text-gray-700 text-sm">
              Suas receitas estão superando as despesas. Continue assim!
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Total de Transações</span>
              <span className="font-bold text-gray-900">{resumo.quantidadeTransacoes}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Média de Despesas</span>
              <span className="font-bold text-gray-900">{formatCurrency(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;