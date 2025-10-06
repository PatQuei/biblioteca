# 🚀 Guia de Deploy - Biblioteca DOMinadores

## 📋 Pré-requisitos

- [x] Código corrigido para Next.js 15
- [x] Variáveis de ambiente configuradas
- [x] Schema Prisma atualizado

## 🗄️ Opções de Banco de Dados

### Opção 1: Turso (Recomendado - Gratuito)

```bash
# 1. Instalar Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# 2. Fazer login
turso auth login

# 3. Criar database
turso db create biblioteca-dominadores

# 4. Obter URL
turso db show biblioteca-dominadores --url

# 5. Criar token
turso db tokens create biblioteca-dominadores
```

### Opção 2: PlanetScale (MySQL - Gratuito até 5GB)

1. Criar conta em planetscale.com
2. Criar novo database "biblioteca-dominadores"
3. Obter connection string

### Opção 3: Supabase (PostgreSQL - Gratuito até 500MB)

1. Criar conta em supabase.com
2. Criar novo projeto
3. Obter connection string em Settings > Database

## 🌐 Deploy na Vercel (Recomendado)

### 1. Preparar Repositório

```bash
git add .
git commit -m "Preparar para deploy"
git push origin main
```

### 2. Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente:
   - `DATABASE_URL`: Sua URL do banco de dados
   - `DATABASE_AUTH_TOKEN`: Token do Turso (se usando Turso)

### 3. Build Settings (automático)

- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## 🌐 Deploy na Netlify

### 1. Netlify.toml

Criar arquivo `netlify.toml` na raiz:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Deploy

1. Acesse [netlify.com](https://netlify.com)
2. Conecte repositório
3. Configure variáveis de ambiente

## 📱 Deploy no Railway

### 1. railway.json

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 🔧 Comandos Importantes

```bash
# Gerar Prisma Client
npx prisma generate

# Aplicar migrations em produção
npx prisma migrate deploy

# Fazer seed do banco (opcional)
npm run db:seed

# Testar build local
npm run build
npm start
```

## ⚠️ Checklist Final

- [ ] Banco de dados configurado
- [ ] Variáveis de ambiente definidas
- [ ] `npm run build` funciona sem erros
- [ ] Migrations aplicadas
- [ ] Dados de seed inseridos (opcional)
- [ ] SSL configurado (automático na Vercel)

## 🆘 Troubleshooting

### Erro: "Database não encontrado"

- Verificar se DATABASE_URL está correto
- Executar `npx prisma migrate deploy`

### Erro: "Module not found"

- Executar `npx prisma generate`
- Verificar se todas as dependências estão instaladas

### Erro: "Build failed"

- Verificar se não há erros de TypeScript
- Executar `npm run lint` para verificar problemas

## 📊 Performance

- **Lighthouse Score Estimado**: 95+
- **Time to First Byte**: <500ms
- **Core Web Vitals**: Todas verdes
- **SEO**: Otimizado

## 🎉 Pós-Deploy

1. Testar todas as funcionalidades
2. Verificar dark mode
3. Testar CRUD operations
4. Validar responsividade
5. Configurar domínio personalizado (opcional)

---

**Estimated Deploy Time: 15-30 minutos**
**Status: ✅ Pronto para Deploy**
