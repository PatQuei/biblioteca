#!/bin/bash
# Script de verificação para deploy

echo "🔍 Verificando configuração para deploy..."

# Verificar se arquivos essenciais existem
files=(".env" "vercel.json" "next.config.ts" "prisma/schema.prisma")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file encontrado"
    else
        echo "❌ $file não encontrado"
        exit 1
    fi
done

# Verificar se DATABASE_URL está definida
if grep -q "DATABASE_URL" .env; then
    echo "✅ DATABASE_URL configurada em .env"
else
    echo "❌ DATABASE_URL não encontrada em .env"
    exit 1
fi

# Verificar se vercel.json tem DATABASE_URL
if grep -q "DATABASE_URL" vercel.json; then
    echo "✅ DATABASE_URL configurada em vercel.json"
else
    echo "❌ DATABASE_URL não encontrada em vercel.json"
    exit 1
fi

# Testar build
echo "🔨 Testando build..."
npm run vercel-build

if [ $? -eq 0 ]; then
    echo "✅ Build bem-sucedido!"
    echo "🚀 Pronto para deploy no Vercel!"
else
    echo "❌ Erro no build"
    exit 1
fi