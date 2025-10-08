# Deploy no Railway - Guia Prático

## 🚀 Passos para Deploy

### 1. Preparação do Projeto (✅ Concluído)

- [x] Schema.prisma alterado para PostgreSQL
- [x] Variáveis de ambiente documentadas

### 2. Deploy no Railway

#### 2.1 Criar conta e projeto

1. Acesse https://railway.app
2. Entre com GitHub
3. Clique em "New Project" → "Deploy from GitHub repo"
4. Escolha o repositório `biblioteca`

#### 2.2 Adicionar banco PostgreSQL

1. Clique em "Add new" → "Database" → "PostgreSQL"
2. Aguarde 1 minuto para criação
3. Clique no banco e copie a "Connection String"
   - Formato: `postgresql://postgres:password@containers-us-west-xx.railway.app:xxxxx/railway`

#### 2.3 Configurar variável de ambiente

1. Vá para o serviço da aplicação (projeto importado)
2. Clique em "Variables" → "Add Variable"
3. Adicione:
   ```
   DATABASE_URL=postgresql://postgres:password@containers-us-west-xx.railway.app:xxxxx/railway
   ```
   (Cole a Connection String copiada no passo anterior)

#### 2.4 Deploy automático

- Railway detecta Next.js automaticamente
- Executa: `npm install` → `npm run build` → `npm start`
- Processo leva 3-5 minutos

#### 2.5 Criar tabelas no banco (CRÍTICO!)

⚠️ **IMPORTANTE**: Sem este passo, a aplicação só mostrará dados de demonstração!

**Onde executar comandos no Railway:**

**Opção 1 - Shell/Terminal (se disponível):**
1. Railway → Seu projeto → Serviço da aplicação
2. Procure por: "Shell", "Terminal", "Console" ou "Execute" 
3. Se encontrar, execute os comandos abaixo

**Opção 2 - Connect (mais comum na interface nova):**
1. Railway → Seu projeto → Serviço da aplicação  
2. Clique em "Connect" (no menu lateral ou superior)
3. Escolha uma opção como "Web Terminal" ou "Railway CLI"

**Opção 3 - Railway CLI (sempre funciona):**
```bash
# No seu computador local
npm install -g @railway/cli
railway login
railway link
railway run npx prisma db push
railway run npx prisma db seed
```

**Comandos para executar (em qualquer uma das opções):**
```bash
# Passo 1: Criar as tabelas
npx prisma db push

# Passo 2: Popular com dados iniciais  
npx prisma db seed

# Passo 3: Verificar se funcionou
npx prisma db execute --command "SELECT COUNT(*) FROM \"Book\""
```

✅ **Como saber se funcionou:**

- No Railway, execute: `npx prisma db execute --command "SELECT COUNT(*) FROM \"Book\""`
- Deve retornar um número > 0
- A aplicação mostrará dados reais ao invés de "demonstração"

## ✅ Resultado Final

Após esses passos, sua aplicação estará online com:

- ✅ CRUD persistente (livros, gêneros, etc.)
- ✅ API funcional
- ✅ Dashboard com dados reais
- ✅ Banco PostgreSQL gratuito
- ✅ Deploy automático a cada push no GitHub

## 🔧 Scripts Úteis

```bash
# Para desenvolvimento local (SQLite)
npm run dev

# Para build de produção
npm run build

# Para deploy de migrações
npm run db:deploy

# Para popular banco com dados de exemplo
npm run db:seed
```

## 📋 Variáveis de Ambiente

### Desenvolvimento Local

```bash
DATABASE_URL="file:./dev.db"
```

### Produção Railway

```bash
DATABASE_URL="postgresql://postgres:password@containers-us-west-xx.railway.app:xxxxx/railway"
```

## 🆘 Troubleshooting

## 🆘 Troubleshooting

### 🚨 PROBLEMA: "Só consigo ver dados, não consigo criar/editar/deletar"

**Sintomas:**

- Interface carrega perfeitamente
- Gêneros aparecem mas não consegue criar/deletar
- Livros aparecem mas não consegue editar/excluir/criar
- Mensagem: "Dados de demonstração"

**Causa:** Banco PostgreSQL não foi configurado no Railway

**Solução - 3 opções:**

**Opção A - Interface Railway:**
1. Railway → Seu projeto → Serviço da aplicação
2. Procure: "Connect", "Shell", "Terminal" ou ícone de terminal
3. Execute: `npx prisma db push && npx prisma db seed`

**Opção B - Railway CLI (recomendado):**
```bash
# No seu computador local
npm install -g @railway/cli
railway login
railway link
railway run npx prisma db push
railway run npx prisma db seed
```

**Opção C - Logs para debug:**
1. Railway → Deploy Logs
2. Veja se há erros de conexão com banco
3. Confirme se DATABASE_URL está configurada### ⚠️ Erro de versão do Node.js (MAIS COMUM)

Se aparecer erro como:

```
❌ You are using Node.js 18.17.0. For Next.js, Node.js version "^18.18.0 || ^19.8.0 || >= 20.0.0" is required.
```

**Causa**: O Railway prioriza o arquivo `.nvmrc` sobre o `engines` no package.json

**Solução**: ✅ Já corrigido!

- Arquivo `.nvmrc` atualizado para `20.0.0`
- Package.json configurado com `"node": ">=20.0.0"`
- O Railway usará automaticamente o Node.js 20+
- Se o erro persistir, faça "Redeploy" no painel do Railway

### Se der erro de conexão:

1. Verifique se a DATABASE_URL está correta
2. Confirme se o banco PostgreSQL está rodando no Railway
3. Execute `npx prisma db push` no Shell do Railway

### Se as tabelas não existirem:

```bash
npx prisma db push
npx prisma db seed
```

### Para ver logs:

- Acesse a aba "Deploy Logs" no Railway
- Verifique erros de build ou runtime
