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

Após o deploy, acesse a aba **"Shell"** do serviço no Railway e execute:

```bash
# Passo 1: Criar as tabelas
npx prisma db push

# Passo 2: Popular com dados iniciais
npx prisma db seed

# Passo 3: Verificar se funcionou
npx prisma db execute --command "SELECT COUNT(*) FROM \"Book\""
```

**OU use o script automatizado:**
```bash
# Script que faz tudo automaticamente
chmod +x railway-setup.sh && ./railway-setup.sh
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

**Solução:**
1. Acesse Railway → Seu projeto → Serviço da aplicação
2. Clique na aba **"Shell"** 
3. Execute estes comandos:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
4. Verifique se funcionou:
   ```bash
   npx prisma db execute --command "SELECT COUNT(*) FROM \"Book\""
   ```
5. Deve retornar número > 0
6. Recarregue a aplicação - agora deve permitir CRUD completo

### ⚠️ Erro de versão do Node.js (MAIS COMUM)

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
