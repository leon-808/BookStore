import { BookReviewItem, BookReviewItemWrite } from "@b/models/book.model";
import { getToken } from "@f/store/authStore";
import { httpClient } from "./http";

export const fetchBookReview = async (bookId: string) => {
  return await httpClient.get<BookReviewItem[]>(`/reviews/${bookId}`);
};

interface AddBookReviewResponse {
  message: string;
}

export const addBookReview = async (
  bookId: string,
  data: BookReviewItemWrite
): Promise<AddBookReviewResponse> => {
  const token = getToken();

  return await httpClient.post(`/reviews/${bookId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const reviewForMain = async () => {
  const response = await httpClient.get<BookReviewItem[]>("/reviews");
  return response.data;
};
