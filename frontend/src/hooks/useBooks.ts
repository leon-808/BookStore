import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { fetchBooks } from "../api/books.api";
import { LIMIT } from "../constants/pagination";
import { QUERY_STRING } from "../constants/queryString";

export const useBooks = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category_id = params.get(QUERY_STRING.CATEGORY_ID);
  const news = params.get(QUERY_STRING.NEWS);
  const currentPage = params.get(QUERY_STRING.PAGE);

  const { data: booksData, isLoading: isBooksLoading } = useQuery(
    ["books", location.search],
    () =>
      fetchBooks({
        category_id: category_id ? Number(category_id) : undefined,
        news: news ? true : undefined,
        currentPage: currentPage ? Number(currentPage) : undefined,
        limit: LIMIT,
      })
  );

  return {
    books: booksData?.books,
    pagination: booksData?.pagination,
    isEmpty: booksData?.books.length === 0,
    isBooksLoading,
  };
};
