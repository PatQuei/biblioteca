export interface DashboardStats {
  overview: {
    totalBooks: number;
    readingBooks: number;
    finishedBooks: number;
    wantToReadBooks: number;
    pausedBooks: number;
    abandonedBooks: number;
    totalGenres: number;
    averageRating: number;
  };
  progress: {
    totalPages: number;
    readPages: number;
    readingProgress: number;
  };
  recentActivity: {
    id: string;
    title: string;
    author: string;
    genre: string;
    status: string;
    createdAt: Date;
  }[];
  topGenres: {
    name: string;
    count: number;
  }[];
  topRatedBooks: {
    id: string;
    title: string;
    author: string;
    rating: number;
    genre: string;
  }[];
}

export interface StatsCardData {
  icon: any;
  label: string;
  value: string | number;
  color: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
  };
}