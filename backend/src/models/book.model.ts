export interface Book {
  id: number;
  title: string;
  img: number;
  category_id: number;
  form: string;
  isbn: string;
  detail: string;
  author: string;
  pages: number;
  summary: string;
  contents: string;
  price: number;
  likes: number;
  publication_date: string;
}

export interface Pagination {
  totalCount: number;
  currentPage: number;
}

export interface BookPagination {
  books: Book[];
  pagination: Pagination;
}

export interface BookDetail extends Book {
  category_name: string;
  liked: boolean;
}

export interface BookReviewItem {
  id: number;
  userId: number;
  email: string;
  content: string;
  created_at: string;
  score: number;
}

export type BookReviewItemWrite = Pick<BookReviewItem, "content" | "score">;
