import { Category } from "../../../backend/src/models/category.model";
import { httpClient } from "./http";

export const fetchCategory = async (): Promise<Category[]> => {
  const response = await httpClient.get<Category[]>("/books/categories");
  return response.data;
};
