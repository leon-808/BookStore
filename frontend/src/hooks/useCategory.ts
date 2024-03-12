import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchCategory } from "../api/category.api";
import { CategoryState } from "../models/category.model";

export const useCategory = () => {
  const location = useLocation();
  const [category, setCategory] = useState<CategoryState[]>([]);

  const setActive = () => {
    const params = new URLSearchParams(location.search);
    if (params.get("category_id")) {
      setCategory((previous) => {
        return previous.map((item) => {
          return {
            ...item,
            isActive: item.id === Number(params.get("category_id")),
          };
        });
      });
    } else {
      setCategory((previous) => {
        return previous.map((item) => {
          return {
            ...item,
            isActive: item.id === 0 ? true : false,
          };
        });
      });
    }
  };

  useEffect(() => {
    fetchCategory().then((category) => {
      if (!category) return;

      const categoryWithAll = [
        {
          id: 0,
          name: "전체",
        },
        ...category,
      ];

      setCategory(categoryWithAll);
      setActive();
    });
  }, []);

  useEffect(() => {
    setActive();
  }, [location.search]);

  return { category };
};
