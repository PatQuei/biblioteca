import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
  try {
    console.log('Testando conexão com banco...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    // Testar conexão
    await prisma.$connect();
    console.log('Conexão estabelecida');

    // Verificar se há dados
    const bookCount = await prisma.book.count();
    const genreCount = await prisma.genre.count();
    
    console.log('Dados encontrados:', { bookCount, genreCount });

    // Se não há dados, criar dados de exemplo
    if (bookCount === 0 && genreCount === 0) {
      console.log('Banco vazio, criando dados de exemplo...');
      
      // Criar gêneros
      const ficaoGenre = await prisma.genre.create({
        data: { name: 'Ficção' }
      });
      
      const fantasia = await prisma.genre.create({
        data: { name: 'Fantasia' }
      });

      // Criar livros de exemplo
      await prisma.book.create({
        data: {
          title: 'O Senhor dos Anéis',
          author: 'J.R.R. Tolkien',
          genreId: fantasia.id,
          year: 1954,
          pages: 1216,
          rating: 5,
          synopsis: 'A épica jornada de Frodo para destruir o Um Anel.',
          cover: 'https://covers.openlibrary.org/b/isbn/9780544003415-L.jpg',
          status: 'LIDO',
          currentPage: 1216
        }
      });

      await prisma.book.create({
        data: {
          title: 'Dom Casmurro',
          author: 'Machado de Assis',
          genreId: ficaoGenre.id,
          year: 1899,
          pages: 256,
          rating: 4,
          synopsis: 'Romance clássico da literatura brasileira.',
          cover: 'https://covers.openlibrary.org/b/isbn/9788525406507-L.jpg',
          status: 'LENDO',
          currentPage: 128
        }
      });

      console.log('Dados de exemplo criados');
    }

    // Buscar estatísticas básicas
    const stats = {
      books: await prisma.book.count(),
      genres: await prisma.genre.count(),
      database_url: process.env.DATABASE_URL?.substring(0, 20) + '...',
      environment: process.env.NODE_ENV
    };

    return NextResponse.json({
      success: true,
      message: 'Banco funcionando corretamente',
      stats
    });

  } catch (error) {
    console.error('Erro no teste do banco:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        stack: errorStack,
        database_url: process.env.DATABASE_URL?.substring(0, 20) + '...',
        environment: process.env.NODE_ENV
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}