import { Book, BookDetail } from "../../../backend/src/models/book.model";
import { Pagination } from "../models/pagination.model";
import { getToken } from "../store/authStore";
import { httpClient } from "./http";

interface FetchBooksParams {
  category_id?: number;
  news?: boolean;
  currentPage?: number;
  limit: number;
}

export interface FetchBooksResponse {
  books: Book[];
  pagination: Pagination;
}

export const fetchBooks = async (
  params: FetchBooksParams
): Promise<FetchBooksResponse> => {
  try {
    const response = await httpClient.get<FetchBooksResponse>("/books", {
      params: params,
    });
    return response.data;
  } catch (error) {
    return {
      books: [],
      pagination: {
        totalCount: 0,
        currentPage: 1,
      },
    } as FetchBooksResponse;
  }
};

export const fetchBook = async (bookId: string) => {
  const token = getToken();
  return await httpClient.get<BookDetail>(`/books/${bookId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const likeBookToggle = async (bookId: number) => {
  const token = getToken();
  return await httpClient.post(
    `/likes/${bookId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const fetchBestBooks = async () => {
  const response = await httpClient.get<Book[]>("/books/best");
  return response.data;
};
