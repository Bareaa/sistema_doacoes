import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { api } from '../services/api';

interface Campaign {
  id: number;
  titulo: string;
  descricao: string;
  meta_arrecadacao: number;
  valor_atual: number;
  data_limite: string;
  status: string;
  categoria: {
    id: number;
    nome: string;
  };
  usuario: {
    nome: string;
  };
}

interface Category {
  id: number;
  nome: string;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
    loadCategories();
  }, [selectedCategory]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const params: any = { status: 'ativa' };
      if (selectedCategory) {
        params.categoria_id = selectedCategory;
      }
      const response = await api.get('/campanhas', { params });
      const campaignsData = response.data.data || response.data;
      setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categorias');
      // A API pode retornar { data: [...] } ou diretamente [...]
      const categoriesData = response.data.data || response.data;
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setCategories([]);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Campanhas Ativas</h1>
        <p className="text-gray-600">Escolha uma causa e ajude a fazer a diferença</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar campanhas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-orange-100">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-600">Nenhuma campanha encontrada</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Link
              key={campaign.id}
              to={`/campanhas/${campaign.id}`}
              className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden hover:shadow-lg transition group"
            >
              <div className="bg-gradient-to-br from-orange-400 to-amber-400 h-48 flex items-center justify-center text-white text-6xl group-hover:scale-105 transition">
                🐾
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                    {campaign.categoria.nome}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {campaign.titulo}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {campaign.descricao}
                </p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">
                      R$ {campaign.valor_atual.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-gray-600">
                      R$ {campaign.meta_arrecadacao.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${getProgress(campaign.valor_atual, campaign.meta_arrecadacao)}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Por {campaign.usuario.nome}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
