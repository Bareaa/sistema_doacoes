import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Campaign {
  id: number;
  titulo: string;
  descricao: string;
  meta_arrecadacao: number;
  valor_atual: number;
  data_limite: string;
  status: string;
  categoria: {
    nome: string;
  };
}

export default function MyCampaigns() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadMyCampaigns();
  }, [isAuthenticated, navigate]);

  const loadMyCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get('/campanhas', {
        params: { usuario_id: user?.id },
      });
      setCampaigns(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta campanha?')) {
      return;
    }

    try {
      await api.delete(`/campanhas/${id}`);
      loadMyCampaigns();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao excluir campanha');
    }
  };

  const getProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Minhas Campanhas</h1>
          <p className="text-gray-600">Gerencie suas campanhas de doação</p>
        </div>
        <Link
          to="/criar-campanha"
          className="flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Campanha</span>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-orange-100">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-600 mb-4">Você ainda não criou nenhuma campanha</p>
          <Link
            to="/criar-campanha"
            className="inline-flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
          >
            <Plus className="h-5 w-5" />
            <span>Criar Primeira Campanha</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-xl shadow-sm border border-orange-100 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                      {campaign.categoria.nome}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        campaign.status === 'ativa'
                          ? 'bg-green-100 text-green-600'
                          : campaign.status === 'concluida'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </div>
                  <Link
                    to={`/campanhas/${campaign.id}`}
                    className="text-2xl font-bold text-gray-800 hover:text-orange-600 transition"
                  >
                    {campaign.titulo}
                  </Link>
                  <p className="text-gray-600 mt-2 line-clamp-2">{campaign.descricao}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => navigate(`/campanhas/${campaign.id}`)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                    title="Editar"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(campaign.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Excluir"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">
                    R$ {campaign.valor_atual.toLocaleString('pt-BR')} arrecadados
                  </span>
                  <span className="text-gray-600">
                    Meta: R$ {campaign.meta_arrecadacao.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${getProgress(campaign.valor_atual, campaign.meta_arrecadacao)}%`,
                    }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Prazo: {new Date(campaign.data_limite).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
