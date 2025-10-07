# Biblioteca de Livros - Sistema de Gerenciamento

Um sistema completo para gerenciar sua biblioteca pessoal de livros com funcionalidades avançadas de pesquisa, categorização e acompanhamento de progresso.

## 🚀 Deploy no Vercel

### Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Repositório Git (GitHub, GitLab, etc.)

### Passos para Deploy

1. **Fazer push do código para o Git**:
   ```bash
   git add .
   git commit -m "Deploy optimization"
   git push origin main
   ```

2. **Conectar ao Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Faça login e clique em "Add New Project"
   - Importe seu repositório

3. **Configurar variáveis de ambiente**:
   ```
   NODE_ENV=production
   DATABASE_URL=file:./dev.db
   NEXT_TELEMETRY_DISABLED=1
   ```

4. **Deploy automático**:
   - O Vercel detectará automaticamente que é um projeto Next.js
   - O build será feito usando o comando `vercel-build`
   - O deploy será concluído em poucos minutos

### Otimizações Implementadas

- ✅ **Next.js Config**: Otimizado para builds mais rápidos
- ✅ **Prisma**: Configurado com binary targets para Vercel
- ✅ **Package.json**: Scripts otimizados e engines especificadas
- ✅ **Vercel.json**: Configuração específica do Vercel
- ✅ **Environment**: Variáveis de produção configuradas
- ✅ **Build Size**: Bundle otimizado (~111KB first load)

### Funcionalidades

- 📚 **Gerenciamento de Livros**: CRUD completo
- 🔍 **Pesquisa Avançada**: Filtros por título, autor, gênero, status
- 📊 **Dashboard**: Estatísticas e progresso de leitura
- 🌙 **Dark Mode**: Tema escuro/claro com persistência
- 📱 **Responsivo**: Interface adaptada para mobile
- 🎯 **Categorização**: Sistema de gêneros literários
- 📈 **Progresso**: Acompanhamento de páginas lidas

### Tecnologias

- **Frontend**: Next.js 15.5.3, React 19, TypeScript
- **Styling**: Tailwind CSS v4 com dark mode
- **Database**: SQLite com Prisma ORM
- **Deploy**: Vercel com otimizações de performance
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build local
npm run build

# Deploy no Vercel
npm run vercel-build

# Database
npm run db:migrate
npm run db:seed
npm run db:studio
```

### Estrutura do Projeto

```
biblioteca/
├── src/
│   ├── app/          # App Router (Next.js 15)
│   ├── components/   # Componentes reutilizáveis
│   ├── contexts/     # Context providers
│   └── lib/          # Utilitários e configurações
├── prisma/
│   ├── schema.prisma # Schema do banco
│   └── migrations/   # Migrações
└── public/           # Assets estáticos
```

### Performance

- **Build Time**: ~35 segundos (otimizado para Vercel)
- **Bundle Size**: 102KB shared chunks
- **First Load**: 111KB average
- **Static Pages**: 13 páginas pré-renderizadas

---

Desenvolvido com ❤️ para gerenciar sua biblioteca pessoal