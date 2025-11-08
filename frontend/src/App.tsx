import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import CreateCampaign from './pages/CreateCampaign';
import Login from './pages/Login';
import Register from './pages/Resgister';
import MyCampaigns from './pages/MyCampaigns';

function App() {
  console.log('App component renderizando...');
  console.log('Tailwind test: classes should be applied');
  
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/campanhas" element={<Campaigns />} />
            <Route path="/campanhas/:id" element={<CampaignDetail />} />
            <Route path="/criar-campanha" element={<CreateCampaign />} />
            <Route path="/minhas-campanhas" element={<MyCampaigns />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
