import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Category {
  id: number;
  nome: string;
}

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    meta_arrecadacao: '',
    data_limite: '',
    categoria_id: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadCategories();
  }, [isAuthenticated, navigate]);

  const loadCategories = async () => {
    try {
      const response = await api.get('/categorias');
      const categoriesData = response.data.data || response.data;
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/campanhas', {
        ...formData,
        meta_arrecadacao: parseFloat(formData.meta_arrecadacao),
        categoria_id: parseInt(formData.categoria_id),
      });
      navigate(`/campanhas/${response.data.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar campanha');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Criar Nova Campanha</h1>
          <p className="text-gray-600">Compartilhe sua causa e faça a diferença</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título da Campanha
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Ex: Ajude a construir um abrigo para animais"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              rows={6}
              placeholder="Conte sobre sua causa, por que ela é importante e como as doações serão utilizadas..."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoria
              </label>
              <select
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Meta de Arrecadação (R$)
              </label>
              <input
                type="number"
                name="meta_arrecadacao"
                value={formData.meta_arrecadacao}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="10000"
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Data Limite
            </label>
            <input
              type="date"
              name="data_limite"
              value={formData.data_limite}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-400"
          >
            {loading ? 'Criando...' : 'Criar Campanha'}
          </button>
        </form>
      </div>
    </div>
  );
}
