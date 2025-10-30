import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Wallet } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center space-x-2 font-bold text-xl">
            <Wallet size={28} />
            <span>Finanças Pessoais</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="hover:text-blue-200 transition">
              Dashboard
            </Link>
            <Link to="/categorias" className="hover:text-blue-200 transition">
              Categorias
            </Link>
            <Link to="/transacoes" className="hover:text-blue-200 transition">
              Transações
            </Link>

            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-blue-400">
              <span className="text-sm">Olá, {user?.nome}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded transition"
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;