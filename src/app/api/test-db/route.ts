import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Testando conexão com banco...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Platform:', process.platform);
    
    // Testar conexão
    try {
      await prisma.$connect();
      console.log('✅ Conexão estabelecida com sucesso');
    } catch (connectionError) {
      console.error('❌ Erro de conexão:', connectionError);
      return NextResponse.json({
        success: false,
        error: 'Falha na conexão com banco',
        details: connectionError instanceof Error ? connectionError.message : 'Erro desconhecido',
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          DATABASE_URL: process.env.DATABASE_URL?.substring(0, 30) + '...',
          platform: process.platform
        }
      }, { status: 500 });
    }

    // Verificar se há dados
    const bookCount = await prisma.book.count();
    const genreCount = await prisma.genre.count();
    
    console.log('📊 Dados encontrados:', { bookCount, genreCount });

    // Se não há dados, criar dados de exemplo
    if (bookCount === 0 && genreCount === 0) {
      console.log('🔧 Banco vazio, criando dados de exemplo...');
      
      try {
        // Criar gêneros
        const ficaoGenre = await prisma.genre.upsert({
          where: { name: 'Ficção' },
          update: {},
          create: { name: 'Ficção' }
        });
        
        const fantasia = await prisma.genre.upsert({
          where: { name: 'Fantasia' },
          update: {},
          create: { name: 'Fantasia' }
        });

        const romance = await prisma.genre.upsert({
          where: { name: 'Romance' },
          update: {},
          create: { name: 'Romance' }
        });

        // Criar livros de exemplo
        await prisma.book.upsert({
          where: { id: 'sample-book-1' },
          update: {},
          create: {
            id: 'sample-book-1',
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

        await prisma.book.upsert({
          where: { id: 'sample-book-2' },
          update: {},
          create: {
            id: 'sample-book-2',
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

        await prisma.book.upsert({
          where: { id: 'sample-book-3' },
          update: {},
          create: {
            id: 'sample-book-3',
            title: 'Orgulho e Preconceito',
            author: 'Jane Austen',
            genreId: romance.id,
            year: 1813,
            pages: 432,
            rating: 5,
            synopsis: 'Clássico romance inglês sobre Elizabeth Bennet.',
            cover: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
            status: 'QUERO_LER',
            currentPage: 0
          }
        });

        console.log('✅ Dados de exemplo criados com sucesso');
      } catch (seedError) {
        console.error('❌ Erro ao criar dados de exemplo:', seedError);
        return NextResponse.json({
          success: false,
          error: 'Erro ao inicializar dados',
          details: seedError instanceof Error ? seedError.message : 'Erro desconhecido'
        }, { status: 500 });
      }
    }

    // Buscar estatísticas finais
    const finalBookCount = await prisma.book.count();
    const finalGenreCount = await prisma.genre.count();
    
    const stats = {
      books: finalBookCount,
      genres: finalGenreCount,
      database_url: process.env.DATABASE_URL?.substring(0, 30) + '...',
      environment: process.env.NODE_ENV,
      platform: process.platform,
      initialized: bookCount === 0 && finalBookCount > 0
    };

    console.log('📈 Estatísticas finais:', stats);

    return NextResponse.json({
      success: true,
      message: 'Banco funcionando corretamente',
      stats
    });

  } catch (error) {
    console.error('💥 Erro no teste do banco:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
        environment: {
          DATABASE_URL: process.env.DATABASE_URL?.substring(0, 30) + '...',
          NODE_ENV: process.env.NODE_ENV,
          platform: process.platform
        }
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}