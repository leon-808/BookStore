import { addBookReview, fetchBookReview } from "@f/api/review.api";
import httpCode from "http-status-codes";
import { useEffect, useState } from "react";
import {
  BookDetail,
  BookReviewItem,
  BookReviewItemWrite,
} from "../../../backend/src/models/book.model";
import { fetchBook, likeBookToggle } from "../api/books.api";
import { addCart } from "../api/carts.api";
import { useAuthStore } from "../store/authStore";
import { useAlert } from "./useAlert";
import { useToast } from "./useToast";

export const useBook = (bookId: string | undefined) => {
  const { showAlert } = useAlert();
  const { isLoggedIn } = useAuthStore();
  const { showToast } = useToast();

  const [book, setBook] = useState<BookDetail | null>(null);
  const [cartAdded, setCartAdded] = useState(false);
  const [reviews, setReviews] = useState<BookReviewItem[]>([]);

  const likeToggle = () => {
    if (!book) return;

    if (!isLoggedIn) {
      showAlert("로그인이 필요합니다.");
      return;
    }

    if (book.liked) {
      likeBookToggle(book.id).then((success) => {
        setBook({
          ...book,
          liked: false,
          likes: book.likes - 1,
        });
        showToast("좋아요 취소");
      });
    } else {
      likeBookToggle(book.id).then((success) => {
        setBook({
          ...book,
          liked: true,
          likes: book.likes + 1,
        });
      });
      showToast("좋아요 성공");
    }
  };

  const addToCart = (quantity: number) => {
    if (!book) return;
    addCart({
      book_id: book.id,
      quantity: quantity,
    }).then(
      (success) => {
        showAlert("장바구니에 추가되었습니다.");
        setCartAdded(true);
        setTimeout(() => {
          setCartAdded(false);
        }, 3000);
      },
      (error) => {
        if (error === httpCode.CONFLICT)
          showAlert("해당 도서는 이미 장바구니에 있습니다.");
      }
    );
  };

  const addReview = (data: BookReviewItemWrite) => {
    if (!book) return;

    const bookId = book.id.toString();

    addBookReview(bookId, data).then((response) => {
      showAlert(response.message);
      fetchBookReview(bookId).then((response) => {
        setReviews(response.data);
      });
    });
  };

  useEffect(() => {
    if (!bookId) return;
    fetchBook(bookId).then((response) => {
      setBook(response.data);
    });
    fetchBookReview(bookId).then((response) => {
      setReviews(response.data);
    });
  }, [bookId]);

  return { book, likeToggle, addToCart, cartAdded, reviews, addReview };
};
