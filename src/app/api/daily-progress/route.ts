import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
  try {
    // Buscar livros em progresso
    const readingBooks = await prisma.book.findMany({
      where: {
        status: {
          in: ['LENDO', 'PAUSADO']
        }
      },
      select: {
        id: true,
        title: true,
        author: true,
        currentPage: true,
        pages: true,
        status: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Calcular progresso para cada livro
    const booksWithProgress = readingBooks.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      currentPage: book.currentPage,
      totalPages: book.pages,
      progress: book.pages > 0 ? (book.currentPage / book.pages) * 100 : 0
    }));

    // Simular dados de metas (em uma implementação real, isso viria de configurações do usuário)
    const todayGoal = 30; // páginas por dia
    const weeklyGoal = 200; // páginas por semana
    
    // Simular páginas lidas hoje e na semana
    // Em uma implementação real, isso viria de um log de atividades
    const pagesReadToday = Math.floor(Math.random() * todayGoal * 1.2); // Simular progresso
    const pagesReadThisWeek = Math.floor(Math.random() * weeklyGoal * 0.8); // Simular progresso semanal
    
    // Simular streak de dias consecutivos lendo
    const streak = Math.floor(Math.random() * 15) + 1;

    return NextResponse.json({
      success: true,
      data: {
        readingBooks: booksWithProgress,
        todayGoal,
        pagesReadToday,
        weeklyGoal,
        pagesReadThisWeek,
        streak
      }
    });

  } catch (error) {
    console.error('Erro ao buscar progresso diário:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor ao buscar progresso diário' 
      },
      { status: 500 }
    );
  }
}