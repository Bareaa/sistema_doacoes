import { Link } from 'react-router-dom';
import { Heart, Target, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center py-12">
        <div className="flex justify-center mb-8">
          <div className="text-8xl">🐕</div>
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Juntos, Podemos Fazer a Diferença
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Conectamos pessoas que querem ajudar com causas que precisam de apoio.
          Cada contribuição importa e transforma vidas.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/campanhas"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition"
          >
            Ver Campanhas
          </Link>
          <Link
            to="/criar-campanha"
            className="bg-white text-orange-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-orange-500 hover:bg-orange-50 transition"
          >
            Criar Campanha
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-4 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 text-center">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Faça a Diferença
          </h3>
          <p className="text-gray-600">
            Sua doação pode mudar vidas e trazer esperança
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 text-center">
          <div className="flex justify-center mb-4">
            <Target className="h-12 w-12 text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Transparência
          </h3>
          <p className="text-gray-600">
            Acompanhe o progresso e veja o impacto real
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 text-center">
          <div className="flex justify-center mb-4">
            <Users className="h-12 w-12 text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Comunidade
          </h3>
          <p className="text-gray-600">
            Junte-se a milhares de pessoas solidárias
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 text-center">
          <div className="flex justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Impacto Real
          </h3>
          <p className="text-gray-600">
            Resultados concretos em diversas causas
          </p>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-12 shadow-sm border border-orange-100">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Como Funciona?
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 rounded-full p-3 flex-shrink-0">
                  <span className="text-orange-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Escolha uma Causa
                  </h3>
                  <p className="text-gray-600">
                    Navegue pelas campanhas e encontre uma causa que toque seu coração
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 rounded-full p-3 flex-shrink-0">
                  <span className="text-orange-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Faça sua Doação
                  </h3>
                  <p className="text-gray-600">
                    Contribua com o valor que desejar, toda ajuda é bem-vinda
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 rounded-full p-3 flex-shrink-0">
                  <span className="text-orange-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Acompanhe o Progresso
                  </h3>
                  <p className="text-gray-600">
                    Veja o impacto da sua contribuição e compartilhe com amigos
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="text-9xl">🤝</div>
          </div>
        </div>
      </section>
    </div>
  );
}
