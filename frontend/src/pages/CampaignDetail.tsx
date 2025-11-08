import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Heart, MessageCircle, Edit2, Trash2 } from 'lucide-react';
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
  usuario: {
    id: number;
    nome: string;
  };
}

interface Comment {
  id: number;
  texto: string;
  data: string;
  usuario_id: number;
  campanha_id: number;
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState(false);
  const [error, setError] = useState('');
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  useEffect(() => {
    console.log('CampaignDetail - User from context:', user);
    console.log('CampaignDetail - isAuthenticated:', isAuthenticated);
    loadCampaign();
    loadComments();
  }, [id]);

  useEffect(() => {
    console.log('CampaignDetail - User changed:', user);
  }, [user]);

  const loadCampaign = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/campanhas/${id}`);
      setCampaign(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar campanha:', error);
      navigate('/campanhas');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setError('');
    setDonating(true);

    try {
      await api.post(`/campanhas/${id}/doacoes`, {
        valor: parseFloat(donationAmount),
        mensagem_apoio: donationMessage || undefined,
      });
      
      setDonationAmount('');
      setDonationMessage('');
      loadCampaign();
      alert('Doação realizada com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao realizar doação');
    } finally {
      setDonating(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await api.get(`/campanhas/${id}/comentarios`);
      const commentsData = response.data.data || response.data;
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setCommentError('');
    setCommentLoading(true);

    try {
      await api.post(`/campanhas/${id}/comentarios`, {
        texto: commentText,
      });
      
      setCommentText('');
      loadComments();
    } catch (err: any) {
      setCommentError(err.response?.data?.message || 'Erro ao adicionar comentário');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleEditComment = async (commentId: number) => {
    setCommentError('');
    setCommentLoading(true);

    try {
      await api.put(`/comentarios/${commentId}`, {
        texto: editingCommentText,
      });
      
      setEditingCommentId(null);
      setEditingCommentText('');
      loadComments();
    } catch (err: any) {
      setCommentError(err.response?.data?.message || 'Erro ao editar comentário');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este comentário?')) {
      return;
    }

    setCommentError('');
    setCommentLoading(true);

    try {
      await api.delete(`/comentarios/${commentId}`);
      await loadComments();
      alert('Comentário deletado com sucesso!');
    } catch (err: any) {
      console.error('Erro ao deletar comentário:', err);
      setCommentError(err.response?.data?.message || 'Erro ao deletar comentário');
    } finally {
      setCommentLoading(false);
    }
  };

  const startEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.texto);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const getProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
        <div className="bg-gradient-to-br from-orange-400 to-amber-400 h-64 flex items-center justify-center text-white text-9xl">
          🐾
        </div>
        
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded">
              {campaign.categoria.nome}
            </span>
            <span
              className={`text-sm font-semibold px-3 py-1 rounded ${
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

          <h1 className="text-4xl font-bold text-gray-800 mb-4">{campaign.titulo}</h1>
          
          <div className="flex items-center space-x-6 text-gray-600 mb-6">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Por {campaign.usuario.nome}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Até {new Date(campaign.data_limite).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-3xl font-bold text-gray-800">
                  R$ {campaign.valor_atual.toLocaleString('pt-BR')}
                </div>
                <div className="text-gray-600">
                  de R$ {campaign.meta_arrecadacao.toLocaleString('pt-BR')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-600">
                  {getProgress(campaign.valor_atual, campaign.meta_arrecadacao).toFixed(0)}%
                </div>
                <div className="text-gray-600">alcançado</div>
              </div>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-3">
              <div
                className="bg-orange-500 h-3 rounded-full transition-all"
                style={{
                  width: `${getProgress(campaign.valor_atual, campaign.meta_arrecadacao)}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sobre esta campanha</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{campaign.descricao}</p>
          </div>
        </div>
      </div>

      {campaign.status === 'ativa' && (
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Heart className="h-8 w-8 text-orange-500" fill="currentColor" />
            <h2 className="text-2xl font-bold text-gray-800">Faça sua Doação</h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleDonate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Valor da Doação (R$)
              </label>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="100.00"
                min="1"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mensagem de Apoio (Opcional)
              </label>
              <textarea
                value={donationMessage}
                onChange={(e) => setDonationMessage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                rows={4}
                placeholder="Deixe uma mensagem de apoio para o criador da campanha..."
              />
            </div>

            <button
              type="submit"
              disabled={donating}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-400 flex items-center justify-center space-x-2"
            >
              <Heart className="h-5 w-5" fill="currentColor" />
              <span>{donating ? 'Processando...' : 'Doar Agora'}</span>
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <MessageCircle className="h-8 w-8 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-800">Comentários</h2>
          <span className="text-gray-500">({comments.length})</span>
        </div>

        {commentError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {commentError}
          </div>
        )}

        {isAuthenticated && (
          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              rows={3}
              placeholder="Deixe seu comentário..."
              required
            />
            <button
              type="submit"
              disabled={commentLoading}
              className="mt-3 bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-400"
            >
              {commentLoading ? 'Enviando...' : 'Comentar'}
            </button>
          </form>
        )}

        {!isAuthenticated && (
          <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg mb-6">
            <button
              onClick={() => navigate('/login')}
              className="text-orange-600 font-semibold hover:underline"
            >
              Faça login
            </button>{' '}
            para deixar um comentário
          </div>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </p>
          ) : (
            comments.map((comment) => {
              const isOwner = user && (user.id === comment.usuario_id || user.id === comment.usuario.id);
              console.log('Comment:', comment.id, 'User ID:', user?.id, 'Comment User ID:', comment.usuario_id, 'Comment Usuario ID:', comment.usuario.id, 'Is Owner:', isOwner);
              
              return (
              <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{comment.usuario.nome}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {isOwner && (
                    <div className="flex space-x-2">
                      {editingCommentId === comment.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleEditComment(comment.id)}
                            disabled={commentLoading}
                            className="text-green-600 hover:text-green-700 disabled:text-gray-400 p-1"
                            title="Salvar"
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditComment}
                            disabled={commentLoading}
                            className="text-gray-600 hover:text-gray-700 disabled:text-gray-400 p-1"
                            title="Cancelar"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEditComment(comment)}
                            disabled={commentLoading}
                            className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 p-1"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={commentLoading}
                            className="text-red-600 hover:text-red-700 disabled:text-gray-400 p-1"
                            title="Deletar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                {editingCommentId === comment.id ? (
                  <textarea
                    value={editingCommentText}
                    onChange={(e) => setEditingCommentText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.texto}</p>
                )}
              </div>
            );
            })
          )}
        </div>
      </div>
    </div>
  );
}
