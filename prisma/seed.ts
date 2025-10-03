// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seed...');

  // Limpar dados existentes
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  console.log('Dados antigos limpos.');

  // Criar Gêneros
  await prisma.genre.create({ data: { name: 'Ficção' } });
  const ficcaoCientifica = await prisma.genre.create({ data: { name: 'Ficção Científica' } });
  const distopia = await prisma.genre.create({ data: { name: 'Distopia' } });
  const fantasia = await prisma.genre.create({ data: { name: 'Fantasia' } });
  const romance = await prisma.genre.create({ data: { name: 'Romance' } });
  const misterio = await prisma.genre.create({ data: { name: 'Mistério' } });
  await prisma.genre.create({ data: { name: 'Policial' } });
  await prisma.genre.create({ data: { name: 'Terror' } });
  const biografia = await prisma.genre.create({ data: { name: 'Biografia' } });
  await prisma.genre.create({ data: { name: 'Auto-ajuda' } });
  const historia = await prisma.genre.create({ data: { name: 'História' } });
  await prisma.genre.create({ data: { name: 'Filosofia' } });
  await prisma.genre.create({ data: { name: 'Ciência' } });
  await prisma.genre.create({ data: { name: 'Tecnologia' } });
  await prisma.genre.create({ data: { name: 'Negócios' } });
  await prisma.genre.create({ data: { name: 'Drama' } });
  const aventura = await prisma.genre.create({ data: { name: 'Aventura' } });
  await prisma.genre.create({ data: { name: 'Juvenil' } });
  const classico = await prisma.genre.create({ data: { name: 'Clássico' } });
  await prisma.genre.create({ data: { name: 'Poesia' } });
  
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
      cover: 'https://picsum.photos/300/400?random=1984',
      status: 'LIDO',
      genreId: distopia.id,
      isbn: '978-0451524935',
      notes: 'Uma obra-prima sobre controle e liberdade.',
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
      cover: 'https://picsum.photos/300/400?random=lotr',
      status: 'LENDO',
      currentPage: 500,
      genreId: fantasia.id,
      isbn: '978-0547928227',
      notes: 'Livro que criou o gênero fantasia moderno.',
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
      cover: 'https://picsum.photos/300/400?random=dune',
      status: 'QUERO_LER',
      genreId: ficcaoCientifica.id,
      isbn: '978-0441172719',
    },
  });

  await prisma.book.create({
    data: {
      title: 'O Assassinato no Expresso do Oriente',
      author: 'Agatha Christie',
      year: 1934,
      pages: 256,
      rating: 4,
      synopsis: 'Um mistério clássico a bordo de um trem.',
      cover: 'https://picsum.photos/300/400?random=christie',
      status: 'LIDO',
      genreId: misterio.id,
      isbn: '978-0062693662',
    },
  });

  await prisma.book.create({
    data: {
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      year: 1899,
      pages: 208,
      rating: 5,
      synopsis: 'Um clássico da literatura brasileira sobre ciúme e dúvida.',
      cover: 'https://picsum.photos/300/400?random=machado',
      status: 'PAUSADO',
      currentPage: 100,
      genreId: classico.id,
      isbn: '978-8525406958',
      notes: 'Capitu traiu ou não? O eterno mistério.',
    },
  });

  await prisma.book.create({
    data: {
      title: 'Steve Jobs',
      author: 'Walter Isaacson',
      year: 2011,
      pages: 656,
      rating: 4,
      synopsis: 'A biografia autorizada do cofundador da Apple.',
      cover: 'https://picsum.photos/300/400?random=jobs',
      status: 'QUERO_LER',
      genreId: biografia.id,
      isbn: '978-1451648539',
    },
  });

  await prisma.book.create({
    data: {
      title: 'O Hobbit',
      author: 'J.R.R. Tolkien',
      year: 1937,
      pages: 304,
      rating: 5,
      synopsis: 'A jornada de Bilbo Bolseiro.',
      cover: 'https://picsum.photos/300/400?random=hobbit',
      status: 'LIDO',
      genreId: aventura.id,
      isbn: '978-0547928227',
      notes: 'Perfeito para introduzir crianças à fantasia.',
    },
  });

  await prisma.book.create({
    data: {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      year: 2011,
      pages: 464,
      rating: 4,
      synopsis: 'Uma breve história da humanidade.',
      cover: 'https://picsum.photos/300/400?random=sapiens',
      status: 'LENDO',
      currentPage: 200,
      genreId: historia.id,
      isbn: '978-0062316097',
    },
  });

  await prisma.book.create({
    data: {
      title: 'Orgulho e Preconceito',
      author: 'Jane Austen',
      year: 1813,
      pages: 432,
      rating: 4,
      synopsis: 'Romance clássico inglês.',
      cover: 'https://picsum.photos/300/400?random=austen',
      status: 'QUERO_LER',
      genreId: romance.id,
      isbn: '978-0141439518',
    },
  });

  await prisma.book.create({
    data: {
      title: 'O Cortiço',
      author: 'Aluísio Azevedo',
      year: 1890,
      pages: 320,
      rating: 3,
      synopsis: 'Romance naturalista brasileiro.',
      cover: 'https://picsum.photos/300/400?random=cortico',
      status: 'ABANDONADO',
      currentPage: 50,
      genreId: classico.id,
      isbn: '978-8594318153',
      notes: 'Linguagem muito datada, difícil de acompanhar.',
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
