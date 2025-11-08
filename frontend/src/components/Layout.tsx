import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogOut, User, Plus, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <nav className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-orange-500" fill="currentColor" />
                <span className="text-2xl font-bold text-orange-600">Ajude+</span>
              </Link>
              <Link
                to="/"
                className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition"
              >
                <Home className="h-4 w-4" />
                <span>Início</span>
              </Link>
              <Link
                to="/campanhas"
                className="text-gray-700 hover:text-orange-600 transition"
              >
                Campanhas
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/criar-campanha"
                    className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Criar Campanha</span>
                  </Link>
                  <Link
                    to="/minhas-campanhas"
                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition"
                  >
                    <User className="h-4 w-4" />
                    <span>{user?.nome}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-orange-600 transition"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/registro"
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-orange-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 Ajude+. Transformando vidas através da solidariedade.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
