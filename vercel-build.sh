#!/bin/bash
# Script de build para Vercel

# Gerar Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Verificar se existem migrações para aplicar
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
    echo "Deploying migrations..."
    npx prisma migrate deploy
else
    echo "No migrations to deploy"
fi

# Build Next.js
echo "Building Next.js..."
npx next build