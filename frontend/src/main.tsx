import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Main.tsx carregando...');
console.log('Tailwind CSS importado');

// Limpar localStorage inválido
if (localStorage.getItem('user') === 'undefined') {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Elemento root não encontrado!');
} else {
  console.log('Montando React app...');
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('React app montado!');
}
