#!/usr/bin/env node

/**
 * Script de Build para Deploy
 * Prepara a aplicação para deploy em produção
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build para deploy...\n');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, cwd = process.cwd()) {
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    return true;
  } catch (error) {
    return false;
  }
}

// Verificar se estamos na raiz do projeto
if (!fs.existsSync('package.json') || !fs.existsSync('backend') || !fs.existsSync('frontend')) {
  log('❌ Execute este script na raiz do projeto!', 'red');
  process.exit(1);
}

// Passo 1: Limpar builds anteriores
log('📦 Passo 1: Limpando builds anteriores...', 'blue');
if (fs.existsSync('frontend/dist')) {
  fs.rmSync('frontend/dist', { recursive: true, force: true });
  log('✅ Frontend dist removido', 'green');
}

// Passo 2: Instalar dependências do frontend
log('\n📦 Passo 2: Instalando dependências do frontend...', 'blue');
if (!exec('npm install', path.join(process.cwd(), 'frontend'))) {
  log('❌ Falha ao instalar dependências do frontend', 'red');
  process.exit(1);
}
log('✅ Dependências do frontend instaladas', 'green');

// Passo 3: Build do frontend
log('\n📦 Passo 3: Fazendo build do frontend...', 'blue');
if (!exec('npm run build', path.join(process.cwd(), 'frontend'))) {
  log('❌ Falha no build do frontend', 'red');
  process.exit(1);
}
log('✅ Build do frontend concluído', 'green');

// Passo 4: Verificar se o build foi criado
if (!fs.existsSync('frontend/dist/index.html')) {
  log('❌ Build do frontend não foi criado corretamente', 'red');
  process.exit(1);
}

// Passo 5: Instalar dependências do backend
log('\n📦 Passo 4: Instalando dependências do backend...', 'blue');
if (!exec('npm install --production', path.join(process.cwd(), 'backend'))) {
  log('❌ Falha ao instalar dependências do backend', 'red');
  process.exit(1);
}
log('✅ Dependências do backend instaladas', 'green');

// Passo 6: Verificar arquivos essenciais
log('\n📦 Passo 5: Verificando arquivos essenciais...', 'blue');
const essentialFiles = [
  'Procfile',
  'package.json',
  'backend/package.json',
  'backend/src/server.js',
  'frontend/dist/index.html'
];

let allFilesExist = true;
essentialFiles.forEach(file => {
  if (fs.existsSync(file)) {
    log(`  ✅ ${file}`, 'green');
  } else {
    log(`  ❌ ${file} não encontrado`, 'red');
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  log('\n❌ Alguns arquivos essenciais estão faltando', 'red');
  process.exit(1);
}

// Passo 7: Verificar variáveis de ambiente
log('\n📦 Passo 6: Verificando configuração...', 'blue');
if (fs.existsSync('backend/.env')) {
  log('  ⚠️  Arquivo backend/.env encontrado (não será usado em produção)', 'yellow');
  log('  💡 Configure as variáveis de ambiente na plataforma de deploy', 'yellow');
}

// Resumo
log('\n' + '='.repeat(60), 'green');
log('✅ BUILD CONCLUÍDO COM SUCESSO!', 'green');
log('='.repeat(60), 'green');

log('\n📋 Próximos passos:', 'blue');
log('1. Commit e push das alterações para o repositório');
log('2. Configure as variáveis de ambiente na plataforma de deploy:');
log('   - NODE_ENV=production');
log('   - DATABASE_URL=sua-url-do-postgres');
log('   - JWT_SECRET=sua-chave-secreta');
log('3. Faça o deploy seguindo o guia em DEPLOY_PLATFORMS.md');
log('\n💡 Dica: Use "node -e \\"console.log(require(\'crypto\').randomBytes(64).toString(\'hex\\'))\\"" para gerar JWT_SECRET\n');
