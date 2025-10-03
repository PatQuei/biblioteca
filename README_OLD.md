# 📚 BookShelf v2: Sua Jornada de Leitura, Otimizada.

Este projeto foi desenvolvido como parte do programa **Desenvolve**, um projeto do **Grupo Boticário**.

O BookShelf v2 é a sua solução pessoal e robusta para gerenciar sua biblioteca, rastrear o progresso e manter anotações. Esta versão marca um salto arquitetônico, migrando de arquivos JSON para um **Banco de Dados Relacional** com **Prisma ORM**, garantindo maior **performance** e **integridade de dados**.

---

## 🚀 Tecnologias

O BookShelf v2 é construído com ferramentas de ponta para garantir performance e escalabilidade em ambientes Serverless:

| Categoria | Tecnologia | Uso no Projeto |
| :--- | :--- | :--- |
| **Frontend/Backend** | **Next.js** | Framework React (App Router, Server Components e Server Actions) |
| **Tipagem** | **TypeScript** | Garante *Type Safety* completa, especialmente com tipos gerados pelo Prisma. |
| **Banco de Dados** | **Turso DB** | Banco de dados **SQLite Distribuído** para Edge Computing, altamente compatível com ambientes Serverless. |
| **ORM** | **Prisma ORM** | Ferramenta moderna para modelagem de dados, migrações e operações *type-safe* no banco. |
| **Deploy** | **Vercel** | Hospedagem Serverless da aplicação Next.js. |

---

## ⚙️ Setup Local (Para Desenvolvedores)

Siga estes passos rápidos para ter o projeto rodando na sua máquina.

### 1. Pré-requisitos
* Node.js (18+)
* **Prisma CLI** e **ts-node** instalados

### 2. Clonagem e Instalação

```bash
# Clone o repositório (Atualize a URL)
git clone [https://github.com/seu-usuario/BookShelf-v2.git](https://github.com/seu-usuario/BookShelf-v2.git)
cd BookShelf-v2

# Instale as dependências
npm install
