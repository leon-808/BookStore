import { Category } from "../../../backend/src/models/category.model";

export interface CategoryState extends Category {
  isActive?: boolean;
}
