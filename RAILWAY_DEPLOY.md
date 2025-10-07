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

#### 2.5 Criar tabelas no banco
Após o deploy, acesse a aba "Shell" do serviço e execute:

```bash
# Opção 1: Aplicar migrações existentes
npx prisma migrate deploy

# Opção 2: Recriar tudo do zero (recomendado na primeira vez)
npx prisma db push
npx prisma db seed
```

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