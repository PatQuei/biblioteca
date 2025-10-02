// prisma/seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seed...');

  // Limpar dados existentes
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  console.log('Dados antigos limpos.');

  // Criar Gêneros
  const ficcao = await prisma.genre.create({ data: { name: 'Ficção' } });
  const distopia = await prisma.genre.create({ data: { name: 'Distopia' } });
  const fantasia = await prisma.genre.create({ data: { name: 'Fantasia' } });
  console.log('Gêneros criados.');

  // Criar Livros
  await prisma.book.create({
    data: {
      title: '1984',
      author: 'George Orwell',
      year: 1949,
      pages: 328,
      rating: 5,
      synopsis: 'Uma história sobre totalitarismo.',
      cover: 'https://placehold.co/300x400/dc2626/white?text=1984',
      status: 'LIDO',
      genreId: ficcao.id,
    },
  });

  await prisma.book.create({
    data: {
      title: 'O Senhor dos Anéis',
      author: 'J.R.R. Tolkien',
      year: 1954,
      pages: 1216,
      rating: 5,
      synopsis: 'Uma grande aventura na Terra-média.',
      cover: 'https://placehold.co/300x400/f97316/white?text=SdA',
      status: 'LENDO',
      currentPage: 500,
      genreId: fantasia.id,
    },
  });

  await prisma.book.create({
    data: {
      title: 'Duna',
      author: 'Frank Herbert',
      year: 1965,
      pages: 688,
      rating: 4,
      synopsis: 'Uma saga de ficção científica em um planeta deserto.',
      cover: 'https://placehold.co/300x400/16a34a/white?text=Duna',
      status: 'QUERO_LER',
      genreId: ficcao.id,
    },
  });
  console.log('Livros criados.');
  console.log('Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });