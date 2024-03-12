import { Banner } from "@b/models/banner.model";
import { Book, BookReviewItem } from "@b/models/book.model";
import { fetchBanners } from "@f/api/banner.api";
import {
  FetchBooksResponse,
  fetchBestBooks,
  fetchBooks,
} from "@f/api/books.api";
import { reviewForMain } from "@f/api/review.api";
import { useQuery } from "react-query";
import { useMediaQuery } from "./useMediaQuery";

export const useMain = () => {
  const { isMobile } = useMediaQuery();

  const { data: reviewsData = [], isLoading: isReviewsLoading } = useQuery<
    BookReviewItem[]
  >("reviews", reviewForMain);

  const {
    data: newBooksData = {
      books: [],
      pagination: {
        totalCount: 0,
        currentPage: 1,
      },
    },
    isLoading: isNewBooksLoading,
  } = useQuery<FetchBooksResponse>("newBooks", () =>
    fetchBooks({
      category_id: undefined,
      news: true,
      currentPage: 1,
      limit: 4,
    })
  );

  const { data: bestBooksData = [], isLoading: isBestBooksLoading } = useQuery<
    Book[]
  >("bestBooks", fetchBestBooks);

  const { data: bannersData, isLoading: isBannerLoading } = useQuery<Banner[]>(
    "banners",
    fetchBanners
  );

  return {
    reviews: reviewsData,
    newBooks: newBooksData.books,
    bestBooks: isMobile ? bestBooksData?.slice(0, 4) : bestBooksData,
    banners: bannersData ?? [],
    isReviewEmpty: reviewsData.length === 0,
    isNewBooksEmpty: !newBooksData || newBooksData.books.length === 0,
    isReviewsLoading,
    isNewBooksLoading,
    isBestBooksLoading,
    isBannerLoading,
  };
};
