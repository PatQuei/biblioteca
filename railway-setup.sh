#!/bin/bash

# Script para configurar banco PostgreSQL no Railway
# Execute este script no Terminal do serviço Railway após deploy

echo "🚀 Configurando banco PostgreSQL no Railway..."

# 1. Verificar se Prisma está disponível
echo "📦 Verificando Prisma..."
npx prisma --version

# 2. Verificar conexão com banco
echo "🔗 Testando conexão com banco..."
npx prisma db execute --command "SELECT 1"

# 3. Aplicar migrações (criar tabelas)
echo "📋 Criando tabelas no banco..."
npx prisma db push

# 4. Verificar se tabelas foram criadas
echo "✅ Verificando tabelas criadas..."
npx prisma db execute --command "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"

# 5. Popular banco com dados iniciais
echo "📚 Populando banco com dados iniciais..."
npx prisma db seed

# 6. Verificar dados inseridos
echo "🔍 Verificando dados inseridos..."
npx prisma db execute --command "SELECT COUNT(*) as total_books FROM \"Book\""
npx prisma db execute --command "SELECT COUNT(*) as total_genres FROM \"Genre\""

echo "✅ Configuração concluída! O banco PostgreSQL está pronto."
echo "🌐 Sua aplicação agora usará dados reais ao invés de demonstração."