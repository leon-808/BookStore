import { useInfiniteQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { fetchBooks } from "../api/books.api";
import { LIMIT } from "../constants/pagination";
import { QUERY_STRING } from "../constants/queryString";

export const useBooksInfinite = () => {
  const location = useLocation();

  const getBooks = ({ pageParam }: { pageParam: number }) => {
    const params = new URLSearchParams(location.search);
    const category_id = params.get(QUERY_STRING.CATEGORY_ID);
    const news = params.get(QUERY_STRING.NEWS);
    const currentPage = pageParam;
    const limit = LIMIT;

    return fetchBooks({
      category_id: category_id ? Number(category_id) : undefined,
      news: news ? true : undefined,
      currentPage: currentPage ? Number(currentPage) : undefined,
      limit: LIMIT,
    });
  };

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    ["books", location.search],
    ({ pageParam = 1 }) => getBooks({ pageParam }),
    {
      getNextPageParam: (lastPage) => {
        const isLastPage =
          Math.ceil(lastPage.pagination.totalCount / LIMIT) ===
          lastPage.pagination.currentPage;
        return isLastPage ? null : lastPage.pagination.currentPage + 1;
      },
    }
  );

  const books = data ? data.pages.flatMap((page) => page.books) : [];
  const pagination = data ? data.pages[data.pages.length - 1] : 1;
  const isEmpty = books.length === 0;

  return {
    books,
    pagination,
    isEmpty,
    isBooksLoading: isFetching,
    fetchNextPage,
    hasNextPage,
  };
};
